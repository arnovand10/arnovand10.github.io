/*if(document.querySelector(".map")){
  
  function initMap() {
    var arrGEO = new Array();
    //var geoData =  $.getJSON("https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson");
    var geoData = $.ajax({type: "GET", url:"https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson", async: false}).responseText;
      //console.log(geoData);
    
    var response = JSON.parse(geoData);
    var hondenvoorzieningen = [];
    var markers = [];
    for(var i=0; i<response.coordinates.length;i++){
      hondenvoorzieningen[i] = {lat: response.coordinates[i][0], lng: response.coordinates[i][1]};
    }
    console.log(hondenvoorzieningen[0]);
    for(var i=0;i<hondenvoorzieningen.length;i++){
        this._geoLocationMarker = new google.maps.Marker({
        position: hondenvoorzieningen[i],
        map: map
      })
    }
    console.log(this._geoLocationMarker);
    

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
  }
}else{
  function initMap(){
    return false;
  }
}



/*
* Load Google Maps Asynchronous
* via appending script
* Don't forget the key: https://console.developers.google.com/flows/enableapi?apiid=maps_backend&keyType=CLIENT_SIDE&reusekey=true&pli=1
* Choose web API
*/
(function(){
  console.log("map");
    var key = 'AIzaSyDM44tX91QAae5d11iSGxe5JeM7Zp2CnUQ'; // User your own Key!

    //Load Google Maps Async
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp'
        + '&key=' + key
        + '&libraries=places'
        + '&callback=initGoogleMaps';
    document.body.appendChild(script);

    var scriptAutoComplete = document.createElement('script');
    script.type = 'text/javascript';
    scriptAutoComplete.src="https://map.googleapis.com/map/api/js?v=3.exp&signed_in=true&libraries=places";
    document.body.appendChild(scriptAutoComplete);


    this.initGoogleMaps = function(){
        this._googleMapsInitialized = true;
    };

})();

var GMap = {
    "init": function() {
      console.log("init");
        var mapOptions = {
            zoom:13,
            center: new google.maps.LatLng(51.048017, 3.727666)
        }
        this._map = new google.maps.Map(document.querySelector('.map'), mapOptions);
        google.maps.visualRefresh = true;
        google.maps.event.trigger(this._map, 'resize');
        this._locations = this.getLocations();
        this._info = this.test(this._map);
        this._geoLocationMarker = null;
        this._markersTreesInventory = [];
        this._markerClusterTreesInventory = null;
    },
    "addMarkerGeoLocation": function(geoLocation) {
        this._geoLocationMarker = new google.maps.Marker({
            position: new google.maps.LatLng(geoLocation[1], geoLocation[0]),
            title:"My location",
        });// Create a Google Maps Marker

        this._geoLocationMarker.setMap(this._map);// Add Marker to Map
        this._map.setCenter(new google.maps.LatLng(geoLocation[1], geoLocation[0]));// Set center of the map to my geolocation
    },
    "hideMarkers": function(arrMarkers, hide){
        var self = this;

        _.each(arrMarkers, function(marker){
            if(hide){
                marker.setMap(null);
            }else{
                marker.setMap(self.map);
            }
        });
    },
    "refresh": function() {
        google.maps.visualRefresh = true;
        google.maps.event.trigger(this.map,'resize');
    },

    "getLocations":function(){
        var geoData = $.ajax({type: "GET", url:"https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson", async: false}).responseText;
        var response = JSON.parse(geoData);
        for(var i=0; i<response.coordinates.length;i++){
          this.addMarkerGeoLocation(response.coordinates[i]);
        }
    },
    "test":function(_map){
      var marker = new google.maps.Marker({
        position:{
          lat: 0,
          lng:0,
        },
        map: this._map,
        draggable: true,
      });
        var searchBox = new google.maps.places.SearchBox(document.getElementById('autocomplete'));

        google.maps.event.addListener(searchBox, 'places_changed',function(){
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var i, place;
        for(i=0; place = places[i];i++){
          console.log(place.geometry.location.lat());
          console.log(place.geometry.location.lng());
          
          bounds.extend(place.geometry.location);
          marker.setPosition(place.geometry.location);
        }

        _map.fitBounds(bounds);
        _map.setZoom(15);
        });
        
    }   
};