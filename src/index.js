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
  app_id: "vnmap",
  title: "title set from object...",
  mapOptions: {
    viewCenterCoords: [3.0, 56.46],
    basemap: "GEBCO",
    layerCtrl: true,
    scalelineCtrl: true,
  },
  treeData: {
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
            "data": {}            
          }
        ]        
      },
      {
        "title": "Overlay maps",
        "folder": true,
        "children": [
          {
            "title": "OpenStreetMap",
            "type": "GIS-layer-basemap",
            "selected": true,
            "data": {}            
          }
        ]        
      }
    ]
  }
}


