import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Platform, ModalController, AlertController } from 'ionic-angular';
import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') map;
  markerCluster: any;
  mapv: any;
  address;
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  locations: any;
  dblocations: any;
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;
  directionsDisplay = new google.maps.DirectionsRenderer();
  mapoptions: any;
  directionsService = new google.maps.DirectionsService();



  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public platform: Platform, public modalCtrl: ModalController, private zone: NgZone, public angFire: AngularFire) {

    this.address = {
      place: ''
    };
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    //this.locations = this.angfire.database.list('/Locations');
    // this.locations = [{"name":"Test1","latitude":6.933239,"longitude":79.877283},{"name":"Salon Colombo","latitude":6.874817,"longitude":79.885272},{"name":"Ramani Fernando Solon","latitude":6.896275,"longitude":79.923068},{"name":"Salon Divanthra","latitude":6.916722,"longitude":79.972541}];
    this.dblocations = angFire.database.list('/Locations');
    this.dblocations.subscribe(items => {
      this.locations = items;
    });
    //console.log("Location : " + this.locations)
  }
  
  added: boolean = false;
  addMarker(): void {
    let prompt = this.alertCtrl.create({
      title: 'Add Location',
      message: 'Enter the salon name, longitude and latitude ',
      inputs: [
        {
          name: 'name',
          placeholder: "Salon name"
        },
        {
          name: 'latitude',
          placeholder: "Latitude"
        },
        {
          name: 'longitude',
          placeholder: "Longitude"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("cancel clicked");
          }
        },
        {
          text: "Save",
          handler: data => {
            this.added = this.dblocations.push({
              name: data.name,
              latitude: data.latitude,
              longitude: data.longitude
            });
            if((data.name !="") && (data.longitude !="") && (data.latitude!="")){
              if (this.added) {
                this.presentAlert();
                this.added=false;
              }
            }
            else
            {
              return true;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Succesfully added',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  

  initJSMaps(mapEle) {

    let thisScope = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        thisScope.mapoptions = new google.maps.Map(mapEle, {
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: 11
        });
        var loc = { lat: position.coords.latitude, lng: position.coords.longitude }
        console.log(loc);
        //+thisScope.drowCircle(mapoptions,loc);
        thisScope.mapv = new google.maps.Map(mapEle, thisScope.mapoptions);
        //thisScope.addMarkersToMap(thisScope.locations, thisScope.mapv);
      });
    }
  }

  initNativeMaps(mapEle) {
    this.map = new GoogleMap(mapEle);
    mapEle.classList.add('show-map');

    GoogleMap.isAvailable().then(() => {
      const position = new GoogleMapsLatLng(6.927079, 79.861244);
      this.map.setPosition(position);
    });
  
  }

  ionViewDidLoad() {
    let mapEle = this.map.nativeElement;

    if (!mapEle) {
      console.error('Unable to initialize map, no map element with #map view reference.');
      return;
    }

    // Disable this switch if you'd like to only use JS maps, as the APIs
    // are slightly different between the two. However, this makes it easy
    // to use native maps while running in Cordova, and JS maps on the web.
    if (this.platform.is('cordova') === true) {
      this.initNativeMaps(mapEle);
    } else {
      this.initJSMaps(mapEle);
    }
  }
  addMarkersToMap() {
    let mapc = this.map.nativeElement;
    let mapoptions3 = new google.maps.Map(mapc, {
      center: { lat: 6.933239, lng: 79.877283 },
      zoom: 11
    });
    // this.locations.subscribe(locations => {
    //       locations.forEach(marker => {  
    //   var position = new google.maps.LatLng(marker.latitude, marker.longitude);
    //   var Mark = new google.maps.Marker({ position: position, title: marker.name });
    //   Mark.setMap(mapoptions3);

    //   google.maps.event.addListener(Mark, 'click', () => {
    //     //this.navCtrl.push(HelloIonicPage);
    //     console.log(position);
    //     //this.calcRoute(mapoptions3,this.directionsService,this.directionsDisplay);
    //   });});});

    this.locations.forEach(marker => {
      var position = new google.maps.LatLng(marker.latitude, marker.longitude);
      var Mark = new google.maps.Marker({ position: position, title: marker.name });
      Mark.setMap(mapoptions3);

      google.maps.event.addListener(Mark, 'click', () => {
        //this.navCtrl.push(HelloIonicPage);
        console.log(position);
        //this.calcRoute(mapoptions3,this.directionsService,this.directionsDisplay);
      });
    });
  }


  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        if (predictions != undefined || predictions != null) {
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction);
          });
        }
      });
    });
  }
  chooseItem(item: any) {
    this.autocomplete.query = item.description;
    let mapc = this.map.nativeElement;
    let mapoptions2 = new google.maps.Map(mapc, {
      center: { lat: 6.933239, lng: 79.877283 },
      zoom: 11
    });
    this.geocodePlaceId(this.geocoder, mapoptions2, this.infowindow, item.place_id);
    this.autocompleteItems = [];
  }



  geocodePlaceId(geocoder, map, infowindow, placeId) {
    geocoder.geocode({ 'placeId': placeId }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(11);
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getCurrentLocation() {
    let mapc = this.map.nativeElement;
    let mapoptions3 = new google.maps.Map(mapc, {
      center: { lat: 6.933239, lng: 79.877283 },
      zoom: 11
    });
    var infowindo = new google.maps.InfoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var posi = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        console.log(posi);
        infowindo.setPosition(posi);
        infowindo.setContent('My Location');
        infowindo.open(mapoptions3);
        mapoptions3.setCenter(posi);
      });
    }
  }
  drowCircle(map, Cordinates) {
    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: Cordinates,
      radius: 5000,
    });
  }
  // calcRoute(map,directionsService,directionsDisplay) {
  //     var start = new google.maps.LatLng(6.9271, 79.8612);
  //     var end = new google.maps.LatLng(7.0025, 79.9099);
  //     var bounds = new google.maps.LatLngBounds();
  //     bounds.extend(start);
  //     bounds.extend(end);
  //     map.fitBounds(bounds);
  //     var request = {
  //         origin: start,
  //         destination: end,
  //         travelMode: google.maps.TravelMode.DRIVING
  //     };
  //     directionsService.route(request, function (response, status) {
  //         if (status == google.maps.DirectionsStatus.OK) {
  //             directionsDisplay.setDirections(response);
  //             directionsDisplay.setMap(map);
  //         } else {
  //             alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
  //         }
  //     });
  // }
}

