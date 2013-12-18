///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Mirror(inShapeType)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var radius = 20;

    this.init(inShapeType + "_mirror", radius * 2, radius * 2);

    if (inShapeType == "square")
    {
        this.shape = new Polygon(new Array(new Vector2D(-radius, -radius),
                                           new Vector2D( radius, -radius),
                                           new Vector2D( radius,  radius),
                                           new Vector2D(-radius,  radius)));
    }
    else if (inShapeType == "circle")
    {
        this.shape = new Circle(radius);
    }
    else
    {
        console.error("Shape " + inShapeType + " not known");
    }
}

///////////////////////////////////////////////////////////////
/// Inheritance
///////////////////////////////////////////////////////////////
Mirror.prototype = new Item;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Mirror.prototype.draw = function()
{
    console.log("Draw " + this.toString());

    //var alpha = this.movingInLauncherBar ? 0.5 : 1.0;

    g.ctx.save();

    if (this.movingInLauncherBar)
    {
        g.ctx.globalAlpha = 0.5;
    }

    drawShapePath(this.shape);
    g.ctx.fillStyle = "rgb(107, 60, 26)";
    g.ctx.save();
    this.enableShadow();
    g.ctx.fill();
    g.ctx.restore();
    g.ctx.strokeStyle = "rgb(100, 100, 100)";
    g.ctx.stroke();
    g.ctx.restore();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Mirror.prototype.handleBeamCollision = function(outBeams,
                                                inCollidedPoint,
                                                inInputRayDirection,
                                                inNormal,
                                                inInputRefractiveIndex,
                                                inBeamSize)
{
    DEBUGCheckArgumentsAreValids(arguments, 6);

    var outputRayDirection = inInputRayDirection.multiply(-1);
    outputRayDirection.normalizeInline();

    var proj = inNormal.multiply(outputRayDirection.dot(inNormal));

    outputRayDirection = outputRayDirection.add(proj.sub(outputRayDirection).multiply(2));
    var outputRayStart = inCollidedPoint.add(outputRayDirection.multiply(g.mathEpsilon));

    var beam = new Beam(outBeams, outputRayStart, outputRayDirection.normalize(), inInputRefractiveIndex, inBeamSize);
}
