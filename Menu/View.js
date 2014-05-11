// CreateView(Menu, Background, function ()
Menu.View = new View(Background, function ()
    {
        function DrawButton(ctx, y, w, h, colours, text)
        {
            ctx.fillStyle = colours.back;
            ctx.fillRect((ctx.width - w) / 2, y, w, h);
            
            ctx.fillStyle = colours.fore;
            //ctx.fillStyle = 'blue';
            ctx.font = 'bold 22pt Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, ctx.width / 2, y + (h / 2), w);
            this.RegisterZone(text, 'click', (ctx.width - w) / 2, y, w, h);
        }
        
        function DrawMenu(ctx)
        {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, ctx.width, ctx.height);
            
            //var bc = BLOCK_COLOURS[0];
            
            DrawWindow(ctx, 0, 0, 25, 24, BLOCK_COLOURS[0]);
            /*for (var i = 0, w = ctx.width, y = ctx.height - BLOCK_SIZE; i != w; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, i, 0, bc);
                DrawBlock(ctx, i, y, bc);
            }
            
            for (var i = BLOCK_SIZE, h = ctx.height - BLOCK_SIZE, x = ctx.width - BLOCK_SIZE; i != h; i += BLOCK_SIZE)
            {
                DrawBlock(ctx, 0, i, bc);
                DrawBlock(ctx, x, i, bc);
            }*/
            
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
            
            DrawTetris(ctx, 0, BLOCK_SIZE * 2);
            
            /*ctx.fillStyle = 'red';
            ctx.fillRect(ctx.width / 2 - 50, ctx.height / 2 - 15, 100, 30);
            
            ctx.fillStyle = 'blue';
            ctx.font = '20pt Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HIDE', ctx.width / 2, ctx.height / 2, 100);*/
            var c = {back: '#BBBBBB', fore: '#800000'};
            DrawButton.call(this, ctx, BLOCK_SIZE * 8 , BLOCK_SIZE * 7, BLOCK_SIZE * 2, c, 'New Game');
            DrawButton.call(this, ctx, BLOCK_SIZE * 11, BLOCK_SIZE * 7, BLOCK_SIZE * 2, c, 'High Scores');
            DrawButton.call(this, ctx, BLOCK_SIZE * 14, BLOCK_SIZE * 7, BLOCK_SIZE * 2, c, 'Options');
            DrawButton.call(this, ctx, BLOCK_SIZE * 17, BLOCK_SIZE * 7, BLOCK_SIZE * 2, c, 'Credits');
            DrawButton.call(this, ctx, BLOCK_SIZE * 20, BLOCK_SIZE * 7, BLOCK_SIZE * 2, c, 'Exit');
        }
        
        this.CreateView(BLOCK_SIZE * 25, BLOCK_SIZE * 24);
        
        var _drawn = false;
        var _hidden = false;
        var _changed = false;
        
        this.Render = function (time, ctx)
        {
            if (!_drawn)
            {
                if (_hidden)
                {
                    /*ctx.fillStyle = 'red';
                    ctx.fillRect(ctx.width / 2 - 50, ctx.height / 2 - 15, 100, 30);
                    
                    ctx.fillStyle = 'blue';
                    ctx.font = '20pt Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('SHOW', ctx.width / 2, ctx.height / 2, 100);*/
                }
                else
                {
                    DrawMenu.call(this, ctx);
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
                //console.log('down: ' + _sx + ', ' + _sy);
            }
        }
        
        function FrameUp(event)
        {
            if (_moving)
            {
                _moving = false;
                this.RemoveEvent('FrameMove');
                //console.log('up');
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
        this.RegisterZone('FrameDown', 'mousedown', 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE * 22);
        this.RegisterZone('FrameDown', 'mousedown', BLOCK_SIZE * 24, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE * 22);
        this.RegisterZone('FrameDown', 'mousedown', 0, BLOCK_SIZE * 23, BLOCK_SIZE * 25, BLOCK_SIZE);
        
        this.RegisterAction('FrameUp', 'mouseup');
        this.RegisterAction('FrameMove', 'mousemove');
        
        
        
        //this.RegisterZone('Hide', 'click', (BLOCK_SIZE * 25 - 100) / 2, (BLOCK_SIZE * 20 - 30) / 2, 100, 30);
        //this.RegisterZone('Show', 'click', (BLOCK_SIZE * 25 - 100) / 2, (BLOCK_SIZE * 20 - 30) / 2, 100, 30);
        
        
        
        
    });

