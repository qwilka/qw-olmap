// (parcel async/await) ReferenceError: regeneratorRuntime is not defined
// https://github.com/parcel-bundler/parcel/issues/1762#issuecomment-519631755
import 'regenerator-runtime/runtime'

import { load_config } from './config';
import {VnApp} from "./app"



async function get_config(url) {
  //console.log("load_config server:", window.location.href);
  let fileF = await fetch(url);
  let confJson = await fileF.json();
  console.log("confJson", confJson)
  //let confData = JSON.parse(confJson);
  return confJson;
}



//mapSetup(config1);

async function main() {
  //let gis = new Vnleafmap();
  //let app = new VnApp({app_id:"testmap"});
  //let app = new VnApp(defaultConf);

  let confFile, confStem, confDir="/conf/", _confD;
  let url = new URL( window.location.href );
  if (url.searchParams.has("conf")) {
    confStem = url.searchParams.get("conf");
    confFile = confDir + confStem + ".vnleaf.json";
    // load_config(confFile, (confData) => {
    //   // merge defaultConf.gisOptions into confData
    //   if (confData.hasOwnProperty('gisOptions')) {
    //     if (confData.gisOptions.hasOwnProperty('leafletMapOptions')) {
    //       confData.gisOptions.leafletMapOptions = Object.assign({}, defaultConf.gisOptions.leafletMapOptions, confData.gisOptions.leafletMapOptions)
    //     };
    //     confData.gisOptions = Object.assign({}, defaultConf.gisOptions, confData.gisOptions);
    //   } else {
    //     console.error(`conf=${confStem}, «gisOptions» not specified, using default.`);
    //     confData.gisOptions = Object.assign({}, defaultConf.gisOptions);
    //   };
    //   console.log("load_config confData.gisOptions", confData.gisOptions);
    //   if (!confData.hasOwnProperty('tree_vnleaf')) {
    //     console.error(`conf=${confStem}, «tree_vnleaf» not specified, using default.`);
    //     confData.tree_vnleaf = Object.assign({}, defaultConf.tree_vnleaf);
    //   }
    //   //let app = new VnApp(confData);
    //   _confD = confData;
    // });
    _confD = await get_config(confFile);
    // let fileF = await fetch(confFile);
    // _confD = await fileF.json();
  } else {
    //let app = new VnApp(defaultConf);
    _confD = defaultConf;
  }
  if (url.searchParams.has("l")) {
    let param_l = url.searchParams.get("l"), param_l_parts;
    // https://stackoverflow.com/questions/6855624/plus-sign-in-query-string
    if (param_l.includes("+")) {
      param_l_parts = param_l.split("+");
    } else {
      param_l_parts = param_l.split(" ");
    }
    console.log("param_l=", param_l)
    console.log("param_l_parts=", param_l_parts)
    _confD.gisOptions.leafletMapOptions.zoom = parseInt(param_l_parts[0]);
    _confD.gisOptions.leafletMapOptions.center[0] = parseFloat(param_l_parts[1]);
    _confD.gisOptions.leafletMapOptions.center[1] = parseFloat(param_l_parts[2]);
  }
  console.log("_confD=", _confD);
  let app = new VnApp(_confD);
}





window.onload = () => {
  main();
}


window.onbeforeunload = () => {
  return 'alert("window.onunload!!!");';
}


const defaultConf = {
  "app_id": "vnmap",
  "title": "title set from object...",
  "appType": "vnleaf",
  "gisOptions": {
    "leafletMapOptions": {
      "attributionControl": false,
      "center": [53.98, -7.3],
      "minZoom": 4,
      "maxZoom": 26,
      "zoom": 5,
      "maxBounds": [[-90,-180], [90,180]],
      "zoomControl": true
    },
    "locationPopup": true,
    "scaleControl": true,
    "sidePanel": true
  },
  "tree_vnleaf": [
      {
        "title": "Base maps",
        "type": "folder-gis-basemaps",
        "radiogroup": true,
        "folder": true,
        "children": [
          {
            "title": "OpenStreetMap",
            "type": "gis-layer-basemap",
            "checkbox": "radio",
            "selected": true,
            "data": {
                "layerType": "WMS",
                "url": "http://ows.terrestris.de/osm/service",
                "refs": [
                  "https://wiki.openstreetmap.org/wiki/List_of_OSM-based_services",
                  "http://ows.terrestris.de/"
                ],
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
            "type": "gis-layer-basemap",
            "checkbox": "radio",
            "selected": false,
            "data": {
                "layerType": "WMS",
                "url": "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
                "refs": ["https://www.gebco.net/"],
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
            "type": "gis-layer-basemap",
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
            "type": "gis-layer",
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





