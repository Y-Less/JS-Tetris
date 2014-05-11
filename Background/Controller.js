Background = {}

Background = new Controller(StateMachine, STATE_SPLASH, function ()
    {
        var _wait = 0;
        var _clickable = true;
        
        this.Entry = function (from)
        {
            _wait = 0;
            _clickable = true;
            var target;
            if (from == '') target = 500;
            else target = 5000;
            this.View.Init();
            this.View.Hint(false);
            //this.View.Tetris(true);
            this.View.Show();
            
            this.RegisterEvents({
                    'Continue': [this, Continue],
                });
            
            this.Update = function (time)
            {
                if ((_wait += time) > target)
                {
                    this.View.Tetris(true);
                    this.Update = function (time)
                    {
                        if ((_wait += time) > target + 3000)
                        {
                            this.View.Hint(true);
                            this.Update = function (time) {};
                        }
                    };
                }
            };
        };
        
        this.Exit = function (to)
        {
            _clickable = false;
            this.View.Hint(false);
            this.View.Tetris(false);
        };
        
        function Continue(event)
        {
            if (_clickable) this.Transition(STATE_MENU);
        }
    });

