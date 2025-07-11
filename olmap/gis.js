

import './style.css';

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import LayerGroup from 'ol/layer/Group.js';
import View from 'ol/View.js';

import {transform, fromLonLat} from 'ol/proj.js';
import Graticule from 'ol/layer/Graticule.js';
import Stroke from 'ol/style/Stroke.js';

import sourceXYZ from 'ol/source/XYZ.js';
import TileWMS from 'ol/source/TileWMS.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

import {defaults as defaultControls} from 'ol/control/defaults.js';
import ScaleLine from 'ol/control/ScaleLine.js';

import LayerSwitcher from 'ol-layerswitcher';
//import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';

//import {VnNode, layersTree} from './vntree.js';

//import sync from './libs/ol-hashed.js';
import {onMoveEnd} from './hash-mapstate.js';

import {makeLayersTree} from './vntree.js';




export const makeMap = (confObj) => {
    // Create a new map instance
    let mapOpts = confObj.mapOptions;
    let layersTree = null;
    let mapCRS = mapOpts.CRS || 'EPSG:3857';   // 'EPSG:3857'   'EPSG:4326'
    const map = new Map({
        target: 'map',
        controls: defaultControls({
            attribution: mapOpts.attribCtrl ? true : false,
        }),
        view: new View({
            projection: mapCRS,
            center:  mapOpts.centreLonLat ? fromLonLat(mapOpts.centreLonLat, mapCRS) : [0, 0],
            zoom: mapOpts.zoom || 3,
        }),
    });

    if (confObj.layers) {
        layersTree = makeLayersTree(confObj.layers);
        console.log(`makeMap: layersTree: ${layersTree.to_texttree()}`);
        //console.log(`makeMap: layersTree: ${layersTree.to_texttree()}`);
        //addMapLayers(map, confObj.layers);
        tree2mapLayers(map, layersTree);

    }

    if (mapOpts.scaleCtrl) {
        const scaleControl = new ScaleLine({
            units: mapOpts.scaleCtrlOpts?.units || 'metric',
            bar: mapOpts.scaleCtrlOpts?.bar || false,
            steps: mapOpts.scaleCtrlOpts?.steps || 4,
            text: mapOpts.scaleCtrlOpts?.text || true,
            minWidth: mapOpts.scaleCtrlOpts?.minWidth || 100,
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
            lonLabelPosition: 0.98,
            latLabelPosition: 1,
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

function tree2mapLayers(map, layersTree) {
    for (let n of layersTree) {
        if (n.id === 'root') continue; // skip root node
        if (n.get_data('deactivate')) {
            console.warn(`tree2mapLayers: Skipping deactivated layer ${n.name}`);
            continue;
        }
        console.log(n.name);
        let layerObj = n.get_data();
        switch (n.type) {
            case 'OSM':
                newLayer = new TileLayer({
                    source: new OSM({
                        attributions: layerObj.source.attributions || [
                            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                        ]
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                    type: 'base',
                });
                break;
            case 'WMS':
            case 'XYZ':
            case 'geojson':
                addMapLayers(map, n.get_child());
                break;
            default:
                console.warn(`tree2mapLayers: Unknown layer type: ${n.get_data('type-layer')}`);
        }
    }
}


function addMapLayers(map, layers) {
    let baselayers = [];
    let overlays = [];
        const baseMapsGroup = new LayerGroup({
            title: 'Base maps',
            visible: true,
            layers: []
        });
        const overlaysGroup = new LayerGroup({
        title: 'Overlays',
        layers: []
        });

    for (let layerObj of layers) {
        let newLayer = null;
        if (layerObj.deactivate) {
            console.log(`addMapLayers: Skipping deactivated layer: ${layerObj.name}`);
            continue;
        }
        
        switch (layerObj['type-layer']) {
            case 'tile':
                switch (layerObj.source) {
                    case 'OSM-built-in':
                        newLayer = new TileLayer({
                            source: new OSM({
                                attributions: layerObj.source.attributions || [
                                    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                                ]
                            }),
                            properties: layerObj.properties || {},
                            visible: layerObj.visible || false,
                            type: 'base',
                        });
                        //addNewLayer(map, newLayer, layerObj);
                        break;
                    default:
                        console.warn(`addMapLayers: Unknown tile source: ${layerObj.source}`);
                }
                break;
            case 'WMS':
                newLayer = new TileLayer({
                    source: new TileWMS({
                        url: layerObj.source.url,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;
            case 'XYZ':
                newLayer = new TileLayer({
                    source: new sourceXYZ({
                        url: layerObj.source.url,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                    type: 'base',
                });
                break;
            case 'geojson':
                newLayer = new VectorLayer({
                    source: new VectorSource({
                        url: layerObj.source.url,
                        format: new GeoJSON(),
                        attributions: layerObj.source.attributions || [],
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                //addNewLayer(map, vectorLayer, layerObj);
                break;
            default:
                console.warn(`addMapLayers: Unknown layer type: ${layerObj.type}`);
        }
        if (newLayer) {
            //map.addLayer(newLayer);
            if (newLayer.get('type') === 'base') {
                baseMapsGroup.getLayers().push(newLayer);
            } else {
                overlaysGroup.getLayers().push(newLayer);
            }
            
            newLayer.setProperties({
                name: layerObj.name,
                title: layerObj.title,
                id: layerObj.id,
            }, true);
            console.log(`addMapLayers: ${newLayer.get('name')} ${newLayer.get('id')}`);
            if (layerObj.parent === 'basemaps') {
                baselayers.push(newLayer);
            } else if (layerObj.parent === 'overlays') {
                overlays.push(newLayer);
            } else {
                console.warn(`addMapLayers: Unknown parent for layer ${layerObj.name}: ${layerObj.parent}`);
            }

        }
    }

    map.addLayer(baseMapsGroup);
    map.addLayer(overlaysGroup);
    if (true) {
        // const baseMapsGroup = new LayerGroup({
        //     title: 'Base maps',
        //     visible: true,
        //     layers: baselayers
        // });
        // map.addLayer(baseMapsGroup);
        // const overlaysGroup = new LayerGroup({
        // title: 'Overlays',
        // layers: overlays
        // });
        // map.addLayer(overlaysGroup);

        var layerSwitcher = new LayerSwitcher({
            reverse: false,
            groupSelectStyle: 'children'
        });
        map.addControl(layerSwitcher);
    }

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