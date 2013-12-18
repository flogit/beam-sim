gImgLaser = new Image();
gImgLaser.src = "img/light.png";

///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Laser()
{
    this.init("laser", 15, 40);

    this.shape = new Polygon(new Array(new Vector2D(-this.width * 0.26, -this.height * 0.47),
                                       new Vector2D( this.width * 0.26, -this.height * 0.47),
                                       new Vector2D( this.width * 0.47,  this.height * 0.47),
                                       new Vector2D(-this.width * 0.47,  this.height * 0.47)))
}

///////////////////////////////////////////////////////////////
/// Inheritance
///////////////////////////////////////////////////////////////
Laser.prototype = new Item;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Laser.prototype.generateBeams = function(outBeams)
{
    DEBUGCheckArgumentsAreValids(arguments, 1);

    if (this.movingInLauncherBar)
    {
        return;
    }

    var frontOffset = new Vector2D(0, this.height / 2);
    var beamStart = this.shape.position.add(frontOffset.rotate(this.shape.angle));

    var beamDirection = new Vector2D(0, 1);
    beamDirection = beamDirection.rotate(this.shape.angle);

    beamStart = beamStart.add(beamDirection.multiply(g.mathEpsilon));

    var refractiveIndex = getRefractiveIndex(beamStart);
    if (refractiveIndex)
    {
        var beam = new Beam(outBeams, beamStart, beamDirection, refractiveIndex, this.width / 20);
    }
    else
    {
        // Not in refactive item
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Laser.prototype.draw = function()
{
    console.log("Draw " + this.toString());

    g.ctx.save();
    g.ctx.translate(this.shape.position.x, this.shape.position.y);
    g.ctx.rotate(this.shape.angle);

    if (this.movingInLauncherBar)
    {
        g.ctx.globalAlpha = 0.5;
    }

    this.enableShadow();
    g.ctx.drawImage(gImgLaser, -this.width / 2, -this.height / 2, this.width, this.height);
    g.ctx.restore();
}
