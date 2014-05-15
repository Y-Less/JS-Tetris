function View()
{
    "use strict";
    
    // Get the arguments as a real array.
    // var args = Array.prototype.slice.call(arguments, 0);
    // var _parent = args.shift().View;
    // var f = args.shift();
    
    var _shown = false;
    var _swap = false;
    var _ffront = true;
    
    var _left = 0;
    var _top  = 0;
    
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
    
    _domContainer.appendChild(_bcanvas);
    _domContainer.appendChild(_fcanvas);
    _domContainer.appendChild(_domInteract);
    
    Object.defineProperty(this, 'X', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                this.Move(v, _top);
            },
            get: function () { return _left; }
        });
    
    Object.defineProperty(this, 'Y', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                this.Move(_left, v);
            },
            get: function () { return _top; }
        });
    
    function SwapBuffers()
    {
        // Change which is shown;
        if (_ffront)
        {
            _bcanvas.style.display = 'block';
            _fcanvas.style.display = 'none';
            _ffront = false;
        }
        else
        {
            _fcanvas.style.display = 'block';
            _bcanvas.style.display = 'none';
            _ffront = true;
        }
        
        // Swap the buffer references.
        var xtmp = _fctx;
        _fctx = _bctx;
        _bctx = xtmp;
        
        // Don't need a flip again for a while.
        _swap = false;
    }
    
    var _domHandlers = {};
    
    function ProcessDOM(event)
    {
        if (_enabled)
        {
            var x = event.offsetX = event.offsetX || event.pageX - _left;
            var y = event.offsetY = event.offsetY || event.pageY - _top ;
            /*var t = _domHandlers[event.type];
            for (var i in t)
            {
                t[i].Try(x, y, event);
            }*/
            // Pass the event down the chain of children.
        }
        return false;
    }
    
    this.Show = function (parent)
    {
        // Add BOTH buffers to the page, so that they can be swapped.
        parent.appendChild(_domContainer);
        // Add the handlers that are pending.
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
        this.Show = function ()
        {
            if (!_shown)
            {
                _domContainer.style.display = 'block';
                _shown = true;
            }
        };
        this.Show();
    };
    
    this.Hide = function ()
    {
        _domContainer.style.display = 'none';
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
    
    this.Move = function (x, y)
    {
        _domContainer.style.left = _left = _fcanvas.style.left = _bcanvas.style.left = x;
        _domContainer.style.top  = _top  = _fcanvas.style.top  = _bcanvas.style.top  = y;
    };
    
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
    
    this.Add = function (child)
    {
        // Add this to the list of children.
        _children.push(child);
    };
    
    this.Remove = function (child)
    {
        // Add this to the list of children.
        for (var i = 0, end = _children.length; i != end; ++i)
        {
            if (_children[i] == child)
            {
                _children.splice(i, 1);
                return;
            }
        }
    };
    
    if (!document.addEventListener)
    {
        _domInteract.addEventListener = function (a, b, c) { return this.attachEvent('on' + a, b); };
    }
    
    this.RegisterAction = function (on)
    {
        if (!_domHandlers[on])
        {
            _domHandlers[on] = true;
        }
    };
    
    // // Call the init function, or concatenate the objects.
    // if (f instanceof Function) f.apply(this, args);
    // else
    // {
        // while (f instanceof Object)
        // {
            // for (var i in f)
            // {
                // if (f.hasOwnProperty(i)) this[i] = f[i];
            // }
            // f = args.shift();
        // }
    // }
    
    return this;
}

Interface(View, ['Render', '_On']);

