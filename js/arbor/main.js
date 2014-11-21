var RendererClass = (function($) {
	var canvasIsArbored = false;
	var sys;
	var Renderer = function(canvas) {
		var canvas = $(canvas).get(0);
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
				particleSystem.screenSize(canvas.width, canvas.height);
				particleSystem.screenPadding(80);// leave an extra 80px of whitespace per side

				// set up some event handlers to allow for node-dragging
				that.initMouseHandling();
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

				particleSystem.eachEdge(function(edge, pt1, pt2) {
					// edge: {source:Node, target:Node, length:#, data:{}}
					// pt1:  {x:#, y:#}  source position in screen coords
					// pt2:  {x:#, y:#}  target position in screen coords
				});

				particleSystem.eachNode(function(node, pt) {
					// node: {mass:#, p:{x,y}, name:"", data:{}}
					// pt:   {x:#, y:#}  node position in screen coords

					// draw a rectangle centered at pt

					var w = 10;
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
				});
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

					dropped : function(e) {
						return;
					}
				};
			},
		};
		return that;
	};
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

	return {
		Renderer : Renderer,
		canvasIsArbored : canvasIsArbored,
		arborCanvas : arborCanvas,
		unarborCanvas : unarborCanvas,
		sys : sys
	};
})(this.jQuery);
