Window = function ()
{
    
}

function Widget(_parent, _x, _y)
{
    "use strict";
    
    var MIN = Math.min;
    var MAX = Math.max;
    
    // VERY simple - is this widget to be shown WHEN IT'S PARENT IS?
    var _shown = true;
    
    // True when the image has shifted, but not been altered.
    var _moved = true;
    
    // True when the image has been changed.
    var _dirty = true;
    // Both these are true by default to show the thing initially.
    
    var _children = [];
    
    // Create a surface on which to draw this element.
    var _canvas = document.createElement('canvas');
    var _ctx    = _canvas.getContext('2d');
    // Useful properties that don't exist normally :(.
    _ctx.width = 0;
    _ctx.height = 0;
    
    //var _x = 0;
    //var _y = 0;
    var _z = 0;
    
    var _width  = 0;
    var _height = 0;
    
    // Dirty previously hidden widgets.
    this.Show = function () { _dirty = _dirty || !_shown; _shown = true; }
    this.Hide = function () { _shown = hide; }
    this.IsShown = function () { return _shown; }
    
    Object.defineProperty(this, 'X', {
            configurable: false,
            enumerable: false,
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
    
    // For this one, we need the help of our parent.
    Object.defineProperty(this, 'Z', {
            configurable: false,
            enumerable: true,
            set: function (v)
            {
                if (v == _z) return;
                if (_parent)
                {
                    _parent.Remove(this);
                    _parent.Add(this, v);
                }
                _moved = true;
                return (_z = v);
            },
            get: function () { return _z; }
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
                return (_ctx.width = _canvas.width = _width = v);
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
                return (_ctx.height = _canvas.height = _height = v);
            },
            get: function () { return _height; }
        });
    
    /*
        x  - Theoretical "x" position of the parent.
        y  - Theoretical "y" position of the parent.
        bl - Left bounds of the drawing area.
        bt - Top bounds of the drawing area.
        br - Right bounds of the drawing area.
        bb - Bottom bounds of the drawing area.
    */
    this._Render = function (ctx, x, y, bl, bt, br, bb, time, force)
    {
        if (!_shown) return false;
        // Get the theoretical start location of this element.
        x += _x;
        y += _y;
        //if (x >= br || y >= bb || x + _width
        // New bounding rect (for this and children).
        var nbl = MAX(bl, x);
        var nbt = MAX(bt, y);
        var nbr = MIN(br, x + _width);
        var nbb = MIN(bb, y + _height);
        // Find out if this is entirely outside the bounding rect.  If it is,
        // the new bounding box will be invalid.
        if (nbl >= nbr || nbt >= nbb) return false;
        // The "||" is NOT in the wrong place here.  We save the result and
        // check it.  Also force rendering if the widget is dirty.
        var moved = _moved;
        var dirty = _dirty;
        // In case "Render" adjusts them.
        _moved = false;
        _dirty = false;
        if ((force = this.Render(_ctx, time, dirty) || moved || force))
        {
            // Draw the canvas within our bounding rectangle.
            ctx.drawImage(_canvas, nbl - x, nbt - y, nbr - nbl, nbb - nbt, nbl, nbt, nbr - nbl, nbb - nbt);
        }
        for (var i = 0, end = _children.length; i != end; ++i)
        {
            // TODO: Don't have non-overlapping regions force each other to
            // redraw.
            force = _children[i]._Render(ctx, x, y, nbl, nbt, nbr, nbb, time, force) || force;
        }
        // Is this view dirty?
        return force;
    };
    
    this.Add = function (child, z)
    {
        if (z < 0) return;
        // Add this to the list of children.
        for (var i = 0, end = _children.length; i != end; ++i)
        {
            if (_children[i].Z > z)
            {
                _children.splice(i, 0, child);
                return;
            }
        }
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
    
    if (_parent) _parent.Add(this, _z);
    
    return this;
}

Interface(Widget, ['Render', 'Update', 'On']);





// function Button()
// {
    // /*
        // #     #                                           
        // ##   ## ###### #    # #####  ###### #####   ####  
        // # # # # #      ##  ## #    # #      #    # #      
        // #  #  # #####  # ## # #####  #####  #    #  ####  
        // #     # #      #    # #    # #      #####       # 
        // #     # #      #    # #    # #      #   #  #    # 
        // #     # ###### #    # #####  ###### #    #  ####  
    // */
    // var _down = false;
    // var _lastDrawn = true;
    
    // /*
        // ######                                         #     #                                          
        // #     # #####  # #    #   ##   ##### ######    ##   ## ###### ##### #    #  ####  #####   ####  
        // #     # #    # # #    #  #  #    #   #         # # # # #        #   #    # #    # #    # #      
        // ######  #    # # #    # #    #   #   #####     #  #  # #####    #   ###### #    # #    #  ####  
        // #       #####  # #    # ######   #   #         #     # #        #   #    # #    # #    #      # 
        // #       #   #  #  #  #  #    #   #   #         #     # #        #   #    # #    # #    # #    # 
        // #       #    # #   ##   #    #   #   ######    #     # ######   #   #    #  ####  #####   ####  
    // */
    // function OnMouseDown(event)
    // {
        // _down = true;
    // }
    
    // function OnMouseUp(event)
    // {
        // if (_down)
        // {
            // _down = false;
            // // Trigger the "click" event.
        // }
    // }
    
    // function OnMouseOff(event)
    // {
        // _down = false;
    // }
    
    // function Render(ctx)
    // {
        // var dirty = false;
        // // Call a rendering function for the current state, and pass whether or
        // // not the state has changed since the last rendering.
        // if (_down) dirty = this.DrawDown(!_lastDrawn, ctx);
        // else       dirty = this.DrawUp  (_lastDrawn, ctx);
        // _lastDrawn = _down;
        // return dirty;
    // }
    
    // /*
         // #####                                                                      
        // #     #  ####  #    #  ####  ##### #####  #    #  ####  #####  ####  #####  
        // #       #    # ##   # #        #   #    # #    # #    #   #   #    # #    # 
        // #       #    # # #  #  ####    #   #    # #    # #        #   #    # #    # 
        // #       #    # #  # #      #   #   #####  #    # #        #   #    # #####  
        // #     # #    # #   ## #    #   #   #   #  #    # #    #   #   #    # #   #  
         // #####   ####  #    #  ####    #   #    #  ####   ####    #    ####  #    # 
    // */
    // (function ()
    // {
        
    // })();
    
    // return this;
// }

