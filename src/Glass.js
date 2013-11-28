///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Glass(inShapeType)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var radius = 20;

    this.init(inShapeType + "_glass", radius * 2, radius * 2);

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

    this.refractiveIndex = 2;
}

///////////////////////////////////////////////////////////////
/// Inheritance
///////////////////////////////////////////////////////////////
Glass.prototype = new Item;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Glass.prototype.isTransparent = function()
{
    return true;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Glass.prototype.draw = function()
{
    console.log("Draw " + this.toString());

    gCtx.save();
    if (this.movingInLauncherBar)
    {
        gCtx.globalAlpha = 0.5;
    }
    drawShapePath(this.shape);
    gCtx.fillStyle = gTransparentColor;
    this.enableShadow();
    gCtx.fill();
    gCtx.restore();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Glass.prototype.handleBeamCollision = function(outBeams,
                                               inCollidedPoint,
                                               inInputRayDirection,
                                               inNormal,
                                               inInputRefractiveIndex1,
                                               inBeamSize)
{
    DEBUGCheckArgumentsAreValids(arguments, 6);

    var costheta1 = inInputRayDirection.dot(inNormal);
    if (costheta1 < 0)
    {
        costheta1 = -costheta1;
        inNormal.multiplyInline(-1);
    }

    var crossVector = inInputRayDirection.cross(inNormal);

    var theta1 = Math.acos(costheta1);

    var outputBeamStart = inCollidedPoint.add(inInputRayDirection.multiply(gMathEpsilon));

    var refractiveIndex2 = getRefractiveIndex(outputBeamStart);

    if (typeof refractiveIndex2 !== 'number')
    {
        refractiveIndex2 = gSpaceRefractiveIndex;
    }

    var sintheta2 = inInputRefractiveIndex1 * Math.sin(theta1) / refractiveIndex2;
    var theta2 = Math.asin(sintheta2);

    if (!isNaN(theta2)) // Refraction
    {
        var outputRayDirection;
        if (crossVector < 0)
        {
            outputRayDirection = inInputRayDirection.rotate(theta2 - theta1);
        }
        else
        {
            outputRayDirection = inInputRayDirection.rotate(theta1 - theta2);
        }

        var beam = new Beam(outBeams, outputBeamStart, outputRayDirection.normalize(), refractiveIndex2, inBeamSize);
    }
    else // Reflexion
    {
        var outputRayDirection = inInputRayDirection.multiply(-1);
        outputRayDirection.normalizeInline();

        var proj = inNormal.multiply(outputRayDirection.dot(inNormal));

        outputRayDirection = outputRayDirection.add(proj.sub(outputRayDirection).multiply(2));
        var outputBeamStart = inCollidedPoint.add(outputRayDirection.multiply(myMathEpsilon));

        var beam = new Beam(outBeams, outputBeamStart, outputRayDirection.normalize(), inInputRefractiveIndex1, inBeamSize);
    }
}
