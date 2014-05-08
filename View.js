function View()
{
    // Get the arguments as a real array.
    var args = Array.prototype.slice.call(arguments, 0);
    var _parent = args.shift();
    var f = args.shift();
    
    var _children = [];
    
    // This view's main canvas.
    var _view;
    var _ctx;
    
    var _z = 0;
    
    var _shown = false;
    
    function MoveChild(c, x, y)
    {
        var rect = _view.getBoundingClientRect();
        // x += rect.left + (_view.width  - c.width ) / 2;
        // y += rect.top  + (_view.height - c.height) / 2;
        c.style.left = x + rect.left + (_view.width  - c.width ) / 2;
        c.style.top  = y + rect.top  + (_view.height - c.height) / 2;
    }
    
    this.Show = function ()
    {
        _view.style.visibility = 'shown';
        _shown = true;
    };
    
    this.Hide = function ()
    {
        _view.style.visibility = 'hidden';
        _shown = false;
    };
    
    if (_parent)
    {
        this.CreateView = function (w, h)
        {
            _view = View.CreateCanvas(w, h);
            _view.width  = w;
            _view.height = h;
            //_ctx = View.GetContext(_view);
            _view.style.zIndex = _z = _parent.AddChild(this, _view);
            document.body.appendChild(_view);
            
            return _view;
        };
        
        this.Resize = function (mx, my)
        {
            _ctx.width  = _view.width;
            _ctx.height = _view.height;
            for (var i in _children)
            {
                MoveChild(_children[i][1], _children[i][2], _children[i][3]);
                _children[i][0].Resize(mx, my);
            }
        };
    }
    else
    {
        // This is the background element - fill the screen.
        _view = View.CreateCanvas(window.innerWidth, window.innerHeight);
        _view.style.left = 0;
        _view.style.top = 0;
        _ctx = View.GetContext(_view);
        _view.style.zIndex = _z = 10;
        
        this.Resize = function ()
        {
            var mx = window.innerWidth;
            var my = window.innerHeight;
            _ctx.width  = _view.width  = mx;
            _ctx.height = _view.height = my;
            for (var i in _children)
            {
                MoveChild(_children[i][1], _children[i][2], _children[i][3]);
                _children[i][0].Resize(mx, my);
            }
        };
        
        this.RunRender = function (time)
        {
            if (_shown)
            {
                this.Render(time, _ctx);
            }
        };
    }
    
    this.AddChild = function()
    {
        // I realise that JavaScript variable scope means that I could declare
        // these variables where they are defined, but I don't want to.
        var o;
        var c;
        var x;
        var y;
        switch (arguments.length)
        {
            case 2:
                o = arguments[0];
                c = arguments[1];
                x = 0;
                y = 0;
                break;
            case 4:
                o = arguments[0];
                c = arguments[1];
                x = arguments[2];
                y = arguments[3];
                break;
            default:
                return;
        }
        MoveChild(c, x, y);
        _children.push([o, c, x, y]);
        return _z + 10;
    };
    
    // Call the init function, or concatenate the objects.
    if (f instanceof Function) f.apply(this, args);
    else
    {
        while (f instanceof Object)
        {
            for (var i in f)
            {
                if (f.hasOwnProperty(i)) this[i] = f[i];
            }
            f = args.shift();
        }
    }
    
    return this;
}

View.prototype.Render = function () {}
View.prototype.Update = function () {}
View.prototype.Init = function () {}
View.prototype.Shut = function () {}

View.CreateCanvas = function (x, y)
{
    var c = document.createElement('canvas');
    c.width  = x;
    c.height = y;
    return c;
}

// Ideally this method would be "protected", but I don't know a way to do
// that in JavaScript...
View.GetContext = function (canvas)
{
    var c = canvas.getContext('2d');
    c.width  = canvas.width;
    c.height = canvas.height;
    return c;
}

