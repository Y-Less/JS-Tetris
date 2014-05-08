var Menu = new View(Background, function ()
    {
        function DrawMenu(ctx)
        {
            //var cl = BLOCK_COLOURS.length;
            function RC()
            {
                return BLOCK_COLOURS[0];
            }
            
            /*ctx.beginPath();
            ctx.moveTo(0, 85);
            
            ctx.lineTo(150, 85);
            
            ctx.quadraticCurveTo(130, 35, 110, 65);
            ctx.quadraticCurveTo(75, 0, 40, 65);
            ctx.quadraticCurveTo(20, 35, 0, 85);
            
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.fillStyle="white";
            ctx.fill();*/
            ctx.fillStyle = 'white';
            // ctx.fillRect(BLOCK_SIZE, BLOCK_SIZE, ctx.width - BLOCK_SIZE - BLOCK_SIZE, ctx.height - BLOCK_SIZE - BLOCK_SIZE);
            ctx.fillRect(0, 0, ctx.width, ctx.height);
            
            
            
            for (var i = 0, w = ctx.width, y = ctx.height - BLOCK_SIZE; i != w; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, i, 0, RC());
                DrawBlock(ctx, i, y, RC());
            }
            
            for (var i = BLOCK_SIZE, h = ctx.height - BLOCK_SIZE, x = ctx.width - BLOCK_SIZE; i != h; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, 0, i, RC());
                DrawBlock(ctx, x, i, RC());
            }
            
            var TETRIS = [
                    "  111 222 333 44  5  66  ",
                    "   1  2    3  4 4 5 6    ",
                    "   1  22   3  44  5  6   ",
                    "   1  2    3  4 4 5   6  ",
                    "   1  222  3  4 4 5 66   "
                ];
            
            for (var i = 0, y = BLOCK_SIZE * 2, rows = TETRIS.length; i != rows; ++i, y += BLOCK_SIZE)
            {
                var row = TETRIS[i];
                for (var j = 0, x = 0, len = row.length; j != len; ++j, x += BLOCK_SIZE)
                {
                    if (row[j] != ' ') DrawBlock(ctx, x, y, BLOCK_COLOURS[row[j]]);
                }
            }
            
            /*
            
            ##### ##### ##### ###  #  ### 
              #   #       #   #  # # #    
              #   ###     #   ###  #  ### 
              #   #       #   #  # #     #
              #   #####   #   #  # #  ### 
            
            */
            
            /*
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.width, BLOCK_SIZE);
            ctx.fillRect(0, 0, BLOCK_SIZE, ctx.height);
            ctx.fillRect(ctx.width - BLOCK_SIZE, 0, BLOCK_SIZE, ctx.height);
            ctx.fillRect(0, ctx.height - BLOCK_SIZE, ctx.width, BLOCK_SIZE);
            
            */
            ctx.fillStyle = 'red';
            ctx.fillRect(ctx.width / 2 - 50, ctx.height / 2 - 15, 100, 30);
            
            ctx.fillStyle = 'blue';
            ctx.font = '20pt Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HIDE', ctx.width / 2, ctx.height / 2, 100);
        }
        
        this.CreateView(BLOCK_SIZE * 25, BLOCK_SIZE * 20);
        //var _menu   = View.GetContext(_canvas);
        //DrawMenu(_menu);
        
        var _drawn = false;
        
        this.Render = function (time, ctx)
        {
            if (!_drawn)
            {
                DrawMenu(ctx);
                _drawn = true;
                this.Swap();
            }
        };
    });







