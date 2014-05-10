Background = {}

Background = new Controller(StateMachine, STATE_SPLASH, function ()
    {
        var _wait = 0;
        var _clickable = true;
        
        this.Entry = function (from)
        {
            _clickable = true;
            this.View.Init();
            this.View.Hint(false);
            this.View.Show();
            
            this.RegisterEvents({
                    'Continue': [this, Continue],
                });
            
            this.Update = function (time)
            {
                if ((_wait += time) > 2000)
                {
                    this.View.Hint(true);
                    this.Update = function () {};
                }
            };
        };
        
        this.Exit = function (to)
        {
            _clickable = false;
            this.View.Hint(false);
        };
        
        function Continue(event)
        {
            if (_clickable) this.Transition(STATE_MENU);
        }
    });

