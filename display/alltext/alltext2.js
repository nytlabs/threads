var threadID = 0;
var entities = [];
var alltext = ''
major = 0;

function getText(json) {
	$.getJSON( json, function( data ) {
		var thread = data[threadID];
		
		$.each(thread["articles"], function(k,v) {
			/*if (k == 0) {
				var date = new Date(v["published"]["$date"])
				$('#begin').html(parseInt(date.getMonth())+1+'/'+date.getDate())
			}
			if (k == thread["articles"].length-1) {
				var date = new Date(v["published"]["$date"])
				$('#end').html(parseInt(date.getMonth())+1+'/'+date.getDate())
			}*/

			var printpos = parseInt(v["print_position"].replace( /^\D+/g, ''));
			if (printpos < 3) {
				major++;
				//var body = strip(v["body"]);
				var body = v["body"];
				alltext += ('<div class="article"><h1>'+v["headline"]+'</h1>'+'<div class="article_text">'+body+'</div></div>');

				$.each(v["entities"], function(k,v) {
					var entity = this["entity"].split(',')[0].split('(')[0];

					if (findEntity(entity) == null) {
						entities.push({"name": entity, "type": this["type"]});
					}

						
				})
			}
		})

		//add num of articles to the header
		$('#article_count').html(major + ' major articles out of ' + thread["articles"].length + ' total articles')

		alltext = alltext.replace(/ "/g, "<span class='quote'>")
		alltext = alltext.replace(/" /g, "</span>")

		$.each(entities, function(k,v) {
			var name = v["name"];
			var type = v["type"];
			var re = new RegExp(name, "g");
			var highlighted = '<span class="'+type+'">'+name+"</span>";
			alltext = alltext.replace(re, highlighted);
		})

		

		$('#main').append(alltext);
		//make columns fit
		$('.article').css('width', (100 / major) - 1.5 + '%');

	});

	//interactions

	$( "#nav li a" ).on( "click", function() {
		var type = $(this).attr('id');
		$('#main').find('*').not( '.'+type ).removeClass('on');
		$('#main .'+type).toggleClass('on');
		if ($('#main .'+type).hasClass('on')) {
			$('#details').children().hide();
			$('#top_'+type).show();
			$('#details').slideDown();
		}
		else {
			$('#details').children().hide();
			$('#details').slideUp();
		}
		
	});
}

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
