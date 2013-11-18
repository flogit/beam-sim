var gEventOldMousePos = new Vector2D(0, 0);
var gEventMouseDown = false;
var gEventItemTranslated = true;
var gSelectedItemComeFromLaunchingBar;
var gOldSelectedItemIdx;

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onMouseDown(inRawEvent)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var evt = window.event || inRawEvent; //equalize event object
    //DEBUGAssertIsValid(evt);

    gEventMouseDown = true;
    gOldSelectedItemIdx = gSelectedItemIdx;
    gSelectedItemIdx = undefined;

    var mousePos = getPosition(evt);

    var nbItems = gItems.length;

    var item;
    for (var i = nbItems - 1; i >= 0 && typeof gSelectedItemIdx == 'undefined'; i--)
    {
        item = gItems[i];

        var extendedCircle = new Circle(item.shape.radius + 10);
        extendedCircle.translate(item.shape.center);
        if (collisionVertexCircle(mousePos, extendedCircle))
        {
            gSelectedItemIdx = i;
            gSelectedItemComeFromLaunchingBar = false;
            gOldMousePage = mousePos;
        }
    }

    if (gOldSelectedItemIdx != gSelectedItemIdx)
    {
        gSelectedItemMode = "translation";
    }
    gEventItemTranslated = false;

    if (typeof gSelectedItemIdx == 'undefined')
    {
        var nbLauncherItems = gLauncherItems.length;
        var launcherItem;
        for (var i = 0; i < nbLauncherItems && typeof gSelectedItemIdx == 'undefined'; i++)
        {
            launcherItem = gLauncherItems[i];

            var extendedCircle = new Circle(launcherItem.shape.radius + 10);
            extendedCircle.translate(launcherItem.shape.center);
            if (collisionVertexCircle(mousePos, extendedCircle))
            {
                //console.log("Launching the item " + launcherItem.name)

                switch (launcherItem.name)
                {
                    case "laser" :
                        var newItem = new Laser();
                        break;

                    case "square_mirror" :
                        var newItem = new Mirror("square");
                        break;

                    case "circle_mirror" :
                        var newItem = new Mirror("circle");
                        break;

                    case "square_glass" :
                        var newItem = new Glass("square");
                        break;

                    case "circle_glass" :
                        var newItem = new Glass("circle");
                        break;

                    default :
                        //console.error("Launcher item " + name + " not known");
                }

                if (newItem.canRotate())
                {
                    newItem.rotate(launcherItem.angle);
                }
                newItem.moveTo(launcherItem.shape.center);
                newItem.movingInLauncherBar = true;
                gItems.push(newItem);
                gSelectedItemIdx = gItems.length - 1;
                gSelectedItemComeFromLaunchingBar = true;
                gOldMousePage = mousePos;
            }
        }
    }

    mainDraw();

    if (evt.preventDefault) //disable default wheel action of scrolling page
    {
        evt.preventDefault()
    }
    else
    {
        return false
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onMouseMove(inRawEvent)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    setTimeout(function() { // To avoid laggy firefox browser on onmousemove :/

        var evt = window.event || inRawEvent; //equalize event object
        //DEBUGAssertIsValid(evt);

        if (gEventMouseDown && typeof gSelectedItemIdx != 'undefined')
        {
            gEventItemTranslated = true;

            var mousePos = getPosition(evt);
            var mouseOffset = mousePos.sub(gOldMousePage);
            gOldMousePage = mousePos;

            var gSelectedItem = gItems[gSelectedItemIdx];

            if (gSelectedItem.shape.center.x + mouseOffset.x - gSelectedItem.shape.radius > gDrawingAreaBottomLeftCorner.x  &&
                gSelectedItem.shape.center.x + mouseOffset.x + gSelectedItem.shape.radius < gDrawingAreaTopRightCorner.x &&
                gSelectedItem.shape.center.y + mouseOffset.y - gSelectedItem.shape.radius > gDrawingAreaTopRightCorner.y  &&
                gSelectedItem.shape.center.y + mouseOffset.y + gSelectedItem.shape.radius < gDrawingAreaBottomLeftCorner.y)
            {
                gSelectedItem.movingInLauncherBar = false;
                gSelectedItem.translate(mouseOffset);
            }
            else if (gSelectedItem.shape.center.x + mouseOffset.x - gSelectedItem.shape.radius > gLauncherAreaBottomLeftCorner.x  &&
                     gSelectedItem.shape.center.x + mouseOffset.x + gSelectedItem.shape.radius < gLauncherAreaTopRightCorner.x &&
                     gSelectedItem.shape.center.y + mouseOffset.y + gSelectedItem.shape.radius > gLauncherAreaTopRightCorner.y  &&
                     gSelectedItem.shape.center.y + mouseOffset.y + gSelectedItem.shape.radius < gLauncherAreaBottomLeftCorner.y)
            {
                if (!gSelectedItemComeFromLaunchingBar &&
                    gSelectedItem.shape.center.x + mouseOffset.x - gSelectedItem.shape.radius > gLauncherAreaBottomLeftCorner.x  &&
                    gSelectedItem.shape.center.x + mouseOffset.x + gSelectedItem.shape.radius < gLauncherAreaTopRightCorner.x &&
                    gSelectedItem.shape.center.y + mouseOffset.y > gLauncherAreaTopRightCorner.y  &&
                    gSelectedItem.shape.center.y + mouseOffset.y + gSelectedItem.shape.radius < gLauncherAreaBottomLeftCorner.y)
                {
                    gItems.splice(gSelectedItemIdx, 1);
                    gSelectedItemIdx = undefined;
                    gSelectedItemMode = "translation";
                    gSelectedItem = undefined;
                }
                else
                {
                    gSelectedItem.movingInLauncherBar = true;
                    gSelectedItem.translate(mouseOffset);
                }
            }

            mainDraw();
        }
    }, 0);
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onMouseUp()
{
    gEventMouseDown = false;

    if (typeof gSelectedItemIdx != 'undefined')
    {
        if (!gEventItemTranslated && gOldSelectedItemIdx == gSelectedItemIdx)
        {
            if (gSelectedItemMode == "rotation")
            {
                gSelectedItemMode = "translation";
            }
            else if (gSelectedItemMode == "translation")
            {
                if (gItems[gSelectedItemIdx].canRotate())
                {
                    gSelectedItemMode = "rotation";
                }
                else
                {
                    // Nothing to do, keep translation
                }
            }
        }

        if (gItems[gSelectedItemIdx].movingInLauncherBar)
        {
            if (gEventItemTranslated)
            {
                gItems.splice(gSelectedItemIdx, 1);
                gSelectedItemIdx = undefined;
                gSelectedItemMode = "translation";
            }
            else
            {
                gItems[gSelectedItemIdx].movingInLauncherBar = false;
                gItems[gSelectedItemIdx].moveTo(new Vector2D(gCanvas.width / 2, gDrawingAreaBottomRightCorner.y / 2));
                gSelectedItemMode = "translation";
            }
        }

        mainDraw();
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onMouseWheel(inRawEvent)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var evt = window.event || inRawEvent; //equalize event object
    //DEBUGAssertIsValid(evt);

    var delta = evt.detail ? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta

    var selectedItemIdx;

    var canvasRect = gCanvas.getBoundingClientRect();

    var mousePos = getPosition(evt);

    if (typeof gSelectedItemIdx !== 'undefined')
    {
        if (gSelectedItemMode == "translation")
        {
            if (delta < 0)
            {
                gItems[gSelectedItemIdx].scale(0.9);
            }
            else
            {
                gItems[gSelectedItemIdx].scale(1.1);
            }
        }
        else if (gSelectedItemMode == "rotation")
        {
            if (delta < 0)
            {
                gItems[gSelectedItemIdx].rotate(0.07);
            }
            else
            {
                gItems[gSelectedItemIdx].rotate(-0.07);
            }
        }
        else
        {
            //console.error("Mode of selected item not known");
        }

        mainDraw();
    }

    if (evt.preventDefault) //disable default wheel action of scrolling page
    {
        evt.preventDefault()
    }
    else
    {
        return false
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function onKeyDown(inRawEvent)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var evt = window.event || inRawEvent; //equalize event object
    //DEBUGAssertIsValid(evt);

    //console.log("On key down with keyCode " + evt.keyCode);

    if (typeof gSelectedItemIdx != 'undefined')
    {
        if (evt.keyCode == 46) // Del
        {
            gItems.splice(gSelectedItemIdx, 1);
            gSelectedItemIdx = undefined;
            mainDraw();
        }
        else if (gSelectedItemMode == "translation")
        {
            switch(evt.keyCode)
            {
                case 38: // Up
                    gItems[gSelectedItemIdx].translate(new Vector2D(0, -1));
                    break;

                case 40: // Down
                    gItems[gSelectedItemIdx].translate(new Vector2D(0, 1));
                    break;

                case 37: // Left
                    gItems[gSelectedItemIdx].translate(new Vector2D(-1, 0));
                    break;

                case 39: // Right
                    gItems[gSelectedItemIdx].translate(new Vector2D(1, 0));
                    break;
            }
            mainDraw();

            if (evt.preventDefault) //disable default wheel action of scrolling page
            {
                evt.preventDefault()
            }
            else
            {
                return false
            }
        }
        else if (gSelectedItemMode == "rotation")
        {
            switch(evt.keyCode)
            {
                case 38: // Up
                case 37: // Left
                    gItems[gSelectedItemIdx].rotate(-0.02);
                    break;

                case 40: // Down
                case 39: // Right
                    gItems[gSelectedItemIdx].rotate(0.02);
                    break;
            }
            mainDraw();

            if (evt.preventDefault) //disable default wheel action of scrolling page
            {
                evt.preventDefault()
            }
            else
            {
                return false
            }
        }
        else
        {
            //console.error("Mode of selected item not known");
        }
    }
}
