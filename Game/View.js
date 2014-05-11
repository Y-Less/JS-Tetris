TetrisGame.View = new View(Background, function ()
    {
        var _dirty = true;
        
        this.CreateView(BLOCK_SIZE * 25, BLOCK_SIZE * 24);
        
        var _gx = BLOCK_SIZE * 8;
        var _gy = BLOCK_SIZE * 2;
        
        this.Render = function (time, ctx)
        {
            if (_dirty)
            {
                ctx.fillStyle = 'white';
                var w = ctx.width;
                var h = ctx.height;
                ctx.fillRect(0, 0, w, h);
                DrawWindow(ctx, 0, 0, 25, 24, BLOCK_COLOURS[0]);
                
                //ctx.fillStyle = 'black';
                //ctx.rect(BLOCK_SIZE * 3.5, BLOCK_SIZE * 2, BLOCK_SIZE * 9, BLOCK_SIZE * 15);
                
                ctx.strokeStyle = 'black';
                ctx.lineWidth = BLOCK_SIZE / 2;
                ctx.strokeRect(BLOCK_SIZE * 2.5, BLOCK_SIZE * 1.75, BLOCK_SIZE * 3.5, BLOCK_SIZE * 5.5);
                ctx.strokeRect(BLOCK_SIZE * 7.75, BLOCK_SIZE * 1.75, BLOCK_SIZE * 9.5, BLOCK_SIZE * 20.5);
                ctx.strokeRect(BLOCK_SIZE * 19.0, BLOCK_SIZE * 1.75, BLOCK_SIZE * 3.5, BLOCK_SIZE * 20.5);
                ctx.strokeRect(BLOCK_SIZE * 19.0, BLOCK_SIZE * 1.75, BLOCK_SIZE * 3.5, BLOCK_SIZE * 5.25);
                ctx.lineWidth = 1;
                
                var y = _gy;
                for (var i in TetrisGame.Grid)
                {
                    var x = _gx;
                    // DrawBlock(ctx, x, y, {);
                    for (var j in TetrisGame.Grid[i])
                    {
                        if (TetrisGame.Grid[i][j] >= 0)
                        {
                            DrawBlock(ctx, x, y, BLOCK_COLOURS[TetrisGame.Grid[i][j]]);
                        }
                        x += BLOCK_SIZE;
                    }
                    y += BLOCK_SIZE;
                }
                
                for (var i in TetrisGame.Stores)
                {
                    TetrisGame.Stores[i].Draw(ctx, BLOCK_SIZE * 18.75, (i * 5 + 2.5) * BLOCK_SIZE);
                }
                TetrisGame.Saved.Draw(ctx, BLOCK_SIZE * 2.25, 2.5 * BLOCK_SIZE);
                TetrisGame.Piece.Draw(ctx, BLOCK_SIZE * TetrisGame.Piece.X + _gx, BLOCK_SIZE * TetrisGame.Piece.Y + _gy);
                
                this.Swap();
            }
            _dirty = true;
        }
        
        this.Dirty = function ()
        {
            _dirty = true;
        };
        
        this.RegisterAction('Drop', 'keyup');
        this.RegisterAction('Move', 'keydown');
    });

