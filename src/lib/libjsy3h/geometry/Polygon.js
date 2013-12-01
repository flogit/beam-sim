///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Polygon(inVertices)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    console.assert(inVertices.length >= 3);

    this.init("polygon");

    this.vertices = inVertices;

    this.position = new Vector2D(0, 0);
    this.bsphereRadius = 0;
    this.bsphereCenter = new Vector2D(0, 0);
    this.angle = 0;

    for (var i = 0; i < this.vertices.length; i++)
    {
        var vertex = this.vertices[i];

        this.bsphereCenter.addInline(vertex);

        /// Compute Radius of BSphere
        var length = vertex.sub(this.position).norm();
        if (i == 0 || length > this.bsphereRadius)
        {
            this.bsphereRadius = length;
        }
    }

    this.bsphereCenter.divideInline(this.vertices.length);
}

///////////////////////////////////////////////////////////////
/// Inheritance
///////////////////////////////////////////////////////////////
Polygon.prototype = new Shape;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.translate = function(inOffset)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var nbVertices = this.vertices.length;
    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].addInline(inOffset);
    }

    this.position.addInline(inOffset);
    this.bsphereCenter.addInline(inOffset);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.rotate = function(inAngle)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var nbVertices = this.vertices.length;
    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].rotateInline(inAngle, this.position);
    }
    this.bsphereCenter.rotateInline(inAngle, this.position);

    this.angle += inAngle;

    if (this.angle > Math.PI)
    {
        this.angle -= 2 * Math.PI;
    }
    else if (this.angle < -Math.PI )
    {
        this.angle += 2 * Math.PI;
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Polygon.prototype.scale = function(inRatio)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var nbVertices = this.vertices.length;

    var vertex = undefined;
    for (var i = 0; i < nbVertices; i++)
    {
        this.vertices[i].subInline(this.position);
        this.vertices[i].multiplyInline(inRatio);
        this.vertices[i].addInline(this.position);
    }
    this.bsphereCenter.subInline(this.position);
    this.bsphereCenter.multiplyInline(inRatio);
    this.bsphereCenter.addInline(this.position);

    this.bsphereRadius *= inRatio;
}
