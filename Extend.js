// Based on:
// http://js-bits.blogspot.co.uk/2010/08/javascript-inheritance-done-right.html
// http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Creating_a_property

function InterfaceException(that, func, args)
{
    "use strict";
    
    this.that = that;
    this.func = func;
    this.arguments = args;
    this.message = 'Function "' + func + '" is not implemented.';
    this.name = 'InterfaceException';
    this.toString = function () { return this.message; };
}

function MixinException(obj)
{
    "use strict";
    
    this.that = obj;
    this.message = 'Array given for mixin - property names are required.';
    this.name = 'MixinException';
    this.toString = function () { return this.message; };
}

function RequiresException(obj, func)
{
    "use strict";
    
    this.that = obj;
    this.func = func;
    this.message = 'Function "' + func + '" required but not found.';
    this.name = 'RequiresException';
    this.toString = function () { return this.message; };
}

function DefinePropertyException(obj, prop, desc)
{
    "use strict";
    
    this.that = obj;
    this.descriptor = desc;
    this.message = 'Unable to call "DefineProperty" on "' + prop + '" with .get or .set.';
    this.name = 'DefinePropertyException';
    this.toString = function () { return this.message; };
}

var InterfaceBase = (function ()
{
    "use strict";
    
    /*
        An object that copies a parent's prototype chain so that we can create
        a new instance of the parent without calling the parent's constructor.
    */
    function InterfaceSurrogate() {}
    
    /*
        This is a wrapper for "Object.defineProperty", in case it doesn't exist.
        Of course, I haven't actually tested this code on any browser in which
        this property doesn't exist...
    */
    var DefineProperty = Object.defineProperty || function (obj, prop, desc)
    {
        if (desc.get || desc.set)
        {
            throw new DefinePropertyException(obj, prop, desc);
        }
        else if (desc.value) obj[prop] = desc.value;
        else obj[prop] = desc;
    };
    
    /*
        This is a wrapper for "Object.getOwnPropertyDescriptor", in case it
        doesn't exist.  Wraps the return in an anonymous object with ".value"
        set for compatibility with other property functions.
    */
    var GetProperty = Object.getOwnPropertyDescriptor || function (obj, prop)
    {
        if (obj[prop].value !== undefined || obj[prop].get || obj[prop].set) return obj[prop];
        else return { value: obj[prop], writable: true, configurable: true, enumerable: true };
    };
    
    /*
        This is a wrapper for "Object.getOwnPropertyNames", trying "Object.keys"
        if that doesn't exist, and a restricted "for .. in" otherwise.
    */
    var PropertyNames = Object.getOwnPropertyNames || Object.keys || function (obj)
    {
        var ret = [];
        for (var i in obj) if (obj.hasOwnProperty(i)) ret.push(i);
        return ret;
    };
    
    Object.inherit = function (_sub, base, methods)
        {
            var sub;
            if (_sub instanceof Function) sub = _sub;
            else if (_sub instanceof Object)
            {
                sub = function () { this.super.apply(this, arguments); return this; }
                for (var i in _sub) sub.prototype[i] = _sub[i];
            }
            if (base instanceof Function && sub instanceof Function)
            {
                InterfaceSurrogate.prototype = base.prototype;
                sub.prototype = new InterfaceSurrogate();
                
                // Add a reference to the parent's prototype
                sub.base = base.prototype;
                
                // Copy the methods passed in to the prototype
                for (var name in (methods || {}))
                {
                    sub.prototype[name] = methods[name];
                }
                
                // Copy the constructor correctly.
                DefineProperty(sub.prototype, 'constructor', { 
                    // Defaults, but explicit anyway.
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: sub
                });
                
                // Copy the constructor correctly.
                DefineProperty(sub.prototype, 'object', { 
                    // Defaults, but explicit anyway.
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: sub
                });
                
                // Copy the constructor correctly.
                DefineProperty(sub.prototype, 'base', { 
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: base.prototype
                });
                
                // Define "$super" as a super constructor call.
                DefineProperty(sub.prototype, 'super', { 
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: function ()
                        {
                            // "this.object" is a copy of "this.constructor",
                            // because you can't delete that property.
                            var cons = this.object;
                            var was = this.base;
                            // Remove the immediate parent, so that repeated
                            // calls to this function don't get stuck in an
                            // infinite loop.
                            delete cons.prototype.object;
                            delete cons.prototype.base;
                            was.constructor.apply(this, arguments);
                            DefineProperty(cons.prototype, 'object', { 
                                configurable: true,
                                enumerable: false,
                                writable: false,
                                value: cons
                            });
                            DefineProperty(cons.prototype, 'base', { 
                                configurable: true,
                                enumerable: false,
                                writable: false,
                                value: was
                            });
                        }
                });
                
                // So we can define the constructor inline.
                return sub;
            }
        };
    
    /*
        The function defined on a prototype chain to be called when the function
        doesn't exist - a pure abstract function that does something.
    */
    function InterfaceFunction(name)
    {
        return function ()
            {
                throw new InterfaceException(this, name, arguments);
            };
    }
    
    /*
        This function takes a parameter (cons) and converts it to an interface.
        If the parameter is a function it is returned as-is, assuming that it is
        a function to be called to set up the interface.  If it is an array, it
        is assumed to be an array of property names, each one to be added to the
        object prototype as "InterfaceFunction(propertyName)".  If it is an
        object, each property is copied over, keeping names and descriptors, but
        again setting the value to "InterfaceFunction(propertyName)".
        
        The return value of this function is another function that is executed
        to add the interface functions to the given target object.
    */
    function BuildInterfaceFunction(cons)
    {
        if (cons)
        {
            if (cons instanceof Function)
            {
                return cons;
            }
            else if (cons instanceof Array)
            {
                var len = cons.length;
                return function (obj)
                    {
                        var prot = obj.prototype;
                        for (var i = 0; i != len; ++i)
                        {
                            var n = cons[i];
                            // Check the whole prototype chain, not just local.
                            if (!(n in prot))
                            {
                                prot[n] = InterfaceFunction(n);
                            }
                        }
                    };
            }
            else if (cons instanceof Object)
            {
                var ints = PropertyNames(cons);
                var len = ints.length;
                return function (obj)
                    {
                        var prot = obj.prototype;
                        for (var i = 0; i != len; ++i)
                        {
                            var n = ints[i];
                            if (!(n in prot))
                            {
                                var desc = GetProperty(cons, n);
                                // Remove incompatible descriptor types.
                                if (desc.set) delete desc.set;
                                if (desc.get) delete desc.get;
                                desc.value = InterfaceFunction(n);
                                DefineProperty(prot, n, desc);
                            }
                        }
                    };
            }
        }
        // Nothing usful passed, return an empty function.
        return function () {};
    };
    
    /*
        This function is similar to the other "Build" functions, this one
        returning an function to check that a given object conforms to a given
        list of requirements.  This is NOT the same as "Interface", but for the
        most part may as well be.  That is more like a run-time check, with this
        as a initialisation check.
        
        Interfaces are added first, then requirements are checked, then mixins
        are done if they can be (given that they are what want the
        requirements).
    */
    function BuildContractFunction(cons)
    {
        if (cons)
        {
            if (cons instanceof Function)
            {
                return cons;
            }
            else if (cons instanceof Array)
            {
                var len = cons.length;
                return function (obj)
                    {
                        var prot = obj.prototype;
                        for (var i = 0; i != len; ++i)
                        {
                            if (!(cons[i] in prot))
                            {
                                return false;
                            }
                        }
                        return true;
                    };
            }
            else if (cons instanceof Object)
            {
                var ints = PropertyNames(cons);
                var len = ints.length;
                return function (obj)
                    {
                        var prot = obj.prototype;
                        for (var i = 0; i != len; ++i)
                        {
                            if (!(ints[i] in prot))
                            {
                                throw new RequiresException(obj, ints[i])
                            }
                        }
                    };
            }
        }
        return function () {};
    }
    
    /*
        This function takes a parameter (cons) and converts it to a mixin.
        If the parameter is a function it is returned as-is, assuming that it is
        a function to be called to add the mixin parts.  If it is an array, it
        is invalid, since you can't have names AND functions in an array (you
        can, but there are better ways).  If it is an object, each property is
        copied over, keeping names, descriptors, and values.
        
        The return value of this function is another function that is executed
        to add the mixin functions to the given target object.
    */
    function BuildMixinFunction(cons)
    {
        if (cons)
        {
            if (cons instanceof Function)
            {
                return cons;
            }
            else if (cons instanceof Array)
            {
                // Can't be done - we need names and implementations.
                throw new MixinException(cons);
            }
            else if (cons instanceof Object)
            {
                var ints = PropertyNames(cons);
                var len = ints.length;
                return function (obj)
                    {
                        var prot = obj.prototype;
                        for (var i = 0; i != len; ++i)
                        {
                            var n = ints[i];
                            if (cons[n] instanceof Function && !(n in prot))
                            {
                                DefineProperty(prot, n, GetProperty(cons, n));
                            }
                        }
                    };
            }
        }
        return function () {};
    }
    
    Object.specify = function (obj, mixin)
        {
            if (obj && obj instanceof Function && mixin && mixin instanceof InterfaceBase)
            {
                mixin.Apply(obj);
            }
        };
    
    return function (_inter, _reqs, _mixers)
        {
            _inter  = BuildInterfaceFunction(_inter);
            _reqs   = BuildContractFunction(_reqs);
            _mixers = BuildMixinFunction(_mixers);
            
            this.Interface = function (inter)
            {
                var om = _inter;
                var nm = BuildInterfaceFunction(inter);
                _inter = function (obj)
                    {
                        om(obj);
                        nm(obj);
                    };
                return this;
            };
            
            this.Contract = function (reqs)
            {
                var om = _reqs;
                var nm = BuildContractFunction(reqs);
                _reqs = function (obj)
                    {
                        om(obj);
                        nm(obj);
                    };
                return this;
            };
            
            this.Mixin = function (mixers)
            {
                var om = _mixers;
                var nm = BuildMixinFunction(mixers);
                _mixers = function (obj)
                    {
                        om(obj);
                        nm(obj);
                    };
                return this;
            };
            
            this.Apply = function (obj, args)
            {
                // Add interface functions.
                _inter(obj);
                // Check the contract.
                _reqs(obj);
                // Add the mixins.
                _mixers(obj);
            };
        };
})();

function Interface(obj, spec)
{
    "use strict";
    
    if (spec)
    {
        Object.specify(obj, new InterfaceBase(spec, 0, 0));
    }
    else
    {
        return new InterfaceBase(obj, 0, 0);
    }
}

function Contract(obj, spec)
{
    "use strict";
    
    if (spec)
    {
        Object.specify(obj, new InterfaceBase(0, spec, 0));
    }
    else
    {
        return new InterfaceBase(0, obj, 0);
    }
}

function Mixin(obj, spec)
{
    "use strict";
    
    if (spec)
    {
        Object.specify(obj, new InterfaceBase(0, 0, spec));
    }
    else
    {
        return new InterfaceBase(0, 0, obj);
    }
}

function Inherit(obj, base)
{
    "use strict";
    return Object.inherit(obj, base);
    //var ret = new InterfaceBase(0, 0, 0);
    //Object.spe
    // return obj;
}

