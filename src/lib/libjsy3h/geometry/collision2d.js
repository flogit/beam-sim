
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

    var vectorPolygonToVertex = inPolygon.position.sub(inVertex);
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

    var vectorVertexToCircle = inCircle.position.sub(inVertex);
    return vectorVertexToCircle.normSq() <= inCircle.radius * inCircle.radius;
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

    var lineLineSubResult = new Array();

    if (privateCollisionLineLine(inV1, inV2, inV3, inV4, lineLineSubResult))
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

    var lineLineSubResult = new Array();

    if (privateCollisionLineLine(inV1, inV2, inV3, inV4, lineLineSubResult))
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

    var lineLineSubResult = new Array();

    if (privateCollisionLineLine(inV1, inV1.add(inDirection), inV3, inV4, lineLineSubResult))
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
                             outSubResult)
{
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

        var raySegmentSubResult = new Array();

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

    var solutions = new Array();
    var isCollision = false;

    var rayEnd = inRayStart.add(inRayDirection);

    var nbSolutions = privateCollisionLineCircle(inRayStart, rayEnd, circlePosition, circleRadius, solutions);

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
///@warning Assume convex polygon
///@warning If 2 polygons are collided : At least 1 vertex is IN the ther polygon (false)
///////////////////////////////////////////////////////////////
function collisionPolygonPolygon(inPolygon1, inPolygon2)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);
    console.assert(inPolygon1.type == "polygon");
    console.assert(inPolygon2.type == "polygon");

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
function privateCollisionLineCircle(inVertex1, inVertex2,
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
function privateCollisionLineLine(inV1, inV2, inV3, inV4, outSubResult)
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
