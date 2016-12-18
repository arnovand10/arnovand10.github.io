(function(){
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	window.addEventListener("resize",function(){
		w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		console.log(w);
	if(w>'850'){
		console.log("true");
		$('.navigatie').css('left',0);
	}else{
		console.log("false");
		$('.navigatie').css('left',100+'vw');
	}
});
	$(".hamburger").click(function(){
		usedHamburger = true;
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
		$(".navigatie").children().click(function(){
		if(w<'850'){
			$(".navigatie").animate({
				left: "100vw"
			},0);
			$("#main").animate({
				left: "0"
			},0);
			$(".hamburger").children().removeClass("fa-times");
			$(".hamburger").children().addClass("fa-bars");
			console.log("child click");
		}
		});
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