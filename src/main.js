// Globals :
var gCanvas;
var gCtx;

var gItems = new Array();
var gLauncherItems = new Array();
var gSelectedItemIdx;
var gSelectedItemMode = "translation";

var gSpaceRefractiveIndex = 1;

var gBgColor;
var gFgColor;
var gBeamColor;
var gTransparentColor;

var gCanvasTopLeftCorner;
var gCanvasBottomLeftCorner;
var gCanvasTopRightCorner;
var gCanvasBottomRightCorner;
var gCanvasPolygon;

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
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var ctx;

    try
    {
        ctx = inCanvas.getContext('2d');
    }
    catch(e) {}

    if (ctx)
    {
        //console.log("2D Context created");
    }
    else
    {
        //console.error("Fail to get the 2D context from the HTML5 canvas");
    }

    return ctx;
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function mainDraw()
{
    //console.time("[mainDraw]");

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

    var nbItems = gItems.length;

    //console.group("Beams generations:");
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
    //console.groupEnd();

    //console.group("Drawing " + nbItems + " non transparent items:");
    {
        for (var i = 0; i < nbItems; i++)
        {
            if (!gItems[i].isTransparent())
            {
                gItems[i].draw();
            }
        }
    }
    //console.groupEnd();

    //console.group("Drawing " + nbItems + " transparent items:");
    {
        for (var i = 0; i < nbItems; i++)
        {
            if (gItems[i].isTransparent())
            {
                gItems[i].draw();
            }
        }
    }
    //console.groupEnd();

    //console.group("Drawing " + beams.length + " beams:");
    {
        var nbBeams = beams.length;
        for (var i = 0; i < nbBeams; i++)
        {
            beams[i].draw();
        }
    }
    //console.groupEnd();

    var nbLauncherItems = gLauncherItems.length;
    //console.group("Drawing " + nbLauncherItems + " launcher items:");
    {
        for (var i = 0; i < nbLauncherItems; i++)
        {
            gLauncherItems[i].draw();
        }
    }
    //console.groupEnd();

    //console.group("Drawing icons:");
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
                //console.error("Mode of selected item not known");
            }
        }
    }
    //console.groupEnd();

    gCtx.save();
    gCtx.beginPath();
    gCtx.moveTo(gDrawingAreaBottomRightCorner.x, gDrawingAreaBottomRightCorner.y);
    gCtx.lineTo(gDrawingAreaBottomLeftCorner.x,  gDrawingAreaBottomLeftCorner.y);
    gCtx.lineWidth = 1;
    gCtx.shadowColor = '#999';
    gCtx.shadowBlur = 2;
    gCtx.shadowOffsetX = 0;
    gCtx.shadowOffsetY = 3;
    gCtx.strokeStyle = gFgColor;
    gCtx.stroke();
    gCtx.restore();

    //console.timeEnd("[mainDraw]");
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onLoad()
{
    var width = getWidth() - 120;
    var realHeight = getHeight()

    width = Math.min(width, 800);

    var height = width; // Try square canvas

    if (height > realHeight - 200)
    {
        height = realHeight - 200;
    }

    width = Math.max(width, 300);
    height = Math.max(height, 300);

    var launcherBarSize = 100;

    gCanvas = document.getElementById('canvas'),
    gCanvas.width = width;
    gCanvas.height = height;

    gInfoDiv = document.getElementById('info'),
    gInfoDiv.style.width = width;

    //return new Utest();

    var mouseWheelEvtName = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

    if (gCanvas.attachEvent) //if IE (and Opera depending on user setting)
    {
        gCanvas.attachEvent("onmousedown", onMouseDown);
        gCanvas.attachEvent("onmouseup",   onMouseUp);
        gCanvas.attachEvent("onmousemove", onMouseMove);
        document.attachEvent("onkeydown",  onKeyDown);
        gCanvas.attachEvent("on" + mouseWheelEvtName, onMouseWheel)
    }
    else if (gCanvas.addEventListener) //WC3 browsers
    {
        gCanvas.addEventListener("mousedown", onMouseDown, false);
        gCanvas.addEventListener("mouseup",   onMouseUp,   false);
        gCanvas.addEventListener("mousemove", onMouseMove, false);
        document.addEventListener("keydown",  onKeyDown,   false);
        gCanvas.addEventListener(mouseWheelEvtName, onMouseWheel, false)
    }

    gDrawingAreaTopLeftCorner     = new Vector2D(0, 0);
    gDrawingAreaTopRightCorner    = new Vector2D(gCanvas.width, 0);
    gDrawingAreaBottomRightCorner = new Vector2D(gCanvas.width, gCanvas.height - launcherBarSize);
    gDrawingAreaBottomLeftCorner  = new Vector2D(0, gCanvas.height - launcherBarSize);
    gDrawingAreaPolygon           = new Polygon(new Array(gDrawingAreaTopLeftCorner,
                                                          gDrawingAreaTopRightCorner,
                                                          gDrawingAreaBottomRightCorner,
                                                          gDrawingAreaBottomLeftCorner));

    gLauncherAreaTopLeftCorner     = new Vector2D(0, gCanvas.height - launcherBarSize);
    gLauncherAreaTopRightCorner    = new Vector2D(gCanvas.width, gCanvas.height - launcherBarSize);
    gLauncherAreaBottomRightCorner = new Vector2D(gCanvas.width, gCanvas.height);
    gLauncherAreaBottomLeftCorner  = new Vector2D(0, gCanvas.height);
    gLauncherAreaPolygon           = new Polygon(new Array(gLauncherAreaTopLeftCorner,
                                                           gLauncherAreaTopRightCorner,
                                                           gLauncherAreaBottomRightCorner,
                                                           gLauncherAreaBottomLeftCorner));

    gCanvasTopLeftCorner     = new Vector2D(0, 0);
    gCanvasTopRightCorner    = new Vector2D(gCanvas.width, 0);
    gCanvasBottomRightCorner = new Vector2D(gCanvas.width, gCanvas.height);
    gCanvasBottomLeftCorner  = new Vector2D(0, gCanvas.height);
    gCanvasPolygon           = new Polygon(new Array(gCanvasTopLeftCorner,
                                                     gCanvasTopRightCorner,
                                                     gCanvasBottomRightCorner,
                                                     gCanvasBottomLeftCorner));

    gCtx = createContext(gCanvas);

    var laser = new Laser();
    laser.rotate(Math.PI);
    laser.moveTo(new Vector2D(gCanvas.width / 4, 3 * (gCanvas.height - launcherBarSize) / 4));
    gItems.push(laser);

    var circleGlass = new Glass("circle");
    circleGlass.moveTo(new Vector2D(gCanvas.width / 4 + circleGlass.shape.radius - 0.5, (gCanvas.height - launcherBarSize) / 4));
    gItems.push(circleGlass);

    var squareMirror = new Mirror("square");
    squareMirror.rotate(7 * Math.PI / 8);
    squareMirror.moveTo(new Vector2D(3 * gCanvas.width / 4, (gCanvas.height - launcherBarSize) / 4));
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

    var widthOfLauncherItemPlace = gCanvas.width / gLauncherItems.length;

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
    //DEBUGCheckArgumentsAreValids(arguments, 3);

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

    gCanvas.style.background = gBgColor;

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
