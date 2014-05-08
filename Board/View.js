var Background = new View(function ()
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
        
        var _canvas = document.createElement('canvas');
        _canvas.width = 150;
        _canvas.height = 85;
        
        var _cloud = _canvas.getContext('2d');
        _cloud.width  = _canvas.width;
        _cloud.height = _canvas.height;
        
        DrawCloud(_cloud);
        
        this.Render = function (ctx)
        {
            //console.log('hi' + _x + _g);
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(0, 0, ctx.width, ctx.height);
            var x = ctx.width;
            var y = ctx.height;
            for (var i in _clouds)
            {
                //if ((_clouds[i].x += (time * _clouds[i].v) / 1000) > 10000) delete _clouds[i];
                if (_clouds[i].x < x && _clouds[i].y < y) ctx.drawImage(_canvas, (0.5 + _clouds[i].x) | 0, (0.5 + _clouds[i].y) | 0);
                //ctx.drawImage(_canvas, i * 200, 50);
            }
            //ctx.drawImage(_canvas, 200, 100);
            //console.log('update: ' + 00);
        };
        
        var _lastAdded = 0;
        
        this.Update = function (time)
        {
            //console.log('update: ' + time);
            for (var i in _clouds)
            {
                if ((_clouds[i].x += (time * _clouds[i].v) / 5) > 2000) delete _clouds[i];
                //console.log(_clouds[i].x + ", " + (time * _clouds[i].v));
                //_clouds[i].x += (time * _clouds[i].v) / 5;
            }
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







