function Profile(){
	this.id;
    this.gebruikersnaam;
    this.wachtwoord;
    this.email;
    this.profielfoto;
    this.rating;
    this.hondnaam;
    this.hondras;
    this.locatie;
    this.status;

    this.mijnActiviteiten;


      
    this.CreatedAt;
    this.UpdatedAt;
    this.DeletedAt;
}

function Activiteit(){
	this.id;
	this.status;
	this.locatie;
	this.lat;
	this.lng;

	this.gebruikerId;
	this.gebruikerNaam;
	this.gebruikerHond;
	this.gebruikerRas;

	this.startDatum;
	this.startUur;
	this.stopDatum;
	this.stopUur;
	this.herhaling;

	this.CreatedAt;
	this.DeletedAt;
}

/*
var Tinderizes = {
	NEUTRAAL: 0,
	ACCEPTEER: 1,
	OPSLAAN: 2,
	properties: {
		0:{id:0, name:"Neutraal"},
		1:{id:1, name:"Accepteer"},
		2:{id:2, name:"Opslaan"}
	}
};

function TinderizeActiviteit(){
	this.UserId;
	this.LecturerId;
	this.Tinderize;

	this.CreatedAt;
	this.UpdatedAt;
	this.DeletedAt;
}*/