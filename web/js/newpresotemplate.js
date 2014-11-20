/*
 * Contains sample strings of HTML content for editor. 
 * New Presentation Span
 * New Slide sidebar content
 * New Impress Slide content
 * New Impress Slide PPT content
 * New Text Snippet
 * All Saved Presentations
 */
var newpresotemplate = '<div id="newpreso">'+
						   '<h4 id="presotitle" class="settingsboxheader">Title</h4><input id="presotitleinput" type="text"></input>'+
						   '<h4 id="presodescription" class="settingsboxheader">Description</h4><textarea id="presotitledescription"></textarea>'+
						   '<a class="btn btn-large btn-primary btn-inline previewbtn settingsCancelBtn" id="newpresocancel">&nbsp;Cancel</a>'+
          				   '<a class="btn btn-large btn-inline btn-info previewbtn">&nbsp;OK</a>'
          				'</div>'
var slidethumb = '<div id="slidethumb_^UID^" class="slidethumb thumbelement">'+
					 '<div class="thumbnailholder"></div>'+
					 '<canvas class="slidemask" id="slidethumb_^UID^" style="z-index:1000; width:100%; height:100%; background-color:#FFF; opacity:0.1; left:0px; top:0px; position:absolute"></canvas>'+
					'<a id="deletebtn" data-parent="slidethumb_^UID^" style="z-index:1001; right:10px; top:0px; height:20px;" class="btn btn-info btn-small deletebtn"><i class="fui-cross-16"></i></a>'+
				 '</div>';
var impress_slide = '<div class="impress-slide" id="impress_slide__slidenumber__">'+
						'<div class="slidelement slidelementh1" id="slidelement_id" data-parent="impress_slide__slidenumber__" data-type="h2" style="width:500px; height:60px; position:absolute; left:200px; top:50px; whitespace:normal;" contentEditable="true">Double Click to Edit </div>'+
                    	'<div class="slidelement slidelementh3" id="slidelement_id" data-parent="impress_slide__slidenumber__" data-type="h3" style="position:absolute; width:450px; height:40px; left:350px; top:120px; whitespace:normal;" contentEditable="true" onmouseup="function(el){$(this).addClass("selectText");}">Double Click to Edit</div>'
                	'</div>';
var impress_slide_ppt = '<div class="impress-slide" id="impress_slide__slidenumber__"></div>';
 var text_snippet = '<div alt="text" class="slidelement slidelementh1" id="slidelement_id" data-parent="impress_slide__slidenumber__" data-type="h2" style="width:auto; height:60px; position:absolute; left:300px; top:50px; whitespace:normal;" contentEditable="true" onmouseup="function(el){$(this).addClass("selectText");}">Double Click to Edit</div>';
 var saved_presentations = '<div class="savedpresos">' +
 								'<div class="presothumbcontent">' +
 								'<h3 style="display:inline-block; color:#2980B9" contentEditable="true"> __presotitle__</h3>'+
 								'<p style="font-size: 120%" contentEditable="true">__presodescription__</p>'+
 								'</div>'+
 								'<div class="presothumb idle" >'+
         							'<a href="#"  data-id="__presoid__" class="btn btn-inline btn-info openpresobtn" style="position:absolute; right: 10px; top: 10px"><i class="fui-eye-16"></i></a>' +
 									'<a href="#"  data-id="__presoid__" class="btn btn-inline btn-danger deletepresobtn" style="position:absolute; right: 60px; top: 10px"><i class="icon-trash"></i></a></br>'+
 								'</div>' +
 							'</div>';