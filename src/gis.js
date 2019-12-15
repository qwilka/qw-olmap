
// https://github.com/Leaflet/Leaflet.markercluster/issues/874#issuecomment-437895103
//import * as L from 'leaflet';
import L from 'leaflet';
import 'leaflet-easybutton';
import './libs/leaflet.ajax.min';

import 'leaflet/dist/leaflet.css';
import 'leaflet-easybutton/src/easy-button.css';
import '@fortawesome/fontawesome-free/css/all.css';

//import LatLon from 'geodesy/latlon-ellipsoidal-datum.js';
import {Utm, LatLon} from 'geodesy/utm';


import $ from 'jquery'; 
//import * as turf from '@turf/turf';
import {lineString, point} from '@turf/helpers';
import {nearestPointOnLine} from '@turf/nearest-point-on-line';


export class Vnleafmap {

  constructor({id_number=0, gisOptions=null} = {}) {
    this.id_number = id_number;
    this.map_id = "vn-map-" + id_number.toString();
    // console.log(`Vnleafmap map_id=${this.map_id}`);
    // console.log("Vnleafmap gisOptions", gisOptions);
    
    this.map = L.map(this.map_id, gisOptions.leafletMapOptions); 
    if (this.map.zoomControl) {
      this.map.zoomControl.setPosition('topright');
    }
    

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

    if (gisOptions.scaleControl) {
      let scale = L.control.scale({position:'bottomright', metric:true, imperial:false});
      scale.addTo(this.map);
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

  loadGeojson(url) {
    let map = this.map;
    let popup = L.popup();
    let layer  = new L.GeoJSON.AJAX(url ,{
      dataType: 'json',
      local: true,
      style: function(feature) {
              let linestyle;
              if (feature.properties.hasOwnProperty('style')) {
                linestyle = feature.properties.style;
              } else if (feature.properties.hasOwnProperty('content_name')) {
                // Denmark pipelines geojson
                switch (feature.properties.content_name.toLowerCase()) {
                  case 'gas': return {color: "#008b00"};
                  case 'oil':  return {color: "#8b0000"};
                  case 'multi-phase':  return {color: "#cdcd00"};
                  default:  return {color: "#36648b", "weight": 1, "opacity": 1.0}; 
                }   
              } else {
                linestyle = {color: "#ff0000", weight: 2, opacity: 1.0};
              }
              return linestyle;      
      },
      onEachFeature: function (feature, layer) {
          layer.on({
              contextmenu: function onGeojsonLayerClick(evt) {
                  L.DomEvent.stopPropagation(evt);
                  let lat = evt.latlng.lat;
                  let long = evt.latlng.lng;
                  let contstr = '<b>'+feature.properties.name+'</b>';
                  if (feature.properties.hasOwnProperty('description')) {
                    contstr += '<br>' + feature.properties.description;
                  }
                  if (feature.properties.hasOwnProperty('vn_uri')) {
                    contstr += '<br>' + feature.properties.vn_uri;
                  }
                  if (feature.properties.hasOwnProperty('KP')) {
                    let KP = feature.properties.KP;
                    //let pldist = feature.properties.distance;
                    //console.log(feature.coordinates);
                    let pl = lineString(feature.geometry.coordinates);
                    let pt = point([long, lat]);
                    let near = nearestPointOnLine(pl, pt);
                    console.log(near.geometry.coordinates, near.properties.index, near.properties.dist, near.properties.location);
                    console.log("index, dist, location", near.properties.index, near.properties.dist, near.properties.location);
                    let pt_loc = near.properties.location;
                    console.log("pt_loc", pt_loc);
                    let idx = near.properties.index;
                    // var KP1 = KP[idx];
                    // var KP2 = KP[idx+1];
                    let pt1 = point(feature.geometry.coordinates[idx]);
                    let pt1_near = nearestPointOnLine(pl, pt1);
                    let pt1_loc = pt1_near.properties.location;
                    console.log("pt1_loc", pt1_loc);
                    let pt2 = point(feature.geometry.coordinates[idx+1]);
                    let pt2_near = nearestPointOnLine(pl, pt2);
                    let pt2_loc = pt2_near.properties.location;
                    console.log("pt2_loc", pt2_loc);
                    //let contstr = "'CLR22 Processed ROV Position'";
                    let eta = (pt_loc - pt1_loc)/(pt2_loc - pt1_loc);
                    let KP_near = KP[idx]*(1 - eta) + KP[idx+1]*eta; 
                    console.log("eta, KP_near, distance", eta, KP_near, near.properties.location)
                    contstr += '<br> KP: '+parseFloat(KP_near).toFixed(3);
                    //contstr += '<br> distance: '+parseFloat(near.properties.location).toFixed(3);
                  }
                  popup
                      .setLatLng(evt.latlng)
                      .setContent(contstr)
                      .openOn(map)
              },
              click: function onGeojsonLayerClick(evt) {
                if (feature.properties.hasOwnProperty('content_name')) {
                  // Denmark pipelines geojson
                  let contstr = "Denmark pipeline";
                  contstr += '<br>name: <b>'+feature.properties.name+'</b>';
                  contstr += '<br>service: '+feature.properties.content_name.toLowerCase();
                  popup
                      .setLatLng(evt.latlng)
                      .setContent(contstr)
                      .openOn(map)
                }
              }
            });
      },
    }  );
    //console.log("geojson layer", layer)
    return layer;
  }


}


// work-around
// sidepanel_close(evt) {
//   let sidepanel_id = "vnsidepanel-" + evt.target.getAttribute("id_number");
//   console.log("sidepanel_close sidepanel_id", sidepanel_id);
//   let sb = document.getElementById(sidepanel_id);
//   sb.style.display = "none";
// }

