var gItemCurrentId = 0;

///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Item()
{
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.init = function(inName, inWidth, inHeight)
{
    DEBUGCheckArgumentsAreValids(arguments, 3);

    this.width               = inWidth;
    this.height              = inHeight;
    this.name                = inName;
    this.id                  = gItemCurrentId++;
    this.movingInLauncherBar = false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.isTransparent = function()
{
    return false; // default value
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.drawTranslateIcon = function()
{
    g.ctx.save();

    var radius = 4;
    var offset = 3;

    g.ctx.translate(this.shape.bsphereCenter.x - 0.75 * this.shape.bsphereRadius - offset,
                   this.shape.bsphereCenter.y - 0.75 * this.shape.bsphereRadius - offset);

    g.ctx.beginPath();
    g.ctx.moveTo(-radius, 0);
    g.ctx.lineTo( radius, 0);
    g.ctx.moveTo(0, -radius);
    g.ctx.lineTo(0,  radius);
    g.ctx.lineWidth = 2;
    g.ctx.strokeStyle = gFgColor;
    g.ctx.stroke();

    g.ctx.restore();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.drawRotationIcon = function()
{
    g.ctx.save();

    var radius = 3;
    var offset = 3;

    g.ctx.translate(this.shape.bsphereCenter.x - 0.75 * this.shape.bsphereRadius - offset,
                   this.shape.bsphereCenter.y - 0.75 * this.shape.bsphereRadius - offset);

    g.ctx.beginPath();
    g.ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
    g.ctx.lineWidth = 2;
    g.ctx.strokeStyle = gFgColor;
    g.ctx.stroke();

    g.ctx.restore();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.getName = function()
{
    return this.name;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.translate = function(inOffset)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    this.shape.translate(inOffset);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.moveTo = function(inNewPosition)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    this.shape.setPosition(inNewPosition);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.canRotate = function()
{
    return !this.shape.invariantRotation;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.rotate = function(inAngle)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);
    console.assert(this.canRotate(), "Try to rotate item that can not rotate");

    this.shape.rotate(inAngle);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.scale = function(inRatio)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    var ratioMulRadius = inRatio * this.shape.bsphereRadius;

    if (this.shape.bsphereCenter.x - ratioMulRadius > gDrawingAreaBottomLeftCorner.x &&
        this.shape.bsphereCenter.x + ratioMulRadius < gDrawingAreaTopRightCorner.x   &&
        this.shape.bsphereCenter.y - ratioMulRadius > gDrawingAreaTopRightCorner.y   &&
        this.shape.bsphereCenter.y + ratioMulRadius < gDrawingAreaBottomLeftCorner.y)
    {
        this.width  *= inRatio;
        this.height *= inRatio;

        this.shape.scale(inRatio);
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.enableShadow = function()
{
    g.ctx.shadowColor = '#999';
    g.ctx.shadowBlur = 4;
    g.ctx.shadowOffsetX = 2;
    g.ctx.shadowOffsetY = 2;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Item.prototype.toString = function()
{
    return "item " + this.name + " (id " + this.id + ") at position " + this.shape.position + " (" + this.width.toFixed(2) + " X " + this.height.toFixed(2) + ")";
}
