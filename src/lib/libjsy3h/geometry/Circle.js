"use strict";

/**
 * @constructor
 */
function Circle(inRadius)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    this.init("circle");

    this.position = new Vector2D(0, 0);
    this.bsphereCenter = new Vector2D(0, 0);

    this.radius = inRadius;
    this.bsphereRadius = inRadius;

    this.invariantRotation = true;
}

///////////////////////////////////////////////////////////////
/// Inheritance
///////////////////////////////////////////////////////////////
Circle.prototype = new Shape;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Circle.prototype.translate = function(inOffset)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    this.position.addInline(inOffset);
    this.bsphereCenter.addInline(inOffset);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Circle.prototype.scale = function(inRatio)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    this.radius *= inRatio;
    this.bsphereRadius *= inRatio;
}
