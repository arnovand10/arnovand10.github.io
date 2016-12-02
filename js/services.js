
$(function () {


var ApplicationDbContext = {
    "init": function(strConnection) {
        this._strConnection = strConnection; // Connection string to the key in the localstorage
        this._dbData = {
        	"info":{
        		"title":"WAF",
        		"description":"Walk a friend",
        		"version":"1.0.",
        		"modified":"2016-11-25",
        		"author":"ArnoVanDenBossche"
        	},
        	"activeusers": null,
        	"profielen":[],
        	"activiteiten":[],
        	"timetable":[],
        	"settings":[],
        };
         if(Utils.store(this._strConnection) != null) {
            this._dbData = Utils.store(this._strConnection);
        } else {
            Utils.store(this._strConnection, this._dbData);
        }
    },

    "getProfiles":function(){
    	//get all profiles
    	var profile = this._dbData.profielen;
    	if(profiles==null || (profiles!=null&&profiles.length ==0)){
    		return null;
    	}
    	return profiles;
    },
    
};






var _activiteit = ["uitlaten","oppassen","ontmoeten","dierenarts"];
var _herhaling = ["dagelijks","wekelijks","maandelijks","jaarlijks"];
var randomActiviteit = Math.floor((Math.random()*4));

//var hondenras = Math.floor((Math.random()*ras.height));




for(var i=0; i<100; i++){
	Profile[i].gebruikersnaam = "test";
	Profile[i].hondnaam = "tets";
	Profile[i].hondras= "test"; 
	Profile[i].status[0] = _activiteit[randomActiviteit];
	Profile[i].status[1] = "begin";
	Profile[i].status[2] = "eind";
	Profile[i].status[3] = _herhaling[randomActiviteit];
	Profile[i].locatie = "Gent";
	console.log(Profile[i]);
}
	
var hondenras = JSON.parse("https://raw.githubusercontent.com/dariusk/corpora/master/data/animals/dogs.json");
})();