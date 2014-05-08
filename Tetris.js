// Settings.

var UPDATE_FPS = 20;
var RENDER_FPS = 50;

// Constants.
var STATE_SPLASH   = 'SplashScreen';
var STATE_CONTINUE = 'ContinueScreen';
var STATE_MENU     = 'Menu';
var STATE_CREDITS  = 'Credits';
var STATE_OPTIONS  = 'Options';
var STATE_SCORES   = 'HighScores';
var STATE_NEW      = 'NewGame';
var STATE_GAME     = 'Game';
var STATE_PAUSE    = 'Pause';
var STATE_QUIT     = 'Quit';
var STATE_OVER     = 'GameOver';
var STATE_HIGH     = 'HighScore';
var STATE_INDUCTED = 'Inducted';

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
			GenFunc.call(that, cur, 'SetMin', function (n)  { return (cur.min = n) == n;   });
			GenFunc.call(that, cur, 'SetMax', function (n)  { return (cur.max = n) == n;   });
		})(this, _settings[i]);
	}
}

var Settings = new SettingsHandler({
		'Volume':     {min: 0, max: 100, value: 100}, //, Set: true},
		'StartSpeed': {min: 1, max: 15,  value: 1}, //, bla: 123, Get: function () { return this.bla; } }
	});

console.log(Settings.SetVolume(55));     // True.
console.log(Settings.SetVolume(-11));     // False.
console.log(Settings.SetVolume(550));     // False.
console.log(Settings.GetVolume());
//console.log(Settings.SetMinVolume(-55));
console.log(Settings.GetMinVolume());

console.log(Settings.SetStartSpeed(3));  // True.
console.log(Settings.GetStartSpeed());

console.log(Settings.SetVolume(58));     // True.
console.log(Settings.GetVolume());

console.log(Settings.SetStartSpeed(99)); // False.
console.log(Settings.GetStartSpeed());

//var x = [5, 6, 7, 8, 9];
//delete x[3];
//x.splice(2, 1);

// Track the current game state.
function StateHandler(_initial)
{
    var _stack = [];
	var _states = [];
	var _cur = '';
	
	function DoTransition(to)
	{
		if (_states[to] && _cur)
		{
			_states[_cur].Exit(to);
			_states[to].Entry(_cur);
			_cur = to;
		}
	}
    
    /*
        The state stack is used for minor states that are called from a great
        number of places and want to return to their call point, while leaving
        the call point alive in the background.
    */
	
	function DoPush(to)
	{
		if (_states[to] && _cur)
		{
            _stack.push(_cur);
			_states[to].Entry(_cur);
			_cur = to;
		}
	}
	
	function DoPop()
	{
		if (_stack[0] && _cur)
		{
            var to = _stack.pop();
			_states[_cur].Exit(to);
            _cur = to;
		}
	}
	
	this.Add = function (state) //name, obj)
	{
		var name = state.name;
		var obj = state.obj;
		// Validate that the state is valid, and that it doesn't already
		// exist.
		if (!_states[name] && obj.Entry && obj.Update && obj.Render && obj.Exit)
		{
			_states[name] = obj;
			obj.Transition = function (to) { if (_cur == name) DoTransition(to); };
			obj.Push = function (to) { if (_cur == name) DoPush(to); };
			obj.Pop = function () { if (_cur == name) DoPop(); };
			if (_cur == '' && _initial == name)
			{
				obj.Entry('');
				_cur = name;
			}
		}
	};
	
	this.Transition = DoTransition;
	this.Push = DoPush;
	this.Pop = DoPop;
	
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

var StateMachine = new StateHandler(STATE_SPLASH);
StateMachine.Update(0);

function GameHandler(_states, _update, _render, _canvas)
{
	var _lastUpdate;
	var _lastRender;
	
	_update = 1000 / _update;
	_render = 1000 / _render;
	
	{
		var now = Date.now();
		_states.Update(0);
		_lastUpdate = now;
		_states.Render(_canvas, 0);
		_lastRender = now;
	}
	
	//var _that = this;
	
	this.Update = function ()
	{
		var now  = Date.now();
		var udiff = now - _lastUpdate;
		var rdiff = now - _lastRender;
		//window.alert('hi: ' + (n - _last));
		if (udiff >= _update)
		{
			_states.Update(udiff);
			_lastUpdate = now;
		}
		if (rdiff >= _render)
		{
			_states.Render(_canvas, rdiff);
			_lastRender = now;
		}
	};
	
	window.setInterval(this.Update, 10);
};

var Game = new GameHandler(StateMachine, UPDATE_FPS, RENDER_FPS, 0);


function State(name, obj)
{
	this.name = name;
	this.obj = obj;
}

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) { this.Transition(STATE_CONTINUE); };
		this.Render = function (canvas, time) {};
		
		return new State(STATE_SPLASH, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) { this.Transition(STATE_MENU); };
		this.Render = function (canvas, time) {};
		
		return new State(STATE_CONTINUE, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_MENU, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_CREDITS, this);
	})());

StateMachine.Add(new (function (_settings)
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_OPTIONS, this);
	})(Settings));

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_SCORES, this);
	})());

StateMachine.Add(new (function (_settings)
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_NEW, this);
	})(Settings));

StateMachine.Add(new (function (_settings)
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_GAME, this);
	})(Settings));

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_PAUSE, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time) {};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_QUIT, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time)
		{
			if (clicked('Retry') || pressed(ENTER)) Transition(STATE_GAME);
			else if (clicked('Quit') || pressed(ESC)) Transition(STATE_MENU);
			else if (clicked('High Scores')) Transition(STATE_SCORES);
			else
			{
			}
		};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_OVER, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time)
		{
			if (clicked('OK') || pressed(ENTER)) Transition(STATE_INDUCTED);
			else if (clicked('Cancel') || pressed(ESC)) Transition(STATE_OVER);
			else
			{
			}
		};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_HIGH, this);
	})());

StateMachine.Add(new (function ()
	{
		this.Entry  = function (prev) {};
		this.Exit   = function (prev) {};
		this.Update = function (time)
		{
			if (clicked('Retry') || pressed(ENTER)) Transition(STATE_GAME);
			else if (clicked('Quit') || pressed(ESC)) Transition(STATE_MENU);
			else if (clicked('High Scores')) Transition(STATE_SCORES);
			else
			{
			}
		};
		this.Render = function (canvas, time) {};
		
		return new State(STATE_INDUCTED, this);
	})());

