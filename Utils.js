function DrawBlock(ctx, x, y, colour, a)
{
    if (a === undefined)
    {
        ctx.strokeStyle = 'rgb(' + (colour.r + 40) + ', ' + (colour.g + 40) + ', ' + (colour.b + 40) + ')';
        ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'rgb(' + (colour.r + 20) + ', ' + (colour.g + 20) + ', ' + (colour.b + 20) + ')';
        ctx.strokeRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        ctx.fillStyle = 'rgb(' + colour.r + ', ' + colour.g + ', ' + colour.b + ')';
        ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    }
    else
    {
        ctx.strokeStyle = 'rgba(' + (colour.r + 40) + ', ' + (colour.g + 40) + ', ' + (colour.b + 40) + ', ' + a + ')';
        ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'rgba(' + (colour.r + 20) + ', ' + (colour.g + 20) + ', ' + (colour.b + 20) + ', ' + a + ')';
        ctx.strokeRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        ctx.fillStyle = 'rgba(' + colour.r + ', ' + colour.g + ', ' + colour.b + ', ' + a + ')';
        ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    }
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

var BLOCK_SHAPES = [
        "     00  00     ", // O
        "  1   1   1   1 ", // I
        "     22   2   2 ", // J
        "     33  3   3  ", // L
        "      4  44  4  ", // Z
        "     5   55   5 ", // S
        "      6  66   6 ", // T
    ];

var BLOCK_COUNT = BLOCK_SHAPES.length;

var NO_PIECE = {};
NO_PIECE.Draw = function () {}

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




var TETRIS = [
        "  111 222 333 44  5  66  ",
        "   1  2    3  4 4 5 6    ",
        "   1  22   3  44  5  6   ",
        "   1  2    3  4 4 5   6  ",
        "   1  222  3  4 4 5 66   "
    ];



function DrawTetris(ctx, x, y, a)
{
    for (var i = 0, rows = TETRIS.length; i != rows; ++i, y += BLOCK_SIZE)
    {
        var row = TETRIS[i];
        for (var j = 0, x2 = x, len = row.length; j != len; ++j, x2 += BLOCK_SIZE)
        {
            if (row[j] != ' ') DrawBlock(ctx, x2, y, BLOCK_COLOURS[row[j]], a);
        }
    }
}

function DrawWindow(ctx, x, y, w, h, c, a)
{
    ctx.fillStyle = 'rgba(255, 255, 255, ' + a + ')';
    w *= BLOCK_SIZE;
    h *= BLOCK_SIZE;
    ctx.fillRect(x, y, w, h);
    w += x;
    h += y - BLOCK_SIZE;
    for (var i = x; i != w; i += BLOCK_SIZE)
    {
        DrawBlock(ctx, i, y, c, a);
        DrawBlock(ctx, i, h, c, a);
    }
    w -= BLOCK_SIZE;
    for (var i = y + BLOCK_SIZE; i != h; i += BLOCK_SIZE)
    {
        DrawBlock(ctx, x, i, c, a);
        DrawBlock(ctx, w, i, c, a);
    }
}



var KEY_LEFT  = 37;
var KEY_UP    = 38;
var KEY_RIGHT = 39;
var KEY_DOWN  = 40;
var KEY_SPACE = 32;
var KEY_ESC   = 27;
var KEY_PAUSE = 19;


