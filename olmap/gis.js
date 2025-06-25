

import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

import {transform, fromLonLat} from 'ol/proj.js';
import Graticule from 'ol/layer/Graticule.js';
import Stroke from 'ol/style/Stroke.js';

import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

import {defaults as defaultControls} from 'ol/control/defaults.js';
import ScaleLine from 'ol/control/ScaleLine.js';

import sync from './libs/ol-hashed.js';


const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: '/data/DK_Geus_pipelines_simplified.geojson',
    format: new GeoJSON(),
    attributions: ["this is a", " TEST"]
  }),
  properties: {
    title: 'DK-pipelines',
    name: 'DK-geojson',
    id: 'dk1',
    type: 'vector',
},
});

const scaleControl = new ScaleLine({
    units: 'metric',
    bar: false,
    steps: 4,
    text: true,
    minWidth: 140,
});


export const makeMap = (confData) => {
    // Create a new map instance
    const map = new Map({
        target: 'map',
        layers: [
        new TileLayer({
            source: new OSM({attributions: [
                '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ',
                '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            ]}),
            properties: {
                title: 'OpenStreetMap',
                name: 'OSM',
                id: 'osm1',
                type: 'tilemap',
            },
            visible: true,
        }),
        vectorLayer,
        new Graticule({
            visible: true,
            strokeStyle: new Stroke({
                color: 'rgba(0, 0, 0, 0.2)',
                width: 1,
            }),
            showLabels: true,
            targetSize: 100,
            maxLines: 10,
            properties: {
                title: 'Graticule',
                name: 'graticule',
                id: 'graticule1',
                type: 'graticule',
            },
        }),
        ],
        controls: defaultControls({attribution: true}).extend([scaleControl]),
        view: new View({
            projection: 'EPSG:4326',   // 'EPSG:3857'
        center:  fromLonLat([4.0, 52.0], 'EPSG:4326'),
        zoom: 6,
        }),
    });

    map.on('moveend', onMoveEnd);
    sync(map);

    return true;  

}

// https://github.com/walkermatt/ol-layerswitcher
// https://github.com/walkermatt/ol-popup
// https://github.com/Turbo87/sidebar-v2

let onMoveEnd = (e) => {
    const map = e.map;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let zoom = view.getZoom();
    let center = view.getCenter();
    let rotation = view.getRotation();
    //console.log("onMoveEnd", zoom, center, rotation, projection);
    console.log(`getState: zoom=${zoom}, center=${center}, rotation=${rotation}, ${projection}`);
    let coord = transform(center, projection, 'EPSG:4326');
    //coord = coord.map(c => c.toFixed(4));
    console.log(`getState: coord=${coord}`);  
    coord = coord.map(c => Math.round(c * 1000) / 1000); 
    console.log(`getState: coord=${coord}`);   
    // let layers = map.getLayers().getArray();
    // console.log(`getState: layers=${layers.length}`);
    // layers.forEach((layer, index) => {
    //     console.log(`Layer ${index}: ${layer.get('title') || layer.get('name')}`);
    //     console.log(layer);
    // });
    // Update the state of the map
    //getState(map);
}



// let getState = (map) => {
//     const view = map.getView();
//     const projection = view.getProjection().getCode();
//     let zoom = view.getZoom();
//     let center = view.getCenter();
//     let rotation = view.getRotation();

//     return {
//         map: null,
//         layers: [],
//         overlays: [],
//         controls: [],
//         popup: null,
//         sidebar: null,
//     };
// }