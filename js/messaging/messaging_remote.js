window.onbeforeunload = function(evt) {
	parent.Robot.iFrameIsLoading = true;
	console.log("parent.Robot.iFrameIsLoading: " + parent.Robot.iFrameIsLoading);
};
