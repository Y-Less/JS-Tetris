// ========================================================================= 
//  The contents of this file are subject to the Mozilla Public License      
//  Version 1.1 (the "License"); you may not use this file except in         
//  compliance with the License. You may obtain a copy of the License at     
//  http://www.mozilla.org/MPL/                                              
//                                                                           
//  Software distributed under the License is distributed on an "AS IS"      
//  basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the  
//  License for the specific language governing rights and limitations       
//  under the License.                                                       
//                                                                           
//  The Original Code is the yavascript development system - yavascript.js.  
//                                                                           
//  The Initial Developer of the Original Code is Alex "Y_Less" Cole.        
// ========================================================================= 

window.onload = function ()
{
	var
		makeArray = "abc".split(/(b)/).length === 3 ?
			function (str)
			{
				// Every ECMAScript compliant browser
				return str.split(/^\s*#\s*(\w*)(.*)\s*$/mg);
			} :
			function (str)
			{
				// Non-compliant browsers (i.e. IE)
				// Need to split out the whole thing manually
				// Note: Fix the BUG, not the BROWSER
				// http://dev.opera.com/articles/view/a-browser-sniffing-warning-the-trouble/
				var
					a = [],
					l = 0,
					p,
					r = /^\s*#\s*(\w*)(.*)\s*$/m;
				while ((p = str.search(r)) != -1)
				{
					a[l++] = str.substr(0, p);
					str = str.substr(p).replace(r, function ($0, $1, $2)
						{
							a[l++] = $1;
							a[l++] = $2;
							return '';
						});
				}
				// Append the end
				a[l] = str;
				return a;
			};
	
	// Send a message somewhere
	var
		message = window['console'] ?
			// Got a console, excellent
			window['console'].log :
			document.getElementById('error') ?
				// Got an error div, OK I guess
				(function()
				{
					var
						id = document.getElementById('error');
					return function (msg)
						{
							// Message div if there is one
							id.innerHTML = msg + '<br />' + id.innerHTML;
						};
				})() :
				// Only got alert(), not good
				alert;
	
	// Get a file for inclusion
	function doInclude(url)
	{
		// Request a file from the server
		// Use a SYNCHRONOUS request,
		// development should always be
		// done locally anyway.
		var
			httpRequest;
		if (window.XMLHttpRequest)
		{
			// Mozilla, Safari, ...
			httpRequest = new XMLHttpRequest();
			if (httpRequest.overrideMimeType)
			{
				httpRequest.overrideMimeType('text/yavascript');
			}
		} 
		else if (window.ActiveXObject)
		{
			// IE
			try
			{
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (e)
			{
				try
				{
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e)
				{
					return '';
				}
			}
		}
		if (!httpRequest)
		{
			return '';
		}
		httpRequest.open('GET', url, false);
		httpRequest.send('');
		if (httpRequest.readyState == 4 && httpRequest.status == 200)
		{
			return doIncludes(httpRequest.responseText, url);
		}
		else
		{
			message('Could not open file "' + url + '"');
		}
		return '';
	}
	
	function doStripComments(code)
	{
		// Take out comments first, makes it easier to sort
		// out the other bits below. Yes, this line is complex
		// it removes comments from the source, ignoring
		// ones in strings. See:
		// http://www.perlmonks.org/?node=How%20do%20I%20use%20a%20regular%20expression%20to%20strip%20C%20style%20comments%20from%20a%20file%3F
		code = code.replace(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\/|([^\/"']*("[^"\\]*(\\[\d\D][^"\\]*)*"[^\/"']*|'[^'\\]*(\\[\d\D][^'\\]*)*'[^\/"']*|\/+[^*\/][^\/"']*)*)/g, function ($0, $1, $2)
			{
				return ' ' + $2 ? $2 : '';
			});
		// This removes line comments
		code = code.replace(/\/\/(.*)|\/\*[^*]*\*+([^\/*][^*]*\*+)*\/|"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[^\/"']+/g, function ($0, $1)
			{
				return $1 ? '' : $0;
			});
		// We know there are no comments now,
		// so everything here should be valid.
		return code;
	}
	
	var doneIncludes = [];
	
	function doIncludes(code, path)
	{
		// Do inclusions
		// Parse all files into one
		// BEFORE doing things like defines
		code = doStripComments(code);
		// #pragma once
		if (/^\s*#\s*pragma\sonce\s*$/m.test(code))
		{
			if (doneIncludes.indexOf(path) != -1) return '';
			else doneIncludes.push(path);
		}
		path = path.replace(/(.*)\/.*/, '$1');
		if (path.length != 0) //indexOf('/') == -1) // && path.indexOf('\\') == -1)
		{
			// A path - append a slash
			path += '/';
		}
		return code.replace(/^\s*#\s*include\s(.*)\s*$/gm, function ($0, $1)
			{
				// Strip old filename
				var
					np = path + eval($1),
					done;
				// Get the relative path
				do
				{
					done = false;
					// Resolve relative paths recursively
					np = np.replace(/[^\/]+\/\.\.\//g, function ()
						{
							done = true;
							return '';
						});
				}
				while (done);
				return doInclude(np);
			});
	}
	
	function doMacroReplaces(code)
	{
		var
			d = doMacroReplaces.defs,
			loop;
		do
		{
			loop = false;
			// Do all current possible replacements
			for (var k in d)
			{
				if (d[k][0].test(code))
				{
					code = code.replace(d[k][0], d[k][1]);
					loop = true;
					break;
				}
				// It doesn't like me defining the
				// regex as the array key
				// code = code.replace(new RegExp(k, 'mg'), function ($0, $1, $2)
					// {
						// loop = true;
						// return $1 + d[k] + $2;
					// });
				// code = code.replace(new RegExp(k, 'mg'), function ($0, $1, $2)
					// {
						// loop = true;
						// return $1 + d[k] + $2;
					// });
			}
		}
		while (loop)
		return code;
	}
	doMacroReplaces.defs = {};
	
	function regexEscape(s)
	{
		return s.replace(/([.*+?^$|(){}\[\]\\])/g, "\\$1");
	}
	
	function searchEscape(s, n)
	{
		if (s == '\\') s = n;
		return s.replace(/([\[\]\\])/, '\\$1');
	}
	
	function replaceEscape(s)
	{
		return s.replace(/\$/g, '$$$$');
	}
	
	// Split the input up in to three parts - name, search, replacement.
	var defPattern = new RegExp('^\\s*([A-Za-z0-9_$]+)(\\S*)($|\\s+(.*)$)');
	// Extract "%n" parts from the search and replace patterns.
	var repPattern = new RegExp('(^|[^%])(%%)*%([0-9])', 'g');
	
	var charEnding = new RegExp('[A-Za-z0-9_$]$');
	
	function buildSearchReplace(str)
	{
		// There are three parts to the define pattern - the name, the search
		// pattern, and the replacement pattern.
		// The first part uses [A-Za-z0-9_$] not \w because "$" is a valid JS
		// identifier character that is NOT covered by "\w".
		var def = str.match(defPattern);
		if (!def) return;
		// "def" = name: def[1], search: def[1] + def[2], replace: def[4] || ''.
		var search = regexEscape(def[1] + def[2]);
		var pos = 0;
		// Where the replacement gets the input from.
		var replacePos = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
		// Build the search regex.
		var ns = '';
		var repnum = 2;
		while ((pos = search.search(repPattern)) != -1)
		{
			ns = ns.concat(search.substr(0, pos));
			while (pos < search.length)
			{
				if (search.charAt(pos) == '%')
				{
					if (search.charAt(pos + 1) == '%')
					{
						ns = ns.concat('%');
						pos += 2;
					}
					else
					{
						ns = ns.concat('([^' + searchEscape(search.charAt(pos + 2), search.charAt(pos + 3)) + ']*)');
						replacePos[0 + search.charAt(pos + 1)] = repnum++;
						break;
					}
				}
				else ns = ns.concat(search.charAt(pos++));
			}
			search = search.substr(pos + 2);
		}
		//ns = ns.concat(search);
		ns = ns.concat(search);
		search = charEnding.test(ns);
		ns = '(^|[^A-Za-z0-9_$])' + ns + (search ? '(\\W|$)' : '');
		// Build the replacement pattern.
		var replace = replaceEscape(def[4] || '');
		var nr = '';
		while ((pos = replace.search(repPattern)) != -1)
		{
			nr = nr.concat(replace.substr(0, pos));
			while (pos < replace.length)
			{
				if (replace.charAt(pos) == '%')
				{
					if (replace.charAt(pos + 1) == '%')
					{
						nr = nr.concat('%');
						pos += 2;
					}
					else
					{
						nr = nr.concat('$' + replacePos[0 + replace.charAt(pos + 1)]);
						break;
					}
				}
				//else ++pos;
				else nr = nr.concat(replace.charAt(pos++));
			}
			replace = replace.substr(pos + 2);
		}
		nr = '$1' + nr.concat(replace) + (search ? ('$' + repnum) : '');
		// /(%[0-9])/g
		//return [name, search, replace];
		return [def[1], new RegExp(ns, 'mg'), nr];
	}
	
	function makeName(name)
	{
		// Strip whitespace from the start
		// and end, then apply the regex bits
		// return '(^|\\W)' + name.replace(/(^\s*)|(\s*$)/g, '') + '(\\W|$)';
		return name.replace(/(^\s*)|(\s*$)/g, '');
	}
	
	// Parse a chunk of text as
	// yavascript code.
	function doYavascript(code, src)
	{
		code = doIncludes(code, src);
		// Split the code into sections
		// The sections are in the order
		// code-directive-parameters
		var
			parts = [],
			execute = true,
			es = [],
			descent = 0,
			temp = 0,
			d = doMacroReplaces.defs;
		parts = makeArray(code);
		code = '';
		// Collect all the pre-processor
		// macros together IN ORDER
		for (var i = 0, j = parts.length; i < j; ++i)
		{
			temp = parts[i];
			//message('parts[' + i + ']: ' + temp);
			if (temp)
			{
				if (i % 3)
				{
					// Get parameters
					++i;
					if (execute)
					{
						// In a true #if block
						switch (temp)
						{
							case 'define':
								// Add this macro to the list
								if (i < j && parts[i])
								{
									var entry = buildSearchReplace(parts[i]);
									/*var
										entry = parts[i].match(/^\s+(\w+)\s+(.*)/m);*/
									if (entry)
									{
										// Create the regex to find this
										// complete word only.
										//temp = makeName(entry[1]);
										if (d[entry[0]])
										{
											message('Macro redefinition: ' + entry[1]);
										}
										// Save the define as the replacement
										// pattern for the search regex.
										d[entry[0]] = [entry[1], entry[2]];
									}
									else
									{
										message('Invalid define: \"#define ' + parts[i] + '\"');
									}
								}
								else
								{
									message('Missing #define parameters');
								}
								break;
							case 'undef':
								// Remove this macro from the list
								if (i < j && parts[i])
								{
									temp = makeName(parts[i]);
									if (d[temp])
									{
										delete d[temp];
									}
									else
									{
										message('Undefined macro: ' + parts[i]);
									}
								}
								else
								{
									message('Missing #undef parameter');
								}
								break;
							case 'if':
								++descent;
								if (i < j && parts[i])
								{
									// First, replace all the macros
									try
									{
										if (!eval(doMacroReplaces(parts[i])))
										{
											// #if failed
											execute = false;
										}
									}
									catch (e)
									{
										message('Invalid #if expression: ' + parts[i]);
										execute = false;
									}
								}
								else
								{
									message('Missing #if expression');
									execute = false;
								}
								es[es.length] = true;
								break;
							case 'ifdef':
								++descent;
								if (i < j && parts[i])
								{
									// Get the macro internal name
									//var
									//	name = '(^|\\W)' + parts[i].replace(/(^\s*)|(\s*$)/g, '') + '(\\W|$)';
									// if (!d[makeName(parts[i])])
									if (!d[makeName(parts[i])])
									{
										// Not defined
										execute = false;
									}
								}
								else
								{
									message('Missing #ifdef expression');
									execute = false;
								}
								es[es.length] = true;
								break;
							case 'ifndef':
								++descent;
								if (i < j && parts[i])
								{
									// Get the macro internal name
									//var
									//	name = '(^|\\W)' + parts[i].replace(/(^\s*)|(\s*$)/g, '') + '(\\W|$)';
									if (d[makeName(parts[i])])
									{
										// Not not defined
										execute = false;
									}
								}
								else
								{
									message('Missing #ifndef expression');
									execute = false;
								}
								es[es.length] = true;
								break;
							case 'else':
								// Don't run the code in here
								if (descent)
								{
									execute = false;
								}
								else
								{
									message('Unmatched #else');
								}
								break;
							case 'endif':
								if (descent)
								{
									es.pop();
									--descent;
								}
								else
								{
									message('Unmatched #endif');
								}
								break;
							case 'pragma':
								// Do nothing in JS mode
								break;
							default:
								message('Unknown directive: ' + temp);
								break;
						}
					}
					else
					{
						// Don't do anything - in a
						// series of false conditionals
						switch (temp)
						{
							case 'define':
							case 'undef':
							case 'pragma':
								// Do nothing
								break;
							case 'if':
							case 'ifdef':
							case 'ifndef':
								// #if in a #if
								es[es.length] = false;
								++descent;
								break;
							case 'else':
								// Alter the current execution
								// But don't exit the current block
								// Run the code in here
								execute = es[es.length - 1];
								break;
							case 'endif':
								--descent;
								execute = es.pop();
								break;
							default:
								message('Unknown directive: ' + temp);
								break;
						}
					}
				}
				else
				{
					if (execute)
					{
						code += doMacroReplaces(temp);
					}
					// Else it's in a false #if
				}
			}
		}
		if (descent > 0)
		{
			message('Unmatched #if');
		}
		return code;
	}
	
	// Loop through HTML script tags
	var
		scripts = document.getElementsByTagName('script');
	for (var i in scripts)
	{
		// Found a yavascript tag
		var
			s = scripts[i];
		if (s.type == 'text/yavascript')
		{
			if (s.src)
			{
				eval(doYavascript(doInclude(s.src), s.src));
			}
			else
			{
				// Do the code
				eval(doYavascript(s.innerHTML, ''));
			}
		}
	}
};
