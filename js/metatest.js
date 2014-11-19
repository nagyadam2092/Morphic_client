$(document).ready(function() {
	var MetaTest = function() {
		var isOn = false;
		var accArray = [];
		var distanceBorder = 100;
		$("#metaButton").click(function() {
			if (isOn) {
				isOn = false;
				$("#metaButton").css("border-color", "#ffffff");
				$(document).unbind("mousemove");
				$(document).unbind("click");
				$(document).unbind("keyup");
				var saveTo = $("#metaTestNameSave").val();
				localStorage.setItem(saveTo, JSON.stringify(accArray));
			} else {
				isOn = true;
				$("#metaButton").css("border-color", "#ff0000");
				$(document).mousemove(function(event) {
					var mouseMove = {};
					if (accArray.length > 0 && accArray[accArray.length - 1].type == "mouseMove") {
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
				$(document).keyup(function(event) {
					//érdekesség: ha karakterenként veszem be az értékeket, összecsúsznak a karakterek a kliens-szerver közti kommunikációs idők miatt.
					if (accArray.length > 1 && accArray[accArray.length - 1].type == "type") {
						accArray[accArray.length - 1].character += String.fromCharCode(event.keyCode);
					} else {
						var type = {};
						type.type = "type";
						type.character = String.fromCharCode(event.keyCode);
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
							$.post(Robot.urlPrefix + 'type=' + elem.character, function(response) {
								console.log(response);
								arr.shift();
								recCall(arr);
							});
						}
					}
				}

			} else {
				alert("Coudn't find '" + $metaTestNameLoad + "' named localStorage element");
			}
		});
	}();
});
