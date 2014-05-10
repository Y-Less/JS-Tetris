function Controller ()
{
    // Get the arguments as a real array.
    var args = Array.prototype.slice.call(arguments, 0);
    var f = args.shift();
    var _name = args.shift();
    f.Add(this, _name);
    f = args.shift();
    
    var _model;
    var _view;
    var _events;
    
    Object.defineProperty(this, 'Name', {
        get: function () { return _name; },
        set: ReadOnly('Name'),
    });
    
    Object.defineProperty(this, 'Model', {
        get: function () { return _model; },
        set: function (v)
        {
            if (v.SetController instanceof Function)
            {
                _model = v;
                v.SetController(this);
                return v;
            }
        },
    });
    
    Object.defineProperty(this, 'View', {
        get: function () { return _view; },
        set: function (v)
        {
            if (v.SetController instanceof Function && v.RegisterEvents instanceof Function)
            {
                _view = v;
                v.SetController(this);
                if (_events) v.RegisterEvents(_events);
                return v;
            }
        },
    });
    
    //this.Controller = this;
    
    this.RegisterEvents = function (events)
    {
        _events = events;
        if (_view) _view.RegisterEvents(events);
    };
    
    this.AddEvent = function (name, event)
    {
        _events[name] = event;
    };
    
    this.RemoveEvent = function (name)
    {
        delete _events[name];
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

//Controller.prototype.RegisterEvents = function () {}


Controller.prototype.Entry  = function () {}
Controller.prototype.Exit   = function () {}
Controller.prototype.Update = function () {}
Controller.prototype.Render = function () {}

