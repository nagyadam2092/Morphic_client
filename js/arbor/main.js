var RendererClass = (function($) {

	/*var GraphBoxMorph;
	 GraphBoxMorph.prototype = new BoxMorph();
	 GraphBoxMorph.prototype.constructor = BoxMorph;
	 GraphBoxMorph.uber = BoxMorph.prototype;*/

	var canvasIsArbored = false;
	var sys;

	var Renderer = function(canvas) {
		var canvas = $(canvas).get(0)
		var ctx = canvas.getContext("2d");
		var particleSystem;
		var counter = 0;

		var that = {
			init : function(system) {
				//
				// the particle system will call the init function once, right before the
				// to pass the canvas size to the particle system
				//
				// save a reference to the particle system for use in the .redraw() loop
				particleSystem = system;

				// inform the system of the screen dimensions so it can map coords for us.
				// if the canvas is ever resized, screenSize should be called again with
				// the new dimensions
				particleSystem.screenSize(canvas.width, canvas.height)
				particleSystem.screenPadding(80)// leave an extra 80px of whitespace per side

				// set up some event handlers to allow for node-dragging
				that.initMouseHandling()
			},

			redraw : function() {
				counter++;
				//hi.setText(counter);
				//
				// redraw will be called repeatedly during the run whenever the node positions
				// change. the new positions for the nodes can be accessed by looking at the
				// .p attribute of a given node. however the p.x & p.y values are in the coordinates
				// of the particle system rather than the screen. you can either map them to
				// the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
				// which allow you to step through the actual node objects but also pass an
				// x,y point in the screen's coordinate system
				//
				//ctx.fillStyle = "transparent"
				//ctx.fillRect(0,0, canvas.width, canvas.height)

				particleSystem.eachEdge(function(edge, pt1, pt2) {
					// edge: {source:Node, target:Node, length:#, data:{}}
					// pt1:  {x:#, y:#}  source position in screen coords
					// pt2:  {x:#, y:#}  target position in screen coords
					/*if (edge.source.data.boxmorph.outbound === null && edge.target.data.boxmorph.inbound.length === 0) {

					var edgeMorph = new BPM_SequenceFlowMorph(edge.source.data.boxmorph, edge.target.data.boxmorph);
					console.log(edge);
					//debugger;
					edge.source.data.boxmorph.outbound = edgeMorph;
					edge.target.data.boxmorph.inbound.push(edgeMorph);
					world.add(edgeMorph);
					}*/

					// draw a line from pt1 to pt2
					//ctx.strokeStyle = "rgba(255,255,255, .333)"
					//ctx.lineWidth = 1
					//ctx.beginPath()
					//ctx.moveTo(pt1.x, pt1.y)
					//ctx.lineTo(pt2.x, pt2.y)
					//ctx.stroke()
				})

				particleSystem.eachNode(function(node, pt) {
					// node: {mass:#, p:{x,y}, name:"", data:{}}
					// pt:   {x:#, y:#}  node position in screen coords

					// draw a rectangle centered at pt

					var w = 10
					if (!node.underDragging && node.data.boxmorph) {
						node.data.boxmorph.setPosition(new Point(pt.x, pt.y));
						if (node.data.boxmorph.outbound) {
							node.data.boxmorph.outbound.fixLayout();
						} else if (node.data.boxmorph.inbound.length > 0) {
							node.data.boxmorph.inbound.map(function(edge) {
								edge.fixLayout();
							});
						}
						if (node.data.boxmorph.fork) {
							node.data.boxmorph.fork.fixLayout();
						}
					}

					//node.data.boxmorph.setColor((node.data.alone) ? "red" : "blue");

				})
			},

			initMouseHandling : function() {
				// no-nonsense drag and drop (thanks springy.js)
				//var dragged = null;

				// set up a handler object that will initially listen for mousedowns then
				// for moves and mouseups while dragging
				var handler = {
					clicked : function(e) {
						return;
					},
					dragged : function(e) {
						return;
					},

					dropped : function(e) { ű
						return;
					}
				}

				// start listening
				//$(canvas).mousedown(handler.clicked);

			},
		}
		return that
	}
	function arborCanvas() {
		if (!sys) {
			sys = arbor.ParticleSystem(1000, 600, 0.5);
			// create the system with sensible repulsion/stiffness/friction
			sys.parameters({
				gravity : true,
				repulsion : 100000
			});
			// use center-gravity to make the graph settle nicely (ymmv)
		}
		if (!sys.renderer) {
			sys.renderer = Renderer("#world1");
			// our newly created renderer will have its .init() method called shortly by sys...
		}
		world1.children[0].children.map(function(morph) {
			var LocalBoxNode = sys.addNode("node#" + createLUID(), {
				boxmorph : morph
			});
			LocalBoxNode.data.boxmorph.setPosition(new Point(LocalBoxNode.p.x, LocalBoxNode.p.y));
			LocalBoxNode.data.boxmorph.isDraggable = true;
			LocalBoxNode.data.boxmorph.graphNode = LocalBoxNode;
			//world.add(LocalBoxNode.data.boxmorph);
			//return LocalBoxNode;
		});
		world1.children.map(function(morph) {
			if ( morph instanceof BPM_SequenceFlowMorph) {
				if (morph.source.graphNode && morph.target.graphNode)
					sys.addEdge(sys.getNode(morph.source.graphNode.name), sys.getNode(morph.target.graphNode.name));
			}
		});
		RendererClass.canvasIsArbored = true;
		RendererClass.sys = sys;
	}

	function unarborCanvas() {
		sys.eachNode(function(node, pt) {
			//NOT WORKING
			delete node.data.boxmorph;
		});
		RendererClass.canvasIsArbored = false;
	}


	$(document).ready(function() {
		//worldCanvas = document.getElementById('world1');
		/*
		world = new WorldMorph(worldCanvas, false);
		world.isDevMode = true;
		setInterval(loop, 50);
		*/
		//world = world1;

		/*hi = new StringMorph('Hello, World!', 48, 'serif');
		hi.isDraggable = true;
		hi.isEditable = true;
		hi.setPosition(new Point(275, 200));*/
		//debugger;
		//world.add(hi);

		//previously defined in index.html
		/*sys = arbor.ParticleSystem(1000, 600, 0.5)// create the system with sensible repulsion/stiffness/friction
		 sys.parameters({
		 gravity : true
		 })// use center-gravity to make the graph settle nicely (ymmv)
		 sys.renderer = Renderer("#world1")// our newly created renderer will have its .init() method called shortly by sys...
		 */
		/*
		 var initArray = ['1', '2', '3', '4'];
		 var initNodes = initArray.map(function(elem) {
		 var LocalBoxNode = sys.addNode(elem.toString(), {
		 boxmorph : new BPM_TaskMorph(elem.toString())
		 });
		 LocalBoxNode.data.boxmorph.setPosition(new Point(LocalBoxNode.p.x, LocalBoxNode.p.y));
		 LocalBoxNode.data.boxmorph.isDraggable = true;
		 LocalBoxNode.data.boxmorph.graphNode = LocalBoxNode;
		 world.add(LocalBoxNode.data.boxmorph);
		 return LocalBoxNode;
		 });

		 //DUMB WAY, JUST TESTINGű

		 var edge1 = new BPM_SequenceFlowMorph(sys.getNode(1).data.boxmorph, sys.getNode(2).data.boxmorph);
		 var edge2 = new BPM_SequenceFlowMorph(sys.getNode(2).data.boxmorph, sys.getNode(3).data.boxmorph);
		 var edge3 = new BPM_SequenceFlowMorph(sys.getNode(3).data.boxmorph, sys.getNode(4).data.boxmorph);

		 sys.getNode(1).data.boxmorph.outbound = edge1;
		 sys.getNode(2).data.boxmorph.outbound = edge2;
		 sys.getNode(3).data.boxmorph.outbound = edge2;
		 sys.getNode(2).data.boxmorph.inbound.push(edge1);
		 sys.getNode(3).data.boxmorph.inbound.push(edge2);
		 sys.getNode(4).data.boxmorph.inbound.push(edge3);

		 world.add(edge1);
		 world.add(edge2);
		 world.add(edge3);

		 sys.addEdge('1', '2');
		 sys.addEdge('2', '3');
		 sys.addEdge('1', '3');

		 //GYURI
		 //ITT NEM LOOPOL!!

		 sys.eachEdge(function(edge, pt1, pt2) {
		 console.log(edge);
		 /*console.log(edge.source.data.boxmorph.outbound == null && edge.target.data.boxmorph.inbound.length == 0);
		 if (edge.source.data.boxmorph.outbound == null && edge.target.data.boxmorph.inbound.length == 0) {
		 var edgeMorph = new BPM_SequenceFlowMorph(edge.source.data.boxmorph, edge.target.data.boxmorph);
		 console.log(edge);
		 //debugger;
		 edge.source.data.boxmorph.outbound = edgeMorph;
		 edge.target.data.boxmorph.inbound.push(edgeMorph);
		 console.log(edge);
		 world.add(edgeMorph);
		 }

		 });
		 */
		/*
		 var edge1 = new BPM_SequenceFlowMorph(sys.getNode('1').data.boxmorph, sys.getNode('2').data.boxmorph);
		 sys.getNode('1').data.boxmorph.outbound = edge1;
		 sys.getNode('2').data.boxmorph.inbound.push(edge1);
		 var edge2 = new BPM_SequenceFlowMorph(sys.getNode('2').data.boxmorph, sys.getNode('3').data.boxmorph);
		 sys.getNode('2').data.boxmorph.outbound = edge2;
		 sys.getNode('3').data.boxmorph.inbound.push(edge2);
		 var edge3 = new BPM_SequenceFlowMorph(sys.getNode('1').data.boxmorph, sys.getNode('3').data.boxmorph);
		 sys.getNode('1').data.boxmorph.outbound = edge3;
		 sys.getNode('3').data.boxmorph.inbound.push(edge3);
		 world.add(edge1);
		 world.add(edge2);
		 world.add(edge3);*/
	})
	return {
		Renderer : Renderer,
		canvasIsArbored : canvasIsArbored,
		arborCanvas : arborCanvas,
		unarborCanvas : unarborCanvas,
		sys : sys
	};
})(this.jQuery);
