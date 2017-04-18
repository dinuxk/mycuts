import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';
import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';

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
  locations : FirebaseListObservable <any>; 
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController, private zone: NgZone,public angfire : AngularFire) {
    
    console.log('Hello GoogleMapsCluster Provider');
    this.address = {
      place: ''
    };
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.locations = this.angfire.database.list('/Locations');
  }

  initJSMaps(mapEle) {

    let thisScope = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let mapoptions = new google.maps.Map(mapEle, {
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: 11
        });
        console.log("call una");
        var loc ={ lat: position.coords.latitude, lng: position.coords.longitude }
        console.log(loc);
        thisScope.drowCircle(mapoptions,loc);
        thisScope.mapv = new google.maps.Map(mapEle, mapoptions);
        thisScope.addMarkersToMap(thisScope.locations, thisScope.mapv);
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
  addMarkersToMap(markers, mapEle) {
    console.log("ethule inne"+markers);
    markers.subscribe(markers => {
          markers.forEach(marker => {
      var position = new google.maps.LatLng(marker.latitude, marker.longitude);
      var Mark = new google.maps.Marker({ position: position, title: marker.name });
      Mark.setMap(mapEle);

      google.maps.event.addListener(Mark, 'click', () => {
        this.navCtrl.push(HelloIonicPage);
      });

    });
      });
  }


  updateSearch() {
    //  this.autocomplete.query = '';
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
    console.log(item);
    this.autocomplete.query = item.description;
    let mapc = this.map.nativeElement;
    let mapoptions2 = new google.maps.Map(mapc, {
      center: { lat: 6.933239, lng: 79.877283 },
      zoom: 11
    });
    this.geocodePlaceId(this.geocoder, mapoptions2, this.infowindow, item.place_id);
    this.autocompleteItems = [];
    //this.locations = [];
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

  getCurrentLocation(): any {

    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lati: position.coords.latitude,
            long: position.coords.longitude
          }
          console.log(pos.lati);
          resolve(pos);
        });
      }
    });
  }
  drowCircle(map,Cordinates){
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
    CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          console.log("hari");
        });

      }
}

