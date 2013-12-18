"use strict";

var g = {}; // Define all global variable in the namespace g

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
if (typeof Object.create !== "function") {
    Object.create = function (inObject) {
        var instance = function () {};
        instance.prototype = inObject;
        return new instance();
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
if (typeof Object.construct !== "function") {
    Object.construct = function (inObject) {
        var instance = Object.create(inObject);                         // Create the instance of the object

        if (inObject.init)
        {
            var argumentsArray = Array.prototype.slice.call(arguments);     // Convert arguments to array
            argumentsArray.shift();                                         // Remove the first arguments (inObject)
            return inObject.init.apply(instance, argumentsArray);           // Invoke init with the argumentsArray
        }

        return instance;
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
var ImgMgr = {

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    init : function() {
        this.all = [];
        return this;
    },

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    get : function (inSrc) {
        if (!this[inSrc]) {
            this[inSrc] = this.__new(inSrc);
        }

        return this[inSrc];
    },

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    __new : function (inSrc) {
        DEBUGCheckArgumentsAreValids(arguments, 1);

        var img = new Image();
        img.src = "img/" + inSrc;

        return img;
    }
}
