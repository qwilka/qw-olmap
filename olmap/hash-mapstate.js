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