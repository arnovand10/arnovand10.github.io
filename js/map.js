if(document.querySelector(".map")){
  function initMap() {
    var gent = {lat: 51.0543, lng: 3.7174};
    var locatie1 = {lat: 51.055, lng: 3.7};
    var locatie2 = {lat: 51.0750, lng: 3.73};
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
      position: locatie1,
      map: map
    });
    var marker3 = new google.maps.Marker({
      position: locatie2,
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
  }
}else{
  function initMap(){
    return false;
  }
}