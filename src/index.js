import { load_config } from './config';
import {VnApp} from "./app"




//mapSetup(config1);

function main() {
  //let gis = new Vnleafmap();
  //let app = new VnApp({app_id:"testmap"});
  //let app = new VnApp(defaultConf);

  let confFile;
  let url = new URL( window.location.href );
  if (url.searchParams.has("conf")) {
    confFile = url.searchParams.get("conf");
    confFile = "/data/" + confFile;
    load_config(confFile, (confData) => {
      //main(confData);
      let app = new VnApp(confData);
    });
  } else {
    let app = new VnApp(defaultConf);
  }
}



window.onload = () => {
  main();
}


const defaultConf = {
  "app_id": "vnmap",
  "title": "title set from object...",
  "appType": "vnleaf",
  "mapOptions": {
    "viewCenterCoords": [3.0, 56.46],
    "basemap": "GEBCO",
    "layerCtrl": true,
    "scalelineCtrl": true,
  },
  "treeData": {
    "title": "rootnode",
    "type": "gis-widget",
    "data": {
    },
    "children": [
      {
        "title": "Base maps",
        "radiogroup": true,
        "folder": true,
        "children": [
          {
            "title": "OpenStreetMap",
            "type": "GIS-layer-basemap",
            "checkbox": "radio",
            "selected": true,
            "data": {
                "layerType": "WMS",
                "url": "http://ows.terrestris.de/osm/service",
                "layerOpts": {
                    "layers": "OSM-WMS",
                    "CRS": "EPSG:4326",
                    "version": "1.1.1",
                    "format": "image/png",
                    "transparent": false,
                    "noWrap": true,
                    "opacity": 1,
                    "attribution": "&copy; <a target='_blank' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
                }
            }
          },
          {
            "title": "GEBCO",
            "type": "GIS-layer-basemap",
            "checkbox": "radio",
            "selected": false,
            "data": {
                "layerType": "WMS",
                "url": "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
                "layerOpts": {
                    "layers": "GEBCO_LATEST",
                    "CRS": "EPSG:4326",
                    "version": "1.3.0",
                    "format": "image/png",
                    "transparent": false,
                    "noWrap": true,
                    "opacity": 1,
                    "attribution": "<a target='_blank' href='https://www.gebco.net/'>GEBCO</a>"
                }
            }
          },
          {
            "title": "No background",
            "type": "GIS-layer-basemap",
            "checkbox": "radio",
            "selected": false,
            "data": {
                "layerType": "tilemap",
                "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg=="
            }
          }
        ]        
      },
      {
        "title": "Overlays",
        "folder": true,
        "children": [
          {
            "title": "Exclusive economic zone boundaries",
            "type": "GIS-layer",
            "checkbox": true,
            "selected": false,
            "data": {
              "layerType": "WMS",
              "url": "http://geo.vliz.be:80/geoserver/MarineRegions/wms",
              "layerOpts": {
                  "layers": "MarineRegions:eez_boundaries",
                  "version": "1.1.1",
                  "format": "image/png",
                  "transparent": true,
                  "noWrap": true,
                  "opacity": 0.8,
                  "attribution": "<a target='_blank' href='http://www.marineregions.org'>FlandersMarineInst (CC-BY-NC-SA)</a>"        
              }  
            }            
          }
        ]        
      }
    ]
  }
}


