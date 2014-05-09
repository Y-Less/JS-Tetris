// Global settings store.
function SettingsHandler(_settings)
{
	// Private object method.
	function GenFunc(obj, gs, func)
	{
		var ff = obj[gs];
		// Don't want any version of this function.
		if (ff === false) return;
		// Do they have a custom version?
		this[gs + obj.name] =
			(ff instanceof Function) ?
				function () { return ff.apply(obj, arguments); } :
				func;
	}
	
	// Create "getters" and "setters" for each item.
	for (var i in _settings)
	{
		(function (that, cur)
		{
			cur.name = i;
			// Generate all the "Settings" functions.
			GenFunc.call(that, cur, 'Set',    function (n) { return cur.min <= n && n <= cur.max && (cur.value = n) == n; });
			GenFunc.call(that, cur, 'Get',    function ()  { return cur.value; });
			GenFunc.call(that, cur, 'GetMin', function ()  { return cur.min;   });
			GenFunc.call(that, cur, 'GetMax', function ()  { return cur.max;   });
			// Default these to non-existent.
			cur.SetMin = cur.SetMin || false;
			cur.SetMax = cur.SetMax || false;
			GenFunc.call(that, cur, 'SetMin', function (n) { return (cur.min = n) == n; });
			GenFunc.call(that, cur, 'SetMax', function (n) { return (cur.max = n) == n; });
		})(this, _settings[i]);
	}
}

// Track the current game state.
function StateHandler(_initial)
{
	var _states = [];
	var _cur = '';
	//var _that = this;
	
	function DoTransition(to)
	{
		if (_states[to] && _cur)
		{
			_states[_cur].Exit(to);
			_states[to].Entry(_cur);
			_cur = to;
		}
	}
	
	this.Add = function (state) //name, obj)
	{
		var name = state.Name;
		//var obj = state;
		// Validate that the state is valid, and that it doesn't already
		// exist.
		if (!_states[name] && state.Entry && state.Update && state.Render && state.Exit)
		{
			_states[name] = state;
			state.Transition = function (to) { if (_cur == name) DoTransition(to); };
			if (_cur == '' && _initial == name)
			{
				state.Entry('');
				_cur = name;
			}
		}
	};
	
	this.Transition = DoTransition;
	
	this.Update = function (time)
	{
		if (_cur)
		{
			_states[_cur].Update(time);
		}
	};
	
	this.Render = function (canvas, time)
	{
		if (_cur)
		{
			_states[_cur].Render(canvas, time);
		}
	};
	
	this.GetState = function ()
	{
		return _cur;
	};
}

function State()
{
    // Get the arguments as a real array.
    var args = Array.prototype.slice.call(arguments, 0);
    var controller = args.shift();
    var _name = args.shift();
    var f = args.shift();
    
    Object.defineProperty(this, 'Name', {
        get: function () { return _name; },
        set: ReadOnly('Name'),
    });
    
    f.apply(this, args);
    
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
    
    controller.Add(this, _name);
    
    return this;
}

function State(name, obj)
{
	this.name = name;
	this.obj = obj;
}

new State(StateMachine, STATE_SPLASH, function ()
    {
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) { this.Transition(STATE_CONTINUE); };
		this.Render = function (canvas, time) {};
    });

