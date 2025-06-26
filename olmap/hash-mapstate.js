import {transform, fromLonLat} from 'ol/proj.js';


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
    let hash = location.hash;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let zoom = view.getZoom();
    let centre = view.getCenter();
    centre = transform(centre, projection, 'EPSG:4326');
    let rotation = view.getRotation();
    hash = `#${zoom}/${Number.parseFloat((centre[0]).toFixed(3))}/${Number.parseFloat((centre[1]).toFixed(3))}/${Number.parseFloat((rotation).toFixed(3))}`;
    let layers = map.getLayers().getArray();
    for (let layer of layers) {
        console.log(layer.get('title'), layer.get('name'), layer.get('id'));
    }
    let ids = layers.map(layer => layer.get('id') || 'X');
    hash = `${hash}/${ids.join("-")}/`;
    return hash;
}


const decode_hash = (map) => {
    let hash = location.hash;
    const view = map.getView();
    const projection = view.getProjection().getCode();
    let parts = hash.substring(1).split("/");
    let centre = [parseFloat(parts[1]), parseFloat(parts[2])];
    centre = transform(centre, 'EPSG:4326', projection);
    let rotation = parseFloat(parts[3]);
    view.setZoom(parseInt(parts[0]));
    view.setCenter(centre);
    view.setRotation(rotation);

    return true;
}