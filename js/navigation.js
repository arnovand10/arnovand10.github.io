(function(){

	$(".hamburger").click(function(){
		if($("#main").position().left == "0"){
			//navigatie openen;
			$(".navigatie").animate({
				left: "30vw"
			},300);
			$("#main").animate({
				left: "-70vw"
			},300);
			$(".hamburger").children().removeClass("fa-bars");
			$(".hamburger").children().addClass("fa-times");
		}

		//navigatie sluiten
		else{
			$(".navigatie").animate({
				left: "100vw"
			},300);
			$("#main").animate({
				left: "0"
			},300);
			$(".hamburger").children().removeClass("fa-times");
			$(".hamburger").children().addClass("fa-bars");
			console.log("closed");
		}
	});

	$(".navigatie").children().click(function(){
		$(".navigatie").animate({
			left: "100vw"
		},0);
		$("#main").animate({
			left: "0"
		},0);
		$(".hamburger").children().removeClass("fa-times");
		$(".hamburger").children().addClass("fa-bars");
		console.log("child click");
	});
})();