"use strict";

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getWindowWidth()
{
    var x = 0;
    if (self.innerHeight)
    {
        x = self.innerWidth;
    }
    else if (document.documentElement && document.documentElement.clientHeight)
    {
        x = document.documentElement.clientWidth;
    }
    else if (document.body)
    {
        x = document.body.clientWidth;
    }
    return x;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getWindowHeight()
{
    var y = 0;
    if (self.innerHeight)
    {
        y = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight)
    {
        y = document.documentElement.clientHeight;
    }
    else if (document.body)
    {
        y = document.body.clientHeight;
    }
    return y;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getMousePosition(inEvent)
{
    var mousePos = new Vector2D(0, 0);

    if (inEvent.x != undefined && inEvent.y != undefined)
    {
        mousePos.x = inEvent.x - window.pageXOffset;
        mousePos.y = inEvent.y + window.pageYOffset;
    }
    else
    {
        // Firefox method to get the position
        mousePos.x = inEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mousePos.y = inEvent.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }
    mousePos.x -= g.canvas.offsetLeft;
    mousePos.y -= g.canvas.offsetTop;

    return mousePos;
}
