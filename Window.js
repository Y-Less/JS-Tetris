Window = function ()
{
    
}

function Widget(_parent, _x, _y)
{
    var MIN = Math.min;
    var MAX = Math.max;
    
    // True when the image has shifted, but not been altered.
    var _moved = false;
    
    // True when the image has been changed.
    var _dirty = false;
    
    // True when the dimensions and position of the widget make it impossible to
    // see.
    var _noshow = false;
    
    var _children = [];
    
    // Create a surface on which to draw this element.
    var _canvas = document.createElement('canvas');
    var _ctx    = _canvas.getContext('2d');
    
    var _x = 0;
    var _y = 0;
    var _z = 0;
    
    var _width  = 0;
    var _height = 0;
    
    function NoShow()
    {
        // Check if this widget is entirely off the top/left of its parent.
        _noshow = _x + _width <= 0 || _y + _height <= 0;
    }
    
    // Accessors for moving the element about.
    Object.defineProperty(this, 'X', {
            configurable: false,
            enumerable: false,
            set: function (v)
            {
                _moved = true;
                NoShow();
                return (_x = v);
            },
            get: function () ( return _x; }
        });
    Object.defineProperty(this, 'Y', {
            configurable: false,
            enumerable: false,
            set: function (v)
            {
                _moved = true;
                NoShow();
                return (_y = v);
            },
            get: function () ( return _y; }
        });
    
    // For this one, we need the help of our parent.
    Object.defineProperty(this, 'Z', {
            configurable: false,
            enumerable: false,
            set: function (v)
            {
                _moved = true;
                _parent.ChangeZ(this);
                return (_z = v);
            },
            get: function () ( return _z; }
        });
    
    // Accessors for changing the object's size.
    Object.defineProperty(this, 'Width', {
            configurable: false,
            enumerable: false,
            set: function (v)
            {
                if (v <= 0) return; // Invalid size.
                _dirty = true;
                NoShow();
                return (_canvas.width = _width = v);
            },
            get: function () ( return _width; }
        });
    Object.defineProperty(this, 'Height', {
            configurable: false,
            enumerable: false,
            set: function (v)
            {
                if (v <= 0) return; // Invalid size.
                _dirty = true;
                NoShow();
                return (_canvas.height = _height = v);
            },
            get: function () ( return _height; }
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
        if (nbl >= nbr || nbt >= nbb) return;
        
        
        
        
        
        
        
        // Check if we are visible in the local parent's context.  We can't
        // abstract all three 
        if (_x >= width || _y >= height || _noshow) return false; // Did nothing (unseen).
        // Get the offset from the global location to this.
        x += _x;
        y += _y;
        // The "||" is NOT in the wrong place here.  We save the result and
        // check it.  Also force rendering if the widget is dirty.
        if ((force = this.Render(ctx, time, _dirty) || _moved || force))
        {
            // We have drawn the widget, re place it on the parent canvas.  We
            // must also take "width" and "height" in to account when drawing -
            // we don't want to draw beyond the end of out parent's bounds.
            ctx.drawImage(_canvas, MAX(0, -_x), MAX(0, -_y), MIN(_width, width - _x), MIN(_height, height - _y), x, y);
            // Here "_x" and "_y" are this widget's offsets from its parent, and
            // "x" and "y" are the position we are drawing this widget to in the
            // whole of the world.  The "MAX" expressions are for when this
            // element has a negative offset.
        }
        _moved = false;
        _dirty = false;
        for (var i = 0, end = _children.length; i != end; ++i)
        {
            // TODO: Don't have non-overlapping regions force each other to
            // redraw.
            force = _children[i]._Render(ctx, x, y, _width, _height, time, force) || force;
        }
        // Is this view dirty?
        return force;
    };
    
    this.Add = function (child, z)
    {
        child.Z = z = z || 0;
        // Add this to the list of children.
        for (var i = 0, end = _children.length; i != end; ++i)
        {
            if (_children[i].Z > z)
            {
                _children.splice(i, 0, child);
            }
            return;
        }
        _children.push(child);
    };
};

Interface(Widget, ['Render', 'Update', 'On']);





function Button()
{
    /*
        #     #                                           
        ##   ## ###### #    # #####  ###### #####   ####  
        # # # # #      ##  ## #    # #      #    # #      
        #  #  # #####  # ## # #####  #####  #    #  ####  
        #     # #      #    # #    # #      #####       # 
        #     # #      #    # #    # #      #   #  #    # 
        #     # ###### #    # #####  ###### #    #  ####  
    */
    var _down = false;
    var _lastDrawn = true;
    
    /*
        ######                                         #     #                                          
        #     # #####  # #    #   ##   ##### ######    ##   ## ###### ##### #    #  ####  #####   ####  
        #     # #    # # #    #  #  #    #   #         # # # # #        #   #    # #    # #    # #      
        ######  #    # # #    # #    #   #   #####     #  #  # #####    #   ###### #    # #    #  ####  
        #       #####  # #    # ######   #   #         #     # #        #   #    # #    # #    #      # 
        #       #   #  #  #  #  #    #   #   #         #     # #        #   #    # #    # #    # #    # 
        #       #    # #   ##   #    #   #   ######    #     # ######   #   #    #  ####  #####   ####  
    */
    function OnMouseDown(event)
    {
        _down = true;
    }
    
    function OnMouseUp(event)
    {
        if (_down)
        {
            _down = false;
            // Trigger the "click" event.
        }
    }
    
    function OnMouseOff(event)
    {
        _down = false;
    }
    
    function Render(ctx)
    {
        var dirty = false;
        // Call a rendering function for the current state, and pass whether or
        // not the state has changed since the last rendering.
        if (_down) dirty = this.DrawDown(!_lastDrawn, ctx);
        else       dirty = this.DrawUp  (_lastDrawn, ctx);
        _lastDrawn = _down;
        return dirty;
    }
    
    /*
         #####                                                                      
        #     #  ####  #    #  ####  ##### #####  #    #  ####  #####  ####  #####  
        #       #    # ##   # #        #   #    # #    # #    #   #   #    # #    # 
        #       #    # # #  #  ####    #   #    # #    # #        #   #    # #    # 
        #       #    # #  # #      #   #   #####  #    # #        #   #    # #####  
        #     # #    # #   ## #    #   #   #   #  #    # #    #   #   #    # #   #  
         #####   ####  #    #  ####    #   #    #  ####   ####    #    ####  #    # 
    */
    (function ()
    {
        
    })();
    
    return this;
}

