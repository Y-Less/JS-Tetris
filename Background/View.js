var Background = new View(0, function ()
    {
        // All the clouds we currently have.
        var _clouds = []; // = [1, 2, 3, 4];
        
        function DrawCloud(ctx)
        {
            ctx.beginPath();
            ctx.moveTo(0, 85);
            
            ctx.lineTo(150, 85);
            
            ctx.quadraticCurveTo(130, 35, 110, 65);
            ctx.quadraticCurveTo(75, 0, 40, 65);
            ctx.quadraticCurveTo(20, 35, 0, 85);
            
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.fillStyle="white";
            ctx.fill();
        }
        
        var _canvas = View.CreateCanvas(150, 85);
        var _cloud  = View.GetContext(_canvas);
        DrawCloud(_cloud);
        
        function Cloud()
        {
            this.v = Math.random() + 1.0;
            var s = this.v - 0.5;
            this.w = 150 * s;
            this.h = 85 * s;
            this.v /= 10.0;
            this.x = -this.w;
            this.y = (Math.random() * 1000 - 75.5) | 0;
        }
        
        Cloud.prototype.Move = function (time)
        {
            return (this.x += time * this.v) <= 2000.0;
        };
        
        Cloud.prototype.Draw = function (ctx, mx, my)
        {
            if (this.x < mx && this.y < my)
                ctx.drawImage(_canvas, (0.5 + this.x) | 0, this.y, this.w, this.h);
        };
        
        this.Render = function (time, ctx)
        {
            ctx.fillStyle = 'skyblue';
            var w = ctx.width;
            var h = ctx.height;
            
            ctx.fillRect(0, 0, w, h);
            
            // The list of clouds that still exist after this loop.
            var clouds = [];
            
            for (var i in _clouds)
            {
                // Build a new list of all clouds that still exist.
                var c = _clouds[i];
                if (c.Move(time))
                if ((c.x += (time * c.v) / 10) <= 2000)
                {
                    c.Draw(ctx, w, h);
                    clouds.push(c);
                }
            }
            
            // Create a number of new clouds, as if rendering has always been
            // happening.
            _lastAdded += time;
            for (var xx = _lastAdded % 500; _lastAdded >= 500; xx += 1000)
            {
                var c = new Cloud();
                if (c.Move(xx))
                {
                    //var v = Math.random() + 1.0;
                    //var c = {x: -150 + v * xx, y: (Math.random() * 1000 - 75.5) | 0, v: v, };
                    c.Draw(ctx, w, h);
                    clouds.push(c);
                }
                _lastAdded -= 500;
                //ctx.drawImage(_canvas, (0.5 + c.x) | 0, c.y);
            }
            
            _clouds = clouds;
            
            this.Swap();
        };
        
        var _lastAdded = 0;
        
        this.Update = function (time)
        {
        };
        
        this.Init = function ()
        {
            // Generate a natural looking initial sjy.
            for (var i = 0; i != 200; ++i)
            {
                var c = new Cloud();
                if (c.Move(i * 1000))
                {
                    _clouds.push(c);
                }
                //var v = Math.random() + 1.0;
                //_clouds.push({x: -150 + (i * 100 * v), y: (Math.random() * 1000 - 75.5) | 0, v: v, });
                //this.Update(1000);
            }
        };
    });







