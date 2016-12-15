if(document.querySelector(".map")){
  document.querySelector(".map").style.visibility = "hidden";
  document.querySelector(".map").style.position = "absolute";
  document.querySelector(".map").style.zIndex= "-50";
  document.querySelector(".browseList").style.position= "absolute";
  document.querySelector(".browseList").style.marginRight = "2%";
  function initMap() {
    var gent = {lat: 51.0543, lng: 3.7174};
    var korenmarkt = {lat: 51.0544, lng: 3.721944};
    var gravesteen = {lat: 51.057222, lng: 3.720556};
    var locatie3 = {lat: 51.0750, lng: 3.78};
    var locatie4 = {lat: 51.0543, lng: 3.735};
    var map = new google.maps.Map(document.getElementsByClassName('map')[0], {
      zoom: 11,
      center: gent
    });
    var marker = new google.maps.Marker({
      position: gent,
      map: map
    });
    var marker2 = new google.maps.Marker({
      position: korenmarkt,
      map: map
    });
    var marker3 = new google.maps.Marker({
      position: gravesteen,
      map: map
    });
    var marker4 = new google.maps.Marker({
      position: locatie3,
      map: map
    });

    var marker4 = new google.maps.Marker({
      position: locatie4,
      map: map
    });
  
    console.log(marker2);
  }
}else{
  function initMap(){
    return false;
  }
}