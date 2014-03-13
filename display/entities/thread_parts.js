var top_topic = [];
var top_nyt_per = [];
var top_nyt_geo = [];
var top_nyt_org = [];



function populateThreads(jsonFile, index) {
	$.getJSON( jsonFile, function( data ) {

		//clear topic lists
		top_topic = [];
		top_nyt_per = [];
		top_nyt_geo = [];
		top_nyt_org = [];

		thread = data[index]["thread"];
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
		//make lists visible
		$('#top_entities').show();


		//populate table rows for each entity
		count = 0;
		$.each(thread["entities"], function( key, val ) {
			var row = $("<tr class='"+val["type"]+"'>", {id: val["content"]});
			$(row).append("<td class='entity_name'>"+val["content"]+"</td>")
			$.each(all_dates, function( k, v ) {
				$(row).append("<td data-date='"+(parseInt(v.getMonth())+1)+"-"+v.getDate()+"-"+v.getFullYear()+"' '></td>");
			});

			$.each(val["dates"], function(k,v) {
				var epoch_date = v;
				var date = new Date(epoch_date);
				var targetCell = $(row).children('td[data-date="'+String(parseInt(date.getMonth())+1)+"-"+date.getDate()+"-"+date.getFullYear()+'"]');
				if (targetCell) {
					$(targetCell).attr("data-epoch", epoch_date);
					$(targetCell).css("opacity", 1);
					$(targetCell).addClass(val["type"]);
				}

			});
			$('#entity_table').append(row);
			count++;
			return count<25; //limit to top 25 entities by frequency
		});

		$('td').on('mouseenter', function(e){
			e.preventDefault();
			$('#popup_content').html('');
			var table_cell = e.target;
			$.each(thread["articles"], function(key,val) {
				if (val["pub_date"] == $(table_cell).attr('data-epoch')) {
					console.log("match");
					console.log(val["headline"])				
					$('#popup_content').append('<a href="'+val["url"]+'" target="new" style="color:#333; display: block; margin:4px 0px;">'+val["headline"]+'</a><br />');
					console.log($('#popup_content').html())
				}
			})
			if ($('#popup_content').html() != '') {
				$('#popup').css('top', e.pageY )
				$('#popup').css('left', e.pageX )
				$('#popup').show();
			}
			else {
				$('#popup').hide();
			}
		})
		$('#entity_table').on('mouseleave', function(e){
			$('#popup').hide();
			$('#popup_content').html('Loading articles...');
		})

		$('.top_list').children('h2').click(function(e) {
			console.log("clicked");
			var type = $(this).parent().attr('id').split('top_')[0];
			console.log(type)
			$.each($('tr'), function() {
				$(this).show();
				if (!$(this).hasClass(type)) {
					$(this).hide();
				}
			})
			
		})

	});
	
	
}


//GLOBAL FUNCTIONS




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




