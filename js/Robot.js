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
	//for iframe loading
	var accCallbackArray = [];
	var tempCallbackArray = [];
	var iFrameIsLoading = false;
	var errorArray = [];

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

	function mouseMoveAt(css, callbackArray) {
		var iBody = $(Settings.iframeId).contents();
		var tempIBody = iBody;
		if (css.indexOf("body") != 0) {
			tempIBody = iBody.find("body");
		}
		var pos = getCenterPosOfElement(tempIBody.find(css));
		if (!pos) {
			var errorObj = {};
			errorObj.type = "mouseMoveAt";
			errorObj.css = css;
			errorObj.text = "Can't find the following css for mouseMoveAt: " + css;
			errorArray.push(errorObj);
			callbackArray.shift();
			callbackHandler(callbackArray);
			return;
		}
		//debugger;
		var x = pos.left;
		var y = pos.top;
		$.post(urlPrefix + 'mouseMove={"x":' + x + ',"y":' + y + '}', function(response) {
			console.log(response);
			if (response == "mouseMove.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function pressAt(css, callbackArray) {
		var iBody = $(Settings.iframeId).contents();
		var tempIBody = iBody;
		if (css.indexOf("body") != 0) {
			tempIBody = iBody.find("body");
		}
		var pos = getCenterPosOfElement(tempIBody.find(css));
		if (!pos) {
			var errorObj = {};
			errorObj.type = "mouseMoveAt";
			errorObj.css = css;
			errorObj.text = "Can't find the following css for pressAt: " + css;
			errorArray.push(errorObj);
			callbackArray.shift();
			callbackHandler(callbackArray);
			return;
		}
		//debugger;
		var x = pos.left;
		var y = pos.top;
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

	function dragDrop(cssFrom, cssTo, callbackArray) {
		var iBody = $(Settings.iframeId).contents();
		var tempIBody = iBody;
		if (cssFrom.indexOf("body") != 0 || cssTo.indexOf("body")) {
			tempIBody = iBody.find("body");
		}
		var pos = getCenterPosOfElement(tempIBody.find(cssFrom));
		if (!pos) {
			var errorObj = {};
			errorObj.type = "mouseMoveAt";
			errorObj.css = cssFrom;
			errorObj.text = "Can't find the following css for dragDrop from: " + cssFrom;
			errorArray.push(errorObj);
			callbackArray.shift();
			callbackHandler(callbackArray);
			return;
		}
		//debugger;
		var x1 = pos.left;
		var y1 = pos.top;
		pos = getCenterPosOfElement(tempIBody.find(cssTo));
		if (!pos) {
			var errorObj = {};
			errorObj.type = "dragDrop";
			errorObj.css = cssTo;
			errorObj.text = "Can't find the following css for dragDrop to: " + cssTo;
			errorArray.push(errorObj);
			callbackArray.shift();
			callbackHandler(callbackArray);
			return;
		}
		var x2 = pos.left;
		var y2 = pos.top;
		$.post(urlPrefix + 'dragDrop={"x1":' + x1 + ',"y1":' + y1 + ',"x2":' + x2 + ',"y2":' + y2 + '}', function(response) {
			console.log(response);
			if (response == "dragDrop.OK") {
				callbackArray.shift();
				callbackHandler(callbackArray);
			}
		});
	}

	function RGMHandler(callbackArray) {
		//if the condition is true, delete all the elements in the array in the false branch
		var RGMNextElem = callbackArray[0];
		//to evaluate inside the iframe
		//slice to get just the id (not the # too)
		var iframeWindow = document.getElementById(Settings.iframeId.slice(1)).contentWindow;
		if (iframeWindow.eval(RGMNextElem.condition)) {
			for (var i = callbackArray.length; i >= 0; i -= 1) {
				if (callbackArray[i] && callbackArray[i].RGMArray && callbackArray[i].RGMArray instanceof Array && callbackArray[i].RGMArray.length > 0) {
					for (var j = callbackArray[i].RGMArray.length; j >= 0; j -= 1) {
						//csak itt van kulonbseg
						if (callbackArray && callbackArray[i] && callbackArray[i].RGMArray[j] && !callbackArray[i].RGMArray[j].RGMIsTrue && callbackArray[i].RGMArray[j].RGMID == RGMNextElem.id) {
							callbackArray.splice(i, 1);
							/*deleteElementFromArray(i);
							i--;*/
							//debugger;
						}
					}
				}
			}
		} else {
			for (var i = callbackArray.length; i >= 0; i -= 1) {
				if (callbackArray[i] && callbackArray[i].RGMArray && callbackArray[i].RGMArray instanceof Array && callbackArray[i].RGMArray.length > 0) {
					for (var j = callbackArray[i].RGMArray.length; j >= 0; j -= 1) {
						//csak itt van kulonbseg
						if (callbackArray && callbackArray[i] && callbackArray[i].RGMArray[j] && callbackArray[i].RGMArray[j].RGMIsTrue && callbackArray[i].RGMArray[j].RGMID == RGMNextElem.id) {
							callbackArray.splice(i, 1);
							/*deleteElementFromArray(i);
							i--;*/
							//debugger;
						}
					}
				}
			}
		}
		callbackArray.shift();
		accCallbackArray = callbackArray;
		callbackHandler(callbackArray, true);

		function deleteElementFromArray(from, to) {
			var rest = callbackArray.slice((to || from) + 1 || callbackArray.length);
			callbackArray.length = from < 0 ? callbackArray.length + from : from;
			return callbackArray.push.apply(callbackArray, rest);
		}

	}

	//ACTIONS

	function callbackHandler(callbackArray, pageChange) {
		if (Robot.iFrameIsLoading && !pageChange) {
			//debugger;
			//tempAccCallbackArray = callbackArray.slice(0);
			Robot.accCallbackArray = callbackArray.slice(0);
			return;
		}
		try {
			$(Settings.iframeId).contents();
		} catch (error) {
			//cross-browser incompatibility
			if (error.name == "SecurityError" && error.code == 18) {
				callbackArray.length = 0;
				alert("Cross-browser incompatibility: the page you want to test doesn't allow to get information outside from the page itself!");
			}
		}
		if (callbackArray.length === 0) {
			testEnded();
		}
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
			case "mouseMoveAt":
				mouseMoveAt(callbackArray[0].css, callbackArray);
				break;
			case "pressAt":
				pressAt(callbackArray[0].css, callbackArray);
				break;
			case "type":
				type(callbackArray[0].text, callbackArray);
				break;
			case "dragDrop":
				dragDrop(callbackArray[0].cssFrom, callbackArray[0].cssTo, callbackArray);
				break;
			case "RGM":
				RGMHandler(callbackArray);
				break;
			}
		}
	}

	function testEnded() {
		var endString = "Test ended!";
		console.log("Test ended!");
		if (errorArray.length > 0) {
			errorArray.map(function(errorObj) {
				console.log(errorObj.text);
				endString += "\n" + errorObj.text;
			});
			console.log(errorArray);
		}
		alert(endString);
	}

	function initializeRobot() {
		function startSimpleTest() {
			console.log("Starting test...");
			startTest($("#testTextInput").val());
		}

		function startTest(JSONTestString) {
			//[{"action":"pressAt","x":150,"y":150},{"action":"type","text":"Ez egy text."},{"action":"mouseMove","x":500,"y":500},{"action":"mouseMove","x":600,"y":500},{"action":"mouseMove","x":800,"y":0},{"action":"mouseMove","x":0,"y":0},{"action":"dragDrop","x1":150,"y1":250,"x2":150,"y2":150}]
			prepareProperties();
			$(document.body).scrollTop(0);
			var JSONTestObject = JSON.parse(JSONTestString);
			console.log(JSONTestObject);
			var serverJSONArray = transformRobotStringToServerString(JSONTestObject);
			console.log(serverJSONArray);
			//debugger;
			callbackHandler(serverJSONArray);
		}

		function prepareProperties() {
			accCallbackArray.length = 0;
			tempCallbackArray.length = 0;
			errorArray.length = 0;
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
			
			console.log("SERIALIZEDSTRING: ");
			console.log(serializedString);
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
				console.log(robotObjectArray);
				console.log("ROBOTSTRING: ");
				console.log(JSON.stringify(robotObjectArray));
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
							robotElem.RGMArray = next.RGMArray;
							break;
						case "MouseMoveAtMorph":
							robotElem.action = "mouseMoveAt";
							robotElem.css = next.css;
							robotElem.RGMArray = next.RGMArray;
							break;
						case "PressAtMorph":
							robotElem.action = "pressAt";
							robotElem.css = next.css;
							robotElem.RGMArray = next.RGMArray;
							break;
						case "TypeMorph":
							robotElem.action = "type";
							robotElem.text = next.text;
							robotElem.RGMArray = next.RGMArray;
							break;
						case "DragDropMorph":
							robotElem.action = "dragDrop";
							robotElem.from = next.from;
							robotElem.to = next.to;
							robotElem.RGMArray = next.RGMArray;
							break;
						case "RobotGateWayMorph":
							robotElem.action = "RGM";
							robotElem.id = next.id;
							robotElem.condition = next["label.text"];
							break;
						}
						if (!$.isEmptyObject(robotElem)) {
							robotObjectArray.push(robotElem);
							//console.log(robotObjectArray);
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
			//var iBody = $(Settings.iframeId).contents();
			var newRobotArray = [];
			serializedObject.map(function(step) {
				var robotElem = {};
				robotElem.action = step.action;
				switch(step.action) {
				case "pressAt":
					/*var tempIBody = iBody;
					 if ((step.action == "pressAt" || step.action == "mouseMove") && step.css.indexOf("body") != 0) {
					 tempIBody = iBody.find("body");
					 }
					 var pos = getCenterPosOfElement(tempIBody.find(step.css));
					 robotElem.x = pos.left;
					 robotElem.y = pos.top;*/
					robotElem.css = step.css;
					robotElem.RGMArray = step.RGMArray;
					break;
				case "mouseMoveAt":
					/*var tempIBody = iBody;
					 //trick
					 step.action = "mouseMove";
					 robotElem.action = step.action;
					 if ((step.action == "pressAt" || step.action == "mouseMove") && step.css.indexOf("body") != 0) {
					 tempIBody = iBody.find("body");
					 }
					 var pos = getCenterPosOfElement(tempIBody.find(step.css));
					 //debugger;
					 robotElem.x = pos.left;
					 robotElem.y = pos.top;*/
					robotElem.action = "mouseMoveAt";
					robotElem.css = step.css;
					robotElem.RGMArray = step.RGMArray;
					break;
				case "dragDrop":
					robotElem.action = step.action;
					robotElem.cssFrom = step.from;
					robotElem.cssTo = step.to;
					robotElem.RGMArray = step.RGMArray;
					break;
				default:
					//deep cloning
					robotElem = $.extend(true, {}, step);
					break;
				}
				newRobotArray.push(robotElem);
			});
			return newRobotArray;
		}

		return {
			startSimpleTest : startSimpleTest,
			startTest : startTest,
			transformSerializationToRobotString : transformSerializationToRobotString
		};
	}

	function getCenterPosOfElement(elem) {
		var retVal = {};
		var pos = elem.position();
		var width = elem.width();
		var height = elem.height();
		if (!pos) {
			return false;
		}
		retVal.left = pos.left + width / 2;
		retVal.top = pos.top + height / 2;
		return retVal;
	}

	function getInstance() {
		if (!instance) {
			instance = new initializeRobot();
		}
		return instance;
	}

	return {
		getInstance : getInstance,
		tempCallbackArray : tempCallbackArray,
		iFrameIsLoading : iFrameIsLoading,
		accCallbackArray : accCallbackArray,
		callbackHandler : callbackHandler,
		errorArray : errorArray,
		urlPrefix : urlPrefix
	};
})();

$(document).ready(function() {
	$("#startTestBtn").click(function() {
		//BPMModule.prepareWorld(world1);
		var robotJSONString;
		var serializedString = BPMModule.BPMDeserialization();
		console.log("serializedString");
		console.log(serializedString);
		var robot = Robot.getInstance();
		robotJSONString = robot.transformSerializationToRobotString(serializedString);
		console.log("robotJSONString: " + robotJSONString);

		////
		robot.startTest(robotJSONString);
		////

	});

	$("#deserializeButton").click(function() {
		deserialize($("#deserializeTextArea").val(), world1, BPMModule.serializationModel);
	});

	//detect if the iframe is loading:
	//document.getElementById("testIFrame").onbeforeunload = iFrameNavigating;
	//document.getElementById("testIFrame").onbeforeupdate = iFrameNavigating;
	//document.getElementById("testIFrame").onload = iFrameNavigating;

	/*document.getElementById("testIFrame").addEventListener("unload", function() {
	 iFrameNavigating();
	 });*/

	/*function iFrameNavigating() {
	 Robot.iFrameIsLoading = true;
	 console.log("Robot.iFrameIsLoading: " + Robot.iFrameIsLoading);
	 };*/

	$("#testIFrame").load(function() {
		if (Robot.iFrameIsLoading) {
			if (Robot.accCallbackArray.length > 0) {
				Robot.callbackHandler(Robot.accCallbackArray, true);
			}
		} else if(Robot.accCallbackArray.length > 0){
			Robot.callbackHandler(Robot.accCallbackArray);
		}
		Robot.iFrameIsLoading = false;
		console.log("Robot.iFrameIsLoading: " + Robot.iFrameIsLoading);
	});

	$("#iFrameChangeSrcBtn").click(function() {
		$("#testIFrame").attr('src', $("#iFrameChangeSrcInput").val());
	});

	//I hate that popup when I want to navigate from the page. So I override it.

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
