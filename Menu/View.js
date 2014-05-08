var Menu = new View(Background, function ()
    {
        function DrawMenu(ctx)
        {
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
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.width, ctx.height);
        }
        
        var _canvas = this.CreateView(500, 500);
        var _menu   = View.GetContext(_canvas);
        DrawMenu(_menu);
    });







