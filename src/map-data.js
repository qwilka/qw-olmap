
//  .. White background
export let WhiteBG = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==");

export let GEBCO = {
    title: "GEBCO",
    type: "WMS",
    basemap: true,
    ref: ["https://www.gebco.net/"],
    baseUrl: "//www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv",
    options: {
        layers: "GEBCO_LATEST",
        CRS: "EPSG:4326",
        version: '1.3.0',
        format: 'image/png',
        transparent: false,
        noWrap: true,
        opacity: 1.0,
        attribution: '<a target="_blank" href="https://www.gebco.net/">GEBCO</a>'
    }
}

export let OSM = {
    title: "OpenStreetMap",
    type: "WMS",
    basemap: true,
    ref: [
        "https://wiki.openstreetmap.org/wiki/List_of_OSM-based_services",
        "http://ows.terrestris.de/"
    ],
    baseUrl: "http://ows.terrestris.de/osm/service",
    options: {
        layers: "OSM-WMS",
        CRS: "EPSG:4326",
        version: '1.1.1',
        format: 'image/png',
        transparent: false,
        noWrap: true,
        opacity: 1.0,
        attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
}

export let NPD = {
    title: "NPD",
    type: "WMS",
    ref: [
        "http://npdwms.npd.no/",
        "http://www.npd.no/en/Maps/Fact-maps/"
    ],
    baseUrl: "http://gis.npd.no/ogc/factmaps/2_0",
    options: {
        layers: "dscAll,pplAll,fclFixed",
        CRS: "EPSG:23032",
        format: 'image/png',
        transparent: true,
        noWrap: true,
        opacity: 1.0,
        attribution: '<a target="_blank" href="http://www.npd.no/en/Maps/Fact-maps/">NPD</a> <a target="_blank" href="https://data.norge.no/nlod/no">(NLOD)</a>'
    }
}

export let EEZ = {
    title: "Exclusive economic zone boundaries",
    type: "WMS",
    ref: [],
    baseUrl: "http://geo.vliz.be:80/geoserver/MarineRegions/wms",
    options: {
        layers: 'MarineRegions:eez_boundaries',
        version: '1.1.1',
        format: 'image/png',
        transparent: true,
        noWrap: true,
        opacity: 0.9,
        attribution: '<a target="_blank" href="http://www.marineregions.org">FlandersMarineInst (CC-BY-NC-SA)</a>'
    }
}

// export let mapObj = {
//     title: "Test Map",
//     center: [58.80, 2.5],
//     zoom: 5,
//     layers: [
//         Object.assign({"show":true}, GEBCO),
//         OSM,
//         Object.assign({"show":true}, NPD),
//         EEZ,
//     ]
// }


