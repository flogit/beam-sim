///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function getRefractiveIndex(inVertex)
{
    DEBUGCheckArgumentsAreValids(1);

    var refractiveIndex;

    // Detect current refractive index
    var nbItems = gItems.length;
    var item;
    for (var i = 0; i < nbItems; i++)
    {
        item = gItems[i];

        if (collisionVertexShape(inVertex, item.shape))
        {
            if (typeof item.refractiveIndex === 'number') // Item is refractive
            {
                if (typeof refractiveIndex !== 'number')
                {
                    refractiveIndex = item.refractiveIndex;
                }
                else
                {
                    if (item.refractiveIndex > refractiveIndex)
                    {
                        refractiveIndex = item.refractiveIndex;
                    }
                }
            }
            else
            {
                return; // Nothing to do, we are in an item
            }
        }
    }

    if (typeof refractiveIndex !== 'number')
    {
        refractiveIndex = gSpaceRefractiveIndex;
    }

    DEBUGAssertIsValid(refractiveIndex);

    return refractiveIndex;
}
