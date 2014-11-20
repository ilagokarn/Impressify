/**
 * impressify.js
 *
 * impressify.js is a visual interactive development environment (IDE) to create stunning Impress.JS presentations 
 * using CSS transformations and transitions to create HTML5-based zooming presentations. 
 * Built on top of Impressionist beta created by Harish Sivaramakrishnan (@hsivaram) 
 * and Impress.js created by Bartek Szopka (@bartaz).
 *
 *
 * Copyright 2014-2015 Ila Gokarn (@ilagokarn)
 *
 * Released under the MIT License.
 *
 * ------------------------------------------------
 *  author:  Ila Gokarn
 *  version: 0.1
 *  source:  http://github.com/ilagokarn/impressify
 */

/**
 * Creates an Impressionist object with all methods attached to it. 
 * 
 * @returns {Impressionist}
 */
var files; 
Impressionist = function()
{

	this.slidecounter = 0;
        this.menuopen = false;
	this.currentview = "mainarea";
	this.colorpickeropen = false;
	this.selectedElement;
	this.clonedElement;
	this.selectedSlide;
	this.lasttextaddedcoords = {};
	this.orchestrationcoords = [];
	this.selectedOrchElement;
	this.lastslideleftpos = 0;
	this.saveKey = "impressionist_decks";
	this.lastSaved = "impressionist_lastsaved";
	this.currentPresentation;
	this.mypresentations = [];
	this.mode = "create";
	this.theme = "montserrat";
	this.loggedinstate = false;

	this.dropdownopen = false;

	this.selectedforedit = false;


	this.isBold = false;
	this.isItalic = false;
	this.isUnderlined = false;
        this.isLeftAligned = true;
        this.isCenterAligned = false;
        this.isRightAligned = false;

	 this.vxmax = 6000;
	//Viewport x min
	this.vxmin = -6000;
	//Viewport y max
	this.vymax = 6000;
	//Viewport y min
	this.vymin = -6000;
	//Window x max
	this.wxmax = 960;
	//Window x min
	this.wxmin = 0;
	//Window y max
	this.wymax = 630;
	//Window y min
	this.wymin = 0;

 	this.slidewxmax = 960;
 	this.slidewxmin = 0;
 	this.slidewymax = 630;
 	this.slidewymin = 0;
        
}
Impressionist.prototype =
{
	/**
         * Initializes the Impresionist object
         * @returns {undefined}
         */
            initialize  : function()
	{
		me = this;
		me.continueInit();
                
		
		//me.openNewPresentationWindow();
	},
        /**
         * Gets the panels of Impressionist populated and ready for Events, initializes all event listeners
         * @returns {undefined}
         */
	continueInit : function()
	{

			me.positionOrchestrationPanel();
			me.setupColorpickerPopup();
			me.setupMenuItemEvents();
			me.enableSort();
			me.setupPopover();
			me.setupDials();	
			me.setupKeyboardShortcuts();	
			me.hideTransformControl();
			//presentations = me.getSavedPresentations();
			//me.renderPresentations( presentations );
			me.openLastSavedPresentation();
			me.switchView("right");
		
	},
        prepareUpload : function(event){
            files = event.target.files;
        },
	hideTransformControl : function()
	{
		$("#play").css("display", "none");
	},
        /**
         * Setup of all keyboard event listeners (for keyup etc)
         * @returns {undefined}
         */
	setupKeyboardShortcuts : function()
	{
			
			key('⌘+c, ctrl+c', function(event, handler)
			{
				//console.log("hey there...")
  				console.log(handler.shortcut, handler.scope);
  				me.cloneElement();
			});
			key('⌘+v, ctrl+v', function(event, handler)
			{
				//console.log("hey there...")
  				console.log(handler.shortcut, handler.scope);
  				me.appendClonedElement();
			});
			key.setScope("issues");
	},
        /*
         * Overwrite of standard clone method
         * @returns {undefined}
         */
	cloneElement : function()
	{
		if(me.selectedElement)
		{
			clone = me.selectedElement.clone();
			clone.attr("id", "slideelement_"+me.generateUID());
			clone.css("left", me.selectedElement.position().left + 20+"px");
			clone.css("top", me.selectedElement.position().top + 20+"px");
			me.clonedElement = clone;
		}
		else
		{
			console.log("Nothing is selected");
		}
	},
        /*
         * Overwrite of standard append method
         * @returns {undefined}
         */
	appendClonedElement : function()
	{
		console.log(me.clonedElement, "clonedelement");
		me.selectedSlide.append(me.clonedElement);
		me.enableDrag();
	},
        /*
         * Setup all Text Editor Menu features, event listeners for B, I, U etc
         * @returns {undefined}
         */
	setupMenuItemEvents : function()
	{
		$("#makebold").on("click", function( e )
		{
			e.stopPropagation();
			if(!me.isBold && me.selectedElement)
			{
				me.selectedElement.css("fontWeight", "bold");
				me.selectedElement.attr("data-isbold", true);
				$(this).addClass("active");
				me.isBold = true;
			}
			else if(me.isBold && me.selectedElement)
			{
				me.selectedElement.css("fontWeight", "normal");
				me.selectedElement.attr("data-isbold", false);
				me.isBold = false;
				$(this).removeClass("active");
			}
		});
		$("#makeitalic").on("click", function( e )
		{
			e.stopPropagation();
			$(this).removeClass("active");
			if(!me.isItalic && me.selectedElement)
			{
				me.selectedElement.css("fontStyle", "italic");
				me.selectedElement.attr("data-isitalic", true);
				$(this).addClass("active");
				me.isItalic = true;
			}
			else if(me.isItalic && me.selectedElement)
			{
				me.selectedElement.css("fontStyle", "normal");
				me.selectedElement.attr("data-isitalic", false);
				me.isItalic = false;
				$(this).removeClass("active");
			}
		});
		$("#makeunderline").on("click", function( e )
		{
			e.stopPropagation();
			$(this).removeClass("active");
			if(!me.isUnderlined && me.selectedElement)
			{
				me.selectedElement.css("text-decoration", "underline");
				me.selectedElement.attr("data-isunderline", true);
				$(this).addClass("active");
				me.isUnderlined = true;
			}
			else if(me.isUnderlined && me.selectedElement)
			{
				me.selectedElement.css("text-decoration", "none");
				me.selectedElement.attr("data-isunderline", false);
				me.isUnderlined = false;
				$(this).removeClass("active");
			}
		});
                $("#makealignleft").on("click", function( e )
		{
			e.stopPropagation();
			$(this).removeClass("active");
			if(!me.isLeftAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "left");
				$(this).addClass("active");
				me.isLeftAligned = true;
			}
			else if(me.isLeftAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "initial");
				me.isLeftAligned = false;
				$(this).removeClass("active");
			}
		});$("#makealigncenter").on("click", function( e )
		{
			e.stopPropagation();
			$(this).removeClass("active");
			if(!me.isCenterAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "center");
				$(this).addClass("active");
				me.isCenterAligned = true;
			}
			else if(me.isCenterAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "initial");
				me.isCenterAligned = false;
				$(this).removeClass("active");
			}
		});$("#makealignright").on("click", function( e )
		{
			e.stopPropagation();
			$(this).removeClass("active");
			if(!me.isRightAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "right");
				$(this).addClass("active");
				me.isRightAligned = true;
			}
			else if(me.isRightAligned && me.selectedElement)
			{
				me.selectedElement.css("text-align", "initial");
				me.isRightAligned = false;
				$(this).removeClass("active");
			}
		});
                
	},
        /*
         * Enables of drag and reorder of slides in the side panel
         * @returns {undefined}
         */
	enableSort : function()
	{
		$(".slidethumbholder").sortable( { update : function( event, ui)
			{
				console.log("sort updated", event, ui);
				me.assignSlideNumbers();
				me.reArrangeImpressSlides();
			}} );
		//$(".slidethumbholder").disableSelection();
	},
        /*
         * Takes in ID of selected element from the sidebar and displays slide in main grey area
         * @param {type} id
         * @returns {undefined}
         */
	displaySelectedSlide : function( id )
	{
		
	},
        /*
         * Drag and reorder of slides in slide thumb panel
         * @returns {undefined}
         */
	reArrangeImpressSlides : function()
	{
		children = $(".slidethumbholder").children();
		var clonedElements = [];
		for(var i=0; i<children.length; i++)
		{
			child = children[i];
			console.log("Rearrange child", child.id);
			id = (child.id).split("_")[1];
			el = $("#impress_slide_"+id);
			clonedElements.push( el );
		}
		$(".impress-slide-container").html("");
		for(var j=0; j< clonedElements.length; j++)
		{
			console.log("el", clonedElements[j]);
			$(".impress-slide-container").append(clonedElements[j]);
		}
		me.enableDrag();
	},
        /*
         * Setup dials for rotate, skew, zoom in transition editor
         * @returns {undefined}
         */
	setupDials : function()
	{
		$("#rotationknob").knob({change : function( v )
		{
			//me.rotateElement( v );
			me.rotateElement( v );
		}});
		$("#skewxknob").knob({change : function( v )
		{
			me.rotateElementX( v );
		}});
		$("#skewyknob").knob({change : function( v )
		{
			me.rotateElementY( v );
		}});
		$("#scalerange").on("change", function( e )
		{
			console.log("moving scale", $(this).val());
			me.selectedOrchElement.attr("data-scale", $(this).val());
			id = me.selectedOrchElement.attr("id").split("_")[1];
			$("#slidethumb_"+id).attr("data-scale", $(this).val());
		});
		$("#depthrange").on("change", function( e )
		{
			me.selectedOrchElement.attr("data-z", $(this).val());
			id = me.selectedOrchElement.attr("id").split("_")[1];
			$("#slidethumb_"+id).attr("data-z", $(this).val());
		});
		$(".transformlabel").css("vertical-align", "top");

	},
        /*
         * Takes in value to rotate and rotates element
         * @param {type} value
         * @returns {undefined}
         */
	rotateElement : function( value )
	{
		//me.selectedOrchElement.css("transform-origin", "0 0");
		
		rotx = me.selectedOrchElement.attr("data-rotate-x");
		roty = me.selectedOrchElement.attr("data-rotate-y");
		s = "";
		if(rotx !== undefined)
		{
			s += "rotateX("+rotx+"deg)";
		}
		if(roty !== undefined)
		{
			s += "rotateY("+roty+"deg)";
		}
		str = s + " rotate("+value+"deg)";
		me.selectedOrchElement.css("transform", str);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate", value);

		id = me.selectedOrchElement.attr("id").split("_")[1];
		console.log("Updating slidethumb", $("#slidethumb_"+id));

		$("#slidethumb_"+id).attr("data-rotate-x", rotx);
		$("#slidethumb_"+id).attr("data-rotate-y", roty);
		$("#slidethumb_"+id).attr("data-rotate", value);

		$("#slidethumb_"+id).attr("data-transform-string", str);
	},
        /*
         * Takes in value to rotate on X axis
         * @param {type} value
         * @returns {undefined}
         */
	rotateElementX : function( value )
	{
		rot = me.selectedOrchElement.attr("data-rotate");
		roty = me.selectedOrchElement.attr("data-rotate-y");
		s = "";
		if(rot !== undefined)
		{
			console.log("rotated already", rot);
			s += "rotate("+rot+"deg)";
		}
		if(roty !== undefined)
		{
			s += "rotateY("+roty+"deg)";
		}
		str = s + " rotateX("+value+"deg)";
		console.log("Transform string before writing", str);
		me.selectedOrchElement.css("transform", str);
		me.selectedOrchElement.attr("data-rotate", value);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate-x", value);

		id = me.selectedOrchElement.attr("id").split("_")[1];

		console.log("Updating slidethumb", $("#slidethumb_"+id));
		$("#slidethumb_"+id).attr("data-rotate-x", value);
		$("#slidethumb_"+id).attr("data-rotate-y", roty);
		$("#slidethumb_"+id).attr("data-rotate", rot);
		$("#slidethumb_"+id).attr("data-transform-string", str);
	},
        /*
         * Takes in vaue to rotate on Y axis
         * @param {type} value
         * @returns {undefined}
         */
	rotateElementY : function( value )
	{
		rot = me.selectedOrchElement.attr("data-rotate");
		rotx = me.selectedOrchElement.attr("data-rotate-x");
		s = "";
		if(rot !== undefined)
		{
			console.log("rotated already", rot);
			s += "rotate("+rot+"deg)";
		}
		if(rotx !== undefined)
		{
			s += "rotateX("+rotx+"deg)";
		}
		str = s + " rotateY("+value+"deg)";
		console.log("Transform string before writing y", str);
		me.selectedOrchElement.css("transform", str);
		me.selectedOrchElement.attr("data-rotate", value);
		console.log("css", me.selectedOrchElement.css("transform"));
		me.selectedOrchElement.attr("data-rotate-y", value);

		id = me.selectedOrchElement.attr("id").split("_")[1];
		console.log("Updating slidethumb", $("#slidethumb_"+id));

		$("#slidethumb_"+id).attr("data-rotate-x", rotx);
		$("#slidethumb_"+id).attr("data-rotate-y", value);
		$("#slidethumb_"+id).attr("data-rotate", rot);
		$("#slidethumb_"+id).attr("data-transform-string", str);
	},
        /*
         * method not used
         * @returns {undefined}
         */
	setupPopover : function()
	{
		$(".slidelement").popover({html:"hello world",placement:"bottom", trigger:"click"});
	},
        /*
         * Enable drag of element across slide
         * @returns {undefined}
         */
	enableDrag : function()
	{

		//$(".slidelement").drags();
		$(".slidelement").draggable().on("dblclick", function( e )
		{
			e.stopPropagation();
			$(this).draggable({disabled : false});
			//$(this).attr("contentEditable", true);
			$("#play").css("display", "none");
			$(this).removeClass("movecursor");
			

		}).on("click", function ( e )
		{
			console.log("click firing....");
			e.stopPropagation();
			$(this).draggable({disabled : true});
			//$(this).attr("contentEditable", true);
			$(".slidelement").removeClass("elementselected");
			//$(this).addClass("elementselected")
			me.selectElement( $(this));
			me.selectedforedit = true;
			me.setTransformValues( $(this) );
			me.setMenuControlValues ( $(this) );
			me.positionTransformControl();
			
			
		}).on("mousedown mouseover", function( e )
		{
			$(this).addClass("movecursor");
		}).on("mouseup", function( e )
		{
			console.log("mouse upping", me.selectedSlide );
			me.generateScaledSlide( me.selectedSlide );
		});
		
		
	},
        enableResizeAndDrag : function()
	{

		//$(".slidelement").drags();
                ////alert("enabling resize");
		$(".slidelement").resizable({ aspectRatio: true }).on("dblclick", function( e )
		{
			e.stopPropagation();
			$(this).resizable({disabled : false});
			//$(this).attr("contentEditable", true);
			$("#play").css("display", "none");
			$(this).removeClass("movecursor");
			

		}).on("click", function ( e )
		{
			console.log("click firing....");
			e.stopPropagation();
			$(this).resizable({disabled: true});
			//$(this).attr("contentEditable", true);
			$(".slidelement").removeClass("elementselected");
			//$(this).addClass("elementselected")
			me.selectElement( $(this));
			me.selectedforedit = true;
			me.setTransformValues( $(this) );
			me.setMenuControlValues ( $(this) );
			me.positionTransformControl();
			
			
		}).on("mousedown mouseover", function( e )
		{
			$(this).addClass("movecursor");
		}).on("mouseup", function( e )
		{
			console.log("mouse upping", me.selectedSlide );
			me.generateScaledSlide( me.selectedSlide );
		});
		
		
	},
        
        /*
         * Transforms position of slide in transition editor
         * @returns {undefined}
         */
	positionTransformControl : function( )
	{
		_transform = me.selectedElement.css("-webkit-transform");
		$("#play").css("-webkit-transform", _transform);
		$("#play").css("display", "block");
		$("#play").width ( me.selectedElement.width());
		//$("#play").height( me.selectedElement.height());
		$("#play").css("left",   me.selectedElement.position().left+"px");
		$("#play").css("top", 	 me.selectedElement.position().top+"px");
		$("#spandelete").on("click", function(e)
		{
			e.stopPropagation();
			me.selectedElement.remove();
			$("#play").css("display", "none");
		});
	},
        /*
         * Takes in element and selects menu item if selected (if isBold, is Italic, isUnderlined)
         * @param {type} el
         * @returns {undefined}
         */
	setMenuControlValues : function( el )
	{
		var isbold = el.attr("data-isbold");
		var isitalic = el.attr("data-isitalic");
		var isunderline = el.attr("data-isunderline");
		if(isbold)
		{
			$("#makebold").addClass("active");
		}
		else
		{
			$("#makebold").removeClass("active");
		}

		if(isitalic)
		{
			$("#makeitalic").addClass("active");
		}
		else
		{
			$("#makeitalic").removeClass("active");
		}

		if(isunderline)
		{
			$("#makeunderline").addClass("active");
		}
		else
		{
			$("#makeunderline").removeClass("active");
		}
	},
	resetMenuControlValues : function()
	{
		$(".menubtn").removeClass("active");
	},
        /*
         * Set transform values in transition panel
         * @param {type} el
         * @returns {undefined}
         */
	setTransformValues : function( el )
	{
		/*rotation = el.attr("data-rotate");
		skewx = el.attr("data-skewx");
		skewy = el.attr("data-skewy");
		$("#rotationknob").val( rotation || 0 )
		$("#skewxknob").val( skewx  || 0)
		$("#skewyknob").val( skewy || 0)
		*/
	},
        /*
         * Overwrides default select method
         */
	selectElement : function( el )
	{
		me.selectedElement = el;
	},
        /*
         * Increase/decrease font size in editor
         */
	calculateFontSize : function( type )
	{
		size = "";
		switch( type )
		{
			case "h3" :
				size = "4.5px";
				break;
			case "h2" :
				size = "5.5px";
				break;
		}
		console.log("size", size);
		return size;
	},
        /*
         * Setup color picker for text
         */
	setupColorpickerPopup : function()
	{
		$("#colorpickerbtn").popover("hide");
		$("#colorpickerbtn").on("click", function(e)
		{
			console.log("Inside click");
			e.stopPropagation();
			if(me.colorpickeropen)
			{
				$("#colorpickerbtn").colorpicker("hide");
				me.colorpickeropen = false;
			}
			else
			{
				$("#colorpickerbtn").colorpicker("show").on("changeColor", function( e )
				{
					console.log("color", e.color.toHex(), $(this));
					me.colorSelectedElement( e.color.toHex());
					//$(this).colorpicker("hide");

				});
				me.colorpickeropen = true;
			}
			
		});
	},
        /*
         * Initial position for the orchestration panel in the main area
         */
	positionOrchestrationPanel : function()
	{
		ypos = $(".mainfooter").position().top;
		ht = $(".mainfooter").height();
		orchestrationareapos = ypos + ht;
		console.log("ypos", ypos);
		//$(".orchgreyarea").css("top", orchestrationareapos+"px" );
	},
        /*
         * Setup of the original settings box in the text editor
         */
	addSettingsPanel : function( type )
	{
		$(".settingsbox").html(newpresotemplate);
		//this.addSlide();
		this.removelisteners();
		this.attachListeners();
	},
        /*
         * Event listener for global click
         */
	manageGlobalClick : function(e)
	{
		$("#colorpickerbtn").colorpicker("hide");
		$(".slidelement").draggable({disabled : false});
		//console.log("in globel ",e.target);
		//$(".dropdownpopup").css("display", "none");
		$("#play").css("display", "none");
		me.generateScaledSlide(me.selectedSlide);
		me.selectedforedit = false;
		me.colorpickeropen = false;
		me.resetMenuControlValues();
		//me.clearElementSelections()
	},
        /*
         * Deselect an element
         */
	clearElementSelections : function()
	{
		$(".slidelement").removeClass("elementhover");
		$(".slidelement").removeClass("elementselected");
		//me.selectedElement = "";;
	},
        /*
         * Set color from color picker menu item
         */
	colorSelectedElement : function( color )
	{
		if(me.selectedElement)
		{
			me.selectedElement.css("color", color);
		}
		
	},
        /*
         * Add a normal slide with sample heading and sample paragraph
         */
	addSlide : function()
	{
                thumb = slidethumb;
		uid = me.generateUID();
		thumb = thumb.split("slidethumb_^UID^").join("slidethumb_"+uid);
		$(".slidethumbholder").append( thumb );
		$("#slidethumb_"+uid).animate({opacity:1}, 200);


		$("#slidethumb_"+uid).attr("data-left", me.lastslideleftpos+"px");
		$("#slidethumb_"+uid).attr("data-top", "0px");
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			});
		});
		$(".slidemask").on("click", function( e )
		{
			e.stopPropagation();
			id = (e.target.id).split("_")[1];
			console.log("slidemask", id);
			me.selectSlide( "#impress_slide_"+id );
			$(".slidethumb").removeClass("currentselection");
			$("#slidethumb_"+id).addClass("currentselection");
			me.hideTransformControl();
			me.switchView("right");
		});
		//me.orchestrationcoords.push({left:"0px", top:"0px"});
		me.lastslideleftpos += 200;
		me.assignSlideNumbers();
		me.addImpressSlide( uid );
                me.switchView( "right" );
		//$("#presentationmetatitle").html($("#titleinput").val());

	},
        addSlideFromDB : function(id, left, right)
	{
                thumb = slidethumb;
		uid = id;
                thumb = thumb.split("slidethumb_^UID^").join("slidethumb_"+uid);
		$(".slidethumbholder").append( thumb );
		$("#slidethumb_"+uid).animate({opacity:1}, 200);
                $("#impress_slide_"+uid).attr("data-left", left);
		$("#impress_slide_"+uid).attr("data-top", right);

		$("#slidethumb_"+uid).attr("data-left", me.lastslideleftpos+"px");
		$("#slidethumb_"+uid).attr("data-top", "0px");
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			});
		});
		$(".slidemask").on("click", function( e )
		{
			e.stopPropagation();
			id = (e.target.id).split("_")[1];
			console.log("slidemask", id);
			me.selectSlide( "#impress_slide_"+id );
			$(".slidethumb").removeClass("currentselection");
			$("#slidethumb_"+id).addClass("currentselection");
			me.hideTransformControl();
			me.switchView("right");
		});
		//me.orchestrationcoords.push({left:"0px", top:"0px"});
		me.lastslideleftpos += 200;
		me.assignSlideNumbers();
		me.addPPTImpressSlide( uid );
                me.switchView( "right" );
		//$("#presentationmetatitle").html($("#titleinput").val());

	},
        /*
         * Add slide with image of PPT from the database
         * Called from startup.js
         */
        addPPTSlide : function(src, id)
	{
                thumb = slidethumb;
		uid = me.generateUID();
		thumb = thumb.split("slidethumb_^UID^").join("slidethumb_"+uid);
		$(".slidethumbholder").append( thumb );
		$("#slidethumb_"+uid).animate({opacity:1}, 200);


		$("#slidethumb_"+uid).attr("data-left", me.lastslideleftpos+"px");
		$("#slidethumb_"+uid).attr("data-top", "0px");
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			});
		});
		$(".slidemask").on("click", function( e )
		{
			e.stopPropagation();
			id = (e.target.id).split("_")[1];
			console.log("slidemask", id);
			me.selectSlide( "#impress_slide_"+id );
			$(".slidethumb").removeClass("currentselection");
			$("#slidethumb_"+id).addClass("currentselection");
			me.hideTransformControl();
			me.switchView("right");
		});
		//me.orchestrationcoords.push({left:"0px", top:"0px"});
		me.lastslideleftpos += 200;
		me.assignSlideNumbers();
		me.addPPTImpressSlide( uid );
                me.addPPTImageToSlide(src, id);
		me.switchView( "right" );
		//$("#presentationmetatitle").html($("#titleinput").val());

	},
        /*
         * Add Impress attributes to a normal slide
         */
	addImpressSlide : function( id )
	{
		islide = impress_slide;
		islide = islide.split("__slidenumber__").join("_"+id);
		islide = islide.split("slidelement_id").join("slidelement_"+me.generateUID());
		$(".impress-slide-container").append( islide );
		$("#impress_slide_"+id).addClass("impress-slide-element");
		me.removeAllStyles($("#impress_slide_"+id));
		$("#impress_slide_"+id).addClass(me.theme);
		me.applyStyle();
		me.selectSlide("#impress_slide_"+id);
		me.enableDrag();
		me.generateScaledSlide("#impress_slide_"+id);
	},
        /*
         * Add Impress attributes to a slide having a PPT image loaded from the database
         */
        addPPTImpressSlide : function( id )
	{
		islide = impress_slide_ppt;
		islide = islide.split("__slidenumber__").join("_"+id);
		islide = islide.split("slidelement_id").join("slidelement_"+me.generateUID());
		$(".impress-slide-container").append( islide );
		$("#impress_slide_"+id).addClass("impress-slide-element");
		me.removeAllStyles($("#impress_slide_"+id));
		$("#impress_slide_"+id).addClass(me.theme);
		me.applyStyle();
		me.selectSlide("#impress_slide_"+id);
		me.enableDrag();
		me.generateScaledSlide("#impress_slide_"+id);
	},
        /*
         * Add the impress-enabled slide to the sidebar
         */
	addImpressSlideItem : function ( el )
	{
		console.log("adding the new item....");
		var text_snippet = '<div class="slidelement slidelementh1" id="slidelement_id" data-parent="impress_slide__slidenumber__" data-type="p" style="width:auto; height:60px; position:absolute; left:200px; top:150px; whitespace:normal;" contentEditable="true"><div>Double Click to Edit</div></div>';
                var id = me.generateUID();
                text_snippet = text_snippet.split('slidelement_id').join('slidelement_'+id);
		$(el).append( text_snippet );
		me.enableDrag();
		me.generateScaledSlide( me.selectedSlide );
	},
        selectTextForEdit : function(el){
            $(el).addClass("selectText");
        },
        /*
         * Generate scaled version of the slide for the sidebar
         */
	generateScaledSlide : function( el )
	{
		tempel = el;
		newel = $(el).clone();
		try
		{
			id = newel.attr("id").split("_")[2];
		}
		catch( e )
		{
			//error.
		}
		console.log("aideeee", id);
		//console.log("element id", id);
		//$("clonethumb_"+id).remove();
		newel.attr("id", "clonethumb_"+id);
		newel.attr("data-clone", true);
                elchildren = newel.children();
                var isSlide = false;
                $.each(elchildren, function(i, elch){
                    if(elch instanceof HTMLImageElement){
                        var alt = $(elch).attr("alt");
                        var split = alt.split("-");
                        if(split[0]==="slide"){
                            newel.css("-ms-transform", "scale(1,1)");
                            newel.css("-webkit-transform", "scale(1,1)");
                            newel.css("left", "0px");
                            newel.css("top", "0px");
                            isSlide = true;
                        }
                    }});
                if(!isSlide){
                    newel.css("-ms-transform", "scale(0.18, 0.18)");
                    newel.css("-webkit-transform", "scale(0.18, 0.18)");
                    newel.css("left", "-110px");
                    newel.css("top", "-75px");
                }
		newel.removeClass("impress-slide-element");
		//newel.css("border", "1px solid #999");
		children = $("#slidethumb_"+id).children();
		//console.log("children", children)
		for(var i=0; i<children.length; i++)
		{
			
			child = children[i];
			if($(child).attr("data-clone") === "true")
			{
				$(child).remove();
			}
		}


		$("#slidethumb_"+id).append( newel );
		//$(".orchestrationviewport").append( orchel );
		//$(".impress-slide").append( newel );
		

	},
        /*
         * Selct particular slide method
         */
	selectSlide : function( id )
	{

		children = $(".impress-slide-container").children();
		//console.log("I am in selection", children)
		for(var i=0; i< children.length; i++)
		{
			child = children[i];
			childid = "#"+child.id;
                        if(childid === id)
			{
				console.log("found", childid);
				$(childid).css("z-index", 1);
				me.selectedSlide = $(childid);
			}
			else
			{
				console.log("did not find", childid);
				$(childid).css("z-index", -200 + (-(Math.round(Math.random()*1000))));
			}
		}
	},
        /*
         * Set new slide numbers based on drag and reorder
         */
	assignSlideNumbers : function()
	{
		children = $(".slidethumbholder").children();
		//console.log("children", children);
		for(var i = 0; i< children.length; i++)
		{
			child = $(children[i]);
			count = i;
			//console.log("child", $("#"+child[0].id).find(".slidedisplay").html())
			$("#"+child[0].id).find(".slidedisplay").html("Slide "+(++count));
			//slidenumber = $("#"+child[0].id).find(".slidedisplay").html();
			//child.innerText = child.innerText.split("__text__").join("Slide "+(++count));
		}
	},
        /*
         * Generate unique id for every element in the impress presentation
         */
	generateUID: function ()
	{
		return Math.round(Math.random()*10000);
	},
        /*
         * Animate transition controls
         */
	animateSettingsPanel : function ( direction )
	{
		if(direction === "left")
		{
			$(".settingsbox").animate({"left": "-500px", "opacity": 0}, { duration: 300, easing: "linear" });
			me.menuopen = false;
		}
		if(direction === "right")
		{
			$(".settingsbox").animate({"left": "230px", "opacity":1}, {duration: 300, easing: "linear" });
			me.menuopen = true;

		}
	},
        /*
         * Assemble transition editor with slides
         */
	assembleOrchestrationTiles : function()
	{
		$(".orchestrationviewport").html("");
		orchestrationElements = [];

		var children = $(".slidethumbholder").children();

		l = 10;

		for(var i=0 ; i<children.length; i++)
		{
			console.log("looping children");
			child = children[i];
			clone = $(child).clone();
			clone.removeClass("slidethumb");
			clone.addClass("orchthumb");
			console.log("clone", clone);
			clone.attr("id", "orchestrationelement_"+$(child).attr("id").split("_")[1]);
			clone.css("opacity", 1);
			clone.css("position", "absolute");
			clone.css("transform", clone.attr("data-transform-string"));
			console.log("Pre check: ", clone.attr("data-left"));



			clone.find(".deletebtn").remove();
			clone.draggable().on("mouseup", function()
			{
					$(this).attr("data-left",$(this).css("left"));
					$(this).attr("data-top",$(this).css("top"));
					console.log("accessing ", $(this).attr("id"));
					id = $(this).attr("id").split("_")[1];

					$("#slidethumb_"+id).attr("data-left",$(this).css("left"));
					$("#slidethumb_"+id).attr("data-top",$(this).css("top"));

			});
			clone.on("click", function(e)
			{
				$(".orchthumb").removeClass("currentselection");
				$(this).addClass("currentselection");
				me.selectedOrchElement = $(this);

				rot = me.selectedOrchElement.attr("data-rotate");
				rotx = me.selectedOrchElement.attr("data-rotate-x");
				roty = me.selectedOrchElement.attr("data-rotate-y");
				scale = me.selectedOrchElement.attr("data-scale");
				depth = me.selectedOrchElement.attr("data-z");

				$("#rotationknob").val(rot || 0).trigger("change");
				$("#skewxknob").val(rotx || 0).trigger("change");
				$("#skewyknob").val(roty || 0).trigger("change");
				$("#scalerange").val( scale || 1 );
				$("#depthrange").val( depth || 1000 );
			});
			$(".orchestrationviewport").append(clone);
			orchestrationElements.push( clone );

			l+= 200;
		}
		me.repositionOrchestrationElements( orchestrationElements );
	},
        /*
         * Reposition slides in transition editor based on prior positioning
         */
	repositionOrchestrationElements : function( arr )
	{
		var children = $(".slidethumbholder").children();
		console.log("Current slide count", children.length, "Orchestration el count", arr.length);
		for(var i=0 ; i < arr.length; i++)
		{
			console.log("Props", $(children[i]).attr("data-left"), $(children[i]).attr("data-top"));
			arr[i].css("left", $(children[i]).attr("data-left"));
			arr[i].css("top", $(children[i]).attr("data-top"));
		}
	},
        /*
         * Switch between slide view and transition view
         */
	switchView : function( direction )
	{
		if(direction === "left")
		{
			//me.animatePanel( ".mainviewport", "-730px" )
			$(".maingreyarea").css("display", "none");
			$(".orchgreyarea").css("display", "block");
			$("#viewtoggleicon").removeClass("icon-th-large");
			$("#viewtoggleicon").addClass("fui-cross-24");
			me.currentview = "orchestration";
			me.assembleOrchestrationTiles();
			
		}
		else
		{
			//me.animatePanel( ".mainviewport", "0px" );
			$(".maingreyarea").css("display", "block");
			$(".orchgreyarea").css("display", "none");
			$("#viewtoggleicon").removeClass("fui-cross-24");
			$("#viewtoggleicon").addClass("icon-th-large");
			me.currentview = "mainarea";
			me.persistOrchestrationCoordinates();

		}
	},
        /*
         * Persist/Save new transition variables/coordinates
         */
	persistOrchestrationCoordinates : function()
	{
		var children = $(".orchestrationviewport").children();
		me.orchestrationcoords = [];
		for(var i=0; i<children.length; i++)
		{
			child = $(children[i]);
			l = child.attr("data-left");
			t = child.attr("data-top");
			console.log("Child", i, l, t);
			me.orchestrationcoords.push( {left: l, top: t});
		}
	},
        /*
         * Method handler for when the views are switched between tile and transition editor
         */
	onViewToggled : function ( e )
	{
		if(me.currentview === "mainarea")
		{
			me.switchView( "left");
		}
		else
		{
			me.switchView( "right");
		}
	},
        /*
         * Animate view of settings panel on toggle of views
         */
	animatePanel : function( panel, amount )
	{
		$(".maskedcontainer").animate({"top": amount, "opacity":1}, {duration: 300, easing: "linear" });
	},
        /*
         * Change text format based on style
         */
	changeTextFormat : function( classname )
	{
		if(me.selectedforedit)
		{
                    //alert("in change text format: "+classname);
			me.removeTextFormatting();
			me.selectedElement.addClass(classname);
		}
		
	},
        /*
         * REmove old text formatting before changing to new style
         */
	removeTextFormatting : function()
	{
		me.selectedElement.removeClass("slidelementh1");
		me.selectedElement.removeClass("slidelementh3");
	},
        /*
         * Method not used
         */
	openCodeExportWindow : function()
	{
		me.generateExportMarkup();
		//hljs.tabReplace = '    '; // 4 spaces
		$('pre code').each(function(i, e) {hljs.highlightBlock(e);});
		//me.autoFormat();
		$("#exportcodemodal").modal("show");
	},
        /*
         * Attach all enet listeners to document
         */
	attachListeners : function()
	{
		$("html").on("click", me.manageGlobalClick);
		$(".settingsCancelBtn").on("click", me.onSettingsCancelClicked);
		$(".menuItemBtn").on("click", me.onMenuItemClicked);
		$(".viewtogglebtn").on("click", me.onViewToggled);
		$(".slidelement").on("click", me.triggetElementEdit);
		$(".slidelement").on("mouseup", me.createEditor);
		$("#newstylepanel").on("click", me.openStyleSelector);
		//$("#exportpresopanel").on("click", me.previewPresentationWindow);
		$("#editpresonamebtn").on("click", function( e )
		{
			$("#newpresentationmodal").modal("show");
			$("#newpresoheader").html("Save Presentation As");
			me.mode = "save";
		});
		$(".previewpresobtn").on("click", function( e )
		{
			console.log("data parent id", $(this).attr("data-id"));
			me.fetchAndPreview( $(this).attr("data-id") );
		});
                $("#closetour").on("click", function( e )
		{
			$("#tourmodal").modal("hide");
		});
		$(".openpresobtn").on("click", function( e )
		{
			console.log("Edit presentation");
			me.mode = "save";
			me.openPresentationForEdit( $(this).attr("data-id") );
			
		});
		$("#createpresentation").on("click", function( e )
		{
			console.log("Mode", me.mode);
			if(me.mode === "create")
			{
				me.createNewPresentation();
			}
			else
			{
				console.log("saving now");
				me.savePresentation();
			}
			
			
		});
		$("#savepresentationbtn").on("click", function( e )
		{
			if(me.currentPresentation)
			{
				console.log("Has access to current presentation");
				$("#titleinput").val( me.currentPresentation.title);
				$("textarea#descriptioninput").val( me.currentPresentation.description);
			}
			//$("#newpresentationmodal").modal("show");
			me.mode = "save";
			me.savePresentation();
		});
		$("#exportpresopanel").on("click", function(e)
		{
                    console.log("export clicked ila");
                    me.generateExportMarkup(true);
		});
		$(".dropdownitem").on("click", function( e )
		{
				console.log("Dd value: " , $(e.target).attr("data-dk-dropdown-value"));
				me.changeTextFormat( $(e.target).attr("data-dk-dropdown-value")  );
				$(".dropdownpopup").css("display", "block");
				$(".pulldownmenu").html($(e.target).html());
			//$(".dropdownpopup").css("display", "none");
				me.dropdownopen = true;
				me.hideTransformControl();	
		});
		$("#addtextbtn").on("click", function ( e )
		{
			console.log("add btn clicked...");
			me.addImpressSlideItem( me.selectedSlide );
		});
		$("#addimagebtn").on("click", function( e )
		{
			$("#imagemodal").modal("show");
                        $("#loadingMsgImage").hide();
                        $("#appendimagebtn").show();
		});
                $("#addaudiobtn").on("click", function( e )
		{
                    $("#audiomodal").modal("show");
                        $("#loadingMsgAudio").hide();
			 $("#appendaudiobtn").show();
		});
                $("#addvideobtn").on("click", function( e )
		{
                    $("#videomodal").modal("show");
                        $("#loadingMsgVideo").hide();
			$("#appendvideobtn").show();
		});
		$("#addslidebtn").on("click", function( e )
		{
			me.addSlide();
		});
		$("#imageinput").on("change", function(e)
		{
			////alert("file changed");
                        me.prepareUpload(e);
		});
                $("#audioinput").on("change", function(e)
		{
			////alert("file changed");
                        me.prepareUpload(e);
		});
                $("#videoinput").on("change", function(e)
		{
			////alert("file changed");
                        me.prepareUpload(e);
		});
		$("#appendimagebtn").on("click", function( e )
		{
                        var moduleId = $.cookie("moduleID");
                        //form data validation
                        var isValid = true;
                        var message = "";
                        var fileUploadedName = document.getElementById("imageinput").value;
                        var extension = fileUploadedName.substr(fileUploadedName.length - 3, fileUploadedName.length).toLowerCase();
                        //check if the file extension is correct, should only be mp4??
                        
                        if (extension=== "png" || extension=== "jpg") {
                            ////alert(extension);
                            //do mothing
                        } else {
                            isValid = false;
                            message += "Please upload an PNG or JPG file only."
                           document.getElementById("imageError").innerHTML = message;
                           $("#imageError").show();
                        }

                        //validate before make the ajax call
                        if (isValid){
                            // Create a formdata object and add the files
                            $("#loadingMsgImage").show();
                            $("#appendimagebtn").hide();
                            var data = new FormData();
                            $.each(files, function(key, value)
                            {
                                data.append("upload", value);
                            });

                            ////alert("Complete front end validation, calling the servlet");
                            $.ajax({
                                url: 'URL?moduleId=' + moduleId,
                                type: 'POST',
                                data: data,
                                cache: false,
                                processData: false, // Don't process the files
                                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function(data) {
                               //     //alert(data);
                                    var jdata = JSON.parse(data);
                                 //   //alert(jdata[0].mediaID);
                                    //TO-DO check if need to parse JSON response
                                    var div = document.createElement("div");
                                    $(div).attr("id", "slidelement_"+me.generateUID());
                                    $(div).addClass("image");
                                    $(div).css("height", "300px");
                                    $(div).css("width", "250px");
                                    $(div).css("position", "relative");
                                    $(div).css("top", "100px");
                                    $(div).css("left","20px");
                                    $(div).attr("alt", "image-"+jdata[0].mediaID);
                                    var img = new Image();
                                    $(img).attr("id", "slidelement_"+me.generateUID());
                                    $(img).css("position", "relative");
                                    $(img).css("height", "100%");
                                    $(img).css("width", "100%");
                                    $(img).addClass("slidelement");
                                    $(img).addClass("image");
                                    $(img).attr("src", "data:audio/"+extension+";base64,"+jdata[0].data);
                                    $(img).attr("alt", "image-"+jdata[0].mediaID);
                                    $(div).append($(img));
                                    me.selectedSlide.append( $(div) );
                                    $(div).draggable().resizable();
                                    me.generateScaledSlide(me.selectedSlide);
                                    $("#imagemodal").modal("hide");
                                },
                                error: function(response){
                                    document.getElementById("imageError").innerHTML = "Upload failed, please try again.";
                                    $("#imageError").show();
                                }
                            });
                        }
		});
                $("#appendaudiobtn").on("click", function( e )
		{
			var moduleId = $.cookie("moduleID");

                        //form data validation
                        var isValid = true;
                        var message = "";
                        var fileUploadedName = document.getElementById("audioinput").value;
                        var extension = fileUploadedName.substr(fileUploadedName.length - 3, fileUploadedName.length).toLowerCase();
                        //check if the file extension is correct, should only be mp4??
                        
                        if (extension=== "mp3") {
                            ////alert(extension);
                        } else {
                            isValid = false;
                            message += "Please upload an MP3 file only."
                           document.getElementById("audioError").innerHTML = message;
                           $("#audioError").show();
                        }

                        //validate before make the ajax call
                        if (!isValid) {
                            $("#loadingMsgAudio").hide();
                            $("#appendaudiobtn").show();
                        } else {
                            // Create a formdata object and add the files
                            $("#loadingMsgAudio").show();
                            $("#appendaudiobtn").hide();
                            var data = new FormData();
                            $.each(files, function(key, value)
                            {
                              //  //alert(value);
                                data.append("upload", value);
                            });

                            ////alert("Complete front end validation, calling the servlet");
                            $.ajax({
                                url: 'URL?moduleId=' + moduleId,
                                type: 'POST',
                                data: data,
                                cache: false,
                                processData: false, // Don't process the files
                                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function(data) {
                                    //TO-DO check if need to parse JSON response
                                //    //alert(data);
                                    var jdata = JSON.parse(data);
                                  //  //alert(jdata[0].mediaID);
                                    var audio = new Audio();
                                    audio.controls = true;
                                    var id = me.generateUID();
                                    $(audio).attr("id", "slidelement_"+id);
                                    $(audio).attr("type", "audio/mpeg");
                                    $(audio).addClass("slidelement");
                                    $(audio).attr("src", "videos/"+jdata[0].src);
                                    $(audio).attr("alt", "audio-"+jdata[0].mediaID);
                                    $(audio).css("bottom", "5px");
                                    $(audio).css("right", "20px");
                                    me.selectedSlide.append( $(audio) );
                                    me.enableDrag();
                                    me.generateScaledSlide(me.selectedSlide);
                                    $("#audiomodal").modal("hide");
                                },
                                error: function(response){
                                    document.getElementById("audioError").innerHTML = "Upload failed, please try again.";
                                }
                            });
                        }
		});
                $("#appendvideobtn").on("click", function( e )
		{
			var moduleId = $.cookie("moduleID");
                        var isValid = true;
                        var message = "";

                        //check if the file extension is correct, should only be mp4??
                        var fileUploadedName = document.getElementById("videoinput").value;
                        if (fileUploadedName.substr(fileUploadedName.length - 3, fileUploadedName.length).toLowerCase() === "mp4") {
                            //do mothing
                        } else {
                            isValid = false;
                            message += "Please upload an MP4 file only."
                           document.getElementById("videoError").innerHTML = message;
                           $("#videoError").show();
                        }

                        //validate before make the ajax call
                        if (!isValid) {
                            $("#loadingMsgVideo").hide();
                            $("#appendvideobtn").show();
                        } else {
                            // Create a formdata object and add the files
                            $("#loadingMsgVideo").show();
                            $("#appendvideobtn").hide();
                            var data = new FormData();
                            $.each(files, function(key, value)
                            {
                                data.append("upload", value);
                            });

                            ////alert("Complete front end validation, calling the servlet");
                            $.ajax({
                                url: 'URL?moduleId=' + moduleId,
                                type: 'POST',
                                data: data,
                                cache: false,
                                processData: false, // Don't process the files
                                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function(data) {
                                    var jdata = JSON.parse(data);
                                    var video = document.createElement("video");
                                    ////alert(data);
                                    video.controls = true;
                                    $(video).attr("id", "slidelement_"+me.generateUID());
                                    $(video).attr("type", "video/mp4");
                                    $(video).addClass("slidelement");
                                    $(video).attr("src", "videos/"+jdata[0].src);
                                    $(video).attr("alt", "video-"+jdata[0].mediaID);
                                    $(video).css("bottom", "5px");
                                    $(video).css("right", "20px");
                                    $(video).css("height", "75%");
                                    me.selectedSlide.append( $(video) );
                                    me.enableDrag();
                                    me.generateScaledSlide(me.selectedSlide);
                                    $("#videomodal").modal("hide");
                                },
                                error: function(response){
                                    document.getElementById("videoError").innerHTML = "Upload failed, please try again.";
                                }
                            });
                        }
		});
		$("#openpresentationsbtn").on("click", function( e )
		{
			$(".previewpresobtn").on("click", function( e )
			{
				console.log("data parent id", $(this).attr("data-id"));
				me.fetchAndPreview( $(this).attr("data-id") );
			});
			$(".openpresobtn").on("click", function( e )
			{
				console.log("Edit presentation");
				me.mode = "save";
				me.openPresentationForEdit( $(this).attr("data-id") );
			});
			$("#savedpresentationsmodal").modal("show");
		});
		$("#exportcontentbtn").on("click", function( e )
		{
			me.generateExportMarkup( true );

		
		});
		$(".stylethumbnail").on("click", function(e )
		{
			$(".stylethumbnail").css("border-bottom", "1px dotted #DDD");
			$(this).css("border-bottom", "2px solid #1ABC9C");
			me.theme = $(this).attr("data-style");
		});
		$("#applystylebtn").on("click", function( e )
		{
			me.applyStyle();
			$("#styleselectionmodal").modal("hide");
		});
                $("#editdetailspanel").on("click", function( e )
		{
                    //***clear the dropdown***
                    $('#group')
                        .find('option')
                        .remove()
                        .end()
                    ;
                    $('#category')
                        .find('option')
                        .remove()
                        .end()
                    ;
                    
                    document.getElementById("moduleName").value = $.cookie("moduleName");
                    document.getElementById("endDate").value = $.cookie("endDate");
                    if($.cookie("schedulePublishDate") == null || $.cookie("schedulePublishDate") == ""){
                        document.getElementById("schedulePublishDate").value = "Not specified";
                    }else{
                        document.getElementById("schedulePublishDate").value = $.cookie("schedulePublishDate");
                    }
                    if($.cookie("scheduleRecallDate") == null || $.cookie("scheduleRecallDate") == ""){
                        document.getElementById("scheduleRecallDate").value = "Not specified";
                    }else{
                        document.getElementById("scheduleRecallDate").value = $.cookie("scheduleRecallDate");
                    }
                    
                    var runtime = $.cookie("runtime");
                    ////alert(runtime);
                    var result = (runtime/60);
                    var mins = Math.floor(result);
                    var secs = Math.ceil((result - mins)*60);
                    
                    document.getElementById("mins").value = mins;
                    document.getElementById("secs").value = secs;
                    //get all categories and select those existing
                    $.ajax({
                            type: 'GET',
                            url: 'URL?getmods=category',
                            dataType: "json",
                            cache: false,
                            success: function(data)
                            {
                                var du1 = document.getElementById("category");
                                var opt = "Select";
                                var el = document.createElement("option");
                                el.textContent = opt;
                                el.value = "";
                                du1.appendChild(el);
                                for (var i = 0; i < data.length; i++) {
                                    var opt = data[i].name;
                                    var el = document.createElement("option");
                                    el.textContent = opt;
                                    el.value = opt;
                                    if(opt===$.cookie("category")){
                                        el.selected = true;
                                    }
                                    du1.appendChild(el);
                                }
                            }
                    });
                    //get and select all target groups
                    $.ajax({
                            type: 'GET',
                            url: 'URL?getmods=group',
                            dataType: "json",
                            cache: false,
                            success: function(data)
                            {
                                var du1 = document.getElementById("group");
                                var opt = "Select";
                                var el = document.createElement("option");
                                el.textContent = opt;
                                el.value = "";
                                du1.appendChild(el);
                                for (var i = 0; i < data.length; i++) {
                                    var opt = data[i].name;
                                    var el = document.createElement("option");
                                    el.textContent = opt;
                                    el.value = opt;
                                    var cookie = $.cookie("targetGroup");
                                    if(opt===cookie.trim()){
                                        el.selected = true;
                                    }
                                    du1.appendChild(el);
                                }
                            }
                    });
                    $("#editdetailsmodal").modal("show");
		});
                $("#editdetailsbtn").on("click", function( e )
		{
                    var moduleID = $.cookie("moduleID");
                    
                    //get the orginial runtime
                    var orginialRuntime = $.cookie("runtime");
                    var result = (orginialRuntime/60);
                    var mins = Math.floor(result);
                    var secs = Math.ceil((result - mins)*60);
                    
                    var data = {};
                    data["method"] = "editModuleDetails";
                    data["moduleID"]= moduleID;
                    data["moduleName"]= document.getElementById("moduleName").value;
                    data["category"]= document.getElementById("category").value;
                    data["targetGroup"]= document.getElementById("group").value;
                    data["endDate"]= document.getElementById("endDate").value;
                    
                    if(document.getElementById("schedulePublishDate").value == null || document.getElementById("schedulePublishDate").value == "" || document.getElementById("schedulePublishDate").value == "Not specified"){
                        data["schedulePublishDate"] = "";
                        ////alert(data["schedulePublishDate"]);
                    }else{
                        data["schedulePublishDate"] = document.getElementById("schedulePublishDate").value;
                        ////alert(data["schedulePublishDate"]);
                    }
                    if(document.getElementById("scheduleRecallDate").value == null || document.getElementById("scheduleRecallDate").value == "" || document.getElementById("scheduleRecallDate").value == "Not specified"){
                        data["scheduleRecallDate"] = "";
                        ////alert(data["scheduleRecallDate"]);
                    }else{
                        data["scheduleRecallDate"] = document.getElementById("scheduleRecallDate").value;
                        ////alert(data["scheduleRecallDate"]);
                    }
                    //data["scheduleRecallDate"] = document.getElementById("scheduleRecallDate").value;
                    data["mins"]= document.getElementById("mins").value;
                    data["secs"]= document.getElementById("secs").value;
                    var putjson = JSON.stringify(data);
                    
                    //validation of the fields
                    var message = "";
                    if(data["moduleName"] == null || data["moduleName"] == ""){
                        message += "Please fill in the module name";
                    }
                    if(data["mins"] == null || data["mins"] == ""){
                        message += "Please enter a valid minute";
                    }
                    if(data["secs"] == null || data["secs"] == ""){
                        message += "Please enter a valid second";
                    }
                    if(data["category"] == null || data["category"] == ""){
                        message += "Please select a category";
                    }
                    if(data["targetGroup"] == null || data["targetGroup"] == ""){
                        message += "Please select a trinee group";
                    }
                    //validate the date will updated to jquery date pciker
                    if(data["endDate"] == null || data["endDate"] == ""){
                        message += "Please enter a valid date";
                    }
                    
                    if(data["mins"] == mins && data["secs"] == secs){
                        //contiue with our showing any erro
                            if(message === null || message === ""){
                                ////alert(putjson);
                                $.ajax({
                                        type: 'PUT',
                                        url: 'URL',
                                        data: putjson,
                                        dataType: "json",
                                        cache: false,
                                        success: function(msg)
                                         {  
                                            $("#overlay").hide();
                                            $("#popup").hide();
                                            setTimeout(function(){$("#editdetailsmodal").modal("hide");}, 200);
                                            //***update the cookies***
                                            $.cookie("moduleName", document.getElementById("moduleName").value);
                                            $.cookie("category", document.getElementById("category").value);
                                            $.cookie("targetGroup", document.getElementById("group").value);
                                            $.cookie("endDate", document.getElementById("endDate").value);
                                            var updatedRuntime = +document.getElementById("mins").value  * 60 + +document.getElementById("secs").value;
                                            $.cookie("runtime", updatedRuntime);
                                            $.cookie("schedulePublishDate", document.getElementById("schedulePublishDate").value);
                                            $.cookie("scheduleRecallDate", document.getElementById("scheduleRecallDate").value);
                                        }
                                });
                            }else{
                                //alert(message);
                            }
                    }else{
                        document.getElementById("errorText").innerHTML = "Are you sure to update timer for all slides as timer for specific slide will lost?";
                        $("#overlay").show();
                        $("#popup").show();
                        document.getElementById("no").onclick = function () {
                            $("#overlay").hide();
                            $("#popup").hide();
                        };
                        document.getElementById("yes").onclick = function () {
                            
                            //only make the ajax call when field are valid
                            if(message === null || message === ""){
                                ////alert(putjson);
                                $.ajax({
                                        type: 'PUT',
                                        url: 'URL',
                                        data: putjson,
                                        dataType: "json",
                                        cache: false,
                                        success: function(msg)
                                         {  
                                            $("#overlay").hide();
                                            $("#popup").hide();
                                            setTimeout(function(){$("#editdetailsmodal").modal("hide");}, 200);
                                            //***update the cookies***
                                            $.cookie("moduleName", document.getElementById("moduleName").value);
                                            $.cookie("category", document.getElementById("category").value);
                                            $.cookie("targetGroup", document.getElementById("group").value);
                                            $.cookie("endDate", document.getElementById("endDate").value);
                                            var updatedRuntime = +document.getElementById("mins").value  * 60 + +document.getElementById("secs").value;
                                            $.cookie("runtime", updatedRuntime);
                                            $.cookie("schedulePublishDate", document.getElementById("schedulePublishDate").value);
                                            $.cookie("scheduleRecallDate", document.getElementById("scheduleRecallDate").value);
                                            ////alert(updatedRuntime);
                                            ////alert($.cookie("moduleName"));
                                            ////alert($.cookie("category"));
                                            ////alert($.cookie("targetGroup"));
                                            ////alert($.cookie("endDate"));

                                        }
                                });
                            }else{
                                //alert(message);
                            }
                        };
                    }  
		});
                $("#addtimerbtn").on("click", function (e){
                    var moduleID = $.cookie("moduleID");
                    children = me.selectedSlide.children();
                    var slideId = "";
                    $.each(children, function(i, elch){
                    if(elch instanceof HTMLImageElement){
                        var alt = $(elch).attr("alt");
                        var split = alt.split("-");
                        if(split[0]==="slide"){
                            slideId = split[1];
                        }
                    }});
                    document.getElementById("timermins").value = "";
                    document.getElementById("timersecs").value = "";
                    $.ajax({
			type: 'GET',
			url: 'URL',
			data: {"getmods":"timer", "moduleId":moduleID, "slideId":slideId},
                        cache: false,
			success: function(data)
			{   
                            var jdata = JSON.parse(data);
                            document.getElementById("timermins").value = jdata[0].mins;
                            document.getElementById("timersecs").value = jdata[0].secs;
                            document.getElementById("timerMsg").innerHTML = "";
                        },
                        error: function(err){
                            document.getElementById("timerMsg").innerHTML = "Default timer attached to this slide";
                            $("#timerMsg").show();
                        }
                    });
                    $("#timermodal").modal("show");
                    $("#tBody").show();
                    var runtime = $.cookie("runtime");
                    var result = (runtime/60);
                    var mins = Math.floor(result);
                    var secs = Math.ceil((result - mins)*60);
                    document.getElementById("timermins").value = mins;
                    document.getElementById("timersecs").value = secs;
                });
                $("#savetimerbtn").on("click", function (e){
                    //TO-DO check if timer > duration of audio/video
                    var moduleID = $.cookie("moduleID");
                    children = me.selectedSlide.children();
                    var slideId = "";
                    $.each(children, function(i, elch){
                    if(elch instanceof HTMLImageElement){
                        var alt = $(elch).attr("alt");
                        var split = alt.split("-");
                        if(split[0]==="slide"){
                            slideId = split[1];
                        }
                    }});
                    var data = {};
                    data["method"] = "editTimer";
                    data["moduleID"]= moduleID;
                    data["slideID"]= slideId;
                    data["mins"]= document.getElementById("timermins").value;
                    data["secs"]= document.getElementById("timersecs").value;
                    var putjson = JSON.stringify(data);
                    $.ajax({
                                type: 'PUT',
                                url: 'URL',
                                data: putjson,
                                dataType: "json",
                                cache: false,
                                success: function(msg)
                                 {
                                    $("#tBody").hide();
                                    document.getElementById("timerMsg").innerHTML = "Timer for this slide has been updated.";
                                    $("#timermodal").modal("hide");
                                }
                        });
                });
                $("#addcheckpointbtn").on("click", function (e){
                   $("#checkpointmodal").modal("show"); 
                   $("#cpBody").show();
                   $("#cpFooter").show();
                   $("#cpMessage").hide();
                    var moduleID = $.cookie("moduleID");
                    children = me.selectedSlide.children();
                    var slideId = "";
                    $.each(children, function(i, elch){
                    if(elch instanceof HTMLImageElement){
                        var alt = $(elch).attr("alt");
                        var split = alt.split("-");
                        if(split[0]==="slide"){
                            slideId = split[1];
                        }
                    }});
                    document.getElementById("question").value = "";
                    document.getElementById("questionChoice1").value = "";
                    document.getElementById("questionChoice2").value = "";
                    document.getElementById("questionChoice3").value = "";
                    document.getElementById("questionChoice4").value = "";
                    document.getElementById("radioChoice1").checked = true;
                    document.getElementById("explanation").value = "";
                    document.getElementById("question").disabled = false;
                   $.ajax({
			type: 'GET',
			url: 'URL',
			data: {"moduleId":moduleID, "slideId":slideId},
                        cache: false,
			success: function(data)
			{
                            document.getElementById("question").value = data[0].question;
                            document.getElementById("question").disabled = true;
                            document.getElementById("questionChoice1").value = data[0].choice1;
                            document.getElementById("questionChoice2").value = data[0].choice2;
                            document.getElementById("questionChoice3").value = data[0].choice3;
                            document.getElementById("questionChoice4").value = data[0].choice4;
                            document.getElementById("radioChoice"+data[0].answer).checked = true;
                            document.getElementById("explanation").value = data[0].explanation;
                            document.getElementById("cperror").innerHTML = "";
                        },
                        error: function(err){
                            document.getElementById("cperror").innerHTML = "No checkpoint attached to this slide, save new checkpoint";
                        }
		});
                   
                   
                });
                $("#savecheckpointbtn").on("click", function (e){
                var moduleID = $.cookie("moduleID");
                children = me.selectedSlide.children();
                var slideId = "";
                $.each(children, function(i, elch){
                if(elch instanceof HTMLImageElement){
                    var alt = $(elch).attr("alt");
                    var split = alt.split("-");
                    if(split[0]==="slide"){
                        slideId = split[1];
                    }
                }});
                var checkPointQuestion=document.getElementById("question").value;
                var methodcall = 'POST';
                if(document.getElementById("question").disabled === true){
                    methodcall = 'PUT';
                }
                var choice1= document.getElementById("questionChoice1").value;
                var choice2 = document.getElementById("questionChoice2").value;
                var choice3= document.getElementById("questionChoice3").value;
                var choice4 = document.getElementById("questionChoice4").value;
                var answer = $('input[name=radio]:radio:checked').val();
                var explanation= document.getElementById("explanation").value;
                var error = "";
                var continueFlag = false;
                if(checkPointQuestion===""){
                    error+="Please enter a question";
                    continueFlag = false;
                }else if(choice1===""||choice2===""||choice3===""||choice4===""){
                    error+="Please check answer choices";
                    continueFlag = false;
                }
                if(error===""){continueFlag = true;}
                if(methodcall==='PUT' && continueFlag){
                    var data = {};
                    data["moduleId"] = moduleID;
                    data["slideId"] = slideId;
                    data["checkPointQuestion"] = checkPointQuestion;
                    data["choice1"]= choice1;
                    data["choice2"]= choice2;
                    data["choice3"]=choice3;
                    data["choice4"]=choice4;
                    data["answer"]=answer;
                    data["explanation"]= explanation;
                    var putdata = JSON.stringify(data);
                    $.ajax({
			type: 'PUT',
			url: 'URL',
			data: putdata,
                        cache: false,
			success: function()
			 {
                            ////alert("successful");
                            $("#cpBody").hide();
                            $("#cpMessage").show();
                            $("#cpFooter").hide();
                            document.getElementById("cpMessage").innerHTML = "Updated Checkpoint!";
                            setTimeout(function(){$("#checkpointmodal").modal("hide");}, 2000); 
                        },
                        error: function(err){
                            ////alert("error saving");
                            document.getElementById("cperror").innerHTML = err;
                        }
		});
                    
                }else if(methodcall==='POST' && continueFlag) {
                        $.ajax({
                            type: 'POST',
                            url: 'URL',
                            cache: false,
                            data: {"moduleId":moduleID, "slideId":slideId, "checkPointQuestion":checkPointQuestion,
                                   "choice1":choice1, "choice2":choice2,"choice3":choice3,"choice4":choice4,
                                   "answer":answer, "explanation":explanation},
                            success: function()
                             {
                                $("#cpBody").hide();
                                $("#cpMessage").show();
                                $("#cpFooter").hide();
                                document.getElementById("cpMessage").innerHTML = "New Checkpoint Added!";
                                setTimeout(function(){$("#checkpointmodal").modal("hide");}, 2000); 
                            },
                            error: function(err){
                                document.getElementById("cperror").innerHTML = err;
                            }
                    });
                }else{
                    document.getElementById("cperror").innerHTML = error;
                }
                });
                
                $("#deletecheckpointbtn").on("click", function (e){
                var moduleId = $.cookie("moduleID");
                var question=document.getElementById("question").value;
                children = me.selectedSlide.children();
                var slideId = "";
                $.each(children, function(i, elch){
                if(elch instanceof HTMLImageElement){
                    var alt = $(elch).attr("alt");
                    var split = alt.split("-");
                    if(split[0]==="slide"){
                        slideId = split[1];
                    }
                }});
                ////alert(moduleId+" "+slideId+" "+question);
                var data = {};
                data["moduleId"] = moduleId;
                data["slideId"] = slideId;
                data["question"] = question;
                var deletejson = JSON.stringify(data);
                $.ajax({
			type: 'DELETE',
			url: 'URL',
                        cache: false,
			data: deletejson,
			success: function()
			 {
                            $.each(children, function(i, elch){
                            if(elch instanceof HTMLImageElement){
                                var src = $(elch).attr("src");
                                if(src==="img/checkpoint.jpg"){
                                    elch.remove();
                                }
                            }});
                            $("#checkpointmodal").modal("hide"); 
                        },
                        error: function(err){
                            document.getElementById("cperror").innerHTML = err;
                        }
		});
                   
                });
                

		
	},
        /**
         * Apply new style from among Google Fonts
         * @returns {undefined}
         */
	applyStyle : function()
	{
		$(".slidelement").each( function( i, object)
			{
				if($(this).hasClass("slidelementh1"))
				{
					console.log("Only change headings.");
					me.removeAllStyles( $(this));
					$(this).addClass(me.theme);
				}
			});
	},
        /**
         * Take in element and remove all previous styles
         * @param {type} el
         * @returns {undefined}
         */
	removeAllStyles : function( el )
	{
		el.removeClass("quicksand");
		el.removeClass("montserrat");
		el.removeClass("sketch");
		el.removeClass("miltonian");
	},
        /**
         * Select new Style for text elements
         * @returns {undefined}
         */
	openStyleSelector : function()
	{
		$("#styleselectionmodal").modal("show");
	},
        /*
         * Method not used
         */
	deleteSavedPresentation : function( id )
	{
		presentations = JSON.parse(me.getItem(me.saveKey));
		for(var i=0; i< presentations.length; i++)
		{
			presentation = presentations[i];
			if(id === presentation.id)
			{
				presentations.splice(i, 1);
				break;
			}
		}
		console.log("after delete", presentations);
		me.saveItem(me.saveKey, JSON.stringify(presentations));
		presentations = me.getSavedPresentations();
		me.renderPresentations( presentations );
		lastsaved =JSON.parse(me.getItem(me.lastSaved));
		if(lastsaved.id === id)
		{
			console.log("lastsaved", lastsaved.id);
			localStorage.removeItem(me.lastSaved);
		}
	},
        /**
         * Checks if command is for preview
         * If True, generates impress code, saves to database and displays in new window
         * If False, generates impress code and saves to database
         * @param {type} isPreview
         * @returns {undefined}
         */
	generateExportMarkup : function( isPreview )
	{
                var srcList = [];
		var children = $(".slidethumbholder").children();
			for(var i=0; i<children.length; i++)
			{
				child = $(children[i]);
				id = child.attr("id").split("_")[1];
				l = child.attr("data-left").split("px")[0];
				t = child.attr("data-top").split("px")[0];
                                coords = me.calculateSlideCoordinates(l,t);
				el = $("#impress_slide_"+id);
                                elch = el.children();
                                elch1 = $(elch[0]);
                                //alert("is ppt?"+elch1.hasClass("ppt"));
                                //alert("is img?"+elch1.hasClass("image"));
                                if(elch1.hasClass("ppt")){
                                    elch1.removeClass("ppt");
                                    elch1.addClass("pptpresent");
                                    var src = $(elch1).attr("src");
                                    srcList.push(src);
                                    elch1.removeAttr("src");
                                }else if(elch1.hasClass("image")){
                                    img = $(elch1).children()[0];
                                    var src = $(img).attr("src");
                                    srcList.push(src);
                                    $(img).removeAttr("src");
                                }
                                el.attr("data-x", coords.x - 1000);
				el.attr("data-y", coords.y);
				el.attr("data-rotate", child.attr("data-rotate"));
				el.attr("data-rotate-x", child.attr("data-rotate-x"));
				el.attr("data-rotate-y", child.attr("data-rotate-y"));
				el.attr("data-z", child.attr("data-z"));
				el.attr("data-scale", child.attr("data-scale"));
				el.addClass("step");
                                el.addClass("slide");
                                el.removeClass("impress-slide");
                                el.removeClass("impress-slide-element");
                                el.removeClass("montserrat");
                                
                        }
			outputcontainer = $(".impress-slide-container").clone();
			console.log("output", $(".impress-slide-container").html().toString());
			outputcontainer.find(".impress-slide").each( function(i, object )
			{
				console.log("Physically adding sizing information");
				$(this).css("width", "1024px");
				$(this).css("height", "768px");
				
			});
                        //alert("saving this: "+outputcontainer.html().toString());
                        if(isPreview)
			{
                           me.generatePreview( outputcontainer.html().toString() );
			}
                        //$("#exportedcode").text( outputcontainer.html().toString() );
                        var children = $(".slidethumbholder").children();
			for(var i=0; i<children.length; i++)
			{
				child = $(children[i]);
				id = child.attr("id").split("_")[1];
				el = $("#impress_slide_"+id);
                                elch = el.children();
                                elch1 = $(elch[0]);
                                if(elch1.hasClass("pptpresent")){
                                    elch1.removeClass("pptpresent");
                                    elch1.addClass("ppt");
                                    $(elch1).attr("src", srcList[i]);
                                }else if(elch1.hasClass("image")){
                                    img = $(elch1).children()[0];
                                    $(img).attr("src",srcList[i]);
                                }
                                el.addClass("impress-slide");
                                el.addClass("impress-slide-element");
                                el.addClass("montserrat");
                        }
	},
        /*
         * Method not used
         */
	createNewPresentation : function()
	{
		$(".slidethumbholder").html("");
		$(".impress-slide-container").html();
		me.addSlide();
		me.savePresentation();
	},
        /*
         * Method not used YET
         */
	openPresentationForEdit : function( id )
	{
		console.log("id", id);
		for(var i=0; i<me.mypresentations.length; i++)
		{
			presentation = me.mypresentations[i];
			if(id === presentation.id)
			{
				$(".impress-slide-container").html(presentation.contents);
				$(".slidethumbholder").html(presentation.thumbcontents);
				$(".slidethumbholder").each( function(i, object )
				{
					$(this).css("opacity", 1);
				});

				me.selectedSlide = $(".impress-slide-container").find(".impress-slide-element");
				me.currentPresentation = presentation;
				$("#presentationmetatitle").html(me.currentPresentation.title);
				console.log("rendered");
			}

			$("#savedpresentationsmodal").modal("hide");

		}
		$(".slidemask").on("click", function( e )
		{
				console.log("repopulated zone");
				e.stopPropagation();
				id = (e.target.id).split("_")[1];
				console.log("slidemask", id);
				me.selectSlide( "#impress_slide_"+id );
				$(".slidethumb").removeClass("currentselection");
				$("#slidethumb_"+id).addClass("currentselection");
				me.hideTransformControl();
				me.switchView("right");
		});
		$(".deletebtn").on("click", function ( e )
		{
			p = $("#"+ $(this).attr("data-parent"));
			slideid = $(this).attr("data-parent").split("_")[1];
			console.log("parent", p, slideid);
			p.animate({opacity:0}, 200, function( e )
			{
				$(this).remove();
				$("#impress_slide_"+slideid).remove();
				me.assignSlideNumbers();
			});
		});
		me.enableDrag();
	},
        /*
         * Takes in ID of presentation and does a preview
         */
	fetchAndPreview : function( id )
	{
		for(var i=0; i<me.mypresentations.length; i++)
		{
			presentation = me.mypresentations[i];
			if(id === presentation.id)
			{
				console.log("content", presentation.contents);
				$(".placeholder").html( presentation.contents);
				$(".placeholder").find(".impress-slide").each( function(i, object )
				{
					console.log("Physically adding sizing information, again");
					$(this).css("width", "1024px");
					$(this).css("height", "768px");
					$(this).addClass("step");
				});
				me.generatePreview( $(".placeholder").html().toString());
				$("#savedpresentationsmodal").modal("hide");
				break;
			}
		}
	},
        removeReference : function( arr )
	{
		
		for(var i=0; i<arr.length; i++ )
		{
			if(arr[i].id === me.currentPresentation.id);
			{
				arr.splice(i,1);
				break;
			}
		}

		return arr;
	},
        /*
         * Method not used
         */
	getSavedPresentations : function()
	{
			item = me.getItem(me.saveKey);
			arr = [];
			if(item)
			{
				 arr = JSON.parse(item);
			}
			return arr;
	},
        /*
         * Generate code markup for preview/save
         */
	generatePreview : function ( str )
	{
		//$("#previewmodal").modal("show");
		//$("#openpreviewbtn").addClass("disabled");
		//$("#openpreviewbtn").removeClass("btn-primary");
		//$("#progressmeter").css("display", "block");
		//$("#previewmessage").html("Please wait while we generate the preview.");
                var moduleID = $.cookie("moduleID");
                var data = {};
                data["method"] = "updateImpressCode";
                data["impressCode"]= str;
                data["moduleID"]= moduleID;
                var putjson = JSON.stringify(data);
                $.ajax({
			type: 'PUT',
			url: 'URL',
			data: putjson,
			dataType: "json",
			success: function(msg)
			 {
                             window.open("previewModuleImpressify.html?moduleID="+moduleID,"_blank");
                        }
		});
	},
        /**
         * Takes in x and y coordinates of the slide and calculates their position in transition editor
         * @param {type} wx
         * @param {type} wy
         * @returns {Impressionist.prototype.calculateSlideCoordinates.object}
         */
	calculateSlideCoordinates : function(wx, wy)
	{
		var vx = Math.round(((me.vxmax - me.vxmin)/(me.wxmax - me.wxmin) )*(wx - me.wxmin) + me.vxmin);
		var vy = Math.round(((me.vymax - me.vymin)/(me.wymax - me.wymin) )*(wy - me.wymin) + me.vymin);
		var object = {x:vx, y:vy};
		console.log("object", object);
		return object;
	},
        /**
         * Adds image of input src to slide
         * @param {type} src
         * @returns {undefined}
         */
	addImageToSlide : function( src )
	{
		console.log("adding image", src);
		var img = new Image();
		$(img).attr("id", "slidelement_"+me.generateUID());
		$(img).css("left", "5px");
		$(img).css("bottom", "500px");
                if(src==="img/checkpoint.jpg"){
                    $(img).css("width", "75px");
                    $(img).css("height", "30px");
                    $(img).css("z-index", "2");
                }
		$(img).addClass("slidelement");
		$(img).attr("src", src);
		console.log("selectedslide", me.selectedSlide);
		me.selectedSlide.append( $(img) );
		me.enableDrag();
                me.generateScaledSlide(me.selectedSlide);
	},
        addImageToSlideFromDB : function( src, imguid, alt, sid )
	{
            var div = document.createElement("div");
            $(div).attr("id", "slidelement_"+me.generateUID());
            $(div).addClass("image");
            $(div).css("height", "300px");
            $(div).css("width", "250px");
            $(div).css("position", "relative");
            $(div).css("top", "100px");
            $(div).css("left","20px");
            $(div).attr("alt", "image-"+alt);
            var img = new Image();
            $(img).attr("id", imguid);
            $(img).css("position", "relative");
            $(img).css("height", "100%");
            $(img).css("width", "100%");
            $(img).addClass("slidelement");
            $(img).addClass("image");
            $(img).attr("src", "data:image/png;base64,"+src);
            $(img).attr("alt", "image-"+alt);
            me.selectSlide("#impress_slide_"+sid);
            $(div).append($(img));
            $(div).draggable().resizable();
            me.selectedSlide.append( $(div));
            me.generateScaledSlide(me.selectedSlide);
        },
        addAudioToSlideFromDB : function( src, imguid, alt, sid )
	{
            var audio = new Audio();
            audio.controls = true;
            $(audio).attr("id", imguid);
            $(audio).attr("type", "audio/mpeg");
            $(audio).addClass("slidelement");
            $(audio).attr("src", "videos/"+src);
            $(audio).attr("alt", "audio-"+alt);
            $(audio).css("bottom", "5px");
            $(audio).css("left", "20px");
            me.selectSlide("#impress_slide_"+sid);
            me.selectedSlide.append( $(audio) );
            me.enableDrag();
            me.generateScaledSlide(me.selectedSlide);
        },
        addVideoToSlideFromDB : function( src, imguid, alt, sid )
	{
             var video = document.createElement("video");
            ////alert(data);
            video.controls = true;
            $(video).attr("id", imguid);
            $(video).attr("type", "video/mp4");
            $(video).addClass("slidelement");
            $(video).attr("src", "videos/"+src);
            $(video).attr("alt", "video-"+alt);
            $(video).css("bottom", "0px");
            $(video).css("left", "0px");
            $(video).css("height", "75%");
            me.selectSlide("#impress_slide_"+sid);
            me.selectedSlide.append( $(video) );
            me.enableDrag();
            me.generateScaledSlide(me.selectedSlide);
        },
        addElementToSlideFromDB : function( el, sid )
	{
            me.selectSlide("#impress_slide_"+sid);
            me.selectedSlide.append( $(el) );
            me.enableDrag();
            me.generateScaledSlide(me.selectedSlide);
        },
        /**
        /**
         * Adds src of PPT image to slide with slideID in database as alterative text
         * @param {type} src
         * @param {type} id
         * @returns {undefined}
         */
        addPPTImageToSlide : function( src, id )
	{
                var dataimg = "data:image/png;base64,"+src;
		var img = new Image();
		$(img).attr("id", "slidelement_"+me.generateUID());
		$(img).addClass("ppt");
		$(img).attr("src", dataimg);
                $(img).attr("alt", "slide-"+id);
		console.log("selectedslide", me.selectedSlide);
		me.selectedSlide.append( $(img) );
		me.enableDrag();
                me.generateScaledSlide(me.selectedSlide);
	},
        addPPTImageToSlideFromDB : function( src, imguid, alt, sid )
	{
                var dataimg = "data:image/png;base64,"+src;
                me.selectSlide("#impress_slide_"+sid);
                children = me.selectedSlide.children();
                var img = new Image();
		$(img).attr("id", imguid);
		$(img).addClass("ppt");
		$(img).attr("src", dataimg);
                $(img).attr("alt", "slide-"+alt);
		console.log("addppttoslidefromdbselectedslide", me.selectedSlide);
                me.selectedSlide.append( $(img) );
		me.enableDrag();
                me.generateScaledSlide(me.selectedSlide);
	},
        /**
         * Remove/Delete slide from sidebar
         * @param {type} el
         * @returns {undefined}
         */
	removeSlide : function(el)
	{
		el.remove();
		clearInterval(me.deleteslideinterval);
	},
        /*
         * Initial creation of editor
         */
	createEditor : function( e )
	{
		editor = $(e.target).clone();
		editor.attr("contentEditable", "true");
	},
        /*
         * Event listener for element edit
         */
	triggetElementEdit : function( e )
	{
		$(e.target).attr("contentEditable", true);
	},
        /*
         * Remove all event listeners
         */
	removelisteners : function()
	{
		$(".settingsCancelBtn").off();
		$(".viewtogglebtn").off();
	},
        /*
         * On settings being cancelled
         */
	onSettingsCancelClicked : function( e )
	{
		console.log("clicked");
		me.animateSettingsPanel( "left" );

	},
        /**
         * Event Listener for Menu Item e
         * @param {type} e
         * @returns {undefined}
         */
	onMenuItemClicked : function( e )
	{
		$("#newpresentationmodal").modal("show");
		$("#newpresoheader").html("Create New Presentation");
		me.mode = "create";
	},
        /**
         * Calculate all min, actual and max coordinates of x and y horizontal and vertical for transition editor
         * @param {type} wx
         * @param {type} wy
         * @param {type} vxmax
         * @param {type} vxmin
         * @param {type} vymax
         * @param {type} vymin
         * @param {type} wxmax
         * @param {type} wxmin
         * @param {type} wymax
         * @param {type} wymin
         * @returns {Impressionist.prototype.calculateThumbnailCoords.object}
         */
	calculateThumbnailCoords : function(wx, 
										wy, 
										vxmax, 
										vxmin, 
										vymax, 
										vymin, 
										wxmax, 
										wxmin, 
										wymax, 
										wymin
										)
	{
		var vx = Math.round(((vxmax - vxmin)/(wxmax - wxmin) )*(wx - wxmin) + vxmin);
		var vy = Math.round(((vymax - vymin)/(wymax - wymin) )*(wy - wymin) + vymin);
		var object = {x:vx, y:vy};
		return object;
	},
        /*
         * Save item in local storage / cache
         */
	saveItem : function(key, value)
	{
		if(me.isSupported())
		{
			localStorage.setItem(key, value);
		}

	},
        /*
         * get item from local storage
         */
    getItem : function(key)
	{
		return localStorage.getItem(key);
	},
        /*
         * For if cache is supported or not
         */
	isSupported : function()
	{
		if(localStorage)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};