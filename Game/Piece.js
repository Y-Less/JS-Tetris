function Piece(_shape)
{
    this.Parts = [];
    
    this.X = 0;
    this.Y = 0;
    this.A = 0;
    this.Boxed = false;
    this.Colour = 'black';
    this.CC = 0;
    
    for (var y = 0; y != 4; ++y)
    {
        for (var x = 0; x != 4; ++x)
        {
            if (_shape[y * 4 + x] != ' ')
            {
                this.Parts.push({x: x, y: y});
                this.CC = _shape.charAt(y * 4 + x);
            }
        }
    }
    this.Colour = BLOCK_COLOURS[this.CC];
    
    // Each piece has 4 parts, but no reason that can't change.
    var _len = this.Parts.length;
    
	this.Rotate = function (dir)
	{
        var parts = this.Parts;
        var tmp;
        this.A = (this.A + dir + 4) % 4; // JS mod is signed.
        while (dir > 0)
        {
            for (var i in parts)
            {
                tmp = parts[i].x;
                parts[i].x = parts[i].y;
                parts[i].y = 3 - tmp;
            }
            --dir;
        }
        while (dir < 0)
        {
            for (var i in parts)
            {
                tmp = parts[i].y;
                parts[i].y = parts[i].x;
                parts[i].x = 3 - tmp;
            }
            ++dir;
        }
	};
    
    this.Reset = function ()
    {
        this.Rotate(4 - this.A);
        this.X = 0;
        this.Y = 0;
        this.A = 0;
    };
    
    this.Move = function (x, y)
    {
        this.X += x;
        this.Y += y;
    };
    
    this.Draw = function (ctx, x, y, a)
    {
        var parts = this.Parts;
        var check;
        for (var i in parts)
        {
            if (parts[i].y + this.Y >= 0)
            {
                DrawBlock(ctx, x + (parts[i].x * BLOCK_SIZE), y + (parts[i].y * BLOCK_SIZE), this.Colour, a);
            }
        }
    };
}


