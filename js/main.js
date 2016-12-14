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
            //check of we op myprofile.html pagina zijn
            if(this._myprofilePage!=null){
            	//check of er een active user is
            	if(this._applicationDbContext._dbData.activeuser != null){
            		//data myprofile uit local storage halen
            		console.log(this._applicationDbContext._dbData.activeuser["id"]);
            		//this.updateUIMyProfile(this._applicationDbContext._dbData.activeuser["id"]);	
            		this.updateUIMyProfile(this._activeUser);
            	}
            	//geen active user -> redirect naar home
            	else{
            		window.location = "/index.html/#home";
            	}
            	
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
            		window.location = "/index.html/#home";	
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
                    	console.log("niets gevonden of leeg veld");
                    } else if(result == false) {
                    	console.log("gebruikersnaam en wachtwoord komen niet overeen");
                    } else {
                        self._activeUser = result; // User is Logged in
                        self._applicationDbContext._dbData.activeuser = result;
                        self._applicationDbContext.save();
                        self.updateUI();
                    }
                    
                    return false;
                });
            }else{
            	console.log("form_home false");
            }
        },

        "updateUI":function(){
        	document.querySelector(".inlogNav").style.visibility = "visible";
        	window.location = "/_pages/myprofile.html";
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

