function initActions() {

	//mouse over article
	$('.article').on('mouseenter', function(e) {
		$(this).animate({opacity: 1.0}, 200);
		$('#headline').append("<h1>"+$(this).attr('data-headline')+"</h1>");
	})
	$('.article').on('mouseleave', function(e) {
		$(this).animate({opacity: 0.5}, 200);
		$('#headline').html('');
	})

	//mouse over entity nav
	$('.entity_nav').on('mouseenter', function(e) {
		var type = $(this).attr('id');
		$('.highlight').not('.'+type).removeClass('on');
	})
	$('.entity_nav').on('mouseleave', function(e) {
		$('.highlight').addClass('on');
	})


}