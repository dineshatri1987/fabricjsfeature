var canvas = this.__canvas = new fabric.Canvas('c');
var canvas1 = this.__canvas1 = new fabric.Canvas('d');
var canvas2 = this.__canvas2 = new fabric.Canvas('e');
var isDown, mode1 = 'draw';
var isFlip = false;
var svgData = null;
var line = [];
var line2 = null;
// create a rect object
var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

function Add() {
    var rect = new fabric.Rect({
        left: 100,
        top: 50,
        fill: 'yellow',
        width: 200,
        height: 100,
        objectCaching: false,
        stroke: 'lightgreen',
        strokeWidth: 4,

    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
}

function Test() {
    debugger
    var json = canvas.toJSON();
    var svg = canvas.toSVG();
    canvas1.loadFromJSON(json);
    fabric.loadSVGFromString(svg, function (objects, options) {
        var svgData = fabric.util.groupSVGElements(objects, options);
        svgData.top = 30;
        svgData.left = 50;
        canvas2.add(svgData);

    });
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    position: { x: 0.5, y: -0.5 },
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24
});


function loadSVG() {
    $.get("Plan.xml", function (svg) {
        var xml = xmlToString(svg);
        fabric.loadSVGFromString(xml, function (objects, options) {
            svgData = fabric.util.groupSVGElements(objects, options);
            svgData.top = 30;
            svgData.left = 50;
            canvas.add(svgData);
            canvas.renderAll();
            //canvas.setActiveObject(svgData).renderAll();

        });

    });
}

function xmlToString(xmlData) {

    var xmlString;
    //IE
    if (window.ActiveXObject) {
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else {
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}

loadSVG();

function deleteObject(eventData, target) {
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
}

function draw() {
    canvas.freeDrawingCursor = 'url("../pencil.cur"), auto';
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "#000";
    canvas.freeDrawingBrush.width = 5;
}

function line1() {
    canvas.on('mouse:down', function (o) {
        if (canvas != undefined) {
            canvas.selection = false;
            isDown = true;
            var pointer = canvas.getPointer(o.e);
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            if (mode1 == "draw") {
                line2 = new fabric.Line(points, {
                    strokeWidth: 5,
                    fill: "#000",
                    stroke: "#000",
                    originX: 'center',
                    originY: 'center'
                });
                line2.set('selectable', false);
                line.push(line2);
                canvas.add(line2);
            }
        }
    });

    canvas.on('mouse:move', function (o) {

        if (!isDown) return;
        if (canvas != undefined) {
            var pointer = canvas.getPointer(o.e);
            if (mode1 == "draw") {
                line2.set({ x2: pointer.x, y2: pointer.y });
                canvas.renderAll();
            }
        }
    });

    canvas.on('mouse:up', function (o) {
        isDown = false;
        if (line2 != undefined) {
            line2.setCoords();
            canvas.renderAll();
        }

    });
}

function zoomIn() {
    var zoom = canvas.getZoom();
    zoom += 0.25;
    canvas.setZoom(zoom);
}

function zoomOut() {
    var zoom = canvas.getZoom();
    zoom -= 0.25;
    canvas.setZoom(zoom);
}

function furniture() {
    var activeObjects = canvas.getActiveObjects(),
        color = 'red';
    //canvas.remove(canvas.getActiveObject());
    //console.log(color); // test
    activeObjects.forEach(function (item) {
        item.toggle('flipX');
        item.setCoords();
    });

    // activeObject._objects.forEach(function (path) {
    //     if (path.id.indexOf('Text') > -1) {
    //         // var p = path;
    //         //  path.flipX = true;
    //         // // // path.flipY=true;
    //            path.scaleX = -1;
    //            path.scaleY = 1;

    //         path.translateX = (((path.top) - (663 / 2)) * 2) + 663 + path.width;
    //         if (path.translateX !== 0) {
    //             path.translateX = Math.round(path.translateX * 100) / 100;
    //         }
    //         path.translateY = 0;
    //         //path.set("angle", 360);
    //         path.toggle('flipX');
    //         var angle = path.get('angle')
    //         var negangle = 360 - angle;
    //         path.set("angle", negangle);
    //         path.setCoords();
    //         //canvas.renderAll();
    //     }
    // });

    //  canvas.add(svgData);
    canvas.renderAll();
}

function flip() {
    isFlip = !isFlip;
    if (svgData) {
        svgData._objects.forEach(function (path) {
            if (path.id.indexOf('Text') > -1) {
                path.set("angle", "-360").set("SkewX","-360");
                path.transformMatrix = [ -1, 0, 0, 1, 0, 0 ];
                path.setCoords();
            }
        });
        svgData.set("angle", "-360").set('flipX', isFlip);
        svgData.setCoords();

    }
    if (line && line.length) {
        debugger
        line.forEach((item) => {
            item.set("angle", "-360").set('flipX', true);
            item.setCoords();
        });

    }
    //canvas.set('flipX', isFlip);
    canvas.renderAll();

    // canvas.getActiveObject().set("angle", "-180").set('flipY', true);
    // canvas.renderAll();
}

function rotate(degrees) {

    let canvasCenter = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2) // center of canvas
    let radians = fabric.util.degreesToRadians(degrees)

    canvas.getObjects().forEach((obj) => {
        debugger
        let objectOrigin = new fabric.Point(obj.left, obj.top);
        let new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, radians);
        obj.top = new_loc.y;
        obj.left = new_loc.x;
        obj.angle += degrees; //rotate each object by the same angle
        obj.setCoords()
    });

    canvas.renderAll()


}

function handleDragStart(e) {
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
    this.classList.add('img_dragging');
}

function handleDrop(e) {
    if (e.preventDefault) {
      e.preventDefault(); 
    }
    
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var img = document.querySelector('#images img.img_dragging');
		
    // console.log('event: ', e);

    var newImage = new fabric.Image(img, {
        width: 100,
        height: 100,
        // Set the center of the new object based on the event coordinates relative
        // to the canvas container.
        left: e.layerX,
        top: e.layerY
    });
    newImage.scaleToHeight(100);
    newImage.scaleToWidth(100);
    canvas.add(newImage);

    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
}

//if (Modernizr.draganddrop) {
    // Browser supports HTML5 DnD.

    // Bind the event listeners for the image elements
    var images = document.querySelectorAll('#images img');
    [].forEach.call(images, function (img) {
        img.addEventListener('dragstart', handleDragStart, false);
        img.addEventListener('dragend', handleDragEnd, false);
    });
    // Bind the event listeners for the canvas
    var canvasContainer = document.getElementById('canvas-container');
    canvasContainer.addEventListener('drop', handleDrop, false);
// } else {
//     // Replace with a fallback to a library solution.
//     alert("This browser doesn't support the HTML5 Drag and Drop API.");
// }
