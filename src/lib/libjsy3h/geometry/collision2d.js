"use strict";

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionVertexShape(inVertex, inShape)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);

    if (inShape.type == "polygon")
    {
        return collisionVertexPolygon(inVertex, inShape);
    }
    else if (inShape.type == "circle")
    {
        return collisionVertexCircle(inVertex, inShape);
    }
    else
    {
        console.error("Type " + inShape.type + " of shape not known");
        return false;
    }
}

///////////////////////////////////////////////////////////////
///@warning Assume convex polygon
///(http://bbs.dartmouth.edu/~fangq/MATH/download/source/Determining%20if%20a%20point%20lies%20on%20the%20interior%20of%20a%20polygon.htm)
///////////////////////////////////////////////////////////////
function collisionVertexPolygon(inVertex, inPolygon)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inPolygon.type == "polygon");

    var vectorPolygonToVertex = inPolygon.bsphereCenter.sub(inVertex);
    if (vectorPolygonToVertex.normSq() > inPolygon.bsphereRadius * inPolygon.bsphereRadius)
    {
        return false;
    }

    var nbVertices = inPolygon.vertices.length;
    var vertex;
    var lastVertex = inPolygon.vertices[nbVertices - 1];
    var currentPosition;

    for (var i = 0; i < nbVertices; i++)
    {
        vertex = inPolygon.vertices[i];

        var position = (inVertex.y - vertex.y) * (lastVertex.x - vertex.x) - (inVertex.x - vertex.x) * (lastVertex.y - vertex.y);

        if (typeof currentPosition == 'undefined')
        {
            if (position > 0)
            {
                currentPosition = 'left';
            }
            else if (position < 0)
            {
                currentPosition = 'right';
            }
        }
        else
        {
            if (position > 0 && currentPosition === 'right' ||
                position < 0 && currentPosition === 'left')
            {
                return false;
            }
        }

        lastVertex = vertex;
    }

    return true;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionVertexCircle(inVertex, inCircle)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inCircle.type == "circle");

    var vectorVertexToCircle = inCircle.bsphereCenter.sub(inVertex);
    return vectorVertexToCircle.normSq() <= inCircle.bsphereRadius * inCircle.bsphereRadius;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionLineLine(inV1, inV2, inV3, inV4, outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 4);

    if (outSubResult)
    {
        outSubResult.length = 0;
    }

    var lineLineSubResult = [];

    if (__collisionLineLine(inV1, inV2, inV3, inV4, lineLineSubResult))
    {
        var r = lineLineSubResult['r']; // alias

        if (outSubResult)
        {
            var v2MinusV1 = inV2.sub(inV1);
            outSubResult['i'] = inV1.add(v2MinusV1.multiply(r));
        }
        return true;
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionSegmentSegment(inV1, inV2, inV3, inV4, outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 4);

    if (outSubResult)
    {
        outSubResult.length = 0;
    }

    var lineLineSubResult = [];

    if (__collisionLineLine(inV1, inV2, inV3, inV4, lineLineSubResult))
    {
        var r = lineLineSubResult['r']; // alias
        var s = lineLineSubResult['s']; // alias

        if (r >= 0 && r <= 1)
        {
            if (s >= 0 && s <= 1)
            {
                if (outSubResult)
                {
                    var v2MinusV1 = inV2.sub(inV1);
                    outSubResult['i'] = inV1.add(v2MinusV1.multiply(r));
                }
                return true;
            }
        }
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionRaySegment(inV1, inDirection, inV3, inV4, outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 4);

    if (outSubResult)
    {
        outSubResult.length = 0;
    }

    var lineLineSubResult = [];

    if (__collisionLineLine(inV1, inV1.add(inDirection), inV3, inV4, lineLineSubResult))
    {
        var r = lineLineSubResult['r']; // alias
        var s = lineLineSubResult['s']; // alias

        if (r >= 0)
        {
            if (s >= 0 && s <= 1)
            {
                if (outSubResult)
                {
                    outSubResult['i'] = inV1.add(inDirection.multiply(r));
                    outSubResult['r'] = r;
                }
                return true;
            }
        }
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionRayShape(inV1,
                           inDirection,
                           inShape,
                           outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 3);

    if (outSubResult)
    {
        outSubResult.length = 0;
    }

    if (inShape.type == "polygon")
    {
        return collisionRayPolygon(inV1, inDirection, inShape, outSubResult);
    }
    else if (inShape.type == "circle")
    {
        return collisionRayCircle(inV1, inDirection, inShape, outSubResult);
    }
    else
    {
        console.error("Type " + inShape.type + " of shape not known");
        return false;
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionRayPolygon(inV1,
                             inDirection,
                             inPolygon,
                             outSubResult) {

    DEBUGCheckFirstArgumentsAreValids(arguments, 3);
    console.assert(inPolygon.type == "polygon");

    if (outSubResult)
    {
        outSubResult.length = 0;
        outSubResult['r'] = Number.MAX_VALUE;
    }

    var nbVertices = inPolygon.vertices.length;
    var vertex;
    var lastVertex = inPolygon.vertices[nbVertices - 1];
    var collision = false;
    for (var i = 0; i < nbVertices; i++)
    {
        vertex = inPolygon.vertices[i];

        var raySegmentSubResult = [];

        if (collisionRaySegment(inV1, inDirection, lastVertex, vertex, raySegmentSubResult))
        {
            if (outSubResult)
            {
                if (raySegmentSubResult['r'] < outSubResult['r'])
                {
                    outSubResult['i'] = raySegmentSubResult['i'];
                    outSubResult['r'] = raySegmentSubResult['r'];

                    var normal = new Vector2D(-(vertex.y - lastVertex.y),
                                                vertex.x - lastVertex.x);
                    normal.normalizeInline();

                    outSubResult['n'] = normal;
                    collision = true;
                }
            }
            else
            {
                return true;
            }
        }

        lastVertex = vertex;
    }

    return collision;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionRayCircle(inRayStart,
                            inRayDirection,
                            inCircle,
                            outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 3);
    console.assert(inCircle.type == "circle");

    if (outSubResult)
    {
        outSubResult.length = 0;
        outSubResult['r'] = Number.MAX_VALUE;
    }

    DEBUGAssertIsValid(inCircle.position);
    DEBUGAssertIsValid(inCircle.radius);

    var circlePosition = inCircle.position;
    var circleRadius = inCircle.radius;

    var solutions = [];
    var isCollision = false;

    var rayEnd = inRayStart.add(inRayDirection);

    var nbSolutions = __collisionLineCircle(inRayStart, rayEnd, circlePosition, circleRadius, solutions);

    switch (nbSolutions)
    {
        case 2:
            var rayStartToSolution2 = solutions['s2'].sub(inRayStart);

            if (rayStartToSolution2.dot(inRayDirection) >= 0)
            {
                if (!outSubResult)
                {
                    return true;
                }

                isCollision = true;

                outSubResult['r'] = solutions['s2'].sub(inRayStart).norm();
                outSubResult['i'] = solutions['s2'];
                outSubResult['n'] = solutions['s2'].sub(circlePosition).normalize();
            }

        case 1:
            var rayStartToSolution1 = solutions['s1'].sub(inRayStart);

            if (rayStartToSolution1.dot(inRayDirection) >= 0)
            {
                if (!outSubResult)
                {
                    return true;
                }

                isCollision = true;

                var r = solutions['s1'].sub(inRayStart).norm();

                if (r < outSubResult['r'])
                {
                    outSubResult['r'] = r;
                    outSubResult['i'] = solutions['s1'];
                    outSubResult['n'] = solutions['s1'].sub(circlePosition).normalize();
                }
            }

            break;
    }

    return isCollision;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionSegmentCircle(inV1,
                                inV2,
                                inCircle)
{
    DEBUGCheckArgumentsAreValids(arguments, 3);
    console.assert(inCircle.type == "circle");

    DEBUGAssertIsValid(inCircle.position);
    DEBUGAssertIsValid(inCircle.radius);

    if (collisionVertexCircle(inV1, inCircle) || collisionVertexCircle(inV2, inCircle))
    {
        return true;
    }

    var circlePosition = inCircle.position;
    var circleRadius = inCircle.radius;

    var solutions = [];

    var nbSolutions = __collisionLineCircle(inV1, inV2, circlePosition, circleRadius, solutions);

    var normSqV2V1 = inV2.sub(inV1).normSq();

    switch (nbSolutions)
    {
        case 2:
            var normSqV1S2 = solutions['s2'].sub(inV2).normSq();
            var normSqV2S2 = solutions['s2'].sub(inV1).normSq();

            if (normSqV1S2 < normSqV2V1 && normSqV2S2 < normSqV2V1)
            {
                return true;
            }

        case 1:
            var normSqV1S1 = solutions['s1'].sub(inV2).normSq();
            var normSqV2S1 = solutions['s1'].sub(inV1).normSq();

            if (normSqV1S1 < normSqV2V1 && normSqV2S1 < normSqV2V1)
            {
                return true;
            }

            break;
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionShapeShape(inShape1, inShape2)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);

    if (inShape1.type == "polygon" && inShape2.type == "polygon")
    {
        return collisionPolygonPolygon(inShape1, inShape2);
    }
    else if (inShape1.type == "polygon" && inShape2.type == "circle")
    {
        return collisionPolygonCircle(inShape1, inShape2);
    }
    else if (inShape1.type == "circle" && inShape2.type == "polygon")
    {
        return collisionPolygonCircle(inShape2, inShape1);
    }
    else if (inShape1.type == "circle" && inShape2.type == "circle")
    {
        return collisionCircleCircle(inShape1, inShape2);
    }
    else
    {
        console.error("Collision " + inShape1.type + " / " + inShape2.type + " not handled");
        return false;
    }
}

///////////////////////////////////////////////////////////////
///@warning Assume convex polygon
///@warning If 2 polygons are collided : At least 1 vertex is IN the the polygon (false)
///////////////////////////////////////////////////////////////
function collisionPolygonPolygon(inPolygon1, inPolygon2)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inPolygon1.type == "polygon");
    console.assert(inPolygon2.type == "polygon");

    var vectorBsphereToBsphere = inPolygon1.bsphereCenter.sub(inPolygon2.bsphereCenter);
    var sumRadius = inPolygon1.bsphereRadius + inPolygon2.bsphereRadius;
    if (vectorBsphereToBsphere.normSq() > sumRadius * sumRadius)
    {
        return false;
    }

    var nbVertices1 = inPolygon1.vertices.length;
    var vertex1;
    for (var idxVertices1 = 0; idxVertices1 < nbVertices1; idxVertices1++)
    {
        vertex1 = inPolygon1.vertices[idxVertices1];

        if (collisionVertexPolygon(vertex1, inPolygon2))
        {
            return true;
        }
    }

    var nbVertices2 = inPolygon2.vertices.length;
    var vertex2;
    for (var idxVertices2 = 0; idxVertices2 < nbVertices2; idxVertices2++)
    {
        vertex2 = inPolygon2.vertices[idxVertices2];

        if (collisionVertexPolygon(vertex2, inPolygon1))
        {
            return true;
        }
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionPolygonCircle(inPolygon, inCircle)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inPolygon.type === "polygon");
    console.assert(inCircle.type  === "circle");

    var vectorBsphereToCircle = inPolygon.bsphereCenter.sub(inCircle.bsphereCenter);
    var sumRadius = inPolygon.bsphereRadius + inCircle.bsphereRadius;
    if (vectorBsphereToCircle.normSq() > sumRadius * sumRadius)
    {
        return false;
    }

    var lastVertex = inPolygon.vertices[inPolygon.vertices.length - 1];
    for (var idxVertices = 0; idxVertices < inPolygon.vertices.length - 1; idxVertices++)
    {
        var vertex = inPolygon.vertices[idxVertices];

        if (collisionSegmentCircle(vertex, lastVertex, inCircle))
        {
            return true;
        }
    }

    return false;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function collisionCircleCircle(inCircle1, inCircle2)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inCircle1.type == "circle");
    console.assert(inCircle2.type == "circle");

    var vectorCircleToCircle = inCircle1.bsphereCenter.sub(inCircle2.bsphereCenter);
    var sumRadius = inCircle1.bsphereRadius + inCircle2.bsphereRadius;
    return vectorCircleToCircle.normSq() <= sumRadius * sumRadius;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function __collisionLineCircle(inVertex1, inVertex2,
                                    inCirclePosition, inCircleRadius,
                                    outSolutions)
{
    DEBUGCheckArgumentsAreValids(arguments, 5);

    var vertex1To2 = inVertex2.sub(inVertex1);
    var circleToVertex1 = inCirclePosition.sub(inVertex1);

    var dot = vertex1To2.dot(circleToVertex1);
    var proj1 = vertex1To2.multiply(dot / vertex1To2.normSq());

    var midpt = inVertex1.add(proj1);
    var circleToMidpt = midpt.sub(inCirclePosition);
    var distSqToCenter = circleToMidpt.normSq();

    if (distSqToCenter > inCircleRadius * inCircleRadius)
    {
        return 0;
    }

    if (floatEqual(distSqToCenter, inCircleRadius * inCircleRadius))
    {
        outSolutions['s1'] = midpt;
        return 1;
    }

    if (floatEqual(distSqToCenter, 0))
    {
        var distToIntersection = inCircleRadius;
    }
    else
    {
        var distToIntersection = Math.sqrt(inCircleRadius * inCircleRadius - distSqToCenter);
    }

    vertex1To2.normalizeInline();
    vertex1To2.multiplyInline(distToIntersection);

    outSolutions['s1'] = midpt.add(vertex1To2);
    outSolutions['s2'] = midpt.sub(vertex1To2);

    return 2;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function __collisionLineLine(inV1, inV2, inV3, inV4, outSubResult)
{
    DEBUGCheckFirstArgumentsAreValids(arguments, 4);

    if (outSubResult)
    {
        outSubResult.length = 0;
    }

    var v1toV2 = inV2.sub(inV1);
    var v3toV4 = inV4.sub(inV3);

    if (v1toV2.y / v1toV2.x != v3toV4.y / v3toV4.x)
    {
        var d = v1toV2.x * v3toV4.y - v1toV2.y * v3toV4.x;

        if (d != 0)
        {
            if (outSubResult != undefined)
            {
                var v3toV1 = inV1.sub(inV3);
                outSubResult['r'] = (v3toV1.y * v3toV4.x - v3toV1.x * v3toV4.y) / d;
                outSubResult['s'] = (v3toV1.y * v1toV2.x - v3toV1.x * v1toV2.y) / d;
            }

            return true;
        }
    }

    return false;
}
