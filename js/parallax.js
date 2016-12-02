$(window).scroll(function(){
	var scroll = $(this).scrollTop();
	$(".bhome").css({
		"transform":'translate(0px,'+ scroll/15+ '%)'
	});
});