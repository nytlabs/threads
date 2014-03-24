function initActions() {

	//mouse over article
	$('.article').on('mouseenter', function(e) {
		$('#headline').html($(this).attr('data-headline'));
	})
	$('.article').on('mouseleave', function(e) {
		$('#headline').html('');
	})


}