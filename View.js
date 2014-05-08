function View()
{
    // Get the arguments as a real array.
    var args = Array.prototype.slice.call(arguments, 0);
    var _parent = args.shift();
    var f = args.shift();
    
    // Double-buffering.
    //var _buffer = {};
    var _shown = false;
    var _swap = false;
    var _z = 10;
    
    var _fcanvas = View.CreateCanvas(0, 0);
    var _fctx = View.GetContext(_fcanvas);
    _fcanvas.style.display = 'none';
    
    var _bcanvas = View.CreateCanvas(0, 0);
    var _bctx = View.GetContext(_bcanvas);
    _bcanvas.style.display = 'none';
    
    _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z;
    
    function SwapBuffers()
    {
        _bcanvas.style.display = 'block';
        _fcanvas.style.display = 'none';
        
        // Swap the buffer references.
        var xtmp = _fctx;
        _fctx = _bctx;
        _bctx = xtmp;
        var ttmp = _fcanvas;
        _fcanvas = _bcanvas;
        _bcanvas = ttmp;
        
        // Clear the back buffer correctly.
        /*xtmp.save();
        xtmp.setTransform(1, 0, 0, 1, 0, 0);
        xtmp.clearRect(0, 0, xtmp.width, xtmp.height);
        xtmp.restore();*/
        
        _swap = false;
    }
    
    this.Show = function ()
    {
        // Add BOTH buffers to the page, so that they can be swapped.
        document.body.appendChild(_fcanvas);
        document.body.appendChild(_bcanvas);
        this.Resize();
        this.Show = function ()
        {
            if (!_shown)
            {
                _fcanvas.style.display = 'block';
                _shown = true;
            }
        };
        this.Show();
    };
    
    this.Hide = function ()
    {
        _fcanvas.style.display = 'none';
        _shown = false;
    };
    
    this.Swap = function ()
    {
        _swap = true;
    };
    
    var _children = [];
    
    function ResizeRecurse(mw, mh)
    {
        for (var i in _children)
        {
            var o = _children[i];
            o[0].UpdatePos(_fcanvas, o[1], o[2]);
            o[0].Resize(mw, mh);
        }
    };
    
    if (_parent)
    {
        this.CreateView = function (w, h)
        {
            _bctx.width  = _fctx.width  = _bcanvas.width  = _fcanvas.width  = w;
            _bctx.height = _fctx.height = _bcanvas.height = _fcanvas.height = h;
            
            _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z = _parent.AddChild(this);
        };
        
        this.UpdatePos = function (parent, ox, oy)
        {
            var rect = parent.getBoundingClientRect();
            _fcanvas.style.left = _bcanvas.style.left = ox + rect.left + (parent.width  - _bcanvas.width ) / 2;
            _fcanvas.style.top  = _bcanvas.style.top  = oy + rect.top  + (parent.height - _bcanvas.height) / 2;
        }
        
        this.Resize = ResizeRecurse;
    }
    else
    {
        // This is the background element - fill the screen.
        _fcanvas.style.left   = _bcanvas.style.left   = 0;
        _fcanvas.style.top    = _bcanvas.style.top    = 0;
        _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z = 10;
        //document.body.appendChild(_view);
        
        this.Resize = function ()
        {
            var mw = window.innerWidth;
            var mh = window.innerHeight;
            _bctx.width  = _fctx.width  = _bcanvas.width  = _fcanvas.width  = mw;
            _bctx.height = _fctx.height = _bcanvas.height = _fcanvas.height = mh;
            ResizeRecurse(mw, mh);
        };
    }
    
    this._Render = function (time)
    {
        if (_shown)
        {
            _swap = false;
            this.Render(time, _bctx);
            // Swap.
            if (_swap) SwapBuffers();
            //_double.drawImage(_buffer, 0, 0);
            for (var i in _children)
            {
                _children[i][0]._Render(time);
            }
        }
    };
    
    this.AddChild = function()
    {
        // I realise that JavaScript variable scope means that I could declare
        // these variables where they are defined, but I don't want to.
        var o;
        var x;
        var y;
        switch (arguments.length)
        {
            case 1:
                o = arguments[0];
                x = 0;
                y = 0;
                break;
            case 3:
                o = arguments[0];
                x = arguments[1];
                y = arguments[2];
                break;
            default:
                return;
        }
        o.UpdatePos(_fcanvas, x, y);
        _children.push([o, x, y]);
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

