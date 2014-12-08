window.onbeforeunload = function(evt) {
	if (parent) {
		if (parent.Robot.iFrameIsLoading !== undefined) {
			parent.Robot.iFrameIsLoading = true;
			console.log("parent.Robot.iFrameIsLoading: " + parent.Robot.iFrameIsLoading);
		} else {
			window.alert("Can't find parent.Robot.iFrameIsLoading object!", "ERROR");
		}
	} else {
		window.alert("Can't find parent object from iframe!", "ERROR");
	}
};
