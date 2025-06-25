

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

//import sync from './libs/ol-hashed.js';
import {onMoveEnd} from './hash-mapstate.js';


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




export const makeMap = (confObj) => {
    // Create a new map instance
    let mapOpts = confObj.mapOptions;
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
        ],
        controls: defaultControls({attribution: true}),
        view: new View({
            projection: mapOpts.CRS || 'EPSG:3857',   // 'EPSG:3857'   'EPSG:4326'
            center:  mapOpts.centre ? fromLonLat(mapOpts.centre, 'EPSG:4326') : [0, 0],
            zoom: mapOpts.zoom || 3,
        }),
    });

//controls: defaultControls({attribution: true}).extend([scaleControl]),    
    if (mapOpts.scaleCtrl) {
        const scaleControl = new ScaleLine({
            units: mapOpts.scaleCtrl?.units || 'metric',
            bar: mapOpts.scaleCtrl?.bar || false,
            steps: mapOpts.scaleCtrl?.steps || 4,
            text: mapOpts.scaleCtrl?.text || true,
            minWidth: mapOpts.scaleCtrl?.minWidth || 140,
        });
        map.addControl(scaleControl);
    }

    if (mapOpts.urlHash) {
        map.on('moveend', onMoveEnd);
    }
//    sync(map);

    if (mapOpts.graticule) {
        const graticule = new Graticule({
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
        });
        //map.addOverlay(graticule);
        graticule.setMap(map);
    }

    return true;  

}

// https://github.com/walkermatt/ol-layerswitcher
// https://github.com/walkermatt/ol-popup
// https://github.com/Turbo87/sidebar-v2





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