var thread_titles = ["NYC Mayoral Race", "New Jersey Culture Listings", "Federal Budget Crisis", "German Elections", "Facebook / Google / Twitter Trifecta", "Immigration Debate", "Healthcare Reform / Affordable Care Act", "Edward Snowden / NSA", "Syria", "Texas Abortion Debate", "U.S. Response to Syria"]
var threadID = getParam('thread');
console.log(threadID)
var json;
var entities = [];
var alltext = ''
major = 0;
var selected_date_index = 0;
var t;
var interval = 20; //how fast the timeline plays
var article_count = 0;
var word_count = 0;
var pv_count = 0;
var nyt_per_count = 0;
var nyt_geo_count = 0;
var nyt_topic_count = 0;
var quote_count = 0;



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

	//load hidden articles
	loadArticles()
}

function playTimeline() {
	$('.pt').removeClass('on');
	var date = json["entries"][selected_date_index]["date"];
	var pt = $(".pt[data-date='" + date +"']");
	$( "#playhead" ).animate({left: $(pt).offset().left + 'px'}, 0 , "linear");

  	if ($(pt).hasClass('fill') == true) {
		$(pt).addClass('on');
		loadContent(json["entries"][selected_date_index]);
	}
	selected_date_index++;
	
	if (selected_date_index == json["entries"].length) {
		$('#headline').html('');
		$( "#playhead" ).animate({left: $('#points').offset().left + 'px'}, 1000 , "linear");
		$('.pt').removeClass('on');
		clearInterval(t);
		initActions();
	}
	
}


////////////////////////////////////////////////////

function placePoint() {
	var major = false;
	$.each(this["articles"], function(k,v) {
		if (v["major"] == true) {
			major = true;
		}
	})
	if (this["articles"].length > 0) {
		var style = "fill";
		if (major == true) {
			var style = "fill major"
		}
	}
	else {
		var style = "nofill";
	}
	var pt = '<div class="pt '+style+'" data-date="'+this["date"]+'"></div>';
	$('#points').append(pt);
}

function loadArticles() {
	$('#major').html("Top articles ("+json["major_articles"]+")");
	$.each(json["entries"], function(k,v) {
		$.each(v["articles"], function(k,v) {
			if(v["major"] == true) {
				var body = strip(v["body"]);
				var body = highlight(body, v);
				$('#maintext').append('<div class="article" id="'+v["url"]+'" data-headline="'+v["headline"]+'"><div class="article_inner"><h1>'+v["headline"]+'</h1>'+'<div class="article_text">'+body+'</div></div></div>');
			}
		});
	});

	//make articles the right width
	$('.article').css('width', (100 / json["major_articles"]) - 1.6 + '%');
}

function loadContent(entry) {
	//clear previous headlines
	$('#headline').html(''); 

	//update headlines and data
	$.each(entry["articles"], function(k,v) {
		$('#headline').append('<h2>'+entry["date"]+'</h1>')
		$('#headline').append('<h1>'+v["headline"]+'</h1>')
		word_count += v["wordcount"];
		pv_count += v["clicks"];
		quote_count += v["num_quotes"];

		//show the article text if it's a major article
		if (v["major"] == true) {
			$('.article[id="'+v["url"]+'"').children('.article_inner').animate({opacity: 1.0}, 200);
		}
		//fade out previously highlighted articles
		$('.article').css('opacity',0.5);
	});

	//update data points
	article_count += entry["articles"].length;
	nyt_per_count += entry["nyt_per"];
	nyt_geo_count += entry["nyt_geo"];
	nyt_topic_count += entry["nyt_topic"];

	//display data points
	$('#article_count').html(convert(article_count));
	$('#word_count').html(convert(word_count));
	$('#pv_count').html(convert(pv_count));
	$('#nyt_per_count').html(convert(nyt_per_count));
	$('#nyt_geo_count').html(convert(nyt_geo_count));
	$('#nyt_topic_count').html(convert(nyt_topic_count));
	$('#quote_count').html(convert(quote_count));

}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function getParam(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.split('/')[0])||[,""])[1].replace(/\+/g, '%20'))||null
}




