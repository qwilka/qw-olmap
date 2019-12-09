import * as L from 'leaflet';
//import * as mapData from "./map-data";

import 'leaflet/dist/leaflet.css';


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
    this.map_id = "vnmap-" + id_number.toString();
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

    let layer = L.tileLayer.wms(OSM.url, OSM.options);
    this.map.addLayer(layer);
    
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
