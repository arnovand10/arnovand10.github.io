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

      
    this.CreatedAt;
    this.UpdatedAt;
    this.DeletedAt;
}

function Activiteit(){
	this.Id;
	this.Status;
	this.Location;

	this.UserName;
	this.DogName;
	this.DogRace;

	this.CreatedAt;
	this.UpdatedAt;
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