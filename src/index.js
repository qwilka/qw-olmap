import {Vnleafmap} from "./gis"
// import {SidebarElement, SidebarService} from 'sidebarjs';
// import 'sidebarjs/lib/sidebarjs.css';
// import './demo.css';

let config1 = {
  mapId: "map",
  viewCenterCoords: [3.0, 56.46],
  basemap: "GEBCO",
  layerCtrl: true,
  scalelineCtrl: true
}

//mapSetup(config1);

function main() {
  let gis = new Vnleafmap();
}



window.onload = () => {
  main();
}


