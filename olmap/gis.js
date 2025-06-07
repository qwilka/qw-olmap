

import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

import {fromLonLat} from 'ol/proj.js';
import Graticule from 'ol/layer/Graticule.js';
import Stroke from 'ol/style/Stroke.js';


import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: '/data/DK_Geus_pipelines_simplified.geojson',
    format: new GeoJSON(),
    attributions: ["this is a", " TEST"]
  }),
});

import {defaults as defaultControls} from 'ol/control/defaults.js';





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
            
        }),
        new Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new Stroke({
            color: 'rgba(255,120,0,0.9)',
            width: 2,
            lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
        }),
        vectorLayer,
        ],
        controls: defaultControls({attribution: true}),
        view: new View({
        center: fromLonLat([4.8, 47.75]),
        zoom: 3,
        }),
    });

    return true;  

}

// https://github.com/walkermatt/ol-layerswitcher
// https://github.com/walkermatt/ol-popup
// https://github.com/Turbo87/sidebar-v2