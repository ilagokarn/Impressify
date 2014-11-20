/**
 * On document load:
 * Gets requested module from URL
 * Initializes Impress using ModuleID
 */
$(document).ready( function (e)
{
    document.getElementById("usernameHolder").innerHTML = $.cookie("LoggedInUser");
    var moduleID = location.search.split('moduleID=')[1] ? location.search.split('moduleID=')[1] : '0';
    $.cookie("moduleID", moduleID);
    impressionist(moduleID);
    $.fn.datePick();

});
 /**
  * Takes in moduleID and gets module data from servlet. Loads editor with slides from saved html code for the whole presentation.
  * Calls individual slides and loads directly into the Impressify editor
  * @param {type} moduleID
  * @returns {undefined}
  */
 function impressionist(moduleID)
    {
        impressionist = new Impressionist();
        impressionist.initialize();
        impressionist.addSettingsPanel(" ");
        $.get("URL", 
        {
            "moduleID":moduleID
        },
        function(data) {
            var runtime=0;
            for(var i = 0; i < data.length; i++) {
                $.cookie("moduleName", data[i].moduleName);
                $.cookie("category", data[i].category);
                $.cookie("targetGroup", data[i].targetGroup);
                $.cookie("endDate", data[i].endDate);
                $.cookie("schedulePublishDate", data[i].schedulePublishDate);
                $.cookie("scheduleRecallDate", data[i].scheduleRecallDate);
                ////alert($.cookie("schedulePublishDate"));
                ////alert($.cookie("scheduleRecallDate"));
                var slides = data[i].slides;
                var media = data[i].media;
                if(data[i].impressCode===""){
                    for (var j = 0; j< slides.length; j++){
                        impressionist.addPPTSlide(slides[j].data,slides[j].slideID);
                        runtime = slides[j].runtime;
                    }
                }else{
                    var div = document.createElement("div");
                    var impress = $.parseHTML(data[i].impressCode);
                    $(div).append($(impress));
                    var impressel = $(div).children();
                    for(var k=0; k<impressel.length; k++){
                        var slidediv = $(impressel[k]);
                        var uid = $(slidediv).attr("id").split("_")[2];
                        var left = $(slidediv).attr("data-left");
                        var right = $(slidediv).attr("data-right");
                        impressionist.addSlideFromDB(uid, left, right);
                        var slidech = $(slidediv).children();
                        for(var u = 0; u<slidech.length; u++){
                            var child = $(slidech[u]);
                            var alt = $(child).attr("alt");
                            if(alt!==undefined){
                                    if(alt.split("-")[0]==="slide"){
                                    var slideID = alt.split("-")[1];
                                    for(var e=0; e<slides.length; e++){
                                        if(parseInt(slides[e].slideID)===parseInt(slideID)){
                                            impressionist.addPPTImageToSlideFromDB(slides[e].data,$(child).attr("id"),slides[e].slideID, uid);
                                        }
                                    }
                                }
                                else if(alt.split("-")[0]==="image"){
                                    var imageID = alt.split("-")[1];
                                    for(var m = 0; m<media.length; m++){
                                        if(parseInt(media[m].mediaID)===parseInt(imageID)){
                                            impressionist.addImageToSlideFromDB(media[m].data,$(child).attr("id"),media[m].mediaID, uid);
                                        }
                                    }

                                }
                                else if(alt.split("-")[0]==="audio"){
                                    var audio = alt.split("-")[1];
                                    for(var m = 0; m<media.length; m++){
                                        if(parseInt(media[m].mediaID)===parseInt(audio)){
                                            impressionist.addAudioToSlideFromDB(media[m].filepath,$(child).attr("id"),media[m].mediaID, uid);
                                        }
                                    }
                                }
                                else if(alt.split("-")[0]==="video"){
                                    var video = alt.split("-")[1];
                                    for(var m = 0; m<media.length; m++){
                                        if(parseInt(media[m].mediaID)===parseInt(video)){
                                            impressionist.addVideoToSlideFromDB(media[m].filepath,$(child).attr("id"),media[m].mediaID, uid);
                                        }
                                    }
                                }
                            } else{
                                impressionist.addElementToSlideFromDB($(child), uid);
                            }
                        }
                    }
                    
                }
            }
            $.cookie("runtime", runtime);
        },
        "json"
      );
        setTimeout(showViewport, 3000);
     }
     /**
      * Hides Loading page
      * @returns {showViewport}
      */
      function showViewport()
      {
        $(".preloaderviewport").css("display", "none");
        $("#tourmodal").modal("show");
        $("#helpVideo").hide();
      }

$.fn.datePick = function() {

    var dateToday = new Date();
    $("#endDate").datepicker({
        minDate: dateToday
    });
    $("#schedulePublishDate").datetimepicker({
        minDate: dateToday
    });
    $("#scheduleRecallDate").datetimepicker({
        minDate: dateToday
    });

};

function tour(){
    $("#takeatour").hide();
    $("#closetour").hide();
    $("#helpVideo").show();
}