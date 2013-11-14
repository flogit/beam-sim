///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getRefractiveIndex(inVertex)
{
    //DEBUGCheckArgumentsAreValids(1);

    var refractiveIndex;

    // Detect current refractive index
    var nbItems = gItems.length;
    var item;
    for (var i = 0; i < nbItems; i++)
    {
        item = gItems[i];

        if (collisionVertexShape(inVertex, item.shape))
        {
            if (typeof item.refractiveIndex === 'number') // Item is refractive
            {
                if (typeof refractiveIndex !== 'number')
                {
                    refractiveIndex = item.refractiveIndex;
                }
                else
                {
                    if (item.refractiveIndex > refractiveIndex)
                    {
                        refractiveIndex = item.refractiveIndex;
                    }
                }
            }
            else
            {
                return; // Nothing to do, we are in an item
            }
        }
    }

    if (typeof refractiveIndex !== 'number')
    {
        refractiveIndex = gSpaceRefractiveIndex;
    }

    //DEBUGAssertIsValid(refractiveIndex);

    return refractiveIndex;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getWidth()
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
function getHeight()
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
function getPosition(event)
{
    var mousePos = new Vector2D();

    if (event.x != undefined && event.y != undefined)
    {
        mousePos.x = event.x - window.pageXOffset;
        mousePos.y = event.y + window.pageYOffset;
    }
    else
    {
        // Firefox method to get the position
        mousePos.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mousePos.y = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }
    mousePos.x -= gCanvas.offsetLeft;
    mousePos.y -= gCanvas.offsetTop;

    return mousePos;
}
