//import {Vnleafmap} from "./gis"
import {VnApp} from "./app"


let config1 = {
  map_id: "map",
  viewCenterCoords: [3.0, 56.46],
  basemap: "GEBCO",
  layerCtrl: true,
  scalelineCtrl: true
}

//mapSetup(config1);

function main() {
  //let gis = new Vnleafmap();
  let app = new VnApp("testmap");
}



window.onload = () => {
  main();
}


