Menu = new Controller(StateMachine, STATE_MENU, function ()
    {
        this.Entry = function (from)
        {
            this.View.Show();
        };
        
        this.Exit = function (to)
        {
            this.View.Hide();
        };
        
        function NewGame(event)
        {
            //this.View.Hide();
            this.Transition(STATE_GAME);
            console.log('New Game');
        }
        
        function HighScores(event)
        {
            //this.View.Hide();
            console.log('High Scores');
        }
        
        function Options(event)
        {
            //this.View.Hide();
            console.log('Options');
        }
        
        function Credits(event)
        {
            //this.View.Hide();
            console.log('Credits');
        }
        
        function Exit(event)
        {
            //this.View.Hide();
            //console.log('Exit');
            this.Transition(STATE_SPLASH);
        }
        
        this.RegisterEvents({
                'New Game':    [this, NewGame],
                'High Scores': [this, HighScores],
                'Options':     [this, Options],
                'Credits':     [this, Credits],
                'Exit':        [this, Exit],
            });
    });

/*
Menu.State = new State(StateMachine, STATE_MENU, function ()
    {
        this.Entry = function (from)
        {
            Menu.View.Show();
        };
        
        this.Exit = function (to)
        {
            Menu.View.Hide();
        };
    });
*/


