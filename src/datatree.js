//import 'jquery.fancytree/dist/skin-vista/ui.fancytree.css';
import 'jquery.fancytree/dist/skin-awesome/ui.fancytree.css';
import $ from 'jquery';  
import 'jquery.fancytree';
import 'jquery.fancytree/dist/modules/jquery.fancytree.glyph';
import 'jquery-contextmenu/dist/jquery.contextMenu.css';  
import 'jquery-contextmenu';

import '@fortawesome/fontawesome-free/css/all.css';
// import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';
// import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';

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


export const attachDatatree = (treeData=null, id_number=0, targetWidget=null) => {
  const datatree_id = "vn-datatree-" + id_number.toString();
  $("#"+datatree_id).fancytree({
    extensions: ["glyph"],
    glyph: {
      preset: "awesome5",
      map: {}
    },
    types: {
      "gis-widget": {icon: "fa fa-globe", iconTooltip: "GIS widget..."},
      "gis-layer-basemap": {icon: "far fa-map"},
      "gis-layer": {icon: "fas fa-layer-group"},
    },
    icon: icon_datatree,
    iconTooltip: iconTooltip_datatree,
    select: select_datatree,
    lazyLoad: lazyLoad_datatree,
    init: onInit,
    source: treeData,
    id_number: id_number,
    targetWidget: targetWidget,
    treeId: "vn-fancytree-" + id_number.toString()
  });

  $.contextMenu({
    selector: "#"+datatree_id+" span.fancytree-title",
    build: build_contextMenu
  });
}

// createNode: onCreateNode,
// const onCreateNode = (evt, data) => {
//   // console.log("onCreateNode evt", evt);
//   // console.log("onCreateNode data", data);
//   console.log("onCreateNode title", data.node.title,"key", data.node.key);
//   //return data.typeInfo.icon;
// }

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
        node.data._widgetData.layerStamp = gis.addLayer(layerObj);;
      } else {
        gis.removeLayerByStamp(node.data._widgetData.layerStamp);
      }
      break;
    // case "gis-widget":
    //     let id_number = node.getIndex();
    //     let wid = document.getElementById("gis-"+id_number);
    //     if (data.node.isSelected() && wid.isHidden) {
    //       if (wid.isHidden) wid.show();
    //     } else {
    //       if (!wid.isHidden) wid.hide();
    //     }
    //   }
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
  // let id_number = data.tree.getOption("id_number");
  // let gis = data.tree.getOption("targetWidget");
  // console.log("#datatree  treeId", data.tree.getOption("treeId"),"id_number",id_number,"_id",data.tree._id);
  // console.log("targetWidget", gis);
//  let root = data.tree.getRootNode();
  
  // root.visit(function(node){
  //   console.log("onInit title", node.title,"key", node.key);
  //   node.data._widgetData = {}; // for temporary data
  //   if (node.type && node.isSelected() && 
  //       ["gis-layer", "gis-layer-basemap"].includes(node.type) ) {
  //     let layerObj = Object.assign({}, node.data);
  //     console.log("onInit layerObj", layerObj);
  //     node.data._widgetData.layerStamp = gis.addLayer(layerObj);
  //   }
  // });
  //gis.getLayerByStamp();
}

const tree_add_all_layers = (tree) => {
  let gis = tree.getOption("targetWidget");
  let root = tree.getRootNode();
  gis.removeAllLayers();
  root.visit((node) => {
    console.log("onInit title", node.title,"key", node.key);
    node.data._widgetData = {}; // for temporary data
    if (node.type && node.isSelected() && 
        ["gis-layer", "gis-layer-basemap"].includes(node.type) ) {
      let layerObj = Object.assign({}, node.data);
      console.log("onInit layerObj", layerObj);
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