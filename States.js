
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
	
	this.Add = function (state, name) //name, obj)
	{
		//var name = state.Name;
		//var obj = state;
		// Validate that the state is valid, and that it doesn't already
		// exist.
		if (!_states[name] && state.Entry && state.Update && state.Render && state.Exit)
		{
			_states[name] = state;
			state.Transition = function (to) { if (_cur == name) DoTransition(to); };
			/*if (_cur == '' && _initial == name)
			{
				state.Entry('');
				_cur = name;
			}*/
		}
	};
    
    this.Start = function ()
    {
        if (_cur == '' && _states[_initial])
        {
			_states[_initial].Entry(_cur);
			_cur = _initial;
            _states[_cur].Update(0);
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

/*
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

State.prototype.Entry  = function () {}
State.prototype.Exit   = function () {}
State.prototype.Update = function () {}
State.prototype.Render = function () {}
*/

// new State(StateMachine, STATE_SPLASH, function ()
    // {
		// this.Entry  = function (prev) {};
		// this.Exit   = function (prev) {};
		// this.Update = function (time) { this.Transition(STATE_CONTINUE); };
		// this.Render = function (canvas, time) {};
    // });

