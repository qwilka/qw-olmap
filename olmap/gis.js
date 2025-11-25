

import './style.css';

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import LayerGroup from 'ol/layer/Group.js';
import View from 'ol/View.js';

import {transform, fromLonLat} from 'ol/proj.js';
import Graticule from 'ol/layer/Graticule.js';
import Stroke from 'ol/style/Stroke.js';

import XYZ from 'ol/source/XYZ.js';
import ImageTile from 'ol/source/ImageTile.js';
import TileWMS from 'ol/source/TileWMS.js';
import WMTS from 'ol/source/WMTS.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

import {defaults as defaultControls} from 'ol/control/defaults.js';
import ScaleLine from 'ol/control/ScaleLine.js';

import LayerSwitcher from 'ol-layerswitcher';
//import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';

//import {VnNode, layersTree} from './vntree.js';

//import sync from './libs/ol-hashed.js';
import {updateHash, decode_hash} from './hash-mapstate.js';

import {makeLayersTree} from './vntree.js';

import {addLocationPopup} from './popup.js';
//let locPopupOverlay;

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
        console.log(`makeMap: layersTree: \n${layersTree.to_texttree()}`);
        //console.log(`makeMap: layersTree: ${layersTree.to_texttree()}`);
        //addMapLayers(map, confObj.layers);
        tree2mapLayers(map, layersTree);

    }
    if (mapOpts.layerCtrl) {
        var layerSwitcher = new LayerSwitcher({
            reverse: false,
            groupSelectStyle: 'children'
        });
        map.addControl(layerSwitcher);
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


//    sync(map);

    if (mapOpts.graticule) {
        let strokeStyle = mapOpts.graticule.strokeStyle || {
                color: 'rgba(0, 0, 0, 0.2)',
                width: 1,
            };
        const graticule = new Graticule({
            visible: mapOpts.graticule.visible || true,
            strokeStyle: new Stroke(strokeStyle),
            lonLabelPosition: 0.98,
            latLabelPosition: 1,
            showLabels: mapOpts.graticule.showLabels || true,
            wrapX: mapOpts.graticule.wrapX || false,
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

    if (mapOpts.urlHash) {
        decode_hash(map);
        //map.on('moveend', onMoveEnd);
        map.on('postrender', updateHash);
        // let url = new URL( window.location.href );
        // if (url.hash) {
        //   history.replaceState(null, null, url.hash);
        // };
        //decode_hash(map);
        // if (confObj.hash){
        //    decode_hash(map, confObj.hash);
        // };
    }

    if (mapOpts.locationPopup) {
        let locPopupOverlay = addLocationPopup(map);
        map.addOverlay(locPopupOverlay);
    }

    return true;  

}

function tree2mapLayers(map, layersTree) {
    for (let n of layersTree) {
        if (n.id === 'root') {
            n.layer = map;
            continue; // skip root node
        }
        if (n.get_data('deactivate')) {
            console.warn(`tree2mapLayers: Skipping deactivated layer ${n.name}`);
            continue;
        }
        console.log(n.name, n.layer);
        let layerObj = n.get_data();
        switch (n.type) {
            case 'OSM':
                n.layer = new TileLayer({
                    source: new OSM({
                        attributions: layerObj.source.attributions || [
                            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                        ]
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;
            case 'WMS':
                n.layer = new TileLayer({
                    source: new TileWMS({
                        url: layerObj.source.url,
                        params: layerObj.source.params,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;

            case 'WMTS':
                // https://openlayers.org/en/latest/examples/wmts-layer-from-capabilities.html
                n.layer = new TileLayer({
                    source: new WMTS({
                        url: layerObj.source.url,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;

            case 'ImageTile':
                n.layer = new TileLayer({
                    source: new ImageTile({
                        url: layerObj.source.url,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;

            case 'XYZ':
                n.layer = new TileLayer({
                    source: new XYZ({
                        url: layerObj.source.url,
                        attributions: layerObj.source.attributions || []
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;

            case 'geojson':
                n.layer = new VectorLayer({
                    source: new VectorSource({
                        url: layerObj.source.url,
                        format: new GeoJSON(),
                        attributions: layerObj.source.attributions || [],
                    }),
                    properties: layerObj.properties || {},
                    visible: layerObj.visible || false,
                });
                break;
            case 'group':
                n.layer = new LayerGroup({"title":n.get_data('title') || n.name, "combine":false, "fold":"close"});
                //n.layer = new LayerGroup({"title":n.get_data('title') || n.name});
                break;
            default:
                console.warn(`tree2mapLayers: Unknown layer type: ${n.get_data('type')}`);
        }
        if (n.layer) {
            // type: 'base' is required by ol-layerswitcher to identify base layers
            if (layerObj.basemap) {
                n.layer.set('type', 'base');
            }
            let parent_layer = n.parent?.layer;
            if (parent_layer && parent_layer instanceof LayerGroup) {
                parent_layer.getLayers().push(n.layer);
                let groupColl = parent_layer.getLayers();
                console.log(`tree2mapLayers: LayerGroup ${parent_layer.get('id')}  layers list ${groupColl.getArray()}`);
                console.log(groupColl.getArray());
                //console.log(`tree2mapLayers: LayerGroup ${parent_layer.get('id')}  added new layer  ${parent_layer.getLayers().forEach((layer) => layer.get('id'))}`)
            } else if (parent_layer && parent_layer instanceof Map) {
                //parent_layer.addLayer(n.layer);
                parent_layer.addLayer(n.layer);
            } else {
                console.warn(`tree2mapLayers: Parent layer not found or invalid for layer ${n.name}`);
            }
            //map.addLayer(newLayer);
            n.layer.setProperties({
                name: n.name,
                title: n.get_data('title') || n.name,
                id: n.id,
            }, true);
            console.log(`tree2mapLayers: Added layer ${n.layer.get('name')} ${n.layer.get('id')}`);
            //newLayer = null;
        }
    }
}


// function addMapLayers(map, layers) {
//     let baselayers = [];
//     let overlays = [];
//         const baseMapsGroup = new LayerGroup({
//             title: 'Base maps',
//             visible: true,
//             layers: []
//         });
//         const overlaysGroup = new LayerGroup({
//         title: 'Overlays',
//         layers: []
//         });

//     for (let layerObj of layers) {
//         let newLayer = null;
//         if (layerObj.deactivate) {
//             console.log(`addMapLayers: Skipping deactivated layer: ${layerObj.name}`);
//             continue;
//         }
        
//         switch (layerObj['type-layer']) {
//             case 'tile':
//                 switch (layerObj.source) {
//                     case 'OSM-built-in':
//                         newLayer = new TileLayer({
//                             source: new OSM({
//                                 attributions: layerObj.source.attributions || [
//                                     '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
//                                 ]
//                             }),
//                             properties: layerObj.properties || {},
//                             visible: layerObj.visible || false,
//                             type: 'base',
//                         });
//                         //addNewLayer(map, newLayer, layerObj);
//                         break;
//                     default:
//                         console.warn(`addMapLayers: Unknown tile source: ${layerObj.source}`);
//                 }
//                 break;
//             case 'WMS':
//                 newLayer = new TileLayer({
//                     source: new TileWMS({
//                         url: layerObj.source.url,
//                         attributions: layerObj.source.attributions || []
//                     }),
//                     properties: layerObj.properties || {},
//                     visible: layerObj.visible || false,
//                 });
//                 break;
//             case 'XYZ':
//                 newLayer = new TileLayer({
//                     source: new sourceXYZ({
//                         url: layerObj.source.url,
//                         attributions: layerObj.source.attributions || []
//                     }),
//                     properties: layerObj.properties || {},
//                     visible: layerObj.visible || false,
//                     type: 'base',
//                 });
//                 break;
//             case 'geojson':
//                 newLayer = new VectorLayer({
//                     source: new VectorSource({
//                         url: layerObj.source.url,
//                         format: new GeoJSON(),
//                         attributions: layerObj.source.attributions || [],
//                     }),
//                     properties: layerObj.properties || {},
//                     visible: layerObj.visible || false,
//                 });
//                 //addNewLayer(map, vectorLayer, layerObj);
//                 break;
//             default:
//                 console.warn(`addMapLayers: Unknown layer type: ${layerObj.type}`);
//         }
//         if (newLayer) {
//             //map.addLayer(newLayer);
//             if (newLayer.get('type') === 'base') {
//                 baseMapsGroup.getLayers().push(newLayer);
//             } else {
//                 overlaysGroup.getLayers().push(newLayer);
//             }
            
//             newLayer.setProperties({
//                 name: layerObj.name,
//                 title: layerObj.title,
//                 id: layerObj.id,
//             }, true);
//             console.log(`addMapLayers: ${newLayer.get('name')} ${newLayer.get('id')}`);
//             if (layerObj.parent === 'basemaps') {
//                 baselayers.push(newLayer);
//             } else if (layerObj.parent === 'overlays') {
//                 overlays.push(newLayer);
//             } else {
//                 console.warn(`addMapLayers: Unknown parent for layer ${layerObj.name}: ${layerObj.parent}`);
//             }

//         }
//     }

//     map.addLayer(baseMapsGroup);
//     map.addLayer(overlaysGroup);
//     if (true) {
//         // const baseMapsGroup = new LayerGroup({
//         //     title: 'Base maps',
//         //     visible: true,
//         //     layers: baselayers
//         // });
//         // map.addLayer(baseMapsGroup);
//         // const overlaysGroup = new LayerGroup({
//         // title: 'Overlays',
//         // layers: overlays
//         // });
//         // map.addLayer(overlaysGroup);

//         var layerSwitcher = new LayerSwitcher({
//             reverse: false,
//             groupSelectStyle: 'children'
//         });
//         map.addControl(layerSwitcher);
//     }

// }

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