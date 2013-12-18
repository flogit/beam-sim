"use strict";

//globals:
g.mathEpsilon = 0.001;

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function floatEqual(x, y)
{
    DEBUGCheckArgumentsAreValids(arguments, 2);

    return (Math.abs(x - y) < g.mathEpsilon);
}
