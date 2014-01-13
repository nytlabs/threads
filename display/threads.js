$(document).ready(function() {

	$.getJSON( "../threads.json", function( data ) {
		var items = [];
		$.each( data, function( key, val ) {
		  var item = "<h2>";
		  $.each( val["keywords"], function( k, v ) {
		  	item += "<div class='tag'>" + k + "</div>";
		  });
		  item += "</h2><ul>";

		  val["articles"].sort(custom_sort);
		  $.each( val["articles"], function( k, v ) {
		  	date = new Date(v["published"]["$date"])
		  	item += "<li><span class='date'>"+("0" + (date.getMonth() + 1)).slice(-2)+"/"+("0" + date.getDate()).slice(-2)+"/"+date.getFullYear()+"</span><a href='"+v["_id"]+"'>"+v["headline"]+"</a></li>";
		  });
		  item += "</ul>";
		  $('#wrapper').append(item);
		});
	});

});

function custom_sort(a, b) {
    return a["published"]["$date"] - b["published"]["$date"];
}

