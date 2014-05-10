function View()
{
    // Get the arguments as a real array.
    var args = Array.prototype.slice.call(arguments, 0);
    var _parent = args.shift().View;
    var f = args.shift();
    
    // Double-buffering.
    //var _buffer = {};
    var _shown = false;
    var _swap = false;
    var _z = 10;
    
    var _domContainer = document.createElement('div');
    _domContainer.className = 'canvas_container';
    
    var _fcanvas = View.CreateCanvas(0, 0);
    var _fctx = View.GetContext(_fcanvas);
    _fcanvas.style.display = 'none';
    
    var _bcanvas = View.CreateCanvas(0, 0);
    var _bctx = View.GetContext(_bcanvas);
    _bcanvas.style.display = 'none';
    
    var _left = 0;
    var _top  = 0;
    
    _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z;
    _domContainer.style.zIndex = _z + 1;
    
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
    
    var _domHandlers  = {}; //{'click': []};
    var _attached = false;
    
    function ProcessDOM(event)
    {
        if (_enabled)
        {
            var x = event.offsetX = event.offsetX || event.pageX - _left;
            var y = event.offsetY = event.offsetY || event.pageY - _top ;
            var t = _domHandlers[event.type];
            for (var i in t)
            {
                t[i].Try(x, y, event);
            }
        }
        return false;
    }
    
    // "onclick" events don't work very well because we are constantly swapping
    // the active DOM element.  Thus, the user may "mousedown" on one, and
    // "mouseup" on the other, so not register a "click" event.  We could add a
    // parent DOM element that is clicked.  That is probably the best solution,
    // this is the quickest.
    /*var _down = false;
    
    // http://stackoverflow.com/questions/12593035/cloning-javascript-event-object
    function CloneEventObj(eventObj, overrideObj)
    {
       if (!overrideObj) overrideObj = {};
       function EventCloneFactory(overProps)
       {
           for (var x in overProps)
           {
               this[x] = overProps[x];
           }
        }
        EventCloneFactory.prototype = eventObj;
        return new EventCloneFactory(overrideObj);
    }
    
    function OnDown(event)
    {
        _down = true;
    }
    
    function OnUp(event)
    {
        if (_down)
        {
            var e = CloneEventObj(event, { type: 'click', });
            //e['type'] = 'click';
            ProcessDOM(e);
            //event.type = 'mouseup';
            _down = false;
        }
    }*/
    
    this.Show = function ()
    {
        // Add BOTH buffers to the page, so that they can be swapped.
        document.body.appendChild(_fcanvas);
        document.body.appendChild(_bcanvas);
        document.body.appendChild(_domContainer);
        this.Resize();
        // Add the handlers that are pending.
        _attached = true;
        //_bcanvas.addEventListener('mousedown', OnDown, false);
        //_fcanvas.addEventListener('mousedown', OnDown, false);
        //_bcanvas.addEventListener('mouseup', OnUp, false);
        //_fcanvas.addEventListener('mouseup', OnUp, false);
        for (var on in _domHandlers)
        {
            //if (on !== 'click')
            {
                _domContainer.addEventListener(on, ProcessDOM, false);
            }
        }
        this.Show = function ()
        {
            if (!_shown)
            {
                _domContainer.style.display = 'block';
                _fcanvas.style.display = 'block';
                _shown = true;
            }
        };
        this.Show();
    };
    
    this.Hide = function ()
    {
        _domContainer.style.display = 'none';
        _fcanvas.style.display = 'none';
        _shown = false;
    };
    
    var _enabled = true;
    
    this.Disable = function ()
    {
        _enabled = false;
    };
    
    this.Enable = function ()
    {
        _enabled = true;
    };
    
    this.IsShown = function ()
    {
        return _shown;
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
            _bctx.width  = _fctx.width  = _bcanvas.width  = _fcanvas.width  = _domContainer.style.width  = w;
            _bctx.height = _fctx.height = _bcanvas.height = _fcanvas.height = _domContainer.style.height = h;
            
            _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z = _parent.AddChild(this);
            _domContainer.style.zIndex = _z + 1;
        };
        
        this.Move = function (x, y)
        {
            _parent.MoveChild(this, x, y);
        };
        
        this.UpdatePos = function (parent, ox, oy)
        {
            var rect = parent.getBoundingClientRect();
            _domContainer.style.left = _left = _fcanvas.style.left = _bcanvas.style.left = ox + rect.left + (parent.width  - _bcanvas.width ) / 2;
            _domContainer.style.top  = _top  = _fcanvas.style.top  = _bcanvas.style.top  = oy + rect.top  + (parent.height - _bcanvas.height) / 2;
        }
        
        this.Resize = ResizeRecurse;
    }
    else
    {
        // This is the background element - fill the screen.
        _fcanvas.style.left   = _bcanvas.style.left   = 0;
        _fcanvas.style.top    = _bcanvas.style.top    = 0;
        _fcanvas.style.zIndex = _bcanvas.style.zIndex = _z = 10;
        _domContainer.style.zIndex = _z + 1;
        //document.body.appendChild(_view);
        
        this.Resize = function ()
        {
            var mw = window.innerWidth;
            var mh = window.innerHeight;
            _domContainer.style.width  = _bctx.width  = _fctx.width  = _bcanvas.width  = _fcanvas.width  = mw;
            _domContainer.style.height = _bctx.height = _fctx.height = _bcanvas.height = _fcanvas.height = mh;
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
    
    this.MoveChild = function(o, x, y)
    {
        o.UpdatePos(_fcanvas, x, y);
    };
    
    var _controller;
    
    this.SetController = function (c)
    {
        _controller = c;
        // Install required handlers.
    };
    
    var _events = {};
    // var _zones = [];
    
    var _domActions   = {};
    var _childActions = {};
    
    this.RegisterEvents = function (events)
    {
        for (var i in events) _events[i] = events[i];
    };
    
    this.AddEvent = function (name, event)
    {
        _events[name] = event;
    };
    
    this.RemoveEvent = function (name)
    {
        delete _events[name];
    };
    
    if (!document.addEventListener)
    {
        _domContainer.addEventListener = function (a, b, c) { return this.attachEvent('on' + a, b); };
    }
    
    this.RegisterZone = function (name, on, x, y, w, h)
    {
        if (!_domHandlers[on])
        {
            if (_attached)
            {
                _domContainer.addEventListener(on, ProcessDOM, false);
            }
            _domHandlers[on] = [];
        }
        //++_domHandlers[on];
        w += x;
        h += y;
        _domHandlers[on].push(
            {
                Name: name,
                On: on,
                Try: function (x2, y2, event)
                {
                    if (x <= x2 && x2 < w && y <= y2 && y2 < h)
                    {
                        var e = _events[name];
                        if (e && e[1] instanceof Function) e[1].call(e[0], event);
                        return true;
                    }
                    return false;
                },
            });
    };
    
    this._ProcessAction = function (event)
    // ProcessAction;
    // function ProcessAction(event)
    {
        if (this.IsShown())
        {
            var t = _childActions[event.type];
            for (var i in t)
            {
                if (t[i]._ProcessAction(event)) return true;
            }
            if (_enabled)
            {
                t = _domActions[event.type];
                var ret = false;
                for (var i in t)
                {
                    if (t[i].Try(event)) ret = true;
                }
                return ret;
            }
        }
        return false;
    }
    
    if (_parent)
    {
        this.RegisterChildAction = function (that, on)
        {
            if (!_childActions[on])
            {
                _parent.RegisterChildAction(this, on);
                _childActions[on] = [];
                _domActions[on] = [];
            }
            _childActions[on].push(that);
        }
        
        this.RegisterAction = function (name, on)
        {
            if (!_domActions[on])
            {
                _parent.RegisterChildAction(this, on);
                _childActions[on] = [];
                _domActions[on] = [];
            }
            _domActions[on].push(
                {
                    Name: name,
                    On: on,
                    Try: function (event)
                    {
                        var e = _events[name];
                        if (e && e[1] instanceof Function) e[1].call(e[0], event);
                        return true;
                    },
                });
        };
    }
    else
    {
        function ProcessRootAction(event)
        {
            var t = _childActions[event.type];
            for (var i in t)
            {
                if (t[i]._ProcessAction(event)) return false;
                // if (ProcessAction.call(t[i], event)) return true;
            }
            if (_enabled)
            {
                t = _domActions[event.type];
                for (var i in t)
                {
                    t[i].Try(event);
                }
            }
            return false;
        }
        
        this.RegisterChildAction = function (that, on)
        {
            if (!_childActions[on])
            {
                document.addEventListener(on, ProcessRootAction, false);
                _childActions[on] = [];
                _domActions[on] = [];
            }
            _childActions[on].push(that);
        }
        
        this.RegisterAction = function (name, on)
        {
            if (!_domActions[on])
            {
                document.addEventListener(on, ProcessRootAction, false);
                _childActions[on] = [];
                _domActions[on] = [];
            }
            _domActions[on].push(
                {
                    Name: name,
                    On: on,
                    Try: function (event)
                    {
                        var e = _events[name];
                        if (e && e[1] instanceof Function) e[1].call(e[0], event);
                        return true;
                    },
                });
        };
    }
    
    // this.Unregister = function (name)
    // {
        // for (
    // };
    
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

