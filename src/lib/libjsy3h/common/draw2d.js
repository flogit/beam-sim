"use strict";

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawShapePath(inShape)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    if (inShape.type == "polygon")
    {
        g.ctx.beginPath();
        var nbVertices = inShape.vertices.length;
        var vertex;
        for (var i = 0; i < nbVertices; i++)
        {
            vertex = inShape.vertices[i];
            if (i == 0)
            {
                g.ctx.moveTo(vertex.x, vertex.y);
            }
            else
            {
                g.ctx.lineTo(vertex.x, vertex.y);
            }
        }
        g.ctx.closePath();
    }
    else if (inShape.type == "circle")
    {
        g.ctx.beginPath();
        g.ctx.arc(inShape.position.x, inShape.position.y, inShape.radius, 0, Math.PI * 2, true);
        g.ctx.closePath();
    }
    else
    {
        console.error("Try to draw path of the not-known shape " + inShape.type);
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function drawShape(inShape)
{
    drawShapePath(inShape);
    g.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    g.ctx.fill();
    drawShapePath(inShape);
    g.ctx.strokeStyle = "rgb(0, 255, 0)";
    g.ctx.stroke();
}
