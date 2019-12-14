
// https://github.com/Leaflet/Leaflet.markercluster/issues/874#issuecomment-437895103
//import * as L from 'leaflet';
import L from 'leaflet';
import 'leaflet-easybutton';

import 'leaflet/dist/leaflet.css';
import 'leaflet-easybutton/src/easy-button.css';
import '@fortawesome/fontawesome-free/css/all.css';

//import LatLon from 'geodesy/latlon-ellipsoidal-datum.js';
import {Utm, LatLon} from 'geodesy/utm';

// const utm = Utm.parse('48 N 377298.745 1483034.794');
// const latlon = utm.toLatLon();
// let uu = latlon.toUtm();
// console.log("latlon.toUtm uu=", uu);
// console.assert(latlon.toString('dms', 2) == '13° 24′ 45.00″ N, 103° 52′ 00.00″ E');
// console.assert(uu.toString() == '48 N 377298.745 1483034.794');

import $ from 'jquery'; 


export class Vnleafmap {

  constructor({id_number=0, gisOptions=null} = {}) {
    this.id_number = id_number;
    this.map_id = "vn-map-" + id_number.toString();
    // console.log(`Vnleafmap map_id=${this.map_id}`);
    // console.log("Vnleafmap gisOptions", gisOptions);
    
    //this.map = L.map(mapId).setView([51.505, -0.09], 13);
    // let mapOpts = Object.assign({
    //   zoomControl: true,
    //   attributionControl: false,
    //   zoom: 5,
    //   center: [53.99, -7.36],
    //   maxBounds: [[-90,-180], [90,180]]
    // }, {})
    // if (!mapOptions) mapOptions = {
    //   zoomControl: true,
    //   attributionControl: false,
    //   zoom: 5,
    //   center: [53.99, -7.36],
    //   maxBounds: [[-90,-180], [90,180]]       
    // }
    this.map = L.map(this.map_id, gisOptions.leafletMapOptions); 
    if (this.map.zoomControl) {
      this.map.zoomControl.setPosition('topright');
    }
    
    // let layer = L.tileLayer.wms(OSM.url, OSM.options);
    // this.map.addLayer(layer);

    // let ebutton_id = "vn-map-ebutton-" + this.id_number.toString();
    // // character "&#9776;" ("fas fa-bars" alternative)
    // let ebutton = L.easyButton("fas fa-bars", (btn, map) => {
    //   let sidepanel_id = "vn-sidepanel-" + this.id_number.toString();
    //   // console.log("fire button", btn);
    //   // console.log("this.id_number", this.id_number);
    //   // console.log("sidepanel_close sidepanel_id", sidepanel_id);
    //   let sb = document.getElementById(sidepanel_id);
    //   sb.style.display = "block";
    // }, 'open side-panel controls', ebutton_id);
    // // let ebutton = L.easyButton({
    // //   stateName: 'open-sidepanel',
    // //   icon: "&#9776;",
    // //   title: 'open side panel',
    // //   onClick: function(control){
    // //     console.log("L.easyButton control", control);
    // //   }
    // // });

    if (gisOptions.sidePanel) {
      let ebutton_id = "vn-map-ebutton-" + this.id_number.toString();
      let ebutton = L.easyButton("fas fa-bars", (btn, map) => {
        let sidepanel_id = "vn-sidepanel-" + this.id_number.toString();
        let sb = document.getElementById(sidepanel_id);
        sb.style.display = "block";
      }, 'open side-panel controls', ebutton_id);
      ebutton.addTo( this.map );
    }
    
    if (gisOptions.locationPopup) {
      this.popup = L.popup();
      this.map.on('contextmenu', (evt) => {this.locationPopup(evt);});
    }

  }

  addLayer(layerObj) {
    //console.log("addLayer layerObj", layerObj);
    let layer;
    switch(layerObj.layerType) {
      case "geojson":
        layer = this.loadGeojson(layerObj.url);
        break;
      case "tilemap":
        layer = L.tileLayer(layerObj.url, layerObj.layerOpts);
        break;
      case "WMS":
        layer = L.tileLayer.wms(layerObj.url, layerObj.layerOpts);
        break;
    }
    this.map.addLayer(layer);
    let layerStamp = L.Util.stamp(layer);
    // console.log("addLayer layerStamp", layerStamp);
    // console.log("addLayer layer", layer);
    return layerStamp;
  }

  getLayerByStamp(layerStamp) {
    let _layers = [];
    this.map.eachLayer((layer) => {_layers.push(layer)})
    //console.log("getLayerByStamp _layers", _layers);
    for (let ii=0; ii<_layers.length; ii++) {
      if (_layers[ii]._leaflet_id == layerStamp) {
        return _layers[ii];
      }
    }
  }

  removeLayerByStamp(layerStamp) {
    let layer = this.getLayerByStamp(layerStamp);
    this.map.removeLayer(layer);
  }

  removeAllLayers() {
    this.map.eachLayer( (layer) => {
      this.map.removeLayer(layer);
    });
  }


  locationPopup(evt) {
    //let map = this.map;
    let popup = this.popup;  // required for callback below
    let url = "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv";
    let X = this.map.layerPointToContainerPoint(evt.layerPoint).x;
    let Y = this.map.layerPointToContainerPoint(evt.layerPoint).y;
    let size = this.map.getSize();
    let params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: 'EPSG:4326',
      version: '1.1.1',      
      bbox: this.map.getBounds().toBBoxString(),
      x: X,
      y: Y,
      height: size.y,
      width: size.x,
      layers: 'GEBCO_LATEST_2',
      query_layers: 'GEBCO_LATEST_2',
      info_format: 'text/html'
    };
    let featInfoUrl = url + L.Util.getParamString(params, url, true);
    let getinfo = $.ajax({
        url: featInfoUrl,
        dataType: "html",
        success: function (doc) { console.log("getinfo successfully loaded!\n", doc);},
        error: function (xhr) { console.log("getinfo ERROR!\n", xhr.statusText); }
    })
    $.when(getinfo).done(function() {
        let htmlstr = $.parseHTML( getinfo.responseText );
        let body = $(htmlstr).find('body:first');
        $.each(htmlstr, function(i, el){
            //console.log(i, el)
            if (el.nodeName == '#text') {
                let targetStr = el.nodeValue
                // console.log(i, targetStr);
                let test = targetStr.match(/Elevation value \(m\):\s*(-?\d+)/)
                if (test) {
                    let elevation = test[1];
                    if (elevation>=0) {
                        pustr += "<br>elevation " + elevation + " m (GEBCO)";
                    } else {
                        pustr += "<br>depth " + elevation + " m (GEBCO)";
                    }
                    // console.log("elevation=", elevation)
                    popup.setContent(pustr)
                }
            }
        });
    });  
    let lat = evt.latlng.lat;
    let long = evt.latlng.lng;
    console.log("long", long, "lat", lat);
    let latlong_WGS84 = new LatLon(lat, long);
    let latlong_ED50 = latlong_WGS84.convertDatum(LatLon.datums.ED50);
    console.log("latlong_WGS84 ", latlong_WGS84.toString());
    // work-around required to recover method toUtm() (cannot use .convertDatum() directly)
    latlong_ED50 = new LatLon(latlong_ED50.lat, latlong_ED50.lon, 0, LatLon.datums.ED50);
    //let latlong_WGS84 = new LatLon(lat, long, LatLon.datums.WGS84);
    // let ll = latlong_WGS84.convertDatum(LatLon.datums.WGS84);
    // console.log("latlon 2nd", ll.toString());
    //let utmCoord = latlong_WGS84.toUtm();
    //let latlong_this.popup = L.popup();latlong_WGS84.convertDatum(LatLon.datums.ED50);
    //let utm_WGS84 = latlong_WGS84.toUtm();
    //let utm_ED50 = new Utm(utm_WGS84.zone, 'N', 572120, 6382750, LatLon.datums.ED50); 
    let utm_ED50 = latlong_ED50.toUtm();
    //let utmCoord = utm_ED50;
    let pustr = "Location coordinates:";
    pustr += "<br>long. " + (long).toFixed(5) + "&deg;  lat. " + (lat).toFixed(5) + "&deg; (WGS84)";
    pustr += "<br>UTM zone " + utm_ED50.zone + utm_ED50.hemisphere;
    pustr += "<br>E" + (utm_ED50.easting).toFixed(1) + " N" + (utm_ED50.northing).toFixed(1) + " (ED50)";
    this.popup
      .setLatLng(evt.latlng)
      .setContent(pustr)
      .openOn(this.map)
  }

}


// work-around
// sidepanel_close(evt) {
//   let sidepanel_id = "vnsidepanel-" + evt.target.getAttribute("id_number");
//   console.log("sidepanel_close sidepanel_id", sidepanel_id);
//   let sb = document.getElementById(sidepanel_id);
//   sb.style.display = "none";
// }

