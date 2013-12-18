///////////////////////////////////////////////////////////////
/// Constructor
///////////////////////////////////////////////////////////////
function Beam(outBeams, inBeamStart, inBeamDirection, inRefractiveIndex, inSize)
{
    DEBUGCheckArgumentsAreValids(arguments, 5);

    if (outBeams.length > 50)
    {
        return;
    }

    this.size = Math.max(inSize, 2);

    outBeams.push(this);

    this.start = inBeamStart;
    this.end = undefined;

    this.refractiveIndex = inRefractiveIndex;

    var nbItems = gItems.length;

    var max_d = Number.MAX_VALUE;
    var normal;

    var subResult = new Array();

    var collidedItemIdx;
    var item;
    for (var i = 0; i < nbItems; i++)
    {
        item = gItems[i];

        if (collisionRayShape(this.start, inBeamDirection, item.shape, subResult))
        {
            if (subResult['r'] < max_d)
            {
                max_d = subResult['r'];
                this.end = subResult['i'];
                normal = subResult['n'];
                collidedItemIdx = i;

                DEBUGAssertIsValid(max_d);
                DEBUGAssertIsValid(this.end);
                DEBUGAssertIsValid(normal);
            }
        }
    }

    if (typeof collidedItemIdx !== 'undefined')
    {
        if (typeof gItems[collidedItemIdx].handleBeamCollision === 'function')
        {
            gItems[collidedItemIdx].handleBeamCollision(outBeams,
                                                        this.end,
                                                        inBeamDirection,
                                                        normal,
                                                        this.refractiveIndex,
                                                        this.size);
        }
    }

    if (typeof this.end == 'undefined')
    {
        // Test collision with Canvas
        if (collisionRayShape(this.start, inBeamDirection, gDrawingAreaPolygon, subResult))
        {
            max_d = subResult['r'];
            this.end = subResult['i'];
        }
    }

    DEBUGAssertIsValid(this.end);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
Beam.prototype.draw = function()
{
    if (typeof this.end !== 'undefined')
    {
        console.log("Draw beams from " + this.start + " to " + this.end + " with refractive index " + this.refractiveIndex);

        g.ctx.save();
        {
            g.ctx.beginPath();
            g.ctx.moveTo(this.start.x, this.start.y);
            g.ctx.lineTo(this.end.x, this.end.y);
            g.ctx.lineWidth = this.size;
            g.ctx.shadowColor = '#999';
            g.ctx.shadowBlur = this.size;
            g.ctx.shadowOffsetX = this.size / 2;
            g.ctx.shadowOffsetY = this.size/ 2;
            g.ctx.strokeStyle = gBeamColor;
            g.ctx.stroke();
        }
        g.ctx.restore();
    }
    else
    {
        console.log("No Draw of invalid beams");
    }
}
