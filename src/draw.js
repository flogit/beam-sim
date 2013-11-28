
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawPolygonPath(inVertices)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    gCtx.beginPath();
    var nbVertices = inVertices.length;
    var vertex;
    for (var i = 0; i < nbVertices; i++)
    {
        vertex = inVertices[i];
        if (i == 0)
        {
            gCtx.moveTo(vertex.x, vertex.y);
        }
        else
        {
            gCtx.lineTo(vertex.x, vertex.y);
        }
    }
    gCtx.closePath();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawCirclePath(inCenter, inRadius)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);

    gCtx.beginPath();
    gCtx.arc(inCenter.x, inCenter.y, inRadius, 0, Math.PI * 2, true);
    gCtx.closePath();
}
