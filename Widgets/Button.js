function Button(_parent, _x, _y)
{
    var _down = false;
    var _highlight
    
    this.Render = function (ctx, time, force)
    {
        console.log('render');
        if (force)
        {
            if (_down)
            {
                this.RenderDown(ctx, time);
            }
            else
            {
                this.RenderUp(ctx, time);
            }
        }
    };
    
    this.On = function (what, x, y, event)
    {
        // Need mouse-out events to cancel a click.
        switch (what)
        {
            /*case 'mousedown':
                if (!_down)
                {
                    _down = true;
                    this.Dirty();
                }
                break;
            case 'mouseup':
                if (_down)
                {
                    _down = false;
                    this.Dirty();
                    this.Click(event);
                }
                break;*/
            case 'click':
                console.log('x: ' + x + ', y: ' + y);
                break;
        }
        return true;
    };
    
    this.super(_parent, _x, _y);
    return this;
}

Inherit(Button, Widget);
// Object.specify(Button, new Interface(['RenderDown', 'RenderUp', 'Click']));
Interface(Button, ['RenderDown', 'RenderUp', 'Click']);


var GreyButton3D = Inherit(function (parent, x, y)
    {
        this.super(parent, x, y);
        this.RenderDown = function (ctx, time)
            {
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(0, 0, ctx.width, ctx.height);
                
                
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(ctx.width - 1, 1);
                ctx.lineTo(ctx.width - 1, ctx.height - 1);
                ctx.lineTo(1, ctx.height - 1);
                ctx.moveTo(2, ctx.height - 2);
                ctx.lineTo(ctx.width - 2, ctx.height - 2);
                ctx.lineTo(ctx.width - 2, 2);
                ctx.stroke();
                
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(ctx.width - 1, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, ctx.height - 1);
                ctx.moveTo(1, ctx.height - 2);
                ctx.lineTo(1, 1);
                ctx.lineTo(ctx.width - 2, 1);
                ctx.stroke();
            };
        this.RenderUp = function (ctx, time)
            {
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(0, 0, ctx.width, ctx.height);
                
                
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(ctx.width - 1, 1);
                ctx.lineTo(ctx.width - 1, ctx.height - 1);
                ctx.lineTo(1, ctx.height - 1);
                ctx.moveTo(2, ctx.height - 2);
                ctx.lineTo(ctx.width - 2, ctx.height - 2);
                ctx.lineTo(ctx.width - 2, 2);
                ctx.stroke();
                
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(ctx.width - 1, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, ctx.height - 1);
                ctx.moveTo(1, ctx.height - 2);
                ctx.lineTo(1, 1);
                ctx.lineTo(ctx.width - 2, 1);
                ctx.stroke();
            };
        this.Width = 100;
        this.Height = 40;
    }, Button);

