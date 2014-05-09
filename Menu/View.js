// CreateView(Menu, Background, function ()
Menu.View = new View(Background, function ()
    {
        function DrawMenu(ctx)
        {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.width, ctx.height);
            
            var bc = BLOCK_COLOURS[0];
            
            for (var i = 0, w = ctx.width, y = ctx.height - BLOCK_SIZE; i != w; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, i, 0, bc);
                DrawBlock(ctx, i, y, bc);
            }
            
            for (var i = BLOCK_SIZE, h = ctx.height - BLOCK_SIZE, x = ctx.width - BLOCK_SIZE; i != h; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, 0, i, bc);
                DrawBlock(ctx, x, i, bc);
            }
            
            /*
            
              ##### ##### ##### ###  #  ### 
                #   #       #   #  # # #    
                #   ###     #   ###  #  ### 
                #   #       #   #  # #     #
                #   #####   #   #  # #  ### 
            
            */
            
            /*
            
              ### ### ### ##  #  ## 
               #  #    #  # # # #   
               #  ##   #  ##  #  # 
               #  #    #  # # #   #
               #  ###  #  # # # ## 
            
            */
            
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
            
            ctx.fillStyle = 'red';
            ctx.fillRect(ctx.width / 2 - 50, ctx.height / 2 - 15, 100, 30);
            
            ctx.fillStyle = 'blue';
            ctx.font = '20pt Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HIDE', ctx.width / 2, ctx.height / 2, 100);
        }
        
        this.CreateView(BLOCK_SIZE * 25, BLOCK_SIZE * 20);
        
        var _drawn = false;
        var _hidden = false;
        var _changed = false;
        
        this.Render = function (time, ctx)
        {
            if (!_drawn)
            {
                if (_hidden)
                {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(ctx.width / 2 - 50, ctx.height / 2 - 15, 100, 30);
                    
                    ctx.fillStyle = 'blue';
                    ctx.font = '20pt Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('SHOW', ctx.width / 2, ctx.height / 2, 100);
                }
                else
                {
                    DrawMenu(ctx);
                }
                _drawn = true;
                _changed = false;
                this.Swap();
            }
        };
        
        var _moving = false;
        var _sx = 0;
        var _sy = 0;
        var _ox = 0;
        var _oy = 0;
        
        function FrameMove(event)
        {
            if (_moving)
            {
               this.Move(_ox + event.pageX - _sx, _oy + event.pageY - _sy);
            }
        }
        
        function FrameDown(event)
        {
            if (!_hidden)
            {
                this.AddEvent('FrameMove', [this, FrameMove]);
                _moving = true;
                _sx = event.pageX;
                _sy = event.pageY;
                console.log('down: ' + _sx + ', ' + _sy);
            }
        }
        
        function FrameUp(event)
        {
            if (_moving)
            {
                _moving = false;
                this.RemoveEvent('FrameMove');
                console.log('up');
                //this.View.UnregisterAction('FrameMove', 'mousemove');
                _ox += event.pageX - _sx;
                _oy += event.pageY - _sy;
            }
        }
        
        function Hide(event)
        {
            if (!_changed && !_hidden)
            {
                _drawn = false;
                _hidden = true;
                _changed = true;
            }
        }
        
        function Show(event)
        {
            if (!_changed && _hidden)
            {
                _drawn = false;
                _hidden = false;
                _changed = true;
            }
        }
        
        this.RegisterEvents({
                'FrameDown': [this, FrameDown],
                'FrameUp'  : [this, FrameUp],
                'Hide'     : [this, Hide],
                'Show'     : [this, Show],
                //'FrameMove': FrameMove,
            });
        
        this.RegisterZone('FrameDown', 'mousedown', 0, 0, BLOCK_SIZE * 25, BLOCK_SIZE);
        this.RegisterZone('FrameDown', 'mousedown', 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE * 18);
        this.RegisterZone('FrameDown', 'mousedown', BLOCK_SIZE * 24, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE * 18);
        this.RegisterZone('FrameDown', 'mousedown', 0, BLOCK_SIZE * 19, BLOCK_SIZE * 25, BLOCK_SIZE);
        
        this.RegisterAction('FrameUp', 'mouseup');
        this.RegisterAction('FrameMove', 'mousemove');
        
        
        
        this.RegisterZone('Hide', 'click', (BLOCK_SIZE * 25 - 100) / 2, (BLOCK_SIZE * 20 - 30) / 2, 100, 30);
        this.RegisterZone('Show', 'click', (BLOCK_SIZE * 25 - 100) / 2, (BLOCK_SIZE * 20 - 30) / 2, 100, 30);
        
        
        
        
    });

