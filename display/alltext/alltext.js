var entities = [];
var alltext = ''
major = 0;

function getText(json) {
	$.getJSON( json, function( data ) {
		var thread = data[0];
		
		$.each(thread["articles"], function(k,v) {
			var printpos = parseInt(v["print_position"].replace( /^\D+/g, ''));
			if (printpos < 3) {
				major++;
				var body = strip(v["body"]);
				alltext += ('<h1>'+v["headline"]+'</h1>'+'<div class="article_text">'+body+'</div>');

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

	});

	//interactions

	$( "#nav li a" ).on( "click", function() {
		var type = $(this).attr('id');
		console.log($('#main .'+type))
		$('#main .'+type).toggleClass('on');
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

