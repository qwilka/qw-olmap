// https://openlayers.org/en/latest/examples/popup.html

import Overlay from 'ol/Overlay.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {toLonLat} from 'ol/proj.js';


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


    map.on('singleclick', function (evt) {
        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
        locPopupOverlay.setPosition(coordinate);
    });

    //map.addLayer(locPopupOverlay);

    return locPopupOverlay;
    //return null;

}






