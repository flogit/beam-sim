// Globals :

var gItems = new Array();
var gLauncherItems = new Array();
var gSelectedItemIdx;
var gSelectedItemMode = "translation";

var gSpaceRefractiveIndex = 1;

var gBgColor;
var gFgColor;
var gBeamColor;
var gTransparentColor;

g.canvasTopLeftCorner = undefined;
g.canvasBottomLeftCorner = undefined;
g.canvasTopRightCorner = undefined;
g.canvasBottomRightCorner = undefined;
g.canvasPolygon = undefined;

var gDrawingAreaTopLeftCorner;
var gDrawingAreaBottomLeftCorner;
var gDrawingAreaTopRightCorner;
var gDrawingAreaBottomRightCorner;
var gDrawingAreaPolygon;

var gLauncherAreaTopLeftCorner;
var gLauncherAreaBottomLeftCorner;
var gLauncherAreaTopRightCorner;
var gLauncherAreaBottomRightCorner;
var gLauncherAreaPolygon;

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function createContext(inCanvas)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var ctx;

    try
    {
        ctx = inCanvas.getContext('2d');
    }
    catch(e) {}

    if (ctx)
    {
        console.log("2D Context created");
    }
    else
    {
        console.error("Fail to get the 2D context from the HTML5 canvas");
    }

    return ctx;
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function mainDraw()
{
    console.time("[mainDraw]");

    g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);

    var nbItems = gItems.length;

    console.group("Beams generations:");
    {
        var beams = new Array();
        for (var i = 0; i < nbItems; i++)
        {
            if (typeof gItems[i].generateBeams == 'function')
            {
                gItems[i].generateBeams(beams);
            }
        }
    }
    console.groupEnd();

    console.group("Drawing " + nbItems + " non transparent items:");
    {
        for (var i = 0; i < nbItems; i++)
        {
            if (!gItems[i].isTransparent())
            {
                gItems[i].draw();
            }
        }
    }
    console.groupEnd();

    console.group("Drawing " + nbItems + " transparent items:");
    {
        for (var i = 0; i < nbItems; i++)
        {
            if (gItems[i].isTransparent())
            {
                gItems[i].draw();
            }
        }
    }
    console.groupEnd();

    console.group("Drawing " + beams.length + " beams:");
    {
        var nbBeams = beams.length;
        for (var i = 0; i < nbBeams; i++)
        {
            beams[i].draw();
        }
    }
    console.groupEnd();

    var nbLauncherItems = gLauncherItems.length;
    console.group("Drawing " + nbLauncherItems + " launcher items:");
    {
        for (var i = 0; i < nbLauncherItems; i++)
        {
            gLauncherItems[i].draw();
        }
    }
    console.groupEnd();

    console.group("Drawing icons:");
    {
        if (typeof gSelectedItemIdx != 'undefined')
        {
            if (gSelectedItemMode == "translation")
            {
                gItems[gSelectedItemIdx].drawTranslateIcon();
            }
            else if (gSelectedItemMode == "rotation")
            {
                gItems[gSelectedItemIdx].drawRotationIcon();
            }
            else
            {
                console.error("Mode of selected item not known");
            }
        }
    }
    console.groupEnd();

    g.ctx.save();
    g.ctx.beginPath();
    g.ctx.moveTo(gDrawingAreaBottomRightCorner.x, gDrawingAreaBottomRightCorner.y);
    g.ctx.lineTo(gDrawingAreaBottomLeftCorner.x,  gDrawingAreaBottomLeftCorner.y);
    g.ctx.lineWidth = 1;
    g.ctx.shadowColor = '#999';
    g.ctx.shadowBlur = 2;
    g.ctx.shadowOffsetX = 0;
    g.ctx.shadowOffsetY = 3;
    g.ctx.strokeStyle = gFgColor;
    g.ctx.stroke();
    g.ctx.restore();

    console.timeEnd("[mainDraw]");
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function init(inCanvas)
{
    g.canvas = inCanvas;

    var launcherBarSize = 100;

    //return new Utest();

    var mouseWheelEvtName = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

    if (g.canvas.attachEvent) //if IE (and Opera depending on user setting)
    {
        g.canvas.attachEvent("onmousedown", onMouseDown);
        g.canvas.attachEvent("onmouseup",   onMouseUp);
        g.canvas.attachEvent("onmousemove", onMouseMove);
        document.attachEvent("onkeydown",  onKeyDown);
        g.canvas.attachEvent("on" + mouseWheelEvtName, onMouseWheel)
    }
    else if (g.canvas.addEventListener) //WC3 browsers
    {
        g.canvas.addEventListener("mousedown", onMouseDown, false);
        g.canvas.addEventListener("mouseup",   onMouseUp,   false);
        g.canvas.addEventListener("mousemove", onMouseMove, false);
        document.addEventListener("keydown",  onKeyDown,   false);
        g.canvas.addEventListener(mouseWheelEvtName, onMouseWheel, false)
    }

    gDrawingAreaTopLeftCorner     = new Vector2D(0, 0);
    gDrawingAreaTopRightCorner    = new Vector2D(g.canvas.width, 0);
    gDrawingAreaBottomRightCorner = new Vector2D(g.canvas.width, g.canvas.height - launcherBarSize);
    gDrawingAreaBottomLeftCorner  = new Vector2D(0, g.canvas.height - launcherBarSize);
    gDrawingAreaPolygon           = new Polygon(new Array(gDrawingAreaTopLeftCorner,
                                                          gDrawingAreaTopRightCorner,
                                                          gDrawingAreaBottomRightCorner,
                                                          gDrawingAreaBottomLeftCorner));

    gLauncherAreaTopLeftCorner     = new Vector2D(0, g.canvas.height - launcherBarSize);
    gLauncherAreaTopRightCorner    = new Vector2D(g.canvas.width, g.canvas.height - launcherBarSize);
    gLauncherAreaBottomRightCorner = new Vector2D(g.canvas.width, g.canvas.height);
    gLauncherAreaBottomLeftCorner  = new Vector2D(0, g.canvas.height);
    gLauncherAreaPolygon           = new Polygon(new Array(gLauncherAreaTopLeftCorner,
                                                           gLauncherAreaTopRightCorner,
                                                           gLauncherAreaBottomRightCorner,
                                                           gLauncherAreaBottomLeftCorner));

    g.canvasTopLeftCorner     = new Vector2D(0, 0);
    g.canvasTopRightCorner    = new Vector2D(g.canvas.width, 0);
    g.canvasBottomRightCorner = new Vector2D(g.canvas.width, g.canvas.height);
    g.canvasBottomLeftCorner  = new Vector2D(0, g.canvas.height);
    g.canvasPolygon           = new Polygon(new Array(g.canvasTopLeftCorner,
                                                     g.canvasTopRightCorner,
                                                     g.canvasBottomRightCorner,
                                                     g.canvasBottomLeftCorner));

    g.ctx = createContext(g.canvas);

    var laser = new Laser();
    laser.rotate(Math.PI);
    laser.moveTo(new Vector2D(g.canvas.width / 4, 3 * (g.canvas.height - launcherBarSize) / 4));
    gItems.push(laser);

    var circleGlass = new Glass("circle");
    circleGlass.moveTo(new Vector2D(g.canvas.width / 4 + circleGlass.shape.radius - 0.5, (g.canvas.height - launcherBarSize) / 4));
    gItems.push(circleGlass);

    var squareMirror = new Mirror("square");
    squareMirror.rotate(7 * Math.PI / 8);
    squareMirror.moveTo(new Vector2D(3 * g.canvas.width / 4, (g.canvas.height - launcherBarSize) / 4));
    gItems.push(squareMirror);

    var laser = new Laser();
    laser.rotate(5 * Math.PI / 4);
    gLauncherItems.push(laser);

    var squareMirror = new Mirror("square");
    gLauncherItems.push(squareMirror);

    var circleMirror = new Mirror("circle");
    gLauncherItems.push(circleMirror);

    var squareGlass = new Glass("square");
    gLauncherItems.push(squareGlass);

    var circleGlass = new Glass("circle");
    gLauncherItems.push(circleGlass);

    var widthOfLauncherItemPlace = g.canvas.width / gLauncherItems.length;

    var nbLauncherItems = gLauncherItems.length;
    {
        for (var i = 0; i < nbLauncherItems; i++)
        {
            gLauncherItems[i].moveTo(new Vector2D(widthOfLauncherItemPlace * i + widthOfLauncherItemPlace / 2,
                                                  gDrawingAreaBottomRightCorner.y + launcherBarSize / 2));
        }
    }

    setBeamColor(255, 255, 0); // setBeamColor launch the first draw
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function setBeamColor(inR, inG, inB)
{
    DEBUGCheckArgumentsAreValids(arguments, 3);

    gBeamColor = "rgb(" + inR + ", " + inG + ", " + inB + ")";

    if (inR + inG + inB < 255 * 3 / 2)
    {
        gBgColor = "#FFFFFF";
        gFgColor = "#222222";
        gTransparentColor = "rgba(128, 128, 128, 0.25)";
    }
    else
    {
        gBgColor = "#000000";
        gFgColor = "#DDDDDD";
        gTransparentColor = "rgba(255, 255, 255, 0.25)";
    }

    g.canvas.style.background = gBgColor;

    document.activeElement.blur(); // Remove Focus of curent element focused

    mainDraw();
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function clearDrawingArea()
{
    gItems.length = 0;
    gSelectedItemIdx = undefined;
    gSelectedItemMode = "translation";
    mainDraw();
}
