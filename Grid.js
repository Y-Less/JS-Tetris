var HighScores = new (function (_top)
	{
		// Store the top "_top" scores.
		var _scores = [];
		var _last = _top - 1;
		var _names = [];
		
		
		this.Check = function (score)
		{
			return _scores.length < _top || _scores[_last] < score;
		};
		
		this.Add = function (score, name)
		{
			// Insertion sort.  Best for value-by-value addition.
			var len = _scores.length;
			var i = 0;
			// This is a simple linear search for the best index.  We could also
			// use a binary search quite easily.
			for ( ; i != len; ++i)
			{
				if (_scores[i] < score)
				{
					_scores.splice(i, 0, score);
					_names.splice(i, 0, name);
					break;
				}
			}
			// Add the score to the end of the array.  This is valid if there
			// are not yet "_top" scores in the array.
			if (i == len)
			{
				// Don't add the score.
				if (len == _top) return false;
				_scores.push(score);
				_names.push(name);
			}
			else if (len == _top)
			{
				// Added a new score, remove the old lowest score.
				_scores.pop();
				_names.pop();
			}
			return true;
		};
	})(10);

var Score = new (function ()
	{
		var _score;
		
		this.AddRows = function (n)
		{
			var speed = Game.GetSpeed();
			_score = n * speed;
		};
		
		this.Reset = function ()
		{
			_score = 0;
		};
		
		this.Get = function ()
		{
			return _score;
		};
	})();

var Grid = new (function (_rows, _cols)
	{
		// Build the grid.  In the grid, the bottom-left point is (0, 0).
		var _grid = [];
		var _onerow = [];
		for (var j = 0; j != _cols; ++j) _onerow.push(0);
		for (var i = 0; i != _rows; ++i) _grid.push(_onerow.slice(0));
		
		// Check if the given piece (represented as a list of FUTURE co-
		// ordinates) will collide with something.
		this.Collide = function (piece)
		{
			for (var i : piece)
			{
				var y = piece[i].y;
				var x = piece[i].x;
				if (0 > x || x >= _cols || 0 > y || y >= _rows || _grid[y][x]) return true;
			}
			return false;
		};
		
		function RowComplete(r)
		{
			var row = _grid[r];
			for (var j = 0; j != _cols; ++j) if (!row[j]) return false;
			return true;
		}
		
		function DestroyRows()
		{
			var removed = [];
			var rem = 0;
			for (var i = 0; i != _rows; ++i)
			{
				if (RowComplete(rem))
				{
					removed.concat(_grid.splice(rem, 1));
				}
				else ++rem;
			}
			for ( ; rem < _rows; ++rem) _grid.push(_onerow.slice(0));
			return removed;
		}
		
		this.Update = function (time)
		{
			var
				removed = DestroyRows();
			
		};
	})();

