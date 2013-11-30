///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawShapePath(inShape)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    if (inShape.type == "polygon")
    {
        gCtx.beginPath();
        var nbVertices = inShape.vertices.length;
        var vertex;
        for (var i = 0; i < nbVertices; i++)
        {
            vertex = inShape.vertices[i];
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
    else if (inShape.type == "circle")
    {
        gCtx.beginPath();
        gCtx.arc(inShape.center.x, inShape.center.y, inShape.radius, 0, Math.PI * 2, true);
        gCtx.closePath();
    }
    else
    {
        console.error("Tru to draw path of the not-known shape " + inShape.type);
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawShape(inShape)
{
    gCtx.save();
    drawShapePath(inShape);
    gCtx.fillStyle = "#FF0000";
    gCtx.fill();
    gCtx.restore();
}
