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
  let confFile = "qwolmap.json";
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
    launch_app(fallbackConfig);
  })
  .then((configData) => {
    console.log("loadConfig: Normal startup with configuration:\n", confFile);
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
      "zoom": 3,
      "centreLonLat": [ 0, 0 ],
      "CRS": "EPSG:3857",
      "attribCtrl": false,
      "scaleCtrl": false,
      "graticule": false,
      "urlHash": false,
      "layerCtrl": true,
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
      "parent": "basemaps",
      "type-layer": "tile",
      "source": "OSM-built-in",  
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"},
    },
    {
          "name": "WorldImagery",
          "title": "Esri World Imagery",
          "id": "e1",
      "parent": "basemaps",
      "type-layer": "XYZ",
      "source": {"url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"},  
      "visible": false,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"},
    },
    {
      "name": "DK-pl",
      "title": "Denamrk pipelines",
      "id": "dk1",
      "parent": "overlays",
      "type-layer": "geojson",
      "source": {
        "url": "https://raw.githubusercontent.com/qwilka/qw-olmap/refs/heads/master/data/DK_Geus_pipelines_simplified.geojson",
        "attributions": ["GEOJSONtest"]
      },  
      "visible": true,
      "properties": {"title": "notitle", "name": "noname", "id": "noid"},      
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
        "name": "WorldImagery",
        "title": "Esri World Imagery",
        "id": "e1",
        "parent": "basemaps",
        "type": "tilemap",
        "deactivate": true,
        "url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "selected": false,
        "options": {
          "attribution": "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }

    },
      {
        "name": "EEZ",
        "title": "EEZ boundaries",
        "id": "ez1",
        "parent": "overlays",
        "deactivate": true,
        "type": "WMS",
        "url": "http://geo.vliz.be:80/geoserver/MarineRegions/wms",
        "selected": true,
        "options": {
            "layers": "MarineRegions:eez_boundaries",
            "version": "1.1.1",
            "format": "image/png",
            "transparent": true,
            "noWrap": true,
            "opacity": 0.8,
            "attribution": "EEZ boundaries: <a target='_blank' href='http://www.marineregions.org'>Flanders Marine Institute</a>, <a target='_blank' href='https://creativecommons.org/licenses/by/4.0/'>(CC BY 4.0)</a>"
        }

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