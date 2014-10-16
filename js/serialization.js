var world1;

var BPMModule = (function () {
    //id-s and their references
    var serializedIDs = {};
    //final serialized object
    var acc = [];
    //the model for serialization
    var serializationModel = {
        "BPM_EventMorph": ["type", "bounds.origin.x", "bounds.origin.y"],
        "BPM_SequenceFlowMorph": ["source", "target"],
        "BPM_TaskMorph": ["label.text", "bounds.origin.x", "bounds.origin.y"],
        "MouseMoveAtMorph": ["label.text", "bounds.origin.x", "bounds.origin.y", "css"],
        "MouseMoveMorph": ["label.text", "bounds.origin.x", "bounds.origin.y", "y","x"],
        "PressAtMorph": [/*"label.text",*/ "bounds.origin.x", "bounds.origin.y","css"],
        "TypeMorph": ["label.text", "bounds.origin.x", "bounds.origin.y","text"],
        "DragDropMorph": [/*"label.text", */"bounds.origin.x", "bounds.origin.y","x1","y1","x2","y2"],
        "BPM_GatewayMorph": ["label.text", "bounds.origin.x", "bounds.origin.y"]
    };

    var serializedString;

    function BPMDeserialization() {
        traverse(world1, serialize, acc, serializedIDs, serializationModel);
        console.log(acc);
        console.log(acc.length);
        serializedString = JSON.stringify(acc);
        document.getElementById("console").innerHTML = "";
        document.getElementById("console").innerHTML = serializedString;
        console.log(serializedString);
        //deserialize(serializedString, world2, serializationModel);
        return serializedString;
    }
    return {
        BPMDeserialization: BPMDeserialization
    };
}());
window.onload = function () {
    initialize();
};

function loop() {
    world1.doOneCycle();
}

function traverse(element, serializationFunction, acc, serializedIDs, serializationModel) {

    serializationFunction(element, acc, serializedIDs, serializationModel);

}

function serialize(element, acc, serializedIDs, serializationModel) {
    if (element instanceof Morph) {
        for (var prop in element) {
            if (element[prop] instanceof Morph) {
                if (elementProcessing(element[prop], acc, serializedIDs, serializationModel)) {
                    return;
                }
            } else if (element[prop] instanceof Array) {
                element[prop].map(function (arrayElement) {
                    if (arrayElement instanceof Morph) {
                        if (elementProcessing(arrayElement, acc, serializedIDs, serializationModel)) {
                            return;
                        }
                    }
                });
            }

        }
    }
}

function elementProcessing(element, acc, serializedIDs, serializationModel) {
    if(element.constructor.name === "BPM_SequenceFlowMorph" && acc.length === 0){
        return;
    }
    if (element.id === undefined && serializationModel.hasOwnProperty(element.constructor.name)) {
        //a Morph which is interesting for us, and not yet traversed
        var serializing = {};
        element.id = createLUID();
        serializing["id"] = element.id;
        serializing["serializationType"] = element.constructor.name;
        for (var p in serializationModel) {
            if (p === element.constructor.name) {
                serializationModel[p].map(function (aE) { 
                    if (aE === "source" || aE === "target") {
                        eval("serializing['" + aE + "']" + "=element." + aE + ".id;");
                    } else {
                        eval("serializing['" + aE + "']" + "=element." + aE + ";");
                    }
                });
            }
        }
        serializedIDs[element.id] = element;
        acc.push(serializing);
        return true;
    } else if (element.id !== undefined && serializationModel.hasOwnProperty(element.constructor.name)) {
        //a Morph which is interesting for us, and traversed already
        return true;
    } else if (element.id === undefined && !(serializationModel.hasOwnProperty(element.constructor.name))) {
        //a Morph which is NOT interesting for us, and not yet traversed
        element.id = createLUID();
        traverse(element, serialize, acc, serializedIDs, serializationModel);
        return false;
    } else if (element.id !== undefined && !(serializationModel.hasOwnProperty(element.constructor.name))) {
        //a Morph which is NOT interesting for us, and traversed already
        return false;
    }
}

var initialize = function () {
    var frame1, frame2, start;
    world1 = new WorldMorph(document.getElementById('world1'), false);
    frame1 = new FrameMorph();
    frame1.color = new Color(141, 205, 193);
    //frame.texture = 'bg.png';
    frame1.setExtent(world1.extent());
    frame1.reactToWorldResize = function (rect) {
        frame1.changed();
        frame1.bounds = rect;
        frame1.drawNew();
        frame1.changed();
    };

    world1.add(frame1);

    //initExampleBPM(frame1);
    start = new BPM_EventMorph('start');
    start.setPosition(new Point(50, 50));
    frame1.add(start);

    // world.isDevMode = true;
    setInterval(loop, 50);

};

function initExampleBPM(frame) {
    var start, task1, task2, flow1, flow2, gateway1, flow3, task3, flow4, task4, flow5, stop, flow6, flow7;

    start = new BPM_EventMorph('start');
    start.setPosition(new Point(50, 50));
    frame.add(start);

    task1 = new BPM_TaskMorph('Task1');
    task1.setPosition(new Point(150, 50));
    frame.add(task1);

    flow1 = new BPM_SequenceFlowMorph(start, task1);
    task1.inbound.push(flow1);
    start.outbound = flow1;
    frame.add(flow1);

    task2 = new BPM_TaskMorph('Task2');
    task2.setPosition(new Point(250, 50));
    frame.add(task2);

    flow2 = new BPM_SequenceFlowMorph(task1, task2);
    task2.inbound.push(flow2);
    task1.outbound = flow2;
    frame.add(flow2);

    gateway1 = new BPM_GatewayMorph();
    gateway1.setPosition(new Point(414, 33));
    frame.add(gateway1);

    flow3 = new BPM_SequenceFlowMorph(task2, gateway1);
    gateway1.inbound.push(flow3);
    task2.outbound = flow3;
    frame.add(flow3);

    task3 = new BPM_TaskMorph('Task3');
    task3.setPosition(new Point(550, 50));
    frame.add(task3);

    flow4 = new BPM_SequenceFlowMorph(gateway1, task3);
    task3.inbound.push(flow4);
    gateway1.outbound = flow4;
    frame.add(flow4);

    task4 = new BPM_TaskMorph('Task4');
    task4.setPosition(new Point(550, 150));
    frame.add(task4);

    flow5 = new BPM_SequenceFlowMorph(gateway1, task4);
    task4.inbound.push(flow5);
    gateway1.fork = flow5;
    frame.add(flow5);

    stop = new BPM_EventMorph('stop');
    stop.setPosition(new Point(650, 100));
    frame.add(stop);

    flow6 = new BPM_SequenceFlowMorph(task3, stop);
    task3.outbound = flow6;
    stop.inbound.push(flow6);
    frame.add(flow6);

    flow7 = new BPM_SequenceFlowMorph(task4, stop);
    task4.outbound = flow7;
    stop.inbound.push(flow7);
    frame.add(flow7);
}

function createLUID() {
    return createUUID().substring(0, 8);
}

function createUUID() {
    return getRandomAlpha() + b(0);
}

function getRandomAlpha() {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return a[Math.round((Math.random() * 25))];

}

//https://gist.github.com/982883
function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
}

//////////////////////////////////DESERIALIZATION//////////////////////////////////

var deserialize = function (serializedString, world, serializationModel, alreadyDeserializedMrophs) {
    var deserializedObject = JSON.parse(serializedString);

    deserializedObject.map(function (elem) {
        if (elem.id) {
            if (elem.serializationType === "BPM_SequenceFlowMorph") {
                desSeqFlowMorph(elem, world, deserializedObject, serializationModel);
            }
        }
    });
    //Without this section, the sequence_flow_morphs would not be in the good position
    //TODO and still isn't when dragging target
    world.children[0].children.map(function (b) {
        if (b.constructor.name === "BPM_SequenceFlowMorph") {
            b.fixLayout();
        }
    });
}

    function desSeqFlowMorph(seqFlowMorph, world, deserializedObject, serializationModel) {
        var source, srcMorph, target, tgtMorph, sourceConstructorArgument, targetConstructorArgument, frame, flowMorph;
        frame = world.children[0];
        source = getMorphById(deserializedObject, seqFlowMorph.source);
        target = getMorphById(deserializedObject, seqFlowMorph.target);
        //console.log(source);
        //console.log(target);
        if (!isIdInWorld(source.id, world2)) {
            if (source.type) {
                sourceConstructorArgument = source.type;
            } else if (source["label.text"]) {
                sourceConstructorArgument = source["label.text"];
            }
            eval('srcMorph = new ' + source.serializationType + '("' + sourceConstructorArgument + '");');
            srcMorph.id = source.id;
        } else {
            srcMorph = getMorphById(frame.children, source.id);
        }
        if (!isIdInWorld(target.id, world2)) {
            if (target.type) {
                targetConstructorArgument = target.type;
            } else if (target["label.text"]) {
                targetConstructorArgument = target["label.text"];
            }
            eval('tgtMorph = new ' + target.serializationType + '("' + targetConstructorArgument + '");');
            tgtMorph.id = target.id;
        } else {
            tgtMorph = getMorphById(frame.children, target.id);
        }
        positioningLogic(frame, srcMorph, source, tgtMorph, target);
    }

    function isIdInWorld(id, world) {
        //UGLY
        var booly = false;
        world.children[0].children.map(function (ele) {
            if (ele.id === id) {
                booly = true;
            }
        });
        return booly;
    }

    function getMorphById(collection, id) {
        var retVal;
        collection.map(function (elem) {
            if (elem.id === id) {
                retVal = elem;
            }
        });
        if (retVal === undefined) {
            return false;
        } else {
            return retVal;
        }
    }

    function positioningLogic(frame, src, srcDes, tgt, tgtDes) {
        //old version:
        //http://jsfiddle.net/Adambasszer/WTrpG/

        var flow;

        flow = new BPM_SequenceFlowMorph(src, tgt);
        src.setPosition(new Point(srcDes["bounds.origin.x"], srcDes["bounds.origin.y"]));
        src.outbound = flow;
        tgt.setPosition(new Point(tgtDes["bounds.origin.x"], tgtDes["bounds.origin.y"]));
        tgt.inbound.push(flow);
        frame.add(src);
        frame.add(tgt);
        frame.add(flow);
    }