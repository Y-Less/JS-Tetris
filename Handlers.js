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

