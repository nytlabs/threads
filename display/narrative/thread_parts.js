

function populateThreads(jsonFile) {
	console.log("populating from "+jsonFile);
	$.getJSON( jsonFile, function( data ) {
		thread = data[0]["thread"];
		thread["entities"].sort(custom_sort).reverse();

		$('#entity_table').append("<tr id='header'><td></td></tr>");

		$.each(thread["articles"], function( k, v ) {
			var date = new Date(v["pub_date"]);
			$('#header').append("<td>"+(parseInt(date.getMonth())+1)+'/'+date.getDate()+"</td>");
		});

		count = 0;
		$.each(thread["entities"], function( key, val ) {
			var row = $("<tr class='"+val["type"]+"'>", {id: val["content"]});
			$(row).append("<td class='entity_name'>"+val["content"]+"</td>")
			$.each(thread["articles"], function( k, v ) {
				$(row).append("<td data-date='"+v["pub_date"]+"'></td>");
			});

			$.each(val["dates"], function(k,v) {
				$(row).children('td[data-date="'+v+'"]').append("&bull;");
			});
			$('#entity_table').append(row);
			count++;
			return count<30; //limit to top 20 entities by frequency
		});
	});
}


function custom_sort(a, b) {
    return a["dates"].length - b["dates"].length;
}




