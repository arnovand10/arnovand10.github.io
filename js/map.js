


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
        
        //hondenvoorzieningen.html

        if(document.querySelector('.hondenvoorzieningen')!=null){
          this._locations = this.getLocations();  
        }
        
        this._geoLocationMarker = null;
        this._markersTreesInventory = [];
        this._markerClusterTreesInventory = null;
    },
    "addMarkerGeoLocation": function(geoLocation) {
        this._geoLocationMarker = new google.maps.Marker({
            position: new google.maps.LatLng(geoLocation[0], geoLocation[1]),
            title:"My location",
            clickable: true,
            icon: {
                url:"../css/img/WafMarkerV2.png",
                scaledSize : new google.maps.Size(35, 50),
            },
        });// Create a Google Maps Marker

        this._geoLocationMarker.setMap(this._map);// Add Marker to Map
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
          //lat en lng van plaats verwisselen omdat ze in de database omgekeerd staan
          // == FACEPALM
          var latLng = [response.coordinates[i][1],response.coordinates[i][0]]
          this.addMarkerGeoLocation(latLng);
        }
    },
};