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
        
        this.Render = function (time, ctx)
        {
            ctx.fillStyle = 'skyblue';
            var x = ctx.width;
            var y = ctx.height;
            ctx.fillRect(0, 0, x, y);
            
            for (var i in _clouds)
            {
                var c = _clouds[i];
                if (c.x += (time * c.v) / 5) > 2000) delete _clouds[i];
                else if (c.x < x && c.y < y) ctx.drawImage(_canvas, (0.5 + c.x) | 0, (0.5 + c.y) | 0);
            }
        };
        
        var _lastAdded = 0;
        
        this.Update = function (time)
        {
            //console.log('update: ' + time);
            /*for (var i in _clouds)
            {
                if ((_clouds[i].x += (time * _clouds[i].v) / 5) > 2000) delete _clouds[i];
                //console.log(_clouds[i].x + ", " + (time * _clouds[i].v));
                //_clouds[i].x += (time * _clouds[i].v) / 5;
            }*/
            //var c = _clouds.length;
            
            _lastAdded += time
            if (_lastAdded >= 1000)
            {
                _clouds.push({x: -150, y: (0.5 + (Math.random() * 1000 - 80.0)) | 0, v: Math.random(), });
                _lastAdded = 0;
            }
        };
        
        this.Init = function ()
        {
            for (var i = 0; i != 100; ++i)
            {
                this.Update(1000);
            }
        };
    });







