
import { attachDatatree } from './datatree';
import {Vnleafmap} from "./gis"

import './libs/w3.css';
import '@fortawesome/fontawesome-free/css/all.css';

export class VnApp {



  constructor({app_id, gisOptions, tree_vnleaf, id_number=0, title="vnleaf testing..."} = {}) {

    this.id_number = id_number;
    this.id = app_id; //"vnapp-" + id_number.toString();
    document.title = title;
    // console.log("VnApp app_id", app_id);
    // console.log("VnApp gisOptions", gisOptions);
    //console.log("tree_vnleaf", tree_vnleaf);


    const appNode = document.getElementById(app_id);
 
    // https://www.w3schools.com/w3css/w3css_sidebar.asp
    const sidepanelNode = document.createElement('div');
    this.sidepanel_id = "vn-sidepanel-" + this.id_number.toString();
    sidepanelNode.setAttribute("id", this.sidepanel_id);
    sidepanelNode.setAttribute("class", "w3-sidebar w3-bar-block w3-border-right");
    sidepanelNode.setAttribute("style", "display:none;z-index:2000;width:300px;height:100%;");
    appNode.appendChild(sidepanelNode);

    // Side-panel top ------------------------------------
    const topGridRow = document.createElement('div');
    topGridRow.setAttribute("class", "w3-row");
    sidepanelNode.appendChild(topGridRow);
    const spCloseButtCol = document.createElement('div');
    spCloseButtCol.setAttribute("class", "w3-col w3-right w3-blue-grey");
    spCloseButtCol.setAttribute("style", "width:40px;height:50px;");
    topGridRow.appendChild(spCloseButtCol);

    const spCloseButton = document.createElement('button');
    spCloseButton.setAttribute("class", "w3-bar-item w3-button w3-dark-grey");
    spCloseButton.setAttribute("title", "close side panel");
    spCloseButton.setAttribute("style", "width:40px;height:50px;");
    //spCloseButton.setAttribute("id_number", this.id_number.toString());
    spCloseButton.onclick = (evt) => {
      this.sidepanel_close();
    }
    //spCloseButton.innerHTML = "close &times;";
    //const spCloseButtContent = document.createElement('p');
    //spCloseButton.appendChild(spCloseButtContent);
    spCloseButtCol.appendChild(spCloseButton);
    const spCloseButtIcon = document.createElement('i');
    spCloseButtIcon.setAttribute("class", "fas fa-caret-left w3-xxlarge");
    spCloseButton.appendChild(spCloseButtIcon);


    const topRestCol = document.createElement('div');
    topRestCol.setAttribute("class", "w3-rest w3-center w3-blue-grey");
    topRestCol.setAttribute("style", "height:50px;");
    const topRestColContent = document.createElement('p');
    let topRestColContent_id = "vn-sidepanel-title-" + this.id_number.toString();
    topRestColContent.setAttribute("id", topRestColContent_id);
    topRestColContent.innerHTML = "Visinum GIS";
    topRestCol.appendChild(topRestColContent);
    topGridRow.appendChild(topRestCol);



    // Side-panel main content ------------------------------------
    const mainGridRow = document.createElement('div');
    mainGridRow.setAttribute("class", "w3-row");
    mainGridRow.setAttribute("style", "height:100%;");
    sidepanelNode.appendChild(mainGridRow);
    const spTabCol = document.createElement('div');
    spTabCol.setAttribute("class", "w3-col w3-border w3-light-gray");
    spTabCol.setAttribute("style", "width:32px;height:100%;");
    //spTabCol.innerHTML = "g";
    mainGridRow.appendChild(spTabCol);

    const mainRestCol = document.createElement('div');
    mainRestCol.setAttribute("class", "w3-rest");
    //mainRestCol.setAttribute("style", "height:50px;");
    mainGridRow.appendChild(mainRestCol);




    // GIS map ------------------------------------
    appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    const _map_id = "vn-map-" + id_number.toString();
    const _mapnode = document.createElement('div');
    _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    _mapnode.setAttribute("id", _map_id);
    appNode.appendChild(_mapnode);
    this.gis = new Vnleafmap({id_number:this.id_number, gisOptions:gisOptions});


    // Data tree ------------------------------------
    const datatreeNode = document.createElement('div');
    let datatree_id = "vn-datatree-" + this.id_number.toString();
    datatreeNode.setAttribute("id", datatree_id);
    //sidepanelNode.appendChild(datatreeNode);
    mainRestCol.appendChild(datatreeNode);
    attachDatatree(tree_vnleaf, this.id_number, this.gis);



    // Map layers select ------------------------------------
    const layersButton = document.createElement('button');
    layersButton.setAttribute("class", "w3-button w3-dark-grey");
    layersButton.setAttribute("style", "margin:1px;padding:4px 2px 2px 2px;height:32px;width:32px;");
    layersButton.setAttribute("title", "select map layers");
    layersButton.onclick = (evt) => {
      console.log("layersButton clicked!!!");
      let sp_title_node = document.getElementById(topRestColContent_id);
      sp_title_node.innerHTML = "Select map layers";
      datatreeNode.style.display = "block";
      spAttribNode.style.display = "none";
    }
    const layersButtIcon = document.createElement('i');
    layersButtIcon.setAttribute("class", "fas fa-layer-group w3-xlarge");
    layersButton.appendChild(layersButtIcon);
    spTabCol.appendChild(layersButton);


    
    // Dummy button ------------------------------------
    const attriButton = document.createElement('button');
    attriButton.setAttribute("class", "w3-button w3-dark-grey");
    attriButton.setAttribute("style", "margin:1px;padding:4px 2px 2px 2px;height:32px;width:32px;");
    attriButton.setAttribute("title", "show map attributions");
    attriButton.onclick = (evt) => {
      let sp_title_node = document.getElementById(topRestColContent_id);
      sp_title_node.innerHTML = "Map attributions";
      datatreeNode.style.display = "none";
      spAttribNode.style.display = "block";

      let _atts = this.gis.getAllAttributions();
      let _html = "<ul class='w3-ul'>";
      for (let ii=0; ii<_atts.length; ii++) {
        _html += "<li>" + _atts[ii] + "</li>";
      }
      _html += "</ul>";
      spAttribNode.innerHTML = _html;
    }
    const attriButtIcon = document.createElement('i');
    attriButtIcon.setAttribute("class", "far fa-copyright w3-xlarge");
    attriButton.appendChild(attriButtIcon);
    spTabCol.appendChild(attriButton);

    const spAttribNode = document.createElement('div');
    let spAttribNode_id = "vn-sp-attr-" + this.id_number.toString();
    spAttribNode.setAttribute("id", spAttribNode_id);
    spAttribNode.setAttribute("style", "padding:2px;display:none;");
    //spAttribNode.innerHTML ="<h3>this is the first line </h3> <p>this is a test with a very long string that should wrap around. this is the second testing sentence.</p>";
    //sidepanelNode.appendChild(datatreeNode);
    mainRestCol.appendChild(spAttribNode);


    // appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    // const _map_id = "vn-map-" + id_number.toString();
    // const _mapnode = document.createElement('div');
    // _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    // _mapnode.setAttribute("id", _map_id);
    // appNode.appendChild(_mapnode);
    // this.gis = new Vnleafmap({id_number:this.id_number, gisOptions:gisOptions});


  }

  sidepanel_open() {
    let sb = document.getElementById(this.sidepanel_id);
    sb.style.display = "block";
  }

  sidepanel_close() {
    let sidepanel_id = "vn-sidepanel-" + this.id_number;
    // console.log("sidepanel_close sidepanel_id", sidepanel_id);
    let sb = document.getElementById(sidepanel_id);
    sb.style.display = "none";
  }



  onActivateRequest(msg) {
    console.log("onActivateRequest(", this.id, msg);
    //this.update();
  }

  onAfterHide(msg) {
    console.log("onAfterHide", this.id, msg);
  }

  onAfterShow(msg) {
    console.log("onAfterShow", this.id, msg);
  }

  onAfterAttach(msg) {
    console.log("onAfterAttach", this.id, msg);
  }

  onCloseRequest(msg) {
    console.log("onCloseRequest", this.id, msg);
    super.onCloseRequest(msg);
  }

  onResize(msg) {
    if (this.map) {
      console.log("onResize", this.id, msg);
      // setTimeout(() => {
      //   this.map.updateSize();
      // }, 100);
    }
  }


}