// https://openlayers.org/en/latest/examples/popup.html

import Overlay from 'ol/Overlay.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {toLonLat} from 'ol/proj.js';

import TileWMS from 'ol/source/TileWMS.js';

// https://openlayers.org/en/latest/examples/getfeatureinfo-tile.html
const gebcoSource = new TileWMS({
        url: "https://wms.gebco.net/mapserv",
        projection: 'EPSG:4326',
        params: {"LAYERS": "GEBCO_LATEST_2", "VERSION": '1.1.1'},
  serverType: 'mapserv',
  crossOrigin: 'anonymous',
    });

export function addLocationPopup(map) {

    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const locPopupOverlay = new Overlay({
    element: container,
    autoPan: {
        animation: {
        duration: 250,
        },
    },
    });


    closer.onclick = function () {
        locPopupOverlay.setPosition(undefined);
        closer.blur();
        return false;
    };    

    // 'singleclick'  left click   'contextmenu' right click
    map.on('contextmenu', function (evt) {
        evt.preventDefault();   // 'contextmenu'
        const coordinate = evt.coordinate;
        let lon_lat = toLonLat(coordinate);
        // console.log("addLocationPopup: coordinate= ", coordinate);
        // console.log("addLocationPopup: lon_lat= ", lon_lat);
        //const hdms = toStringHDMS(toLonLat(coordinate));


    // let bounds = map.getExtent();
    // console.log("addLocationPopup: bounds= ", bounds);


        const view = map.getView();
        const viewResolution = view.getResolution();
        let projection = view.getProjection().getCode();
        const hdms = toStringHDMS(toLonLat(coordinate, projection));
        //projection = 'EPSG:4326';
  const url = gebcoSource.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    projection,
    {'INFO_FORMAT': 'text/html'},
  );
  let ll = url.split("&");
  console.log("addLocationPopup: url= ", url);
  console.log("addLocationPopup: url= ", ll);
  if (url) {
    // fetch(url)
    //   .then((response) => {
    //     let data = response.text();
    //     console.log("response.text(): ", data);
    //     return data;
    //   })
    //   .then((html) => {
    //     //content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>' +  '<br>' + html ;
    //     //content.innerHTML =  url ;
    //     console.log("addLocationPopup: ", html);
    //   });
    infoRequest(url);
  }



        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
        locPopupOverlay.setPosition(coordinate);
    });

    //map.addLayer(locPopupOverlay);

    return locPopupOverlay;
    //return null;

}


async function infoRequest(url){
  console.log("infoRequest url ", url);
  let elevation = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const rtext = await response.text();
    console.log("infoRequest: ", rtext);

    // let test = rtext.match(/Elevation value \(m\):\s*(-?\d+)/)
    // if (test) {
    //     //console.log("test elevation string: ", test);
    //     let elevation = test[1];
    //     if (elevation>=0) {
    //         pustr += "<br>elevation " + elevation + " m (GEBCO)";
    //     } else {
    //         pustr += "<br>depth " + elevation + " m (GEBCO)";
    //     }
    //     // console.log("elevation=", elevation)
    //     popup.setContent(pustr)
    // }
  } catch (error) {
    console.error(error.message);
  }
}



