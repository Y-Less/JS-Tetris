function Placeable(_x, _y)
{
    "use strict";
    
    // VERY simple - is this widget to be shown WHEN IT'S PARENT IS?
    var _shown = true;
    
    // True when the image has shifted, but not been altered.
    var _moved = true;
    
    // True when the image has been changed.
    var _dirty = true;
    // Both these are true by default to show the thing initially.
    
    var _width  = 0;
    var _height = 0;
    
    var _align = 0;
    
    // Dirty previously hidden widgets.
    this.Show = function () { _dirty = _dirty || !_shown; _shown = true; }
    this.Hide = function () { _shown = hide; }
    this.Moved = function () { _moved = true; }
    this.Dirty = function () { _dirty = true; }
    this.IsShown = function () { return _shown; }
    this.HasMoved = function () { return _moved; }
    this.IsDirty = function () { return _dirty; }
    this.ResetDirty = function () { _dirty = false; _moved = false; }
    
    Object.defineProperty(this, 'X', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _x) return;
                _moved = true;
                return (_x = v);
            },
            get: function () { return _x; }
        });
    
    Object.defineProperty(this, 'Y', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _y) return;
                _moved = true;
                return (_y = v);
            },
            get: function () { return _y; }
        });
    
    // Accessors for changing the object's size.
    Object.defineProperty(this, 'Width', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _width) return;
                if (v <= 0) return; // Invalid size.
                _dirty = true;
                return (_width = v);
            },
            get: function () { return _width; }
        });
    Object.defineProperty(this, 'Height', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _height) return;
                if (v <= 0) return; // Invalid size.
                _dirty = true;
                return (_height = v);
            },
            get: function () { return _height; }
        });
    
    Object.defineProperty(this, 'Align', {
            configurable: false,
            enumerable: true,
            set: function (align)
            {
                var v;
                switch (align)
                {
                    case 'left'  : v = 0; break;
                    case 'center': v = 1; break;
                    case 'right' : v = 2; break;
                    default: return;
                }
                if (v == _align) return;
                _dirty = true;
                return (_align = v);
            },
            get: function ()
            {
                switch (_align)
                {
                    case 0: return 'left';
                    case 1: return 'center';
                    case 2: return 'right';
                }
            }
        });
    
    this.AlignNum = function ()
    {
        return _align;
    };
    
    return this;
}

var Drag = (function ()
    {
        var _what;
        var _ex;
        var _ey;
        var _ox;
        var _oy;
        
        
        return {
                Start: function (what, event)
                {
                    console.log('start');
                    if (what instanceof Placeable && !_what)
                    {
                        console.log('begin');
                        _what = what;
                        _ex = event.pageX;
                        _ey = event.pageY;
                        _ox = what.X;
                        _oy = what.Y;
                    }
                },
                
                End: function (what)
                {
                    console.log('end');
                    //if (what == _what)
                    {
                        _what = 0;
                    }
                },
                
                Move: function (event)
                {
                    console.log('move');
                    if (_what)
                    {
                        _what.X = _ox + (event.pageX - _ex);
                        _what.Y = _oy + (event.pageY - _ey);
                    }
                }
            };
    })();

document.body.addEventListener('mousemove', Drag.Move, false);
document.body.addEventListener('mouseup', Drag.End, false);

function Widget(x, y)
{
    "use strict";
    
    this.super(x, y);
    
    var MIN = Math.min;
    var MAX = Math.max;
    
    var _children = new Container(Widget, true);
    
    // Create a surface on which to draw this element.
    var _canvas = document.createElement('canvas');
    var _ctx    = _canvas.getContext('2d');
    // Useful properties that don't exist normally :(.
    _ctx.width = 0;
    _ctx.height = 0;
    
    var _z = 1;
    
    var _parent;
    
    var _tx = 0; // True x (after alignment);
    
    // For this one, we need the help of our parent.
    Object.defineProperty(this, 'Z', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _z) return;
                if (_parent)
                {
                    _parent.RemoveWidget(this);
                    _parent.AddWidget(this);
                }
                this.Moved();
                return (_z = v);
            },
            get: function () { return _z; }
        });
    
    this.Order = function () { return this.Z; };
    
    /*
        x  - Theoretical "x" position of the parent.
        y  - Theoretical "y" position of the parent.
        bl - Left bounds of the drawing area.
        bt - Top bounds of the drawing area.
        br - Right bounds of the drawing area.
        bb - Bottom bounds of the drawing area.
    */
    this._Render = function (force, ctx, x, y, w, h, bl, bt, br, bb, time)
    {
        if (!this.IsShown()) return false;
        // Get the theoretical start location of this element.
        var width = this.Width;
        var height = this.Height;
        if (width === '100%') width = w;
        if (height === '100%') height = h;
        switch (this.AlignNum())
        {
            case 0:
                _tx = this.X;
                //y += this.Y;
                break;
            case 1:
                _tx = (w - width) / 2 + this.X;
                //y += (h / 2) + this.Y;
                break;
            case 2:
                _tx = w - width - this.X;
                //y += h - this.Y;
                break;
        }
        x += _tx;
        y += this.Y;
        //w = this.Width;
        //h = this.Height;
        //if (x >= br || y >= bb || x + _width
        // New bounding rect (for this and children).
        var nbl = MAX(bl, x);
        var nbt = MAX(bt, y);
        var nbr = MIN(br, x + width);
        var nbb = MIN(bb, y + height);
        // Find out if this is entirely outside the bounding rect.  If it is,
        // the new bounding box will be invalid.
        if (nbl >= nbr || nbt >= nbb) return false;
        // Check if we need to change any of the sizes.
        if (this.IsDirty())
        {
            _ctx.width  = _canvas.width  = width;
            _ctx.height = _canvas.height = height;
            this.ResetDirty();
            this.Render(_ctx, time);
        }
        // Redrew the contents, replace it on the parent.
        ctx.drawImage(_canvas, nbl - x, nbt - y, nbr - nbl, nbb - nbt, nbl, nbt, nbr - nbl, nbb - nbt);
        _children.Map('_Render', [ctx, x, y, width, height, nbl, nbt, nbr, nbb, time]);
    };
    
    this.AddWidget = function (child)
    {
        _children.Add(child);
        child.SetParent(this);
    };
    
    this.RemoveWidget = function (child)
    {
        _children.Remove(child);
        child.SetParent();
    };
    
    this._On = function (what, ex, ey, px, py, event, done)
    {
        if (done) return true;
        if (!this.IsShown()) return false;
        // Get the top edge of this element.
        px += _tx;
        py += this.Y;
        if (ex >= px && ex < px + this.Width && ey >= py && ey < py + this.Height)
        {
            if (!_children.FoldR('_On', [what, ex, ey, px, py, event], false))
            {
                if (this.On(what, ex - px, ey - py, event)) return true;
            }
        }
        return false;
    };
    
    this.SetParent = function (p)
    {
        _parent = p;
    };
    
    this.RegisterAction = function (on)
    {
        if (_parent)
        {
            _parent.RegisterAction(on);
        }
    };
    
    //if (_parent) _parent.AddWidget(this);
    
    
    return this;
}

Inherit(Widget, Placeable);
Interface(Widget, ['Render', 'On']); //, 'Update', 'On']);

function View(x, y)
{
    "use strict";
    
    this.super(x, y);
    
    var _children = new Container(View, false);
    
    // Double-buffering.
    var _domContainer = document.createElement('div');
    _domContainer.className = 'view_container';
    
    var _bcanvas = document.createElement('canvas');
    var _bctx = _bcanvas.getContext('2d');
    _bcanvas.style.display = 'none';
    
    var _fcanvas = document.createElement('canvas');
    var _fctx = _fcanvas.getContext('2d');
    _fcanvas.style.display = 'block';
    
    var _domInteract = document.createElement('div');
    
    // The back context passed about.
    var _ctx = _bctx;
    var _ffront = true;
    
    _domContainer.appendChild(_bcanvas);
    _domContainer.appendChild(_fcanvas);
    _domContainer.appendChild(_domInteract);
    
    // Things to do when this is utilised.
    var _domHandlers = {};
    
    var that = this;
    function ProcessDOM(event)
    {
        if (that.IsShown())
        {
            var x = event.offsetX = event.offsetX || event.pageX - that.X;
            var y = event.offsetY = event.offsetY || event.pageY - that.Y;
            that.On(event.type, x, y, event);
            /*var t = _domHandlers[event.type];
            for (var i in t)
            {
                t[i].Try(x, y, event);
            }*/
            // Pass the event down the chain of children.
        }
        return false;
    }
    
    this.RegisterAction = function (on)
    {
        if (!_domHandlers[on])
        {
            _domHandlers[on] = true;
        }
    };
    
    var _Show = this.Show;
    this.Show = function ()
    {
        // Add BOTH buffers to the page, so that they can be swapped.
        document.body.appendChild(_domContainer);
        // Add the handlers that are pending.
        if (!document.addEventListener)
        {
            _domInteract.addEventListener = function (a, b, c) { return this.attachEvent('on' + a, b); };
        }
        this.RegisterAction = function (on)
        {
            if (!_domHandlers[on])
            {
                _domInteract.addEventListener(on, ProcessDOM, false);
                _domHandlers[on] = true;
            }
        };
        for (var on in _domHandlers)
        {
            _domInteract.addEventListener(on, ProcessDOM, false);
        }
        // Show the view within the system.
        this.Show = function ()
        {
            _Show.call(this);
            _domContainer.style.display = 'block';
        };
        this.Show();
    };
    
    var _Hide = this.Hide;
    this.Hide = function ()
    {
        _Hide.call(this);
        _domContainer.style.display = 'none';
    };
    
    var _lw = 0;
    var _lh = 0;
    
    this._Render = function (time)
    {
        if (!this.IsShown()) return;
        if (this.HasMoved())
        {
            // Do the actual movement.
            _domContainer.style.left = this.X;
            _domContainer.style.top  = this.Y;
        }
        var dirty = this.IsDirty();
        this.ResetDirty();
        if (dirty)
        {
            var w = this.Width;
            var h = this.Height;
            if (_lw != w) _lw = _ctx.width  = _domContainer.style.width  = _bcanvas.width  = _fcanvas.width  = this.Width;
            if (_lh != h) _lh = _ctx.height = _domContainer.style.height = _bcanvas.height = _fcanvas.height = this.Height;
        }
        if (this.Render(_ctx, time, dirty))
        {
            // Flip.
            if (_ffront)
            {
                _bcanvas.style.display = 'block';
                _fcanvas.style.display = 'none';
                _ctx = _fctx;
                _ffront = false;
            }
            else
            {
                _fcanvas.style.display = 'block';
                _bcanvas.style.display = 'none';
                _ctx = _bctx;
                _ffront = true;
            }
        }
    };
    
    this.AddChild = function (child)
    {
        _children.Add(child);
    };
    
    this.RemoveChild = function (child)
    {
        _children.Remove(child);
    };
}

Inherit(View, Placeable);
Interface(View, ['Render', 'GetViewport', 'On']);

function Viewport()
{
    var _widgets = new Container(Widget, true);
    var _bounds = { l: 0, t: 0, r: 0, b: 0 };
    
    var _window;
    
    this.Render = function (ctx, time, bounds, force)
    {
        _bounds = bounds;
        return _widgets.FoldL('_Render', force, [ctx, _bounds.l, _bounds.t, _bounds.r - _bounds.l, _bounds.b - _bounds.t, _bounds.l, _bounds.t, _bounds.r, _bounds.b, time]) || force;
    };
    
    this.On = function (what, x, y, event)
    {
        if (x >= _bounds.l && x < _bounds.r && y >= _bounds.t && y < _bounds.b)
        {
            return _widgets.FoldR('_On', [what, x, y, _bounds.l, _bounds.t, event], false);
        }
        return false;
    };
    
    this.AddWidget = function (child)
    {
        _widgets.Add(child);
        child.SetParent(this);
    };
    
    this.RemoveWidget = function (child)
    {
        _widgets.Remove(child);
        child.SetParent(this);
    };
    
    this.SetWindow = function (window)
    {
        _window = window;
    };
    
    this.RegisterAction = function (on)
    {
        if (_window)
        {
            _window.RegisterAction(on);
        }
    };
}

function Window(x, y)
{
    "use strict";
    
    this.super(x, y);
    
    var _chrome = new Container(Widget, true);
    
    var _viewport = new Viewport();
    _viewport.SetWindow(this);
    
    Object.defineProperty(this, 'Viewport', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v instanceof Viewport)
                {
                    if (v == _viewport) return;
                    this.Dirty();
                    _viewport.SetWindow();
                    v.SetWindow(this);
                    return (_viewport = v);
                }
            },
            get: function () { return _viewport; }
        });
    
    /*
        x  - Theoretical "x" position of the parent.
        y  - Theoretical "y" position of the parent.
        bl - Left bounds of the drawing area.
        bt - Top bounds of the drawing area.
        br - Right bounds of the drawing area.
        bb - Bottom bounds of the drawing area.
    */
    this.Render = function (ctx, time, force)
    {
        force = this.RenderChrome(ctx, time, force) || force;
        force = _chrome.FoldL('_Render', force, [ctx, 0, 0, this.Width, this.Height, 0, 0, this.Width, this.Height, time]) || force;
        return _viewport.Render(ctx, time, this.GetViewport(this.Width, this.Height, time), force);
        // Render all the children.
    };
    
    this.On = function (what, x, y, event)
    {
        if (!_viewport.On(what, x, y, event) && !_chrome.FoldR('_On', [what, x, y, 0, 0, event], false))
        {
            this.OnChrome(what, x, y, event);
        }
        return false;
    };
    
    this.AddChrome = function (child)
    {
        _chrome.Add(child);
    };
    
    this.RemoveChrome = function (child)
    {
        _chrome.Remove(child);
    };
    
    this.RegisterAction('mousedown');
    //this.RegisterAction('mouseup');
    
    return this;
}

Inherit(Window, View);
Interface(Window, ['GetViewport', 'RenderChrome', 'OnChrome']);






