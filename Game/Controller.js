TetrisGame = new Controller(StateMachine, STATE_GAME, function ()
    {
        var _rows = 20;
        var _cols = 9;
        
		//var _grid = [];
        this.Grid = []
		var _onerow = [];
		for (var j = 0; j != _cols; ++j) _onerow.push(-1);
		for (var i = 0; i != _rows; ++i) this.Grid.push(_onerow.slice(0));
        
        this.Stores = [];
        this.Saved = NO_PIECE;
        
        var _futurePieces = 4;
        
        function CreatePiece()
        {
            return new Piece(BLOCK_SHAPES[(Math.random() * BLOCK_COUNT) | 0]);
        };
        
        for (var i = 0; i != _futurePieces; ++i)
        {
            this.Stores.push(CreatePiece());
        }
        
        var _speed = 1000;
        var _step = 0;
        // Like "_speed", but affected by holding "down".
        var _dropSpeed = _speed;
        
        //this.Saved;
        this.Piece = CreatePiece();
        this.Piece.X = 2;
        this.Piece.Y = -4;
        //this.Saved = CreatePiece();
        var _paused = false;
        var _destroyed = 0;
        
        var _boxit = false;
        
        var _left    = 0;
        var _right   = 0;
        var _rotateL = 0;
        var _rotateR = 0;
        
        var _noRepeat = true;
        
        this.Entry = function (from)
        {
            this.Grid = [];
            for (var i = 0; i != _rows; ++i) this.Grid.push(_onerow.slice(0));
            this.Stores = [];
            this.Saved = NO_PIECE;
            for (var i = 0; i != _futurePieces; ++i)
            {
                this.Stores.push(CreatePiece());
            }
            _speed = 1000;
            _step = 0;
            _dropSpeed = _speed;
            this.Piece = CreatePiece();
            this.Piece.X = 2;
            this.Piece.Y = -4;
            _boxit = false;
            _left    = 0;
            _right   = 0;
            _rotateL = 0;
            _rotateR = 0;
            _noRepeat = true;
            _paused = false;
            _destroyed = 0;
            this.View.Dirty();
            this.View.Show();
        };
        
        function Shuffle()
        {
            var parts = this.Piece.Parts;
            var c = this.Piece.CC;
            var x = this.Piece.X;
            var y = this.Piece.Y;
            var check;
			for (var i in parts)
			{
                if ((check = y + parts[i].y) < 0) return true;
                this.Grid[check][x + parts[i].x] = c;
			}
            this.Stores.push(CreatePiece());
            this.Piece = this.Stores.shift();
            this.Piece.X = 2;
            this.Piece.Y = -4;
            _dropSpeed = _speed;
            return false;
        }
        
        function DoDrop(event)
        {
            if (_paused) return;
            _noRepeat = true;
            //console.log('down');
            switch (event.keyCode)
            {
                case KEY_DOWN:
                    _dropSpeed = _speed;
                    break;
            }
        }
        
        function DoMove(event)
        {
            console.log(event.keyCode);
            if (_paused)
            {
                if (event.keyCode == KEY_PAUSE)
                    _paused = false;
                return;
            }
            //if (_noRepeat)
            {
                //console.log('up');
                switch (event.keyCode)
                {
                    case KEY_SPACE:
                        _boxit = true;;
                        break;
                    case KEY_LEFT:
                        ++_left;
                        break;
                    case KEY_RIGHT:
                        ++_right;
                        break;
                    case KEY_DOWN:
                        _dropSpeed = 100;
                        break;
                    case KEY_ESC:
                        this.Transition(STATE_MENU);
                        break;
                    case KEY_PAUSE:
                        _paused = true;
                        break;
                    case KEY_UP:
                        ++_rotateR;
                        break;
                }
                _noRepeat = false;
            }
        }
        
        this.Exit = function (to)
        {
            this.View.Hide();
        };
        
		this.Collide = function (piece)
		{
            var parts = piece.Parts;
			for (var i in parts)
			{
				var x = parts[i].x + piece.X;
				var y = parts[i].y + piece.Y;
				if (x < 0 || x >= _cols || y >= _rows) return true;
                // Account for when the piece is off the top of the screen.
                if (y >= 0 && this.Grid[y][x] >= 0) return true;
			}
			return false;
		};
        
        function MovePiece(_piece)
        {
            while (_left)
            {
                _piece.Move(-1, 0);
                if (this.Collide(_piece))
                {
                    _piece.Move(1, 0);
                    _left = 0;
                }
                else --_left;
            }
            while (_right)
            {
                _piece.Move(1, 0);
                if (this.Collide(_piece))
                {
                    _piece.Move(-1, 0);
                    _right = 0;
                }
                else --_right;
            }
            while (_rotateL)
            {
                _piece.Rotate(1);
                if (this.Collide(_piece))
                {
                    _piece.Rotate(-1);
                    _rotateL = 0;
                }
                else --_rotateL;
            }
            while (_rotateR)
            {
                _piece.Rotate(-1);
                if (this.Collide(_piece))
                {
                    _piece.Rotate(1);
                    _rotateR = 0;
                }
                else --_rotateR;
            }
        }
        
		function RowComplete(row)
		{
			//var row = _grid[r];
			for (var j = 0; j != _cols; ++j) if (row[j] < 0) return false;
			return true;
		}
		
		function DestroyRows()
		{
			var removed = [];
			var rem = 0;
			for (var i = 0; i != _rows; ++i)
			{
				if (RowComplete(this.Grid[rem]))
				{
					this.Grid.splice(rem, 1);
                    removed.push(i);
				}
				else ++rem;
			}
			for ( ; rem < _rows; ++rem) this.Grid.splice(0, 0, _onerow.slice(0));
			return removed;
		}
		
        this.Update = function (time)
        {
            if (_paused) return;
            var piece = this.Piece;
            MovePiece.call(this, piece);
            // Try move left or right.
            if (_boxit)
            {
                if (!piece.Boxed)
                {
                    // TODO: Swap this piece with the one in the store.
                    if ((this.Piece = this.Saved) == NO_PIECE)
                    {
                        this.Stores.push(CreatePiece());
                        this.Piece = this.Stores.shift();
                    }
                    this.Piece.X = 2;
                    this.Piece.Y = -4;
                    // piece.X = 0;
                    // piece.Y = 0;
                    piece.Reset();
                    piece.Boxed = true;
                    this.Saved = piece;
                }
                _boxit = false;
            }
            // Drop the piece down slightly (if we can).
            _step += time;
            if (_step > _dropSpeed)
            {
                piece.Move(0, 1);
                if (this.Collide(piece))
                {
                    piece.Move(0, -1);
                    // Settled in its final place.  Transfer the parts to the
                    // static grid.
                    if (Shuffle.call(this))
                    {
                        window.alert('GAME OVER!');
                        this.Transition(STATE_MENU);
                    }
                    else
                    {
                        var u = DestroyRows.call(this).length;
                        while (u--)
                        {
                            if (++_destroyed % 10 == 0)
                            {
                                _dropSpeed = (_speed *= 0.75);
                            }
                        }
                    }
                }
                
                
                
                
                // Tell the view that something changed so needs re-rendering.
                this.View.Dirty();
                
                // End this loop.
                _step %= _dropSpeed;
            }
        };
        
        /*function NewGame(event)
        {
            //this.View.Hide();
            this.Transition(STATE_GAME);
            console.log('New Game');
        }
        
        function HighScores(event)
        {
            //this.View.Hide();
            console.log('High Scores');
        }
        
        function Options(event)
        {
            //this.View.Hide();
            console.log('Options');
        }
        
        function Credits(event)
        {
            //this.View.Hide();
            console.log('Credits');
        }
        
        function Exit(event)
        {
            //this.View.Hide();
            //console.log('Exit');
            this.Transition(STATE_SPLASH);
        }
        
        this.RegisterEvents({
                'New Game':    [this, NewGame],
                'High Scores': [this, HighScores],
                'Options':     [this, Options],
                'Credits':     [this, Credits],
                'Exit':        [this, Exit],
            });*/

        this.RegisterEvents({
                'Drop': [this, DoDrop],
                'Move': [this, DoMove],
            });
    });



