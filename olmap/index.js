import { makeMap } from './gis';

export let confFile = "qwolmap.json";

window.onload = () => {
  let url = new URL( window.location.href );
  let hashParams = {};
  if (url.searchParams.has("conf")) {
    hashParams[0] = url.searchParams.get("conf");
  }
  if (url.hash) {
    let hash = url.hash.substring(1); // remove the #
    console.log(`Startup hash = ${url.hash}`);
    let parts = hash.split("/");
    for (let i = 0; i < parts.length; i++) {
      hashParams[i] = parts[i];
    }
  }
  if (hashParams[0]) {
    confFile = `qwolmap-${hashParams[0]}.json`
  } 
  loadConfig(confFile);
}

function loadConfig(confFile) {
  let confUrl = window.location.pathname + confFile;


  fetch(confUrl)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`loadConfig: HTTP error! status: ${response.status}`);
  })
  .catch((err) => {
      console.error("loadConfig: error! failed to load:\n", confUrl,"\n", err, "\nProceeding with fallback config.");
    //launch_app(fallbackConfig);
      confFile = "FALLBACK";
      return fallbackConfig;
  })
  .then((configData) => {
    console.log("loadConfig: startup with configuration :\n", confFile);
    launch_app(configData);
  });

}

function launch_app(conf){
  document.title = conf.title;
  makeMap(conf);
}  


var fallbackConfig = {
    "title": "Qwilka qw-olmap [FALLBACK config]",
    "name": "qw-olmap",
    "description": "A basic webmap using OpenLayers." ,
    "version": "0.0.001",
    "author": "SMcE",
    "license": "MIT",
    "repository": "https://github.com/qwilka/qw-olmap",
    "refs": ["https://qwilka.github.io/gis/1/#5/53.980/-7.300/g1", "https://github.com/qwilka/qw-olmap"],
    "mapOptions": {
      "zoom": 5,
      "centreLonLat": [ 0.5, 49.0 ],
      "CRS": "EPSG:3857",
      "attribCtrl": false,
      "scaleCtrl": false,
      "scaleCtrlOpts": {
        "units": "metric",
        "bar": false,
        "steps": 4,
        "text": true,
        "minWidth": 100
      },
      "graticule": false,
      "graticuleOpts": {
            "lonLabelPosition": 0.98,
            "latLabelPosition": 1,        
            "properties": {
                "id": "graticule1"
            }
          },
      "urlHash": false,
      "layerCtrl": false,
      "xxxxxxxxxxxxxxx": null,
      "maxZoom": 15,
      "minZoom": 2,
      "zoomControl": true,
      "zoomControlPosition": "topright",
      "layerControl": true,
      "layerControlPosition": "topleft",
      "scaleControl": false,
      "scaleControlPosition": "bottomleft",
      "scaleControlMetric": true,
      "scaleControlImperial": false,
      "scaleControlMaxWidth": 100,
      "attributionControl": true,    
      "attributionPosition": "bottomright",
      "attributionPrefix": "<a target=\"_blank\" href=\"https://qwilka.github.io/\">Qwilka</a>",
      "hash": true,
      "locationPopup": true
    },
  "layers": [
    {
      "name": "OSM",
      "title": "OpenStreetMap (built-in)",
      "id": "o",
      "parent": "root",
      "type": "OSM",
      "basemap": true,
      "source": "OSM-built-in",  
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}
    }
  ]
};

// https://usefulangle.com/post/298/javascript-url-hash
// https://www.w3schools.com/jsref/prop_loc_hash.asp