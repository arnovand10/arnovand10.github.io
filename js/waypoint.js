$(".register").css("opacity","0");
$(".bregister").css("opacity","0");
$(".bhome").css("opacity","0");

var top = window.
$(".wregister").waypoint(function(){
	$(".register").animate({
		opacity: "1"
	},1500);
	$(".bregister").animate({
		opacity: "1"
	},2000);
	console.log("register");
},"100vw");


$('.about').css({
	"opacity":"0",
	"margin-left":"-100px",
});
$(".wabout").waypoint(function(){
	$('.about').animate({
		marginLeft:"12.5%",
		opacity: "1"
	},2000);
	console.log("waypoint");
});

$("main").waypoint(function(){
	$(".bhome").animate({
		opacity: 1
	},1000)
});