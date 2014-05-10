// var Background = {}
// CreateView(Background, 0, function ()
Background.View = new View(0, function ()
    {
        // All the clouds we currently have.
        var _clouds = [];
        
        // Definition of the data underlying a cloud.
        // MODEL.
        function Cloud()
        {
            this.v = Math.random() * 2.0;
            var s = this.v;
            this.w = 150 * s;
            this.h = 85 * s;
            this.v /= 10.0;
            this.x = -this.w;
            this.y = (Math.random() * 1000 - 75.5) | 0;
        }
        
        // VIEW.
        (function ()
        {
            function PreRenderCloud(canvas)
            {
                var ctx = View.GetContext(canvas)
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
            
            var _cloud = View.CreateCanvas(150, 85);
            PreRenderCloud(_cloud);
            
            Cloud.prototype.Draw = function (ctx, mx, my)
            {
                if (this.x < mx && this.y < my)
                    ctx.drawImage(_cloud, (0.5 + this.x) | 0, this.y, this.w, this.h);
            };
        })();
        
        // CONTROLLER.
        Cloud.prototype.Move = function (time)
        {
            return (this.x += time * this.v) <= 2000.0;
        };
        
        var _hint = false;
        var _hintPulse = 1000;
        
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
                    c.Draw(ctx, w, h);
                    clouds.push(c);
                }
                _lastAdded -= 500;
            }
            
            _clouds = clouds;
            
            if (_hint)
            {
                // console.log(_hintPulse);
                // console.log(time);
                _hintPulse = (_hintPulse + time) % 2000;
                // console.log(_hintPulse);
                // var p = Math.abs(_hintPulse / 1000 - 1);
                ctx.font = 'bold 22pt Arial';
                // p = 'rgba(0, 0, 0, ' + p + ')';
                ctx.fillStyle = 'rgba(0, 0, 0, ' + Math.abs(_hintPulse / 1000 - 1) + ')';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Press any key to continue...', ctx.width / 2, ctx.height - 100);
            }
            
            this.Swap();
        };
        
        var _lastAdded = 0;
        
        // this.Update = function (time)
        // {
        // };
        
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
            }
        };
        
        this.Hint = function (t)
        {
            _hint = t;
            _hintPulse = 1000;
        };
        
        this.RegisterZone('Continue', 'click', 0, 0, 5000, 2000);
    });







