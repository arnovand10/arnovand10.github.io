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

	$(".toggleMap").click(function(){
		if(this.innerHTML == "Map"){
			this.innerHTML = "Lijst";
			$(".browseList").css('visibility','hidden');
			$(".browseList").css('z-index',"-50");
			$(".map").css('visibility','visible');
			$(".map").css('z-index','0');
		}else{
			this.innerHTML = "Map";
			$(".map").css('visibility','hidden');
			$(".map").css('z-index',"-50");
			$(".browseList").css('visibility','visible');
			$(".browseList").css('z-index','0');
		}
		
	});
})();