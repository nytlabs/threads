var threadID = 0;
var json;
var entities = [];
var alltext = ''
major = 0;
var thread_titles = ["NYC Mayoral Race", "New Jersey Culture Listings", "Federal Budget Crisis", "German Elections", "Facebook / Google / Twitter Trifecta", "Immigration Debate", "Healthcare Reform / Affordable Care Act", "Edward Snowden / NSA", "Syria", "Texas Abortion Debate", "U.S. Response to Syria"]
var selected_date_index = 0;
var t;
var interval = 20; //how fast the timeline plays


function makeTimeline() {
	var begin_date = json["begin_date"].slice(5) + '-' + json["begin_date"].slice(0,4);
	var end_date = json["end_date"].slice(5) + '-' + json["end_date"].slice(0,4);
	$('#begin_date').html(begin_date.replace(/-/g, '.'));
	$('#end_date').html(end_date.replace(/-/g, '.'));

	//place and size the timeline content area
	var pts_left = $("#timeline").offset().left + $('#begin_date').outerWidth();
	var pts_top = $("#timeline").offset().top;
	var pts_width = $("#timeline").width() - $('#begin_date').outerWidth() - $('#end_date').outerWidth();
	$('#points').css('left', pts_left+'px');
	$('#points').css('top', pts_top+'px');
	$('#points').css('width', pts_width+'px');	

	//place the playhead at the beginning
	$('#playhead').css('left', pts_left+'px');
	$('#playhead').css('top', pts_top - 10 +'px');

	//place the points along the timeline
	$.each(json["entries"], placePoint);
	var pt_width = $('#points').width() / json["entries"].length - 2;
	$('.pt').css('width', pt_width + 'px');
	$('playhead').css('width', pt_width + 'px');
}

function playTimeline() {
	$('.pt').removeClass('on');
	var date = json["entries"][selected_date_index]["date"];
	console.log("playdate="+date)
	var pt = $(".pt[data-date='" + date +"']");
	$( "#playhead" ).animate({left: $(pt).offset().left + 'px'}, 0 , "linear");

  	if ($(pt).hasClass('fill') == true) {
		$(pt).addClass('on');
		loadContent(json["entries"][selected_date_index]);
	}
	selected_date_index++;
	
	if (selected_date_index == json["entries"].length -1) {
		$('#headline').html('');
		$( "#playhead" ).animate({left: $('#points').offset().left + 'px'}, 1000 , "linear");
		clearInterval(t);
	}
	
}


////////////////////////////////////////////////////

function placePoint() {
	if (this["articles"].length > 0) {
		console.log(this)
		var style = "fill";
	}
	else {
		var style = "nofill";
	}
	var pt = '<div class="pt '+style+'" data-date="'+this["date"]+'"></div>';
	$('#points').append(pt);
}


function loadContent(entry) {
	console.log("entrydate="+entry["date"])
	$('#headline').html('');
	console.log(entry)
	$.each(entry["articles"], function(k,v) {
		$('#headline').append('<h1>'+v["headline"]+'</h1>')
	});
}

///////////////////////////////////////////////////

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function findEntity(entity) {
    for (var i = 0, len = entities.length; i < len; i++) {
        if (entities[i].name === entity)
            return entities[i]; // Return as soon as the object is found
    }
    return null; // The object was not found
}

function topTens() {
	$.getJSON( 'entities.json', function( data ) {

		//clear topic lists
		top_topic = [];
		top_nyt_per = [];
		top_nyt_geo = [];
		top_nyt_org = [];

		thread = data[threadID]["thread"];
		thread["entities"].sort(custom_sort).reverse(); //sort by number of dates mentioned, descending

		//populate top entity lists

		$.each(thread["entities"], function( key, val ) {
			if (window["top_" + val["type"]]) {
				if (window["top_" + val["type"]].length < 10) {
					window["top_" + val["type"]].push(val["content"]);
				}
			}
		});

		//display top 10s
		$.each(top_topic, function() {
			$('#top_topic').children('ol').append('<li>'+this+'</li>');
		});
		$.each(top_nyt_per, function() {
			$('#top_nyt_per').children('ol').append('<li>'+this+'</li>');
		});
		$.each(top_nyt_geo, function() {
			$('#top_nyt_geo').children('ol').append('<li>'+this+'</li>');
		});
		$.each(top_nyt_org, function() {
			$('#top_nyt_org').children('ol').append('<li>'+this+'</li>');
		});

	});

}

function custom_sort(a, b) {
    return a["dates"].length - b["dates"].length;
}
