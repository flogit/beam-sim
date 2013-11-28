///////////////////////////////////////////////////////////////
/// Unit test
///////////////////////////////////////////////////////////////
function Utest()
{
    console.log("Start unit test");

    console.group(" > Class Vector2D");
    {
        (function ()
        {
            var vector = new Vector2D(10, 0);
            vector.rotateInline(Math.PI / 2);

            console.assert(vector.equal(new Vector2D(0, 10)));
        }) ();

        (function ()
        {
            var vector = new Vector2D(0, -10);
            vector.rotateInline(Math.PI / 2);

            console.assert(vector.equal(new Vector2D(10, 0)));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Vertex / Circle");
    {
        (function ()
        {
            var vertex = new Vector2D(-1, -1);
            var circle = new Circle(1);
            console.assert(!collisionVertexCircle(vertex, circle));
        }) ();

        (function ()
        {
            var vertex = new Vector2D(-1, -1);
            var circle = new Circle(2);
            console.assert(collisionVertexCircle(vertex, circle));
        }) ();

        (function ()
        {
            var vertex = new Vector2D(-2 + myMathEpsilon, 0);
            var circle = new Circle(2);
            console.assert(collisionVertexCircle(vertex, circle));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Vertex / Polygon");
    {
        (function ()
        {
            var vertex = new Vector2D(-1, 0);
            var polygon = new Polygon(new Array(new Vector2D(0, 0),
                                                new Vector2D(0, 1),
                                                new Vector2D(1, 1),
                                                new Vector2D(1, 0)));
            console.assert(!collisionVertexPolygon(vertex, polygon));
        }) ();

        (function ()
        {
            var vertex = new Vector2D(0.5, 0.5);
            var polygon = new Polygon(new Array(new Vector2D(0, 0),
                                                new Vector2D(0, 1),
                                                new Vector2D(1, 1),
                                                new Vector2D(1, 0)));
            console.assert(collisionVertexPolygon(vertex, polygon));
        }) ();

        (function ()
        {
            var vertex = new Vector2D(0.5, myMathEpsilon);
            var polygon = new Polygon(new Array(new Vector2D(0, 0),
                                                new Vector2D(0, 1),
                                                new Vector2D(1, 1),
                                                new Vector2D(1, 0)));
            console.assert(collisionVertexPolygon(vertex, polygon));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Line / Line");
    {
        (function ()
        {
            var l1_v1 = new Vector2D(-1, -1);
            var l1_v2 = new Vector2D( 1, -1);
            var l2_v1 = new Vector2D(-1,  1);
            var l2_v2 = new Vector2D( 1,  1);

            console.assert(!collisionLineLine(l1_v1, l1_v2, l2_v1, l2_v2));
        }) ();

        (function ()
        {
            var l1_v1 = new Vector2D( 0,  0);
            var l1_v2 = new Vector2D(-1,  0);
            var l2_v1 = new Vector2D( 2, -1);
            var l2_v2 = new Vector2D( 2,  1);

            var subResult = new Array();
            var isCollision = collisionLineLine(l1_v1, l1_v2, l2_v1, l2_v2, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(2, 0)));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Ray / Segment");
    {
        (function ()
        {
            var r_v = new Vector2D( 0, 0);
            var r_d = new Vector2D(-1, 0);

            var s_v1 = new Vector2D( 2, -1);
            var s_v2 = new Vector2D( 2,  1);

            console.assert(!collisionRaySegment(r_v, r_d, s_v1, s_v2));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(0, 0.1);
            var r_d = new Vector2D(1, 0);

            var s_v1 = new Vector2D(0.5, -1);
            var s_v2 = new Vector2D(0.5,  1);

            var subResult = new Array();
            var isCollision = collisionRaySegment(r_v, r_d, s_v1, s_v2, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(0.5, 0.1)));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Segment / Segment");
    {
        (function ()
        {
            var s1_v1 = new Vector2D( 0, 0);
            var s1_v2 = new Vector2D(-1, 0);

            var s2_v1 = new Vector2D( 2, -1);
            var s2_v2 = new Vector2D( 2,  1);

            console.assert(!collisionSegmentSegment(s1_v1, s1_v2, s2_v1, s2_v2));
        }) ();

        (function ()
        {
            var s1_v1 = new Vector2D(0, 0.1);
            var s1_v2 = new Vector2D(1, 0.1);

            var s2_v1 = new Vector2D(0.5, -1);
            var s2_v2 = new Vector2D(0.5,  1);

            var subResult = new Array();
            var isCollision = collisionSegmentSegment(s1_v1, s1_v2, s2_v1, s2_v2, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(0.5, 0.1)));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Ray / Polygon");
    {
        (function ()
        {
            var r_v = new Vector2D(1.5, 0.5);
            var r_d = new Vector2D(1, 0);
            var p = new Polygon(new Array(new Vector2D(0, 0),
                                          new Vector2D(0, 1),
                                          new Vector2D(1, 1),
                                          new Vector2D(1, 0)));

            console.assert(!collisionRayPolygon(r_v, r_d, p));
            console.assert(!collisionRayShape(r_v, r_d, p));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(-2, 0.5);
            var r_d = new Vector2D(1, 1);
            var p = new Polygon(new Array(new Vector2D(0, 0),
                                          new Vector2D(0, 1),
                                          new Vector2D(1, 1),
                                          new Vector2D(1, 0)));

            console.assert(!collisionRayPolygon(r_v, r_d, p));
            console.assert(!collisionRayShape(r_v, r_d, p));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(-0.5, 0.5);
            var r_d = new Vector2D(1, 0);
            var p = new Polygon(new Array(new Vector2D(0, 0),
                                          new Vector2D(0, 1),
                                          new Vector2D(1, 1),
                                          new Vector2D(1, 0)));

            console.assert(collisionRayPolygon(r_v, r_d, p));

            var subResult = new Array();
            var isCollision = collisionRayShape(r_v, r_d, p, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(0, 0.5)));
        }) ();
    }
    console.groupEnd();

    console.group(" > Collision Ray / Circle");
    {
        (function ()
        {
            var r_v = new Vector2D(1.5, 0);
            var r_d = new Vector2D(0, 1);
            var c = new Circle(1);

            console.assert(!collisionRayCircle(r_v, r_d, c));
            console.assert(!collisionRayShape(r_v, r_d, c));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(0, 0);
            var r_d = new Vector2D(0, 1);
            var c = new Circle(1);

            console.assert(collisionRayCircle(r_v, r_d, c));

            var subResult = new Array();
            var isCollision = collisionRayShape(r_v, r_d, c, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(0, 1)));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(-2, 0);
            var r_d = new Vector2D(1, 0);
            var c = new Circle(1);

            console.assert(collisionRayCircle(r_v, r_d, c));

            var subResult = new Array();
            var isCollision = collisionRayShape(r_v, r_d, c, subResult);

            console.assert(isCollision && subResult['i'].equal(new Vector2D(-1, 0)));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(-5, 0);
            var r_d = new Vector2D(1, 1);
            var c = new Circle(1);
            c.translate(new Vector2D(0, 5.5));

            console.assert(collisionRayCircle(r_v, r_d, c));
        }) ();

        (function ()
        {
            var r_v = new Vector2D(-5, 0);
            var r_d = new Vector2D(-1, -1);
            var c = new Circle(1);
            c.translate(new Vector2D(0, 5.5));

            console.assert(!collisionRayCircle(r_v, r_d, c));
        }) ();
    }
    console.groupEnd();



    console.log("End of unit test");

    return true;
}
