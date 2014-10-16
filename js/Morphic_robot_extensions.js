var MouseMoveMorph;
var PressAtMorph;
var TypeMorph;
var DragDropMorph;
var MouseMoveAtMorph;

//
//MouseMoveMorph
//
//var mouseMorph = new MouseMoveMorph(30,30);mouseMorph.setPosition(new Point(100,100));world1.children[0].add(mouseMorph);mouseMorph.fixLayout();

MouseMoveMorph.prototype = new BoxMorph();
MouseMoveMorph.prototype.constructor = MouseMoveMorph;
MouseMoveMorph.uber = BoxMorph.prototype;

function MouseMoveMorph(x, y) {
	console.log(this);
	this.init(x, y);
}

MouseMoveMorph.prototype.init = function(x, y) {
	var labelText;
	this.label = null;
	this.inbound = [];
	this.outbound = null;
	this.inputs = [];
	this.outputs = [];
	if (x === undefined) {
		x = 0;
	}
	if (y === undefined) {
		y = 0;
	}
	this.setX(x);
	this.setY(y);
	labelText = "mouseMove\nx: " + x + "\ny: " + y;

	MouseMoveMorph.uber.init.call(this, 7, 1);
	this.isDraggable = true;
	this.color = new Color(179, 179, 215);
	this.borderColor = this.color.darker(70);
	this.createLabel(labelText || 'Task');
	this.fixLayout();
};

MouseMoveMorph.prototype.getX = function() {
	return this.x;
};

MouseMoveMorph.prototype.setX = function(_x) {
	this.x = _x;
};

MouseMoveMorph.prototype.getY = function() {
	return this.y;
};

MouseMoveMorph.prototype.setY = function(_y) {
	this.y = _y;
};

MouseMoveMorph.prototype.createLabel = BPM_TaskMorph.prototype.createLabel;

MouseMoveMorph.prototype.fullCopy = BPM_TaskMorph.prototype.fullCopy;

MouseMoveMorph.prototype.layoutChanged = BPM_TaskMorph.prototype.layoutChanged;

MouseMoveMorph.prototype.fixLayout = BPM_TaskMorph.prototype.fixLayout;

MouseMoveMorph.prototype.userMenu = function() {
	var menu = new MenuMorph(this);
	menu.addItem('edit label...', 'editLabel');
	menu.addItem("duplicate", function() {
		this.fullCopy().pickUp(this.world());
	}, 'make a copy\nand pick it up');
	menu.addItem("delete", 'destroy');
	menu.addLine();
	if (this.outbound === null) {
		menu.addItem('next press at', 'addPressAt');
		menu.addItem('next mouse move at', 'addMouseMoveAt');
		menu.addItem('next mouse move', 'addMouseMove');
		menu.addItem('next type', 'addType');
		menu.addLine();
		menu.addItem('connect...', 'connect');
		menu.addItem('next task...', 'addNextTask');
		menu.addItem('gateway...', 'addGateway');
		menu.addItem('parallel gateway...', 'addParallelGateway');
		menu.addItem('terminate...', 'addStopEvent');
	} else {
		menu.addItem('disconnect next', 'disconnectOutbound');
	}
	menu.addLine();
	menu.addItem('add input...', 'addInput');
	menu.addItem('add output...', 'addOutput');
	if (this.inputs.length + this.outputs.length > 0) {
		menu.addLine();
		if (this.inputs.length > 0) {
			menu.addItem('disconnect inputs', 'disconnectInputs');
		}
		if (this.outputs.length > 0) {
			menu.addItem('disconnect outputs', 'disconnectOutputs');
		}
	}
	return menu;
};

MouseMoveMorph.prototype.destroy = BPM_TaskMorph.prototype.destroy;

MouseMoveMorph.prototype.editLabel = function() {
	this.label.isEditable = true;
	this.label.alignment = 'left';
	this.label.enableSelecting();
	this.label.edit();
	//selectAll() changed

	this.label.startMark = "mouseMove\n".length;
	this.label.endMark = this.label.text.length;
	this.label.drawNew();
	this.label.changed();
};

MouseMoveMorph.prototype.connect = BPM_TaskMorph.prototype.connect;

MouseMoveMorph.prototype.addNextTask = BPM_TaskMorph.prototype.addNextTask;

MouseMoveMorph.prototype.addGateway = BPM_TaskMorph.prototype.addGateway;

MouseMoveMorph.prototype.addParallelGateway = BPM_TaskMorph.prototype.addParallelGateway;

MouseMoveMorph.prototype.addStopEvent = BPM_TaskMorph.prototype.addStopEvent;

MouseMoveMorph.prototype.addInput = BPM_TaskMorph.prototype.addInput;

MouseMoveMorph.prototype.addOutput = BPM_TaskMorph.prototype.addOutput;

MouseMoveMorph.prototype.disconnectOutbound = BPM_TaskMorph.prototype.disconnectOutbound;

MouseMoveMorph.prototype.removeInbound = BPM_TaskMorph.prototype.removeInbound;

MouseMoveMorph.prototype.disconnectInputs = BPM_TaskMorph.prototype.disconnectInputs;

MouseMoveMorph.prototype.disconnectOutputs = BPM_TaskMorph.prototype.disconnectOutputs;

MouseMoveMorph.prototype.removeInput = BPM_TaskMorph.prototype.removeInput;

MouseMoveMorph.prototype.removeOutput = BPM_TaskMorph.prototype.removeOutput;

// testing

MouseMoveMorph.prototype.isUpLoop = BPM_TaskMorph.prototype.isUpLoop;

MouseMoveMorph.prototype.isDownLoop = BPM_TaskMorph.prototype.isDownLoop;

MouseMoveMorph.prototype.isBackLoop = BPM_TaskMorph.prototype.isBackLoop;

MouseMoveMorph.prototype.isSelfLoop = BPM_TaskMorph.prototype.isSelfLoop;

MouseMoveMorph.prototype.isBelowAllInbound = BPM_TaskMorph.prototype.isBelowAllInbound;

MouseMoveMorph.prototype.isAboveAllInbound = BPM_TaskMorph.prototype.isAboveAllInbound;

// events

MouseMoveMorph.prototype.reactToEdit = function() {
	this.label.isEditable = false;
	this.label.clearSelection();
	this.label.disableSelecting();
	this.label.alignment = 'center';
	//ADAM
	if (this.label.text.indexOf("mouseMove\n") == 0) {
		this.x = this.label.text.substr(this.label.text.indexOf("x: ")+3,this.label.text.indexOf("y: ")-14);
		this.y = this.label.text.substr(this.label.text.indexOf("y: ")+3,this.label.text.length);
	} else {
		this.x = 0;
		this.y = 0;
		this.label.text = "mouseMove\nx:0\ny:0";
	}
	this.label.text = "mouseMove\nx: " + this.x + "\ny: " + this.y;
	this.label.drawNew();
	this.label.changed();
	console.log(this);
};

MouseMoveMorph.prototype.mouseEnter = BPM_TaskMorph.prototype.mouseEnter;

MouseMoveMorph.prototype.mouseLeave = BPM_TaskMorph.prototype.mouseLeave;

MouseMoveMorph.prototype.wantsDropOf = BPM_TaskMorph.prototype.wantsDropOf;

MouseMoveMorph.prototype.reactToDropOf = BPM_TaskMorph.prototype.reactToDropOf;

MouseMoveMorph.prototype.prepareToBeGrabbed = BPM_TaskMorph.prototype.prepareToBeGrabbed;

MouseMoveMorph.prototype.justDropped = BPM_TaskMorph.prototype.justDropped;

// drawing

MouseMoveMorph.prototype.drawNew = BPM_TaskMorph.prototype.drawNew;

//
//PressAtMorph
//
//var pressAtMorph = new PressAtMorph("#middleButton");pressAtMorph.setPosition(new Point(100,100));world1.children[0].add(pressAtMorph);pressAtMorph.fixLayout();

PressAtMorph.prototype = new BoxMorph();
PressAtMorph.prototype.constructor = PressAtMorph;
PressAtMorph.uber = BoxMorph.prototype;

function PressAtMorph(targetCSS) {
	this.init(targetCSS);
}

PressAtMorph.prototype.init = function(targetCSS) {
	var labelText;
	this.label = null;
	this.inbound = [];
	this.outbound = null;
	this.inputs = [];
	this.outputs = [];
	if(!targetCSS){
		targetCSS = "CSS selector here";
	}
	labelText = "press at\nCSS: " + targetCSS;
	this.css = targetCSS;

	PressAtMorph.uber.init.call(this, 7, 1);
	this.isDraggable = true;
	this.color = new Color(79, 119, 215);
	this.borderColor = this.color.darker(70);
	this.createLabel(labelText || 'Task');
	this.fixLayout();
};

PressAtMorph.prototype.createLabel = BPM_TaskMorph.prototype.createLabel;

PressAtMorph.prototype.fullCopy = BPM_TaskMorph.prototype.fullCopy;

PressAtMorph.prototype.layoutChanged = BPM_TaskMorph.prototype.layoutChanged;

PressAtMorph.prototype.fixLayout = BPM_TaskMorph.prototype.fixLayout;

PressAtMorph.prototype.userMenu = function() {
	var menu = new MenuMorph(this);
	menu.addItem('edit label...', 'editLabel');
	menu.addItem("duplicate", function() {
		this.fullCopy().pickUp(this.world());
	}, 'make a copy\nand pick it up');
	menu.addItem("delete", 'destroy');
	menu.addLine();
	if (this.outbound === null) {
		menu.addItem('next press at', 'addPressAt');
		menu.addItem('next mouse move at', 'addMouseMoveAt');
		menu.addItem('next mouse move', 'addMouseMove');
		menu.addItem('next type', 'addType');
		menu.addLine();
		menu.addItem('connect...', 'connect');
		menu.addItem('next task...', 'addNextTask');
		menu.addItem('gateway...', 'addGateway');
		menu.addItem('parallel gateway...', 'addParallelGateway');
		menu.addItem('terminate...', 'addStopEvent');
	} else {
		menu.addItem('disconnect next', 'disconnectOutbound');
	}
	menu.addLine();
	menu.addItem('add input...', 'addInput');
	menu.addItem('add output...', 'addOutput');
	if (this.inputs.length + this.outputs.length > 0) {
		menu.addLine();
		if (this.inputs.length > 0) {
			menu.addItem('disconnect inputs', 'disconnectInputs');
		}
		if (this.outputs.length > 0) {
			menu.addItem('disconnect outputs', 'disconnectOutputs');
		}
	}
	return menu;
};

PressAtMorph.prototype.destroy = BPM_TaskMorph.prototype.destroy;

PressAtMorph.prototype.editLabel = function() {
	this.label.isEditable = true;
	this.label.alignment = 'left';
	this.label.enableSelecting();
	this.label.edit();
	//selectAll() changed
	this.label.startMark = "press at\nCSS: ".length;
	this.label.endMark = this.label.text.length;
	this.label.drawNew();
	this.label.changed();
};

PressAtMorph.prototype.connect = BPM_TaskMorph.prototype.connect;

PressAtMorph.prototype.addNextTask = BPM_TaskMorph.prototype.addNextTask;

PressAtMorph.prototype.addGateway = BPM_TaskMorph.prototype.addGateway;

PressAtMorph.prototype.addParallelGateway = BPM_TaskMorph.prototype.addParallelGateway;

PressAtMorph.prototype.addStopEvent = BPM_TaskMorph.prototype.addStopEvent;

PressAtMorph.prototype.addInput = BPM_TaskMorph.prototype.addInput;

PressAtMorph.prototype.addOutput = BPM_TaskMorph.prototype.addOutput;

PressAtMorph.prototype.disconnectOutbound = BPM_TaskMorph.prototype.disconnectOutbound;

PressAtMorph.prototype.removeInbound = BPM_TaskMorph.prototype.removeInbound;

PressAtMorph.prototype.disconnectInputs = BPM_TaskMorph.prototype.disconnectInputs;

PressAtMorph.prototype.disconnectOutputs = BPM_TaskMorph.prototype.disconnectOutputs;

PressAtMorph.prototype.removeInput = BPM_TaskMorph.prototype.removeInput;

PressAtMorph.prototype.removeOutput = BPM_TaskMorph.prototype.removeOutput;

// testing

PressAtMorph.prototype.isUpLoop = BPM_TaskMorph.prototype.isUpLoop;

PressAtMorph.prototype.isDownLoop = BPM_TaskMorph.prototype.isDownLoop;

PressAtMorph.prototype.isBackLoop = BPM_TaskMorph.prototype.isBackLoop;

PressAtMorph.prototype.isSelfLoop = BPM_TaskMorph.prototype.isSelfLoop;

PressAtMorph.prototype.isBelowAllInbound = BPM_TaskMorph.prototype.isBelowAllInbound;

PressAtMorph.prototype.isAboveAllInbound = BPM_TaskMorph.prototype.isAboveAllInbound;

// events

PressAtMorph.prototype.reactToEdit = function() {
	this.label.isEditable = false;
	this.label.clearSelection();
	this.label.disableSelecting();
	this.label.alignment = 'center';
	//ADAM
	if (this.label.text.indexOf("press at\nCSS: ") == 0) {
		this.css = this.label.text.substr("press at\nCSS: ".length, this.label.text.length);
	} else {
		this.css = "";
		this.label.text = "press at\nCSS: CSS selector here";
	}
	this.label.drawNew();
	this.label.changed();
	console.log(this);
};

PressAtMorph.prototype.mouseEnter = BPM_TaskMorph.prototype.mouseEnter;

PressAtMorph.prototype.mouseLeave = BPM_TaskMorph.prototype.mouseLeave;

PressAtMorph.prototype.wantsDropOf = BPM_TaskMorph.prototype.wantsDropOf;

PressAtMorph.prototype.reactToDropOf = BPM_TaskMorph.prototype.reactToDropOf;

PressAtMorph.prototype.prepareToBeGrabbed = BPM_TaskMorph.prototype.prepareToBeGrabbed;

PressAtMorph.prototype.justDropped = BPM_TaskMorph.prototype.justDropped;

// drawing

PressAtMorph.prototype.drawNew = BPM_TaskMorph.prototype.drawNew;

//
//TypeMorph
//
//var typeMorph = new TypeMorph("ez itt egy text");typeMorph.setPosition(new Point(100,100));world1.children[0].add(typeMorph);typeMorph.fixLayout();

TypeMorph.prototype = new BoxMorph();
TypeMorph.prototype.constructor = TypeMorph;
TypeMorph.uber = BoxMorph.prototype;

function TypeMorph(text) {
	this.init(text);
}

TypeMorph.prototype.init = function(text) {
	var labelText;
	this.label = null;
	this.inbound = [];
	this.outbound = null;
	this.inputs = [];
	this.outputs = [];
	if (text !== undefined) {
		this.setText(text);
	} else {
		text = "text here";
	}
	labelText = "type: " + text;
	TypeMorph.uber.init.call(this, 7, 1);
	this.isDraggable = true;
	this.color = new Color(0, 119, 150);
	this.borderColor = this.color.darker(70);
	this.createLabel(labelText || 'Task');
	this.fixLayout();
};

TypeMorph.prototype.getText = function() {
	return this.text;
};

TypeMorph.prototype.setText = function(_text) {
	return this.text = _text;
};

TypeMorph.prototype.createLabel = BPM_TaskMorph.prototype.createLabel;

TypeMorph.prototype.fullCopy = BPM_TaskMorph.prototype.fullCopy;

TypeMorph.prototype.layoutChanged = BPM_TaskMorph.prototype.layoutChanged;

TypeMorph.prototype.fixLayout = BPM_TaskMorph.prototype.fixLayout;

TypeMorph.prototype.userMenu = function() {
	var menu = new MenuMorph(this);
	menu.addItem('edit label...', 'editLabel');
	menu.addItem("duplicate", function() {
		this.fullCopy().pickUp(this.world());
	}, 'make a copy\nand pick it up');
	menu.addItem("delete", 'destroy');
	menu.addLine();
	if (this.outbound === null) {
		menu.addItem('next press at', 'addPressAt');
		menu.addItem('next mouse move at', 'addMouseMoveAt');
		menu.addItem('next mouse move', 'addMouseMove');
		menu.addItem('next type', 'addType');
		menu.addLine();
		menu.addItem('connect...', 'connect');
		menu.addItem('next task...', 'addNextTask');
		menu.addItem('gateway...', 'addGateway');
		menu.addItem('parallel gateway...', 'addParallelGateway');
		menu.addItem('terminate...', 'addStopEvent');
	} else {
		menu.addItem('disconnect next', 'disconnectOutbound');
	}
	menu.addLine();
	menu.addItem('add input...', 'addInput');
	menu.addItem('add output...', 'addOutput');
	if (this.inputs.length + this.outputs.length > 0) {
		menu.addLine();
		if (this.inputs.length > 0) {
			menu.addItem('disconnect inputs', 'disconnectInputs');
		}
		if (this.outputs.length > 0) {
			menu.addItem('disconnect outputs', 'disconnectOutputs');
		}
	}
	return menu;
};

TypeMorph.prototype.destroy = BPM_TaskMorph.prototype.destroy;

TypeMorph.prototype.editLabel = function() {
	this.label.isEditable = true;
	this.label.alignment = 'left';
	this.label.enableSelecting();
	this.label.edit();
	//selectAll() changed
	this.label.startMark = "type: ".length;
	this.label.endMark = this.label.text.length;
	this.label.drawNew();
	this.label.changed();
};

TypeMorph.prototype.connect = BPM_TaskMorph.prototype.connect;

TypeMorph.prototype.addNextTask = BPM_TaskMorph.prototype.addNextTask;

TypeMorph.prototype.addGateway = BPM_TaskMorph.prototype.addGateway;

TypeMorph.prototype.addParallelGateway = BPM_TaskMorph.prototype.addParallelGateway;

TypeMorph.prototype.addStopEvent = BPM_TaskMorph.prototype.addStopEvent;

TypeMorph.prototype.addInput = BPM_TaskMorph.prototype.addInput;

TypeMorph.prototype.addOutput = BPM_TaskMorph.prototype.addOutput;

TypeMorph.prototype.disconnectOutbound = BPM_TaskMorph.prototype.disconnectOutbound;

TypeMorph.prototype.removeInbound = BPM_TaskMorph.prototype.removeInbound;

TypeMorph.prototype.disconnectInputs = BPM_TaskMorph.prototype.disconnectInputs;

TypeMorph.prototype.disconnectOutputs = BPM_TaskMorph.prototype.disconnectOutputs;

TypeMorph.prototype.removeInput = BPM_TaskMorph.prototype.removeInput;

TypeMorph.prototype.removeOutput = BPM_TaskMorph.prototype.removeOutput;

// testing

TypeMorph.prototype.isUpLoop = BPM_TaskMorph.prototype.isUpLoop;

TypeMorph.prototype.isDownLoop = BPM_TaskMorph.prototype.isDownLoop;

TypeMorph.prototype.isBackLoop = BPM_TaskMorph.prototype.isBackLoop;

TypeMorph.prototype.isSelfLoop = BPM_TaskMorph.prototype.isSelfLoop;

TypeMorph.prototype.isBelowAllInbound = BPM_TaskMorph.prototype.isBelowAllInbound;

TypeMorph.prototype.isAboveAllInbound = BPM_TaskMorph.prototype.isAboveAllInbound;

// events

//ADAM
TypeMorph.prototype.reactToEdit = function() {
	this.label.isEditable = false;
	this.label.clearSelection();
	this.label.disableSelecting();
	this.label.alignment = 'center';
	//ADAM
	if (this.label.text.indexOf("type: ") == 0) {
		this.text = this.label.text.substr("type: ".length, this.label.text.length);
	} else {
		this.text = "";
		this.label.text = "type: nothing";
	}
	this.label.drawNew();
	this.label.changed();
	console.log(this);
};

TypeMorph.prototype.mouseEnter = BPM_TaskMorph.prototype.mouseEnter;

TypeMorph.prototype.mouseLeave = BPM_TaskMorph.prototype.mouseLeave;

TypeMorph.prototype.wantsDropOf = BPM_TaskMorph.prototype.wantsDropOf;

TypeMorph.prototype.reactToDropOf = BPM_TaskMorph.prototype.reactToDropOf;

TypeMorph.prototype.prepareToBeGrabbed = BPM_TaskMorph.prototype.prepareToBeGrabbed;

TypeMorph.prototype.justDropped = BPM_TaskMorph.prototype.justDropped;

// drawing

TypeMorph.prototype.drawNew = BPM_TaskMorph.prototype.drawNew;

//
//DragDropMorph
//
//var dragDropMorph = new DragDropMorph(10,10,300,300);dragDropMorph.setPosition(new Point(100,100));world1.children[0].add(dragDropMorph);dragDropMorph.fixLayout();

DragDropMorph.prototype = new BoxMorph();
DragDropMorph.prototype.constructor = DragDropMorph;
DragDropMorph.uber = BoxMorph.prototype;

function DragDropMorph(x1, y1, x2, y2) {
	this.init(x1, y1, x2, y2);
}

DragDropMorph.prototype.init = function(x1, y1, x2, y2) {
	var labelText = "dragDrop:\nx1: " + x1 + ", y1: " + y1 + ", x2: " + x2 + ",y2: " + y2;
	this.label = null;
	this.inbound = [];
	this.outbound = null;
	this.inputs = [];
	this.outputs = [];
	this.setX1(x1);
	this.setY1(y1);
	this.setX2(x2);
	this.setY2(y2);

	DragDropMorph.uber.init.call(this, 7, 1);
	this.isDraggable = true;
	this.color = new Color(0, 119, 255);
	this.borderColor = this.color.darker(70);
	this.createLabel(labelText || 'Task');
	this.fixLayout();
};

DragDropMorph.prototype.getX1 = function() {
	return this.x1;
};

DragDropMorph.prototype.getY1 = function() {
	return this.y1;
};

DragDropMorph.prototype.getX2 = function() {
	return this.x2;
};

DragDropMorph.prototype.getY2 = function() {
	return this.y2;
};

DragDropMorph.prototype.setX1 = function(_x1) {
	return this.x1 = _x1;
};

DragDropMorph.prototype.setY1 = function(_y1) {
	return this.y1 = _y1;
};

DragDropMorph.prototype.setX2 = function(_x2) {
	return this.x2 = _x2;
};

DragDropMorph.prototype.setY2 = function(_y2) {
	return this.y2 = _y2;
};

DragDropMorph.prototype.createLabel = BPM_TaskMorph.prototype.createLabel;

DragDropMorph.prototype.fullCopy = BPM_TaskMorph.prototype.fullCopy;

DragDropMorph.prototype.layoutChanged = BPM_TaskMorph.prototype.layoutChanged;

DragDropMorph.prototype.fixLayout = BPM_TaskMorph.prototype.fixLayout;

DragDropMorph.prototype.userMenu = function() {
	var menu = new MenuMorph(this);
	menu.addItem('edit label...', 'editLabel');
	menu.addItem("duplicate", function() {
		this.fullCopy().pickUp(this.world());
	}, 'make a copy\nand pick it up');
	menu.addItem("delete", 'destroy');
	menu.addLine();
	if (this.outbound === null) {
		menu.addItem('next mouse move', 'addMouseMove');
		menu.addItem('next mouse move at', 'addMouseMoveAt');
		menu.addItem('next type', 'addType');
		menu.addLine();
		menu.addItem('connect...', 'connect');
		menu.addItem('next task...', 'addNextTask');
		menu.addItem('gateway...', 'addGateway');
		menu.addItem('parallel gateway...', 'addParallelGateway');
		menu.addItem('terminate...', 'addStopEvent');
	} else {
		menu.addItem('disconnect next', 'disconnectOutbound');
	}
	menu.addLine();
	menu.addItem('add input...', 'addInput');
	menu.addItem('add output...', 'addOutput');
	if (this.inputs.length + this.outputs.length > 0) {
		menu.addLine();
		if (this.inputs.length > 0) {
			menu.addItem('disconnect inputs', 'disconnectInputs');
		}
		if (this.outputs.length > 0) {
			menu.addItem('disconnect outputs', 'disconnectOutputs');
		}
	}
	return menu;
};

DragDropMorph.prototype.destroy = BPM_TaskMorph.prototype.destroy;

DragDropMorph.prototype.editLabel = BPM_TaskMorph.prototype.editLabel;

DragDropMorph.prototype.connect = BPM_TaskMorph.prototype.connect;

DragDropMorph.prototype.addNextTask = BPM_TaskMorph.prototype.addNextTask;

DragDropMorph.prototype.addGateway = BPM_TaskMorph.prototype.addGateway;

DragDropMorph.prototype.addParallelGateway = BPM_TaskMorph.prototype.addParallelGateway;

DragDropMorph.prototype.addStopEvent = BPM_TaskMorph.prototype.addStopEvent;

DragDropMorph.prototype.addInput = BPM_TaskMorph.prototype.addInput;

DragDropMorph.prototype.addOutput = BPM_TaskMorph.prototype.addOutput;

DragDropMorph.prototype.disconnectOutbound = BPM_TaskMorph.prototype.disconnectOutbound;

DragDropMorph.prototype.removeInbound = BPM_TaskMorph.prototype.removeInbound;

DragDropMorph.prototype.disconnectInputs = BPM_TaskMorph.prototype.disconnectInputs;

DragDropMorph.prototype.disconnectOutputs = BPM_TaskMorph.prototype.disconnectOutputs;

DragDropMorph.prototype.removeInput = BPM_TaskMorph.prototype.removeInput;

DragDropMorph.prototype.removeOutput = BPM_TaskMorph.prototype.removeOutput;

// testing

DragDropMorph.prototype.isUpLoop = BPM_TaskMorph.prototype.isUpLoop;

DragDropMorph.prototype.isDownLoop = BPM_TaskMorph.prototype.isDownLoop;

DragDropMorph.prototype.isBackLoop = BPM_TaskMorph.prototype.isBackLoop;

DragDropMorph.prototype.isSelfLoop = BPM_TaskMorph.prototype.isSelfLoop;

DragDropMorph.prototype.isBelowAllInbound = BPM_TaskMorph.prototype.isBelowAllInbound;

DragDropMorph.prototype.isAboveAllInbound = BPM_TaskMorph.prototype.isAboveAllInbound;

// events

DragDropMorph.prototype.reactToEdit = BPM_TaskMorph.prototype.reactToEdit;

DragDropMorph.prototype.mouseEnter = BPM_TaskMorph.prototype.mouseEnter;

DragDropMorph.prototype.mouseLeave = BPM_TaskMorph.prototype.mouseLeave;

DragDropMorph.prototype.wantsDropOf = BPM_TaskMorph.prototype.wantsDropOf;

DragDropMorph.prototype.reactToDropOf = BPM_TaskMorph.prototype.reactToDropOf;

DragDropMorph.prototype.prepareToBeGrabbed = BPM_TaskMorph.prototype.prepareToBeGrabbed;

DragDropMorph.prototype.justDropped = BPM_TaskMorph.prototype.justDropped;

// drawing

DragDropMorph.prototype.drawNew = BPM_TaskMorph.prototype.drawNew;





//
//MouseMoveAtMorph
//
//

MouseMoveAtMorph.prototype = new BoxMorph();
MouseMoveAtMorph.prototype.constructor = MouseMoveAtMorph;
MouseMoveAtMorph.uber = BoxMorph.prototype;

function MouseMoveAtMorph(x, y) {
	console.log(this);
	this.init(x, y);
}

MouseMoveAtMorph.prototype.init = function(css) {
	var labelText;
	this.label = null;
	this.inbound = [];
	this.outbound = null;
	this.inputs = [];
	this.outputs = [];
	if (css === undefined) {
		css = "CSS here";
	}
	this.css = css;
	labelText = "mouseMoveAt\nCSS: " + css;
	MouseMoveAtMorph.uber.init.call(this, 7, 1);
	this.isDraggable = true;
	this.color = new Color(0, 0, 0);
	this.borderColor = this.color.darker(70);
	this.createLabel(labelText || 'Task');
	this.fixLayout();
};

MouseMoveAtMorph.prototype.createLabel = BPM_TaskMorph.prototype.createLabel;

MouseMoveAtMorph.prototype.fullCopy = BPM_TaskMorph.prototype.fullCopy;

MouseMoveAtMorph.prototype.layoutChanged = BPM_TaskMorph.prototype.layoutChanged;

MouseMoveAtMorph.prototype.fixLayout = BPM_TaskMorph.prototype.fixLayout;

MouseMoveAtMorph.prototype.userMenu = function() {
	var menu = new MenuMorph(this);
	menu.addItem('edit label...', 'editLabel');
	menu.addItem("duplicate", function() {
		this.fullCopy().pickUp(this.world());
	}, 'make a copy\nand pick it up');
	menu.addItem("delete", 'destroy');
	menu.addLine();
	if (this.outbound === null) {
		menu.addItem('next press at', 'addPressAt');
		menu.addItem('next mouse move at', 'addMouseMoveAt');
		menu.addItem('next mouse move', 'addMouseMove');
		menu.addItem('next type', 'addType');
		menu.addLine();
		menu.addItem('connect...', 'connect');
		menu.addItem('next task...', 'addNextTask');
		menu.addItem('gateway...', 'addGateway');
		menu.addItem('parallel gateway...', 'addParallelGateway');
		menu.addItem('terminate...', 'addStopEvent');
	} else {
		menu.addItem('disconnect next', 'disconnectOutbound');
	}
	menu.addLine();
	menu.addItem('add input...', 'addInput');
	menu.addItem('add output...', 'addOutput');
	if (this.inputs.length + this.outputs.length > 0) {
		menu.addLine();
		if (this.inputs.length > 0) {
			menu.addItem('disconnect inputs', 'disconnectInputs');
		}
		if (this.outputs.length > 0) {
			menu.addItem('disconnect outputs', 'disconnectOutputs');
		}
	}
	return menu;
};

MouseMoveAtMorph.prototype.destroy = BPM_TaskMorph.prototype.destroy;

MouseMoveAtMorph.prototype.editLabel = function() {
	this.label.isEditable = true;
	this.label.alignment = 'left';
	this.label.enableSelecting();
	this.label.edit();
	//selectAll() changed

	this.label.startMark = "mouseMoveAt\nCSS: ".length;
	this.label.endMark = this.label.text.length;
	this.label.drawNew();
	this.label.changed();
};

MouseMoveAtMorph.prototype.connect = BPM_TaskMorph.prototype.connect;

MouseMoveAtMorph.prototype.addNextTask = BPM_TaskMorph.prototype.addNextTask;

MouseMoveAtMorph.prototype.addGateway = BPM_TaskMorph.prototype.addGateway;

MouseMoveAtMorph.prototype.addParallelGateway = BPM_TaskMorph.prototype.addParallelGateway;

MouseMoveAtMorph.prototype.addStopEvent = BPM_TaskMorph.prototype.addStopEvent;

MouseMoveAtMorph.prototype.addInput = BPM_TaskMorph.prototype.addInput;

MouseMoveAtMorph.prototype.addOutput = BPM_TaskMorph.prototype.addOutput;

MouseMoveAtMorph.prototype.disconnectOutbound = BPM_TaskMorph.prototype.disconnectOutbound;

MouseMoveAtMorph.prototype.removeInbound = BPM_TaskMorph.prototype.removeInbound;

MouseMoveAtMorph.prototype.disconnectInputs = BPM_TaskMorph.prototype.disconnectInputs;

MouseMoveAtMorph.prototype.disconnectOutputs = BPM_TaskMorph.prototype.disconnectOutputs;

MouseMoveAtMorph.prototype.removeInput = BPM_TaskMorph.prototype.removeInput;

MouseMoveAtMorph.prototype.removeOutput = BPM_TaskMorph.prototype.removeOutput;

// testing

MouseMoveAtMorph.prototype.isUpLoop = BPM_TaskMorph.prototype.isUpLoop;

MouseMoveAtMorph.prototype.isDownLoop = BPM_TaskMorph.prototype.isDownLoop;

MouseMoveAtMorph.prototype.isBackLoop = BPM_TaskMorph.prototype.isBackLoop;

MouseMoveAtMorph.prototype.isSelfLoop = BPM_TaskMorph.prototype.isSelfLoop;

MouseMoveAtMorph.prototype.isBelowAllInbound = BPM_TaskMorph.prototype.isBelowAllInbound;

MouseMoveAtMorph.prototype.isAboveAllInbound = BPM_TaskMorph.prototype.isAboveAllInbound;

// events

MouseMoveAtMorph.prototype.reactToEdit = function() {
	this.label.isEditable = false;
	this.label.clearSelection();
	this.label.disableSelecting();
	this.label.alignment = 'center';
	//ADAM
	if (this.label.text.indexOf("mouseMoveAt\nCSS: ") == 0) {
		this.css = this.label.text.substr("mouseMoveAt\nCSS: ".length,this.label.text.length);
	} else {
		this.css = "CSS here";
	}
	this.label.text = "mouseMoveAt\nCSS: " + this.css;
	this.label.drawNew();
	this.label.changed();
	console.log(this);
};

MouseMoveAtMorph.prototype.mouseEnter = BPM_TaskMorph.prototype.mouseEnter;

MouseMoveAtMorph.prototype.mouseLeave = BPM_TaskMorph.prototype.mouseLeave;

MouseMoveAtMorph.prototype.wantsDropOf = BPM_TaskMorph.prototype.wantsDropOf;

MouseMoveAtMorph.prototype.reactToDropOf = BPM_TaskMorph.prototype.reactToDropOf;

MouseMoveAtMorph.prototype.prepareToBeGrabbed = BPM_TaskMorph.prototype.prepareToBeGrabbed;

MouseMoveAtMorph.prototype.justDropped = BPM_TaskMorph.prototype.justDropped;

// drawing

MouseMoveAtMorph.prototype.drawNew = BPM_TaskMorph.prototype.drawNew;








//EXTENSIONS to existing BPMN morphs

BPM_EventMorph.prototype.addMouseMove = function() {
	var world = this.world(), task = new MouseMoveMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

BPM_EventMorph.prototype.addMouseMoveAt = function() {
	var world = this.world(), task = new MouseMoveAtMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

BPM_EventMorph.prototype.addType = function() {
	var world = this.world(), task = new TypeMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

BPM_EventMorph.prototype.addPressAt = function() {
	var world = this.world(), task = new PressAtMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

MouseMoveMorph.prototype.addMouseMove = function() {
	var world = this.world(), task = new MouseMoveMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

MouseMoveMorph.prototype.addType = function() {
	var world = this.world(), task = new TypeMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

MouseMoveMorph.prototype.addPressAt = BPM_EventMorph.prototype.addPressAt;
PressAtMorph.prototype.addPressAt = BPM_EventMorph.prototype.addPressAt;
PressAtMorph.prototype.addType = BPM_EventMorph.prototype.addType;
PressAtMorph.prototype.addMouseMove = BPM_EventMorph.prototype.addMouseMove;
TypeMorph.prototype.addPressAt = BPM_EventMorph.prototype.addPressAt;

MouseMoveMorph.prototype.addMouseMoveAt = BPM_EventMorph.prototype.addMouseMoveAt;

PressAtMorph.prototype.addMouseMoveAt = BPM_EventMorph.prototype.addMouseMoveAt;
TypeMorph.prototype.addMouseMoveAt = BPM_EventMorph.prototype.addMouseMoveAt;

MouseMoveAtMorph.prototype.addMouseMoveAt = BPM_EventMorph.prototype.addMouseMoveAt;
MouseMoveAtMorph.prototype.addMouseMove = BPM_EventMorph.prototype.addMouseMove;
MouseMoveAtMorph.prototype.addType = BPM_EventMorph.prototype.addType;
MouseMoveAtMorph.prototype.addPressAt = BPM_EventMorph.prototype.addPressAt;

TypeMorph.prototype.addMouseMove = function() {
	var world = this.world(), task = new MouseMoveMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

TypeMorph.prototype.addType = function() {
	var world = this.world(), task = new TypeMorph(), flow = new BPM_SequenceFlowMorph(this, task);
	this.outbound = flow;
	task.inbound.push(flow);
	world.add(flow);
	task.setPosition(world.hand.position());
	task.pickUp(world);
};

//morphic.js redefine
//because some characters were not accepted
//new characeters: #

CursorMorph.prototype.processKeyPress = function (event) {
	// this.inspectKeyEvent(event);
	console.log(event.keyCode);
	if (this.keyDownEventUsed) {
		this.keyDownEventUsed = false;
		return null;
	}
	if ((event.keyCode === 40) || event.charCode === 40) {
		this.insert('(');
		return null;
	}
	if ((event.keyCode === 37) || event.charCode === 37) {
		this.insert('%');
		return null;
	}
	//ADAM
	if ((event.keyCode === 35) || event.charCode === 35) {
		this.insert('#');
		return null;
	}
	if ((event.keyCode === 60) || event.charCode === 60) {
		this.insert('<');
		return null;
	}
	if ((event.keyCode === 62) || event.charCode === 62) {
		this.insert('>');
		return null;
	}
	//ADAM
	var navigation = [8, 13, 18, 27, 35, 36, 37, 38, 40];
	if (event.keyCode) { // Opera doesn't support charCode
		if (!contains(navigation, event.keyCode)) {
			if (event.ctrlKey) {
				this.ctrl(event.keyCode);
			} else if (event.metaKey) {
                this.cmd(event.keyCode);
            } else {
				this.insert(String.fromCharCode(event.keyCode));
			}
		}
	} else if (event.charCode) { // all other browsers
		if (!contains(navigation, event.charCode)) {
			if (event.ctrlKey) {
				this.ctrl(event.charCode);
			} else if (event.metaKey) {
                this.cmd(event.keyCode);
            } else {
				this.insert(String.fromCharCode(event.charCode));
			}
		}
	}
    // notify target's parent of key event
    this.target.escalateEvent('reactToKeystroke', event);
};

