import { makeMap } from './gis';



window.onload = () => {
  let url = new URL( window.location.href );
  let hashParams = {};
  if (url.hash) {
    let hash = url.hash.substring(1); // remove the #
    let parts = hash.split("/");
    for (let i = 0; i < parts.length; i++) {
      hashParams[i] = parts[i];
    }
  }
  let confFile = "xqwolmap.json";
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
      confFile = "FALLBACK config";
      return fallbackConfig;
  })
  .then((configData) => {
    console.log("loadConfig: startup with configuration:\n", confFile);
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
      "type-layerswitcher": "base",
      "source": "OSM-built-in",  
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}
    },
    {
      "name": "Basemaps",
      "title": "Basemaps group",
      "id": "basemaps",
      "parent": "root",
      "deactivate": true,
      "type": "group",
      "type-layerswitcher": "base", 
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}
    },
    {
          "name": "WorldImagery",
          "title": "Esri World Imagery",
          "id": "e1",
      "parent": "basemaps",
      "deactivate": true,
      "type-layer": "XYZ",
      "source": {"url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"},  
      "visible": false,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}
    },
      {
          "name": "OSM1",
          "title": "OpenStreetMap",
          "id": "o1",
          "parent": "basemaps",
          "type": "tilemap",
          "deactivate": true,
          "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          "selected": true,
          "options": {
              "maxZoom": 19,
              "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
          }

      },
    {
      "name": "Overlays",
      "title": "Overlays group",
      "id": "overlays",
      "parent": "root",
      "deactivate": true,
      "type": "group",
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}
    },
    {
      "name": "DK-pl",
      "title": "Denamrk pipelines",
      "id": "dk1",
      "parent": "overlays",
      "type-layer": "geojson",
      "deactivate": true,
      "source": {
        "url": "https://raw.githubusercontent.com/qwilka/qw-olmap/refs/heads/master/data/DK_Geus_pipelines_simplified.geojson",
        "attributions": ["GEOJSONtest"]
      },  
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"}      
    },
      {
        "name": "EEZ",
        "title": "EEZ boundaries",
        "id": "ez1",
        "parent": "overlays",
        "deactivate": true,
        "type-layer": "WMS",
      "source": {
        "url": "http://geo.vliz.be:80/geoserver/MarineRegions/wms",
        "attributions": ["EEZ boundaries: <a target='_blank' href='http://www.marineregions.org'>Flanders Marine Institute</a>, <a target='_blank' href='https://creativecommons.org/licenses/by/4.0/'>(CC BY 4.0)</a>"]
      },  
        "visible": true
      },
      {
          "name": "coastlines",
          "title": "coastlines (EMODnet)",
          "id": "cl1",
          "parent": "overlays",
          "deactivate": true,
          "type": "WMS",
          "url": "http://ows.emodnet-bathymetry.eu/ows",
          "selected": false,
          "options": {
            "layers": "coastlines",
            "CRS": "EPSG:4326",
            "version": "1.3.0",
            "format": "image/png",
            "transparent": true,
            "noWrap": true,
            "opacity": 0.9,
            "attribution": "<a target='_blank' href='https://emodnet.ec.europa.eu/en/bathymetry'>EMODnet, </a>"
          }

      }
  ]
};

// https://usefulangle.com/post/298/javascript-url-hash
// https://www.w3schools.com/jsref/prop_loc_hash.asp