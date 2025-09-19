import {transform, fromLonLat} from 'ol/proj.js';
import { confFile } from './index';

export const onMoveEnd = (e) => {
    const map = e.map;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let zoom = view.getZoom();
    let center = view.getCenter();
    let rotation = view.getRotation();
    //console.log("onMoveEnd", zoom, center, rotation, projection);
    console.log(`getState: zoom=${zoom}, center=${center}, rotation=${rotation}, ${projection}`);
    let coord = transform(center, projection, 'EPSG:4326');
    console.log(`zoom=${zoom} lon=${Number.parseFloat((coord[0]).toFixed(3))} lat=${Number.parseFloat((coord[1]).toFixed(3))} rotation=${Number.parseFloat((rotation).toFixed(3))}, ${projection}`);
    history.replaceState(null, null, encode_hash(map));
    //coord = coord.map(c => c.toFixed(4));
    // console.log(`getState: coord=${coord}`);  
    // coord = coord.map(c => Math.round(c * 1000) / 1000); 
    // console.log(`getState: coord=${coord}`);   
    // let layers = map.getLayers().getArray();
    // console.log(`getState: layers=${layers.length}`);
    // layers.forEach((layer, index) => {
    //     console.log(`Layer ${index}: ${layer.get('title') || layer.get('name')}`);
    //     console.log(layer);
    // });
    // Update the state of the map
    //getState(map);
}


const encode_hash = (map) => {
    console.log("encode_hash:", confFile);
    let mat = confFile.match(/^qwolmap-(\w+).json$/);
    let suffix = mat ? mat[1] : "";
    let hash = location.hash;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let zoom = view.getZoom();
    let centre = view.getCenter();
    centre = transform(centre, projection, 'EPSG:4326');
    let rotation = view.getRotation();
    hash = `#${suffix}/${zoom}/${Number.parseFloat((centre[0]).toFixed(3))}/${Number.parseFloat((centre[1]).toFixed(3))}/${Number.parseFloat((rotation).toFixed(3))}`;
    let layers = map.getLayers().getArray();
    for (let layer of layers) {
        console.log(layer.get('title'), layer.get('name'), layer.get('id'));
    }
    layers = layers.filter(layer => layer.getVisible());
    let ids = layers.map(layer => layer.get('id') || 'X');
    
    hash = `${hash}/${ids.join("-")}/`;
    return hash;
}


const decode_hash = (map) => {
    let hash = location.hash;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let parts = hash.substring(1).split("/");
    let centre = [parseFloat(parts[2]), parseFloat(parts[3])];
    centre = transform(centre, 'EPSG:4326', projection);
    let ids = parts.length > 4 ? parts[4].split("-") : [];
    let layers = map.getLayers().getArray();
    for (let layer of layers) {
        if (ids.includes(layer.get('id'))) {  
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
    }
    
    view.setZoom(parseInt(parts[1]));
    view.setCenter(centre);
    if (parts.length > 5) {
        let rotation = parseFloat(parts[5]);
        if (isNaN(rotation || rotation < 0 || rotation >= 360)) {
            console.warn(`decode_hash: Invalid rotation value: ${parts[5]}, specifiy degrees between 0 and 360.`);
        } else {
            view.setRotation(rotation*Math.PI / 180); // Convert degrees to radians
        }
    }

    

    return true;
}