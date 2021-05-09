//import 'jquery.fancytree/dist/skin-vista/ui.fancytree.css';
import 'jquery.fancytree/dist/skin-awesome/ui.fancytree.css';
import $ from 'jquery';  
import 'jquery.fancytree';
import 'jquery.fancytree/dist/modules/jquery.fancytree.glyph';
import 'jquery-contextmenu/dist/jquery.contextMenu.css';  
import 'jquery-contextmenu';

import '@fortawesome/fontawesome-free/css/all.css';
import flagAu from '../assets/images/au.jpg';
import flagDk from '../assets/images/dk.jpg';
import flagGb from '../assets/images/gb.jpg';
import flagGbSct from '../assets/images/gb-sct.jpg';
import flagIe from '../assets/images/ie.jpg';
import flagNo from '../assets/images/no.jpg';
import flagUs from '../assets/images/us.jpg';

//import { commands } from './commands';


// $("#"+datatree_id).fancytree({
//   extensions: ["glyph"],
//   glyph: {
//     preset: "awesome4",
//     map: {}
//   },
//   types: {
//     "gis-widget": {icon: "fa fa-globe", iconTooltip: "GIS widget..."},
//   },
//   icon: icon_datatree,
//   iconTooltip: iconTooltip_datatree,
//   select: select_datatree,
//   lazyLoad: lazyLoad_datatree,
//   init: onInit,
//   source: treeData,
//   id_number: id_number,
//   targetWidget: targetWidget,
//   treeId: "vn-fancytree-" + id_number.toString()
// });


// types: {
//   "folder-gis-basemaps": {icon: "fa fa-globe", iconTooltip: "this folder contains the base maps"},
//   "gis-layer-basemap": {icon: "far fa-map"},
//   "gis-layer": {icon: "fas fa-layer-group"},
// },

export const attachDatatree = (treeData=null, id_number=0, targetWidget=null) => {
  const datatree_id = "vn-datatree-" + id_number.toString();
  $("#"+datatree_id).fancytree({
    extensions: ["glyph"],
    glyph: {
      preset: "awesome5",
      map: {}
    },
    imagePath: "",
    types: {
      "folder-gis-basemaps": {iconTooltip: "select the base map"},
      "gis-layer-basemap": {icon: false},
      "gis-layer": {icon: false},
      "folder-flag-au": {icon:  flagAu},
      "folder-flag-dk": {icon:  flagDk},
      "folder-flag-gb": {icon:  flagGb},
      "folder-flag-gb-sct": {icon:  flagGbSct},
      "folder-flag-ie": {icon:  flagIe},
      "folder-flag-no": {icon:  flagNo},
      "folder-flag-us": {icon:  flagUs},
    },
    icon: icon_datatree,
    iconTooltip: iconTooltip_datatree,
    select: select_datatree,
    lazyLoad: lazyLoad_datatree,
    init: onInit,
    source: treeData,
    id_number: id_number,
    targetWidget: targetWidget,
    treeId: "vn-fancytree-" + id_number.toString(),
    createNode: onCreateNode
  });

  $.contextMenu({
    selector: "#"+datatree_id+" span.fancytree-title",
    build: build_contextMenu
  });
}

const onCreateNode = (evt, data) => {
  console.log("datatree onCreateNode node.title", data.node.title);
  let node = data.node;
  if (!node.data.hasOwnProperty('_widgetData')) {
    console.log("datatree onCreateNode", node.title, "_widgetData={}");
    node.data._widgetData = {};
  }
}


const icon_datatree = (evt, data) => {
  return data.typeInfo.icon;
}

const iconTooltip_datatree = (evt, data) => {
  return data.typeInfo.iconTooltip;
}

const select_datatree = (evt, data) => {
  let gis = data.tree.getOption("targetWidget");
  let node = data.node;
  switch(data.node.type) {
    case "gis-layer-basemap":
      tree_add_all_layers(data.tree);
      break;
    case "gis-layer":
      if (node.isSelected()) {
        let layerObj = Object.assign({}, node.data);
        // if (!node.data.hasOwnProperty('_widgetData')) {
        //   node.data._widgetData = {};
        // }
        node.data._widgetData.layerStamp = gis.addLayer(layerObj);;
      } else {
        gis.removeLayerByStamp(node.data._widgetData.layerStamp);
      }
      break;
    default:
      console.log(`select_datatree ${node.title} ${node.type}`);
  }
}

const lazyLoad_datatree = (evt, data) => {
  let node = data.node;
  data.result = {
    url: node.data.fancytree,
    data: {mode: "children", parent: node.key},
    cache: false
  }
}

const onInit = (evt, data) => {
  tree_add_all_layers(data.tree);
}

const tree_add_all_layers = (tree) => {
  let gis = tree.getOption("targetWidget");
  let root = tree.getRootNode();
  gis.removeAllLayers();
  root.visit((node) => {
    //console.log("onInit title", node.title,"key", node.key);
    node.data._widgetData = {}; // for temporary data
    if (node.type && node.isSelected() && 
        ["gis-layer", "gis-layer-basemap"].includes(node.type) ) {
      let layerObj = Object.assign({}, node.data);
      //console.log("onInit layerObj", layerObj);
      node.data._widgetData.layerStamp = gis.addLayer(layerObj);
    }
  });
}


const build_contextMenu = ($trigger, evt) => {
  let node = $.ui.fancytree.getNode($trigger);
  switch(node.type) {
    case "gis-layer-basemap":
      return {
        items: {
          "console-message": {
            name: "msg to console",
            icon: "fa-globe",
            callback: (key, opt) => {
              console.log("gis-widget: console-message: testing context menu");
              //commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
            }
          },
        }
      }
    }
}


export const getDatatree = (id_number=0) => {
  const datatree_id = "vn-datatree-" + id_number.toString();
  let tree = $.ui.fancytree.getTree("#"+datatree_id);
  let dd = tree.toDict(true);
  return dd;

}