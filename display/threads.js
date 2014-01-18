

function populateThreads(jsonFile) {
	$('#nav').nextAll().remove();
	$.getJSON( jsonFile, function( data ) {
		var items = [];
		$.each( data, function( key, val ) {
		  var item = "<div class='item'><h2><span class='entypo-down-dir'></span>";
		  $.each( val["keywords"], function( k, v ) {
		  	item += "<div class='tag'>" + k + "</div>";
		  });
		  item += "</h2><ul>";

		  val["articles"].sort(custom_sort);
		  $.each( val["articles"], function( k, v ) {
		  	date = new Date(v["published"]["$date"])
		  	item += "<li><span class='date'>"+("0" + (date.getMonth() + 1)).slice(-2)+"/"+("0" + date.getDate()).slice(-2)+"/"+date.getFullYear()+"</span><a href='"+v["_id"]+"'>"+v["headline"]+"</a></li>";
		  });
		  item += "</ul></div>";
		  $('#wrapper').append(item);
		});

		$(".entypo-down-dir").on( "click", function() {
		  $(this).parent().parent().children('ul').toggle();
		  $(this).toggleClass('open')
		});
	});
}





function custom_sort(a, b) {
    return a["published"]["$date"] - b["published"]["$date"];
}

