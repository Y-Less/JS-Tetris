function DrawBlock(ctx, x, y, colour)
{
    ctx.strokeStyle = 'rgb(' + (colour.r + 40) + ', ' + (colour.g + 40) + ', ' + (colour.b + 40) + ')';
    ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'rgb(' + (colour.r + 20) + ', ' + (colour.g + 20) + ', ' + (colour.b + 20) + ')';
    ctx.strokeRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    ctx.fillStyle = 'rgb(' + colour.r + ', ' + colour.g + ', ' + colour.b + ')';
    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
}

// TODO: Better colours.
var BLOCK_COLOURS = [
        {r:   0, g: 100, b:   0},
        {r:   0, g:   0, b: 100},
        {r:   0, g: 100, b: 100},
        {r: 100, g:   0, b:   0},
        {r: 100, g:   0, b: 100},
        {r: 100, g: 100, b:   0},
        {r: 100, g: 100, b: 100},
    ];

var BLOCK_RGB = BLOCK_COLOURS.map(function (colour)
    {
        return 'rgb(' + colour.r + ', ' + colour.g + ', ' + colour.b + ')';
    });

var BLOCK_SHAPES = {
        O : "     00  00     ",
        I : "  1   1   1   1 ",
        J : "     22   2   2 ",
        L : "     33  3   3  ",
        Z : "      4  44  4  ",
        S : "     5   55   5 ",
        T : "      6  66   6 ",
    };

function DrawShape(name, ctx, rot, x, y)
{
    
}


var ProtectedError = function (f)
{
    this.reference = f;
    this.message = '' + f + ' is not accessible.';
};
ProtectedError.prototype.name = 'ProtectedError';

var WriteError = function (f)
{
    this.reference = f;
    this.message = '' + f + ' is read-only.';
};
WriteError.prototype.name = 'WriteError';

function ReadOnly(name)
{
    return function (unused)
        {
            throw new WriteError(name);
        };
}

var ReadError = function (f)
{
    this.reference = f;
    this.message = '' + f + ' is write-only.';
};
ReadError.prototype.name = 'ReadError';

function WriteOnly(name)
{
    return function ()
        {
            throw new WriteError(name);
        };
}

function Null()
{
}

function True()
{
    return true;
}

function False()
{
    return false;
}

function ID(i)
{
    return i;
}











