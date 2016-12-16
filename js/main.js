function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();
};

ready(function(){

    var App = {
        "init": function() {
            this._unitTesting = false; // Unit Testing the ApplicationDbContext or not

            this._applicationDbContext = applicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.dds.WAF'); // Intialize the ApplicationDbContext with the connection string as parameter value

            //user manager verwerkt login
            this._userManager = UserManager;
            this._userManager.init(this._applicationDbContext);


           	this.checkCurrentPage();

            //alleprofiles
            this.profiles = this._applicationDbContext._dbData.profiles;

            //activeUser
            this._dbActiveUser = this._applicationDbContext._dbData.activeuser;
            if(this._dbActiveUser!=null){
            	this._activeUser = this.findActiveUserId(this._dbActiveUser["id"]);
        	}
            

           	//index.html/#home
           	this._formLogin = document.querySelector(".form_home");
           	this._btnLogin = document.querySelector(".btnLogin");
        	//data ophalen bij login
        	if(this._formLogin!=null){
           		this.loginEventListeners();
           	}

           	//index.html/#register
           	this._formRegister = document.querySelector(".form_register");
           	if(this._formRegister != null){
           		this.registerEventListeners();
           	}

           	//uitloggen
           	this._btnLogout = document.querySelector(".btnLogout");
           	this.logoutEventListeners();

           	


            //myprofile.html
            this._myprofilePage = document.querySelector(".myprofilePage");
            this._myprofileUsername = document.querySelector('.myUsername');
            this._myprofileStatus = document.querySelector('.myStatus');
            this._myprofileLocation = document.querySelector('.myLocation');
            this._myprofileRating = document.querySelector(".myRating");
            this._myprofileDog = document.querySelector('.myDog');
            this._myprofileRace = document.querySelector('.myRace');
            this._myprofileImage = document.querySelector('.myImage');
            this._myprofileBtn=  document.querySelector(".myprofileAanpassen");
            //check of we op myprofile.html pagina zijn
            if(this._myprofilePage!=null){
            	//check of er een active user is
            	if(this._applicationDbContext._dbData.activeuser != null){
            		//data myprofile uit local storage halen
            		console.log(this._applicationDbContext._dbData.activeuser["id"]);
            		//this.updateUIMyProfile(this._applicationDbContext._dbData.activeuser["id"]);	
            		this.updateUIMyProfile(this._activeUser);

                    //check of er op de profielaanpassen knop gedrukt wordt
                    this.myprofilePageBtnEventListener();
            	}
            	//geen active user -> redirect naar home
            	else{
            		window.location = "/index.html";
            	}
            }

            //editmyprofile.html
            this._myProfilePageEdit = document.querySelector('.myprofilePageEdit');
            if(this._myProfilePageEdit != null){
                this._btnEdit = document.querySelector('.btnEditMyProfile');
                this.myProfilePageEdit();
            }

            //action.html
            this._actionPage = document.querySelector(".action");
            if(this._actionPage != null){
                this.actionEventListener();
            }

            //browse.html
            this._browsePage = document.querySelector(".browse");
            if(this._browsePage != null){
                this._activiteiten = this.getActivities();
                this.filterActivities(this._activiteiten);
                if(this._activiteiten != null){
                    this.addOrDeleteActivities();
                }
            }

            //activities.html
            this._savedActivitiesPage = document.querySelector(".activities");
            if(this._savedActivitiesPage != null){
                this._savedActivities = this.getSavedActivities();
            }


            if(this._unitTesting) {
                this.unitTestProfiles(); // Unit Testing: profiles
            }

            this.updateUIProfilesList(); // Update UI for list of profiles


        },

        "checkCurrentPage":function(){
        	//checken of user is ingelogt (m.a.w. check of useractive != null)
            if(this._applicationDbContext._dbData.activeuser == null){
            	//indien niet ingelogd wordt navigatie aangepast
            	document.querySelector(".inlogNav").style.visibility = "hidden";

            	//De huidige url opvragen en splitsen op '/'
            	//bv https://127.0.0.1:400/_pages/action.html
      			//zoeken naar _pages => na 3de '/'
            	var currentPage = window.location.href;
            	var currentDir = currentPage.split("/")[3];

            	//als we op /_pages/ komen en niet ingelogd zijn moeten we geriderect worden
            	// /_pages/ mag enkel bezocht worden indien je ingelogd bent
            	if(currentDir == "_pages"){
            		window.location = "/index.html";	
            	}
            }
        },

        "loginEventListeners": function() {
            // Event Listeners for Form Login
            if(this._formLogin != null) {
                var self = this; // Hack for this keyword within an event listener of another object
                this._btnLogin.addEventListener('click', function(ev) {
                	ev.preventDefault();
                    var userName = Utils.trim(document.querySelectorAll('[name="user"]')[0].value);
                    var passWord = Utils.trim(document.querySelectorAll('[name="pass"]')[0].value);
                    var result = self._userManager.login(userName, passWord);
                    console.log(result);
                    if(result == null) {
                        document.querySelector('[name="user"]').style.border = "2px solid red";
                        document.querySelector('[name="pass"]').style.border = "2px solid red";
                    	console.log("niets gevonden of leeg veld");
                    } else if(result == false) {
                        document.querySelector('[name="user"]').style.border = "2px solid red";
                        document.querySelector('[name="pass"]').style.border = "2px solid red";
                    	console.log("gebruikersnaam en wachtwoord komen niet overeen");
                    } else {
                        self._activeUser = result; // User is Logged in
                        self._applicationDbContext._dbData.activeuser = result;
                        self._applicationDbContext.save();
                        self.updateUI();
                        return self._activeUser;
                    }
                    
                    return false;
                });
            }else{
            	console.log("form_home false");
            }
        },

        "updateUI":function(){
            //wanneer ingelogd update de navigatie
        	document.querySelector(".inlogNav").style.visibility = "visible";
            //check of het de 1ste keer is dat de gebruiker inlogt
            //als het de 1ste keer is, redirect naar edit my profile
        	if(this._activeUser.lastLogin == ""){
                this.updateLastLoginById(this._activeUser.id);
                window.location = "/_pages/editmyprofile.html";
                console.log(this._activeUser.id);
            }else{
                this.updateLastLoginById(this._activeUser.id);
                window.location = "/_pages/myprofile.html";
                console.log(this._activeUser.id);
            }
        },

        "updateLastLoginById":function(activeId){
            //alle profielen doorlopen, en zoeken waar de activeuserID = profileID
            for(var i=0;i<this._applicationDbContext._dbData.profiles.length;i++){
                if(this._applicationDbContext._dbData.profiles[i].id == activeId){
                    //gevonden -> update last login
                    this._applicationDbContext._dbData.profiles[i].lastLogin = new Date();
                    this._applicationDbContext.save();
                }
            }
            
        },

        "myprofilePageBtnEventListener":function(){
            this._myprofileBtn.addEventListener("click",function(ev){
                ev.preventDefault();
                window.location = "/_pages/editmyprofile.html";
            });
        },

        "myProfilePageEdit":function(){
            //textvelden upvullen met de profiel waardes uit de localstorage

            console.log(this._applicationDbContext._dbData.profiles[this._activeUser]);
            document.querySelector('[name="foto"]').value =  this._applicationDbContext._dbData.profiles[this._activeUser].profielfoto;
            document.querySelector('[name="status"]').value =  this._applicationDbContext._dbData.profiles[this._activeUser].status;
            document.querySelector('[name="locatie"]').value =  this._applicationDbContext._dbData.profiles[this._activeUser].locatie;
            document.querySelector('[name="hond"]').value =  this._applicationDbContext._dbData.profiles[this._activeUser].hondnaam;
            document.querySelector('[name="ras"]').value =  this._applicationDbContext._dbData.profiles[this._activeUser].hondras;
            document.querySelector('[name="email"').value = this._applicationDbContext._dbData.profiles[this._activeUser].email;
            //wanneer er op de knop gedrukt wordt, textveld values opvragen en opslaan in database
            var self = this;
            this._btnEdit.addEventListener("click",function(ev){
                ev.preventDefault();
                //waardes uit textvelden halen
                var profileId = self._activeUser;
                var profilePic = Utils.trim(document.querySelector('[name="foto"]').value);
                var profileStatus = Utils.trim(document.querySelector('[name="status"]').value);
                var profileLocatie = Utils.trim(document.querySelector('[name="locatie"]').value);
                var profileHondNaam = Utils.trim(document.querySelector('[name="hond"]').value);
                var profileHondRas = Utils.trim(document.querySelector('[name="ras"]').value);
                var profileEmail =  Utils.trim(document.querySelector('[name="email"]').value);
                
                //textveld values in array stoppen en meegeven aan functie updateMyProfile()
                var profileEdited = [profileId,profilePic,profileStatus,profileLocatie,profileHondNaam,profileHondRas, profileEmail];

                var result = self._applicationDbContext.updateMyProfile(profileEdited);
                if(result!=null){
                    window.location = "/_pages/myprofile.html";
                }
                
            });
        },

        "logoutEventListeners":function(){
        	//klik op logout knop
        	var self = this;
        	this._btnLogout.addEventListener("click",function(ev){
        		//active user op null stellen
        		//opslaan in de data
        		//navigatie aanpassen
        		//redirecten naar homepage
        		ev.preventDefault();
        		self._activeUser = null;
        		self._userManager.logout();
        		self._applicationDbContext.save();
        		document.querySelector(".inlogNav").style.visibility = "hidden";
        		window.location = "/index.html";
        	});
        },

        "registerEventListeners":function(){
        	//check knop registreer klik
        	var self = this;
	        var _regBtn = document.querySelector("#regreg");
        	_regBtn.addEventListener("click",function(ev){
        		//Geen default actie
        		ev.preventDefault();
        	
	        	//waardes uit de textvelden halen wanneer register form aanwezig is
		        var _regUser = Utils.trim(document.querySelector('[name="reguser"]').value);
		        var _regEmail = Utils.trim(document.querySelector('[name="email"]').value);
		        var _regPass = Utils.trim(document.querySelector('[name="regpass"]').value);
		        var _regRePass = Utils.trim(document.querySelector('[name="reregpass"]').value);
                
                //p tag wordt vervangen door errormessage
                var _errorMessage = document.querySelector(".placeholderErrorMessage");
                _errorMessage.style.color = "red";

                //borders normale kleur geven (anders blijven ze rood, ookal zijn ze na een fout gecorrigeerd)
                document.querySelectorAll(".form_register>input")[0].style.border = "2px solid rgba(52,95,137,1)";
                document.querySelectorAll(".form_register>input")[1].style.border = "2px solid rgba(52,95,137,1)";
                document.querySelectorAll(".form_register>input")[2].style.border = "2px solid rgba(52,95,137,1)";
                document.querySelectorAll(".form_register>input")[3].style.border = "2px solid rgba(52,95,137,1)";

                
                
	        	//checken of alle waardes ingevuld zijn en _regPass == _regRePass
	        	if(_regPass!="" && _regEmail!="" && _regUser!="" && _regRePass!=""){
                    if(_regPass==_regRePass){


    	        		//check of username al bestaat| neen => ok | ja=> niets doen
    	        		var getUser = self._applicationDbContext.getProfileByUserName(_regUser);
    	        		if(getUser==null || getUser==undefined){
    	        			//toevoegen van gebruikers
    	        			var profile = new Profile();
    	        			profile.gebruikersnaam = _regUser;
    	        			profile.email = _regEmail;
    	        			profile.wachtwoord = _regPass;
                            profile.profielfoto = "../css/img/dog-placeholder.jpg";
                            profile.status = "";
                            profile.locatie = "";
                            profile.rating = "";
                            profile.hondnaam = "";
                            profile.hondras = "";
                            profile.CreatedAt = new Date();
                            profile.lastLogin = "";
                            profile.opgeslagenActiviteiten = [];
                            


    	        			var addedprofile = self._applicationDbContext.addProfile(profile);
    	        			if(addedprofile != null){
                                document.querySelector("#btnreg>a").innerHTML = "Geregistreerd";
    	        				window.location = "index.html";
    	        				console.log("gebruiker toegevoegd");
                                return true;
    	        			}
                            else{
                                _errorMessage.innerHTML = "Interne fout bij het registreren.";
    	        				console.log("fout bij profiel toevoegen");
    	        				return false;
    	        			}
    	        		}
                        else{
                            _errorMessage.innerHTML = "Gebruikersnaam al in gebruik.";
                            //focus in textveld zetten en rode rend geven
                            document.querySelector('[name="reguser"').focus();
                            document.querySelectorAll(".form_register>input")[0].style.border = "2px solid red";
    	        			console.log("gebruikersnaam al in gebruik");
    	        			return false;
    	        		}
                    }
                    else{
                        _errorMessage.innerHTML = "Passwoorden komen niet overeen.";
                        document.querySelector('[name="regpass"').focus();
                        document.querySelectorAll(".form_register>input")[2].style.border = "2px solid red";
                        document.querySelectorAll(".form_register>input")[3].style.border = "2px solid red";
                        console.log("wachtwoorden zijn niet identiek");
                        return false;
                    }
                }
                else{
                    _errorMessage.innerHTML = "Gelieve alle velden correct in te vullen.";
                    document.querySelector('[name="reguser"').focus();
                    //document.querySelector('[name="reguser"').style.border = "2px solid red";
                    document.querySelectorAll(".form_register>input")[0].style.border = "2px solid red";
                    document.querySelectorAll(".form_register>input")[1].style.border = "2px solid red";
                    document.querySelectorAll(".form_register>input")[2].style.border = "2px solid red";
                    document.querySelectorAll(".form_register>input")[3].style.border = "2px solid red";
                    console.log(_borderUser);
	        		console.log("niet alle waardes ingevuld");
	        		return false;
	        	}

        	});
        },



        "findActiveUserId":function(activeuser){
        	var i = 0;
        	while(this.profiles[i]["id"]!=activeuser){
        		i++;
        	}
        	return i;
        },

        "updateUIMyProfile":function(activeId){
        	this._myprofileUsername.innerHTML = this.profiles[activeId]["gebruikersnaam"];
        	this._myprofileStatus.innerHTML = this.profiles[activeId]["status"];
        	this._myprofileLocation.innerHTML = this.profiles[activeId]["locatie"];
        	this._myprofileDog.innerHTML = this.profiles[activeId]["hondnaam"];
        	this._myprofileRace.innerHTML = this.profiles[activeId]["hondras"];
        	this._myprofileImage.style.backgroundImage = "url("+this.profiles[activeId]["profielfoto"]+")";
        },

        "actionEventListener":function(){
            this._actionButton = document.querySelector("#activiteittoevoegen");
            document.querySelector('[name="hond"]').value = this._applicationDbContext._dbData.profiles[this._activeUser].hondnaam;

            var self = this;
            this._actionButton.addEventListener("click",function(ev){
                ev.preventDefault();
                var actionGebruikerId = self._applicationDbContext._dbData.activeuser.id;
                var actionId = Utils.guid();
                var actionActiviteit = document.querySelector('[name="activiteit"]').value;
                var actionHond = document.querySelector('[name="hond"]').value;
                var actionStraat = document.querySelector('[name="locatie"]').value;
                var actionNummer = document.querySelector('[name="nummer"]').value;
                var actionStartDatum = document.querySelector('[name="startdatum"]').value;
                var actionStartUur = document.querySelector('[name="startuur"]').value;
                var actionStopDatum = document.querySelector('[name="stopdatum"]').value;
                var actionStopUur = document.querySelector('[name="stopuur"]').value;
                var actionHerhaling = document.querySelector('[name="herhaling"]').value;
                if(actionHond != null && actionHond !=""){
                    var result = self._applicationDbContext.addActivity(actionGebruikerId,actionId,actionActiviteit,actionHond,actionStraat,actionNummer,actionStartDatum,actionStartUur,actionStopDatum,actionStopUur,actionHerhaling);
                    if(result != null){
                        console.log("toegevoegd");
                        window.location = "/_pages/browse.html";
                    }else{
                        document.querySelector(".placeholderErrorMessage").innerHTML = "Gelieve alle waardes correct in te vullen";
                        console.log("fout");
                    }    
                }else{
                    document.querySelector('[name="hond"]').style.border = "2px solid red";
                    document.querySelector('[name="hond"').placeholder ="U moet een hond toevoegen";
                }
                
            });   
        },

        "getActivities":function(){
            
            //alle activiteiten ophalen;
            var browseList = document.querySelector(".browseList");
            var activiteit = this._applicationDbContext._dbData.activiteiten;
            for(var i=0; i<activiteit.length;i++){
                        var html;
                            //als activegebruikerId = gebruikerID van de actie (degine die het gepost heeft)
                            //veranderd de style
                            //er wordt een id waarde toegekent aan de button en activiteit -> bij het klikken kan 
                            //dan makkelijk gezien worden bij welke activiteit welke button hoord. 
                            //zie addOrDeleteActivity();
                            if(activiteit[i].gebruikerId == this._applicationDbContext._dbData.activeuser.id){
                                html += '<li class="activity"  id="'+activiteit[i].id+'" style="background-color: #345f89; color:white;">';
                                html += '<button class="btn_X" id="'+activiteit[i].gebruikerId+'"><i class="fa fa-trash fa-lg" aria-hidden="true" style="color: white"; ></i></button>';    
                            }
                            else{
                                html += '<li class="activity"  id="'+activiteit[i].id+'">';
                                html +='<button class="btn_X" id="'+activiteit[i].gebruikerId+'"><i class="fa fa-floppy-o fa-lg" aria-hidden="true" ></i></button>';    
                            }
                            
                            html += '<ul class="info_dtl">';
                            html += '<li><span>'+activiteit[i].status+'</span></li>';
                            html += '<li>Van: '+activiteit[i].startDatum+" "+activiteit[i].startUur+'</li>';
                            html += '<li>Tot: '+activiteit[i].stopDatum+" "+activiteit[i].stopUur+'</li>';
                           // html += '</ul>';
                           // html += '<ul class="info_user">';
                            html += '<li>Door: '+activiteit[i].gebruikerNaam+'</li>';
                            html += '<li>Hond: '+activiteit[i].gebruikerHond+' '+activiteit[i].gebruikerRas+'</li>'
                            html += '<li>Locatie: '+activiteit[i].locatie+'</li>';
                            html += '</ul>';
                            html += '</li>';
                            browseList.innerHTML = html;
                }
            return activiteit;
        },

        "filterActivities":function(activiteiten){
            
            var activiteit = activiteiten;
            var self = this;
            //wanneer de waarde van de filter is aangepast
            var browseList = document.querySelector(".browseList");
            var filterValue = document.querySelector('[name="activiteit"]');
            filterValue.addEventListener("change",function(ev){
                console.log("change");
                //doorloop alle activiteiten
                //toon enkel digene waar de activiteit.status == filter.value
                for(var i=0; i<activiteit.length;i++){
                    if(activiteit[i].status == filterValue.value || filterValue.value == ""){
                        var html;
                            if(activiteit[i].gebruikerId == self._applicationDbContext._dbData.activeuser.id){
                                html += '<li class="activity"  id="'+activiteit[i].id+'" style="background-color: #345f89; color:white;">';
                                html += '<button class="btn_X" id="'+activiteit[i].gebruikerId+'"><i class="fa fa-trash fa-lg" aria-hidden="true" style="color: white"; ></i></button>';    
                            }else{
                                html += '<li class="activity"  id="'+activiteit[i].id+'">';
                                html +='<button class="btn_X" id="'+activiteit[i].gebruikerId+'"><i class="fa fa-floppy-o fa-lg" aria-hidden="true" ></i></button>';    
                            }
                            html += '<ul class="info_dtl">';
                            html += '<li><span>'+activiteit[i].status+'</span></li>';
                            html += '<li>Van: '+activiteit[i].startDatum+" "+activiteit[i].startUur+'</li>';
                            html += '<li>Tot: '+activiteit[i].stopDatum+" "+activiteit[i].stopUur+'</li>';
                           // html += '</ul>';
                           // html += '<ul class="info_user">';
                            html += '<li>Door: '+activiteit[i].gebruikerNaam+'</li>';
                            html += '<li>Hond: '+activiteit[i].gebruikerHond+' '+activiteit[i].gebruikerRas+'</li>'
                            html += '<li>Locatie: '+activiteit[i].locatie+'</li>';
                            html += '</ul>';
                            html += '</li>';
                            browseList.innerHTML = html;
                    }
                }
            });
        },

        "addOrDeleteActivities":function(){
            var saved = false;
            var saved2 = false;
            var self= this;
            //doorloop alle aanwezige buttons, en voeg er een eventlistener aan toe
            var activiteitBtn = document.querySelectorAll(".btn_X");
            for(var i=0; i<this._applicationDbContext._dbData.activiteiten.length;i++){
                activiteitBtn[i].addEventListener("click",function(ev){
                    //this["id"] geeft de id  weer van de gebruikers post waar op geklikt is
                    var gebruikerId = this["id"];
                    //als activiteitId == activeuserId => verwijderen
                    if(gebruikerId == self._applicationDbContext._dbData.activeuser.id){
                        //ga door alle activiteiten;
                        for(var j=0; j<self._applicationDbContext._dbData.activiteiten.length;j++){
                            //als activiteitId == id -> delete activiteit
                            var activiteitId = this.parentElement["id"];
                            console.log(self._applicationDbContext._dbData.activiteiten[j]);
                            if(activiteitId==self._applicationDbContext._dbData.activiteiten[j].id){
                                //delete op plaats j
                                self._applicationDbContext._dbData.activiteiten.splice(j,1);
                                self._applicationDbContext.save();
                                this.parentElement.remove();
                            }
                        }
                    }
                    //als activiteitId != activeuserId => opslaan
                    else if(gebruikerId != self._applicationDbContext._dbData.activeuser.id){
                        
                        this.innerHTML = '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i>';
                        
                        //ga door alle activiteiten;
                        for(var j=0; j<self._applicationDbContext._dbData.activiteiten.length;j++){
                            //als activiteitId meegegeven in de html == id van de activiteit in de database -> save activiteit in myactivities
                            //de activiteitId wordt via het li element meegegeven dat de parent van de button is
                            var activiteitId = this.parentElement["id"];
                            if(activiteitId==self._applicationDbContext._dbData.activiteiten[j].id){
                                
                                //doorloop alle profielen
                                for(var k=0; k<self._applicationDbContext._dbData.profiles.length;k++){
                                //selecteer mijn profiel
                                if(self._applicationDbContext._dbData.profiles[k].id == self._applicationDbContext._dbData.activeuser.id){
                                    //voeg aan de activiteit de Id van de gebruiker die de activiteit GEACCEPTEERD heeft
                                    self._applicationDbContext._dbData.activiteiten[j].acceptorId = self._applicationDbContext._dbData.activeuser.id;
                                    
                                    
                
                


                                    //sla de activiteit op in profile[x].opgeslagenActiviteiten
                                    //dit is een array -> de length wordt opgevragen, deze geeft bv 5 weer
                                    //aangezien array 0based telt, heeft het 5de element , index 4 ([4])
                                    //DUS: savedActivities[nieuweIndex] zal altijd op de laatste index +1 de waarde stoppen;
                                    var savedActivities = self._applicationDbContext._dbData.profiles[k].opgeslagenActiviteiten;
                                    //var nieuweIndex = savedActivities.length;
                                    savedActivities.push(self._applicationDbContext._dbData.activiteiten[j]);
                                    self._applicationDbContext.save();
                                    saved = true;
                                    }
                                }  
                            }
                        }
                    
                        //voeg dit ook toe aan de activiteit van de CREATOR in zijn opgeslagen activiteiten
                        //doorloop alle activiteiten
                        //als de profielId == creatorId =>
                        //doorloop al zijn opgeslagen activiteiten
                        //als opgeslagenId == activiteitenId =>
                        //verander acceptorId
                        if(saved == true){
                        //zoek een profiel waar de  profiles[k].id== activiteiten.gebruikerId;
                            var clickedActiviteitId = this.parentElement["id"];
                            var profielen = self._applicationDbContext._dbData.profiles;
                            for(var k=0; k<profielen.length;k++){
                                var savedActivities = profielen[k].opgeslagenActiviteiten;
                                for(var x=0; x<savedActivities.length;x++){
                                    console.log(savedActivities[x].id);
                                    console.log(clickedActiviteitId);
                                    console.log("------------------");
                                    if(savedActivities[x].id == clickedActiviteitId){
                                        console.log("***WINNER***");
                                        console.log(savedActivities[x]);
                                        console.log(clickedActiviteitId);
                                        console.log("*************");
                                        savedActivities[x].acceptorId = self._applicationDbContext._dbData.activeuser.id;
                                        saved2 =true;
                                    }
                                }
                            }
                        }
                    }
                for(var j=0; j<self._applicationDbContext._dbData.activiteiten.length;j++){
                    //als activiteitId == id -> delete activiteit
                    var activiteitId = this.parentElement["id"];
                    console.log(self._applicationDbContext._dbData.activiteiten[j]);
                    if(activiteitId==self._applicationDbContext._dbData.activiteiten[j].id){
                        //delete op plaats j
                        self._applicationDbContext._dbData.activiteiten.splice(j,1);
                        self._applicationDbContext.save();
                        }
                }

                //na verwijderen of opslaan -> weer alle activiteiten laden en 
                //checken of er wordt geklikt op save/delete

                self.addOrDeleteActivities();
                });
            }
        },

        "getSavedActivities":function(){
            console.log(this._applicationDbContext._dbData.profiles);


            var browseList = document.querySelector(".savedActivitiesList");
            //alle opgeslagen activiteiten van de user ophalen;
            var profielen = this._applicationDbContext._dbData.profiles;

            //checken data uit mijn profiel halen
            for(var i=0; i<profielen.length;i++){
                if(profielen[i].id == this._applicationDbContext._dbData.activeuser.id){
                    //profiel gevonden -> alle opgeslagen activiteiten doorlopen
                    for(var j=0; j<profielen[i].opgeslagenActiviteiten.length;j++){
                       var activiteit = profielen[i].opgeslagenActiviteiten[j];
                       var html;
                        //als activegebruikerId = gebruikerID van de actie (degine die het gepost heeft)
                            //veranderd de style
                            //er wordt een id waarde toegekent aan de button en activiteit -> bij het klikken kan 
                            //dan makkelijk gezien worden bij welke activiteit welke button hoord. 
                            //zie addOrDeleteActivity();
                            
                            html += '<li class="activity"  id="'+activiteit.id+'">';
                            html += '<button class="btn_X" id="'+activiteit.gebruikerId+'"><i class="fa fa-trash fa-lg" aria-hidden="true" ></i></button>';    
                            
                            
                            html += '<ul class="info_dtl">';
                            html += '<li><span>'+activiteit.status+'</span></li>';
                            html += '<li>Van: '+activiteit.startDatum+" "+activiteit.startUur+'</li>';
                            html += '<li>Tot: '+activiteit.stopDatum+" "+activiteit.stopUur+'</li>';
                           // html += '</ul>';
                           // html += '<ul class="info_user">';
                            html += '<li>Door: '+activiteit.gebruikerNaam+'</li>';
                            html += '<li>Hond: '+activiteit.gebruikerHond+' '+activiteit.gebruikerRas+'</li>'
                            html += '<li>Locatie: '+activiteit.locatie+'</li>';
                            //de gebruikersnaam van de persoon die de activiteit geaccepteerdheeft
                            //de acceptorId werd meegestuurd -> daarmee gebruikersnaam opvragen
                            console.log(activiteit.acceptorId);
                            for(var k=0; k<this._applicationDbContext._dbData.profiles.length;k++){
                                if(this._applicationDbContext._dbData.profiles[k].id==activiteit.acceptorId){
                                    html+= '<li>Geaccepteerd door :'+this._applicationDbContext._dbData.profiles[k].gebruikersnaam+'</li>';
                                }
                                console.log("acceptorId is "+activiteit.acceptorId);

                            }
                            html += '</ul>';
                            html += '</li>';
                            browseList.innerHTML = html;
                            

                    }
                }
            }
        },


        
        

        /*VAN VORIGE OEFENINGEN */

        "updateUIProfilesList": function() {
            var profiles = this._applicationDbContext.getProfiles(); // Get all profiles via the ApplicationDbContext

            if(this._listprofiles != null) {

                if(profiles != null && profiles.length > 0)
                {
                    var strHTML = '', profile = null;
                    for(var i=0; i < profiles.length;i++) {
                        profile = profiles[i]; // Get profile from the array of profiles by certain index i
                        strHTML += '<div class="mdl-card mdl-cell mdl-cell--12-col-desktop mdl-cell--12-col-tablet mdl-cell--12-col-phone  mdl-shadow--2dp tweet' + ((profile.DeletedAt != null)?' tweet--softdeleted':'') + '" data-id="' + profile.Id + '">';
                        strHTML += '<div class="mdl-card__supporting-text">';
                        strHTML += '<h4>' + profile.Gebruikersnaam + '</h4>';
                        strHTML += '<p>' + profile.Email + '</p>';
                        strHTML += '</div>';
                        strHTML += '<button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="btn-' + profile.Id + '">';
                        strHTML += '<i class="material-icons">more_vert</i>';
                        strHTML += '</button>';
                        strHTML += '<ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right" for="btn-' + profile.Id + '">';
                        strHTML += '<li class="mdl-menu__item">Edit</li>';
                        strHTML += '<li class="mdl-menu__item">';
                        strHTML += (profile.DeletedAt == null || profile.DeletedAt == undefined)?'Soft-delete':'Soft-undelete';
                        strHTML += '</li>';
                        strHTML += '<li class="mdl-menu__item">Delete</li>';
                        strHTML += '</ul>';
                        strHTML += '</div>';
                    }
                    this._listprofiles.innerHTML = strHTML;
                    componentHandler.upgradeAllRegistered(); // Update Material Design Lite Event Listeners for all new elements into the DOM
                }
            }
        },

        "unitTestProfiles": function() {
            // TEST
            if(this._applicationDbContext.getProfiles() == null) {
                // CREATE profile
                var profile = new profile();
                profile.Gebruikersnaam = 'Nintendo NES Classic Review - Schattig, maar komt iets tekort';
                profile.Email = 'Hij is klein, hij is schattig en hij verschijnt op precies het juiste moment. Rara wat is dat? Dat moet de NES Classic zijn, die het vast goed gaat doen in de komende cadeautjesperiode. Althans: als hij leverbaar is. Nintendo heeft een perfect moment uitgekozen om het kleine hebbedingetje op de markt te brengen, en er is dan ook veel belangstelling voor de miniconsole. Overigens is er wat verwarring over de naam van het ding, want Nintendo hanteert verschillende varianten. Op de doos wordt het aangeduid als Nintendo Classic Mini, op de site heeft Nintendo het over de NES Classic Edition en in persberichten wordt het apparaatje aangeduid als Nintendo Classic Mini: Nintendo Entertainment System. Wij houden het voorlopig maar op NES Classic.';
                profile.Wachtwoord = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. An quod ita callida est, ut optime possit architectari voluptates? Nunc haec primum fortasse audientis servire debemus. Quem Tiberina descensio festo illo die tanto gaudio affecit, quanto L. Qui autem esse poteris, nisi te amor ipse ceperit? Ergo adhuc, quantum equidem intellego, causa non videtur fuisse mutandi nominis. Duo Reges: constructio interrete. Mihi enim erit isdem istis fortasse iam utendum. Quid sequatur, quid repugnet, vident. </p><p>Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. Quae cum essent dicta, finem fecimus et ambulandi et disputandi. Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Id enim natura desiderat. Graece donan, Latine voluptatem vocant. Odium autem et invidiam facile vitabis. Etenim si delectamur, cum scribimus, quis est tam invidus, qui ab eo nos abducat? Verba tu fingas et ea dicas, quae non sentias? Quae cum magnifice primo dici viderentur, considerata minus probabantur. Honesta oratio, Socratica, Platonis etiam. </p><p>Scio enim esse quosdam, qui quavis lingua philosophari possint; Quod quidem iam fit etiam in Academia. Hoc simile tandem est? Quae autem natura suae primae institutionis oblita est? Quid dubitas igitur mutare principia naturae? </p><p>Quid de Pythagora? Cur deinde Metrodori liberos commendas? Hoc ipsum elegantius poni meliusque potuit. Cui Tubuli nomen odio non est? Age, inquies, ista parva sunt. Ut pulsi recurrant? Etenim semper illud extra est, quod arte comprehenditur. Equidem, sed audistine modo de Carneade? </p><p>Aliter enim explicari, quod quaeritur, non potest. Mihi enim satis est, ipsis non satis. Nam quibus rebus efficiuntur voluptates, eae non sunt in potestate sapientis. Si enim ad populum me vocas, eum. Sed ad bona praeterita redeamus. Inde sermone vario sex illa a Dipylo stadia confecimus. Non quaero, quid dicat, sed quid convenienter possit rationi et sententiae suae dicere. Ad corpus diceres pertinere-, sed ea, quae dixi, ad corpusne refers? Isto modo, ne si avia quidem eius nata non esset. Quacumque enim ingredimur, in aliqua historia vestigium ponimus. </p>'
                var profileAdded = this._applicationDbContext.addProfile(profile);
                console.log(profileAdded);
            } else {
                // UPDATE A profile
                var id = this._applicationDbContext.getProfiles()[0].Id;
                var profile = this._applicationDbContext.getProfileById(id);
                if(profile != null) {
                    profile.Gebruikersnaam = 'Nintendo NES Classic Review - Schattig, maar komt iets tekort';
                    var result = this._applicationDbContext.updateProfile(profile);
                    console.log(result);
                }
                // SOFT DELETE OR UNDELETE A profile
                profile = this._applicationDbContext.getProfileById(id);
                if(profile != null) {
                    var result = (profile.DeletedAt == null || profile.DeletedAt == undefined)?this._applicationDbContext.softDeleteProfile(profile.Id):this._applicationDbContext.softUnDeleteProfile(profile.Id);
                    console.log(result);
                }
                // DELETE A profile
                profile = this._applicationDbContext.getProfileById(id);
                if(profile != null) {
                    var result = this._applicationDbContext.deleteProfile(profile.Id)
                    console.log(result);
                }
            }
        }
    };

    App.init();
});

