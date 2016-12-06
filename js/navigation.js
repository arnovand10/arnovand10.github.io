(function(){
	console.log("test");
	var hamburger = document.querySelector(".fa-bars");
	var navigatie = document.querySelector(".navigatie");
	hamburger.addEventListener("click",function(){
		if(navigatie.style.opacity ==1){
			navigatie.style.opacity = 0;
			navigatie.style.zIndex = -100;
		}else{
			navigatie.style.opacity = 1;
			navigatie.style.zIndex = 100;
		}
		console.log("click");
	});
})();