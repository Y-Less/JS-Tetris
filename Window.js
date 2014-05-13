Window = function ()
{
    
}



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

