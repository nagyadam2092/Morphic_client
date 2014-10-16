var Settings = (function() {
	var iframeId = "#testIFrame";

	return {
		iframeId : iframeId
	};
})();

var Robot = (function() {
	//Singleton
	var instance = null;
	var urlPrefix = "http://localhost:8080/robot?";

	//ACTIONS
	function click(callbackArray) {
		$.post(urlPrefix + 'click=true', function(response) {
			console.log(response);
			if (response == "click.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function mouseMoveSimple(x, y, callbackArray) {
		$.post(urlPrefix + 'mouseMoveSimple={"x":' + x + ',"y":' + y + '}', function(response) {
			console.log(response);
			if (response == "mouseMoveSimple.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function mouseMove(x, y, callbackArray) {
		$.post(urlPrefix + 'mouseMove={"x":' + x + ',"y":' + y + '}', function(response) {
			console.log(response);
			if (response == "mouseMove.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function pressAt(x, y, callbackArray) {
		$.post(urlPrefix + 'pressAt={"x":' + x + ',"y":' + y + '}', function(response) {
			console.log(response);
			if (response == "pressAt.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function type(text, callbackArray) {
		$.post(urlPrefix + 'type=' + text, function(response) {
			console.log(response);
			if (response == "type.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function dragDrop(x1, y1, x2, y2, callbackArray) {
		$.post(urlPrefix + 'dragDrop={"x1":' + x1 + ',"y1":' + y1 + ',"x2":' + x2 + ',"y2":' + y2 + '}', function(response) {
			console.log(response);
			if (response == "dragDrop.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	//ACTIONS

	function callbackHandler(callbackArray) {
		//debugger;
		if ($.isArray(callbackArray) && callbackArray[0]) {
			switch(callbackArray[0].action) {
			case "click":
				click(callbackArray[0].x, callbackArray[0].y, callbackArray);
				break;
			case "mouseMoveSimple":
				mouseMoveSimple(callbackArray[0].x, callbackArray[0].y, callbackArray);
				break;
			case "mouseMove":
				mouseMove(callbackArray[0].x, callbackArray[0].y, callbackArray);
				break;
			case "pressAt":
				pressAt(callbackArray[0].x, callbackArray[0].y, callbackArray);
				break;
			case "type":
				type(callbackArray[0].text, callbackArray);
				break;
			case "dragDrop":
				dragDrop(callbackArray[0].x1, callbackArray[0].y1, callbackArray[0].x2, callbackArray[0].y2, callbackArray);
				break;
			}
		}
	}

	function initializeRobot() {
		function startSimpleTest() {
			console.log("Starting test...");
			startTest($("#testTextInput").val());
		}

		function startTest(JSONTestString) {
			//[{"action":"pressAt","x":150,"y":150},{"action":"type","text":"Ez egy text."},{"action":"mouseMove","x":500,"y":500},{"action":"mouseMove","x":600,"y":500},{"action":"mouseMove","x":800,"y":0},{"action":"mouseMove","x":0,"y":0},{"action":"dragDrop","x1":150,"y1":250,"x2":150,"y2":150}]
			$(document.body).scrollTop(0);
			var JSONTestObject = JSON.parse(JSONTestString);
			console.log(JSONTestObject);
			callbackHandler(transformRobotStringToServerString(JSONTestObject));
		}

		function transformSerializationToRobotString(serializedString) {
			//[{"action":"pressAt","x":20,"y":240},{"action":"type","text":"This is a text."},
			//{"action":"mouseMove","x":500,"y":500},{"action":"mouseMove","x":600,"y":500},
			//{"action":"mouseMove","x":800,"y":0},{"action":"mouseMove","x":0,"y":0},
			//{"action":"dragDrop","x1":150,"y1":250,"x2":150,"y2":150}]

			//--------

			//[{"id":"Ncc236b6","serializationType":"TypeMorph","label.text":"type: ez itt egy text","bounds.origin.x":117,"bounds.origin.y":114,"getText()":"ez itt egy text"},
			//{"id":"Y4a2adcc","serializationType":"DragDropMorph","label.text":"dragDrop:\nx1: 10, y1: 20, x2: 100,y2: 200","bounds.origin.x":408,"bounds.origin.y":107,"getX1()":10,"getY1()":20,"getX2()":100,"getY2()":200},
			//{"id":"M0619b5e","serializationType":"BPM_EventMorph","type":"start","bounds.origin.x":50,"bounds.origin.y":50},
			//{"id":"Sc7fdaa4","serializationType":"MouseMoveMorph","label.text":"mouseMove\nx:30 ,y:40","bounds.origin.x":121,"bounds.origin.y":18,"getY()":40,"getX()":30},
			//{"id":"F0a367c5","serializationType":"PressAtMorph","label.text":"pressAt\nid: #middleButton","bounds.origin.x":429,"bounds.origin.y":8,"getTargetId()":"#middleButton"},
			//{"id":"U60765ae","serializationType":"BPM_SequenceFlowMorph","source":"M0619b5e","target":"Sc7fdaa4"},
			//{"id":"Xfe37619","serializationType":"BPM_SequenceFlowMorph","source":"Sc7fdaa4","target":"F0a367c5"},
			//{"id":"T735d2ce","serializationType":"BPM_SequenceFlowMorph","source":"F0a367c5","target":"Ncc236b6"},
			//{"id":"C93e9fd2","serializationType":"BPM_SequenceFlowMorph","source":"Ncc236b6","target":"Y4a2adcc"}]
			serializedString = serializedString.replace("\n", "");
			var serializedObject = JSON.parse(serializedString);
			console.log(serializedObject);
			var robotObjectArray = [];
			var start;
			//find start morph
			serializedObject.map(function(step) {
				if (step.serializationType == "BPM_EventMorph" && step.type == "start") {
					start = step;
				}
			});
			if (start) {
				putInRobotArrayRecursively(serializedObject, start.id);
				return JSON.stringify(robotObjectArray);
			} else {
				return "couldn't find start morph";
			}

			function putInRobotArrayRecursively(serArray, id) {
				serArray.map(function(elem) {
					var next = findStepById(serArray, elem.target);
					//debugger;
					var robotElem = {};
					if (elem.serializationType == "BPM_SequenceFlowMorph" && elem.source == id) {
						switch(next.serializationType) {
						case "MouseMoveMorph":
							robotElem.action = "mouseMove";
							robotElem.x = next.x;
							robotElem.y = next.y;
							break;
						case "MouseMoveAtMorph":
							robotElem.action = "mouseMoveAt";
							robotElem.css = next.css;
							break;
						case "PressAtMorph":
							robotElem.action = "pressAt";
							robotElem.css = next.css;
							break;
						case "TypeMorph":
							robotElem.action = "type";
							robotElem.text = next.text;
							break;
						case "DragDropMorph":
							robotElem.action = "dragDrop";
							robotElem.x1 = next.x1;
							robotElem.x2 = next.x2;
							robotElem.y1 = next.y1;
							robotElem.y2 = next.y2;
							break;
						}
						if (!$.isEmptyObject(robotElem)) {
							robotObjectArray.push(robotElem);
							console.log(robotObjectArray);
						}
						putInRobotArrayRecursively(serArray, elem.target);
						return;
					} else if (elem.serializationType == "BPM_EventMorph" && elem.type == "stop") {
						return;
					} else {

					}
				});
			}

			function findStepById(serArray, id) {
				var next;
				serArray.map(function(elem) {
					if (elem.id == id) {
						next = elem;
						return elem;
					}
				});
				return next;
			}

		}

		//transform it to for example x,y coorinates from id
		function transformRobotStringToServerString(serializedObject) {
			var iBody = $(Settings.iframeId).contents();
			var newRobotArray = [];
			serializedObject.map(function(step) {
				var robotElem = {};
				robotElem.action = step.action;
				switch(step.action) {
				case "pressAt":
					var tempIBody = iBody;
					if((step.action == "pressAt" || step.action == "mouseMove") && step.css.indexOf("body") != 0){
						tempIBody = iBody.find("body");
					}
					var pos = tempIBody.find(step.css).position();
					//debugger;
					robotElem.x = pos.left + 10;
					robotElem.y = pos.top + 10;
					break;
				case "mouseMoveAt":
					var tempIBody = iBody;
					//trick
					step.action = "mouseMove";
					robotElem.action = step.action;
					if((step.action == "pressAt" || step.action == "mouseMove") && step.css.indexOf("body") != 0){
						tempIBody = iBody.find("body");
					}
					var pos = tempIBody.find(step.css).position();
					//debugger;
					robotElem.x = pos.left + 10;
					robotElem.y = pos.top + 10;
					break;
				default:
					//deep cloning
					robotElem = $.extend(true, {}, step);
					break;
				}
				newRobotArray.push(robotElem);
			});
			console.log(newRobotArray);
			return newRobotArray;
		}

		return {
			startSimpleTest : startSimpleTest,
			startTest : startTest,
			transformSerializationToRobotString : transformSerializationToRobotString
		};
	}

	function getInstance() {
		if (!instance) {
			instance = new initializeRobot();
		}
		return instance;
	}

	return {
		getInstance : getInstance
	};
})();

$(document).ready(function() {
	$("#simpleTest").click(function() {
		simpleTest();
	});
	$("#deserializeButton").click(function() {
		world1.children[0].children.map(function(morph) {
			delete morph.id;
		});
		var robotJSONString;
		var serializedString = BPMModule.BPMDeserialization();
		var robot = Robot.getInstance();
		robotJSONString = robot.transformSerializationToRobotString(serializedString);
		console.log("robotJSONString: " + robotJSONString);

		////
		robot.startTest(robotJSONString);
		////

	});
});

function simpleTest() {
	/*var frame = world1.children[0];
	 var start = world1.children[0].children[0];
	 var mouseMorph = new MouseMoveMorph(30, 40);
	 mouseMorph.setPosition(new Point(140, 10));
	 world1.children[0].add(mouseMorph);
	 mouseMorph.layoutChanged();
	 var pressAtMorph = new PressAtMorph("#middleButton");
	 pressAtMorph.setPosition(new Point(340, 10));
	 world1.children[0].add(pressAtMorph);
	 pressAtMorph.fixLayout();
	 var typeMorph = new TypeMorph("ez itt egy text");
	 typeMorph.setPosition(new Point(140, 140));
	 world1.children[0].add(typeMorph);
	 typeMorph.fixLayout();
	 var dragDropMorph = new DragDropMorph(10, 20, 100, 200);
	 dragDropMorph.setPosition(new Point(340, 140));
	 world1.children[0].add(dragDropMorph);
	 dragDropMorph.fixLayout();
	 var stop = new BPM_EventMorph('stop');
	 stop.setPosition(new Point(600, 140));
	 frame.add(stop);
	 var flow1 = new BPM_SequenceFlowMorph(start, mouseMorph);
	 mouseMorph.inbound.push(flow1);
	 start.outbound = flow1;
	 frame.add(flow1);
	 flow1.fixLayout();
	 var flow2 = new BPM_SequenceFlowMorph(mouseMorph, pressAtMorph);
	 pressAtMorph.inbound.push(flow2);
	 mouseMorph.outbound = flow2;
	 frame.add(flow2);
	 flow2.fixLayout();
	 var flow3 = new BPM_SequenceFlowMorph(pressAtMorph, typeMorph);
	 typeMorph.inbound.push(flow3);
	 pressAtMorph.outbound = flow3;
	 frame.add(flow3);
	 flow3.fixLayout();
	 var flow4 = new BPM_SequenceFlowMorph(typeMorph, dragDropMorph);
	 dragDropMorph.inbound.push(flow4);
	 typeMorph.outbound = flow4;
	 frame.add(flow4);
	 flow4.fixLayout();
	 var flow5 = new BPM_SequenceFlowMorph(dragDropMorph, stop);
	 stop.inbound.push(flow5);
	 dragDropMorph.outbound = flow5;
	 frame.add(flow5);
	 flow5.fixLayout();
	 */
	var frame = world1.children[0];
	var start = world1.children[0].children[0];
	var mouseMorph = new MouseMoveMorph(300, 400);
	mouseMorph.setPosition(new Point(140, 30));
	world1.children[0].add(mouseMorph);
	mouseMorph.layoutChanged();
	var typeMorph = new TypeMorph("ez itt egy text");
	typeMorph.setPosition(new Point(140, 140));
	world1.children[0].add(typeMorph);
	typeMorph.fixLayout();
	var dragDropMorph = new DragDropMorph(10, 20, 100, 200);
	dragDropMorph.setPosition(new Point(340, 140));
	world1.children[0].add(dragDropMorph);
	dragDropMorph.fixLayout();
	var stop = new BPM_EventMorph('stop');
	stop.setPosition(new Point(600, 140));
	frame.add(stop);
	var flow1 = new BPM_SequenceFlowMorph(start, mouseMorph);
	mouseMorph.inbound.push(flow1);
	start.outbound = flow1;
	frame.add(flow1);
	flow1.fixLayout();
	var flow2 = new BPM_SequenceFlowMorph(mouseMorph, typeMorph);
	typeMorph.inbound.push(flow2);
	mouseMorph.outbound = flow2;
	frame.add(flow2);
	flow2.fixLayout();
	var flow4 = new BPM_SequenceFlowMorph(typeMorph, dragDropMorph);
	dragDropMorph.inbound.push(flow4);
	typeMorph.outbound = flow4;
	frame.add(flow4);
	flow4.fixLayout();
	var flow5 = new BPM_SequenceFlowMorph(dragDropMorph, stop);
	stop.inbound.push(flow5);
	dragDropMorph.outbound = flow5;
	frame.add(flow5);
	flow5.fixLayout();
}
