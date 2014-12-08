$(document).ready(function() {
	var MetaTest = function() {
		var isOn = false;
		var accArray = [];
		var distanceBorder = 100;
		$("#metaButton").click(function() {
			if (isOn) {
				isOn = false;
				$("#metaButton").css("color", "#000000");
				$(document).unbind("mousemove");
				$(document).unbind("click");
				$(document).unbind("keyup");
				var saveTo = $("#metaTestNameSave").val();
				localStorage.setItem(saveTo, JSON.stringify(accArray));
			} else {
				isOn = true;
				$("#metaButton").css("color", "#ff0000");
				$(document).mousemove(function(event) {
					var mouseMove = {};
					//INTERESTING 2000 characters max approx for URL String
					//approx one element is 20 characters
					//2000 / 20 = 100
					if (accArray.length > 0 && accArray[accArray.length - 1].type == "mouseMove" && accArray[accArray.length - 1].moveArray.length < 100) {
						accArray[accArray.length - 1].moveArray.push({
							"x" : event.pageX,
							"y" : event.pageY
						});
					} else {
						mouseMove.type = "mouseMove";
						mouseMove.moveArray = [];
						mouseMove.moveArray.push({
							"x" : event.pageX,
							"y" : event.pageY
						});
						accArray.push(mouseMove);
					}
				});
				$(document).click(function(event) {
					if (accArray.length > 0 && event.target != $("#metaButton")[0] && event.target != $("#metaStartButton")[0]) {
						var click = {};
						click.type = "click";
						click.x = event.pageX;
						click.y = event.pageY;
						accArray.push(click);
						//console.log(accArray);
					}
				});
				$(document).keypress(function(event) {
					//érdekesség: ha karakterenként veszem be az értékeket, összecsúsznak a karakterek a kliens-szerver közti kommunikációs idők miatt.
					if (accArray.length > 1 && accArray[accArray.length - 1].type == "type") {
						accArray[accArray.length - 1].text += String.fromCharCode(event.keyCode);
					} else {
						var type = {};
						type.type = "type";
						type.text = String.fromCharCode(event.keyCode);
						accArray.push(type);
					}
				});
			}
		});

		function distanceIsTooBigBetweenMouseMovements(event) {
			if (accArray.length > 1) {
				var lastElement = accArray[accArray.length - 1];
				if (Math.sqrt(Math.pow(event.pageX - lastElement.x) + Math.pow(event.pageY - lastElement.y)) > 100) {
					return true;
				} else {
					return false;
				}
			}
		}


		$("#metaStartButton").click(function() {
			var $metaTestNameLoad = $("#metaTestNameLoad").val();
			if ($metaTestNameLoad == "") {
				window.alert("Warning! Empty string for demo name! (maybe you didn't fill the right input in MetaTest box?)")
			} else {
				if (localStorage.getItem($metaTestNameLoad)) {
					var localAccArray = JSON.parse(localStorage.getItem($metaTestNameLoad));

					recCall(localAccArray);

					function recCall(arr) {
						if (arr.length > 0) {
							var elem = arr[0];
							if (elem.type == "mouseMove") {
								console.log(Robot.urlPrefix + 'mouseMoveSimpleMeta=' + JSON.stringify(elem));
								$.post(Robot.urlPrefix + 'mouseMoveSimpleMeta=' + JSON.stringify(elem), function(response) {
									console.log(response);
									arr.shift();
									recCall(arr);
								});
							} else if (elem.type == "click") {
								$.post(Robot.urlPrefix + 'click=true', function(response) {
									console.log(response);
									arr.shift();
									recCall(arr);
								});
							} else if (elem.type == "type") {
								var queryString = Robot.urlPrefix + 'type=' + escape(elem.text);
								//var queryString = encodeURI(Robot.urlPrefix + 'type=' + elem.text);
								$.post(queryString, function(response) {
									console.log(response);
									arr.shift();
									recCall(arr);
								});
							}
						}
					}

				} else {
					window.alert("Couldn't find '" + $metaTestNameLoad + "' named localStorage element");
				}
			}
		});
	}();
	$("#metaDiv").draggable();
	$("#dialog").dialog({
		autoOpen : false,
		modal : true,
		show : {
			effect : "highlight",
			duration : 500
		},
		hide : {
			effect : "higlight",
			duration : 500
		},
		buttons : {
			Ok : function() {
				$(this).dialog("close");
			}
		}
	});
});
