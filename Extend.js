// Based on:
// http://js-bits.blogspot.co.uk/2010/08/javascript-inheritance-done-right.html
// http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Creating_a_property

Object.extend = (function ()
    {
        function Surrogate() {}
        
        return function (base, sub, methods)
            {
                if (base instanceof Object && sub instanceof Object)
                {
                    Surrogate.prototype = base.prototype;
                    sub.prototype = new Surrogate();
                    
                    // Add a reference to the parent's prototype
                    sub.extends = base.prototype;
                    
                    // Copy the methods passed in to the prototype
                    for (var name in (methods || {}))
                    {
                        sub.prototype[name] = methods[name];
                    }
                    
                    // Copy the constructor correctly.
                    Object.defineProperty(sub.prototype, 'constructor', { 
                        // Defaults, but explicit anyway.
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: sub
                    });
                    
                    // Copy the constructor correctly.
                    Object.defineProperty(sub.prototype, 'extends', { 
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: base.prototype
                    });
                    
                    // Define "$super" as a super constructor call.
                    Object.defineProperty(sub.prototype, 'super', { 
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: function ()
                            {
                                this.extends.constructor.apply(this, arguments);
                            }
                    });
                    
                    // So we can define the constructor inline.
                    return sub;
                }
            };
    })();

function Mixin(cons)
{
    if (cons instanceof Function)
    {
        this.$mixin = cons;
    }
    else if (cons instanceof Object)
    {
        this.$mixin = function ()
        {
            var ints = Object.getOwnPropertyNames(cons);
            for (var i in ints)
            {
                var n = ints[i];
                Object.defineProperty(this.prototype, n, Object.getOwnPropertyDescriptor(cons, n));
            }
        };
    }
    else return;
    return this;
}

// Object.mixin = (function ()
    // {
        // return function ()
            // {
                // var args = Array.prototype.slice.call(arguments, 0);
                // if (args.length < 2) return;
                // var obj = args.shift();
                // var mixin = args.shift();
                // if (mixin.hasOwnProperty('$mixin'))
                // {
                    // mixin.$mixin.apply(obj, args);
                // }
            // };
    // })();

Object.mixin = function ()
    {
        var args = Array.prototype.slice.call(arguments, 0);
        if (args.length < 2) return;
        var obj = args.shift();
        var mixin = args.shift();
        if (obj instanceof Function && mixin instanceof Mixin)
        {
            mixin.$mixin.apply(obj, args);
        }
    };

function Interface(cons)
{
    if (cons instanceof Array)
    {
        this.$interface = {};
        for (var i in cons)
        {
            this.$interface[cons[i]] = Interface.FUNCTION;
        }
    }
    else if (cons instanceof Object)
    {
        this.$interface = cons;
    }
    else return;
    return this;
};

Interface.FUNCTION = 0;
Interface.CONST = 1;
Interface.VAR = 2;

function InterfaceException(type, name, args)
{
    switch (type)
    {
        case Interface.FUNCTION:
            this.message = 'Function "' + name + '" is not implemented.';
            break;
        case Interface.CONST:
            this.message = 'Constant "' + name + '" has not been initialised.';
            break;
        case Interface.VAR:
            this.message = 'Variable "' + name + '" has not been initialised.';
            break;
    }
    this.name = 'InterfaceException';
    this.toString = function () { return this.message; };
}

Object.interface = function (obj, intf)
    {
        if (obj instanceof Function && intf instanceof Interface)
        {
            intf = intf.$interface;
            var ints = Object.getOwnPropertyNames(intf);
            for (var i in ints)
            {
                var n = ints[i];
                // All the created properties are enumerable.  It would be a
                // pretty rubbish 
                if (!(n in obj))
                {
                    switch (intf[n])
                    {
                        case Interface.FUNCTION:
                            Object.defineProperty(obj.prototype, n, {
                                configurable: true,
                                enumerable: true,
                                writable: true,
                                value: (function (name) { return function ()
                                {
                                    throw new InterfaceException(Interface.FUNCTION, name, arguments);
                                }; })(n)
                            });
                            break;
                        // Meaningless in prototype chains.
                        /*case Interface.CONST:
                            // Should be set once, when the object is
                            // constructed, but then never again.
                            Object.defineProperty(obj.prototype, n, {
                                configurable: true,
                                enumerable: true,
                                set: function (v)
                                {
                                    // First write, change this to a regular
                                    // value.
                                    Object.defineProperty(obj.prototype, n, {
                                            configurable: true,
                                            enumerable: true,
                                            writable: false,
                                            value: v
                                        });
                                    return v;
                                },
                                get: (function (name) { return function ()
                                {
                                    throw new InterfaceException(Interface.VAR, name, arguments);
                                }; })(n)
                            });
                            break;
                        case Interface.VAR:
                            Object.defineProperty(obj.prototype, n, {
                                configurable: true,
                                enumerable: true,
                                set: function (v)
                                {
                                    // First write, change this to a regular
                                    // value.
                                    Object.defineProperty(obj.prototype, n, {
                                            configurable: true,
                                            enumerable: true,
                                            writable: true,
                                            value: v
                                        });
                                    return v;
                                },
                                get: (function (name) { return function ()
                                {
                                    throw new InterfaceException(Interface.VAR, name, arguments);
                                }; })(n)
                            });
                            break;*/
                    }
                }
            }
        }
        else return;
    };

