///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Polygon(inVertices)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    //console.assert(inVertices.length >= 3);

    this.type = "polygon";
    this.vertices = inVertices;

    this.center = new Vector2D(0, 0);
    this.radius = 0;

    var nbVertices = this.vertices.length;

    for (var i = 0; i < nbVertices; i++)
    {
        var vertex = this.vertices[i];

        /// Compute Radius of BSphere
        var length = vertex.sub(this.center).norm();
        if (i == 0 || length > this.radius)
        {
            this.radius = length;
        }
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.drawPath = function()
{
    drawPolygonPath(this.vertices);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.draw = function()
{
    gCtx.save();
    this.drawPath();
    gCtx.fillStyle = "#909090";
    gCtx.fill();
    gCtx.restore();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.rotate = function(inAngle, inPosition)
{
    //DEBUGCheckArgumentsAreValids(arguments, 2);

    var nbVertices = this.vertices.length;
    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].rotateInline(inAngle, inPosition);
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.translate = function(inOffset)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var nbVertices = this.vertices.length;
    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].addInline(inOffset);
    }

    this.center.addInline(inOffset);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.scale = function(inRatio)
{
    //DEBUGCheckArgumentsAreValids(arguments, 1);

    var nbVertices = this.vertices.length;

    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].subInline(this.center);
        this.vertices[i].multiplyInline(inRatio);
        this.vertices[i].addInline(this.center);
    }

    this.radius *= inRatio;
}
