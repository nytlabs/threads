

function populateThreads(jsonFile) {
	$.getJSON( jsonFile, function( data ) {
		thread = data[0]["thread"];
		thread["entities"].sort(custom_sort).reverse(); //sort by number of dates mentioned, descending

		//get the full array of dates for the thread
		var begin_date = new Date(thread["begin_date"]);
		var end_date = new Date(thread["end_date"]);
		var all_dates = getDates(begin_date, end_date);

		//populate table header
		$('#entity_table').append("<tr id='header'><td></td></tr>");
		$.each(all_dates, function( k, v ) {
			$('#header').append("<td>"+(parseInt(v.getMonth())+1)+'/'+v.getDate()+"</td>");
		});

		//populate top entity lists
		var top_topic = [];
		var top_nyt_per = [];
		var top_nyt_geo = [];
		var top_nyt_org = [];
		$.each(thread["entities"], function( key, val ) {
			console.log(val["type"]);
			console.log(window["top_" + val["type"]]);
			if ($(val["type"]).length < 10) {
				console.log("adding");
				$(val["type"]).append(val["entity"]);
			}
		});

		console.log(nyt_per)

		//populate table rows for each entity
		count = 0;
		$.each(thread["entities"], function( key, val ) {
			var row = $("<tr class='"+val["type"]+"'>", {id: val["content"]});
			$(row).append("<td class='entity_name'>"+val["content"]+"</td>")
			$.each(all_dates, function( k, v ) {
				$(row).append("<td data-date='"+(parseInt(v.getMonth())+1)+"-"+v.getDate()+"-"+v.getFullYear()+"'></td>");
			});

			$.each(val["dates"], function(k,v) {
				var date = new Date(v);
				$(row).children('td[data-date="'+String(parseInt(date.getMonth())+1)+"-"+date.getDate()+"-"+date.getFullYear()+'"]').append("&bull;");
			});
			$('#entity_table').append(row);
			count++;
			return count<30; //limit to top 20 entities by frequency
		});
	});
}


//FUNCTIONS

function custom_sort(a, b) {
    return a["dates"].length - b["dates"].length;
}

//date functions
Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate)
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}




