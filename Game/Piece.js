function Piece(_shape)
{
    this.Parts = [];
    
    this.X = 2;
    this.Y = -4;
    
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
    
    /*for (var i in _shape)
    {
        var c = _shape[i];
        for (var j in c)
        {
        }
    }*/
    
    // Each piece has 4 parts, but no reason that can't change.
    var _len = this.Parts.length;
    
    
    
	this.Rotate = function (dir)
	{
        var parts = this.Parts;
        var tmp;
        //while (dir > 0)
        if (dir > 0)
        {
            for (var i in parts)
            {
                tmp = parts[i].x;
                parts[i].x = parts[i].y;
                parts[i].y = 3 - tmp;
            }
            //--dir;
        }
        //while (dir < 0)
        else
        {
            for (var i in parts)
            {
                tmp = parts[i].y;
                parts[i].y = parts[i].x;
                parts[i].x = 3 - tmp;
            }
            //++dir;
        }
	};
    
    this.Move = function (x, y)
    {
        this.X += x;
        this.Y += y;
    };
    
    this.Draw = function (ctx, x, y, a)
    {
        var parts = this.Parts;
        for (var i in parts)
        {
            DrawBlock(ctx, x + (parts[i].x * BLOCK_SIZE), y + (parts[i].y * BLOCK_SIZE), this.Colour, a);
        }
    };
	
	// this.RotateRight()
	// {
		// for (var i = 0; i != len; ++i)
		// {
			// if ((shapeX[i] >= 2) == (shapeY[i] >= 2))
			// {
				// shapeX[i] = 3 - shapeX[i];
			// }
			// else
			// {
				// shapeY[i] = 3 - shapeY[i];
			// }
		// }
	// };
}


