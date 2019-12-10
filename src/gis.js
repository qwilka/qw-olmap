
// https://github.com/Leaflet/Leaflet.markercluster/issues/874#issuecomment-437895103
//import * as L from 'leaflet';
import L from 'leaflet';
import 'leaflet-easybutton';
console.log("L.easyButton", L.easyButton);
//import * as mapData from "./map-data";


import 'leaflet/dist/leaflet.css';
import 'leaflet-easybutton/src/easy-button.css';


let OSM = {
  title: "OpenStreetMap",
  type: "WMS",
  basemap: true,
  ref: [
      "https://wiki.openstreetmap.org/wiki/List_of_OSM-based_services",
      "http://ows.terrestris.de/"
  ],
  url: "http://ows.terrestris.de/osm/service",
  options: {
      layers: "OSM-WMS",
      CRS: "EPSG:4326",
      version: '1.1.1',
      format: 'image/png',
      transparent: false,
      noWrap: true,
      opacity: 1.0,
      attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
}



export class Vnleafmap {

  constructor(id_number=0) {
    this.id_number = id_number;
    this.map_id = "vn-map-" + id_number.toString();
    console.log(`map_id=${this.map_id}`);
    
    //this.map = L.map(mapId).setView([51.505, -0.09], 13);
    let mapOpts = Object.assign({
      zoomControl: true,
      attributionControl: false,
      zoom: 5,
      center: [53.99, -7.36],
      maxBounds: [[-90,-180], [90,180]]
    }, {})
    this.map = L.map(this.map_id, mapOpts); 
    this.map.zoomControl.setPosition('topright');

    let layer = L.tileLayer.wms(OSM.url, OSM.options);
    this.map.addLayer(layer);
    let ebutton_id = "vn-map-ebutton-" + this.id_number.toString();
    let ebutton = L.easyButton("&#9776;", (btn, map) => {
      let sidepanel_id = "vn-sidepanel-" + this.id_number.toString();
      // console.log("fire button", btn);
      // console.log("this.id_number", this.id_number);
      // console.log("sidepanel_close sidepanel_id", sidepanel_id);
      let sb = document.getElementById(sidepanel_id);
      sb.style.display = "block";
    }, 'open side panel', ebutton_id);
    // let ebutton = L.easyButton({
    //   stateName: 'open-sidepanel',
    //   icon: "&#9776;",
    //   title: 'open side panel',
    //   onClick: function(control){
    //     console.log("L.easyButton control", control);
    //   }
    // });
    console.log("ebutton", ebutton);
    ebutton.addTo( this.map );
    
    // switch(basemap) {
    //   case "GEBCO":
    //     let gebcoSource = new TileWMS(mapData.GEBCO.options);
    //     newLayer = new TileLayer({
    //       source: gebcoSource, 
    //       title: mapData.GEBCO.options.title,
    //       type: "base"
    //     });
    //     this.map.addLayer(newLayer);
    //     break;
    //   case "OSM":
    //     newLayer = new TileLayer({
    //       source: new OSM(), 
    //       title:"OSM (default)",
    //       type: "base"
    //     });
    //     this.map.addLayer(newLayer);
    //     break;
    //   default:
    //     console.log("basemap=",basemap," set activate basemap in datatree");
    // }
  
    //let baseSource = new OSM();
    // baseLayer = new TileLayer({source: baseSource}); 
    // this.map.addLayer(baseLayer);
  
    // if (scalelineCtrl) {
    //   this.map.addControl(new ScaleLine({units: 'metric'}));
    // }

    // if (layerCtrl) {
    //   let lswitch = new LayerSwitcher({
    //     tipLabel: 'Légende',
    //     groupSelectStyle: 'children'
    //   });
    //   this.map.addControl(lswitch);
    // }

  }

}


// work-around
// sidepanel_close(evt) {
//   let sidepanel_id = "vnsidepanel-" + evt.target.getAttribute("id_number");
//   console.log("sidepanel_close sidepanel_id", sidepanel_id);
//   let sb = document.getElementById(sidepanel_id);
//   sb.style.display = "none";
// }

