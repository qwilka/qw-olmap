
import { attachDatatree } from './datatree';
import {Vnleafmap} from "./gis"

import './libs/w3.css';

export class VnApp {



  constructor({app_id, gisOptions, tree_vnleaf, id_number=0, title="vnleaf testing..."} = {}) {
    //super({ direction: 'left-to-right', spacing: 0, node: VnApp.createNode(id_number) });
    this.id_number = id_number;
    this.id = app_id; //"vnapp-" + id_number.toString();
    document.title = title;
    // console.log("VnApp app_id", app_id);
    // console.log("VnApp gisOptions", gisOptions);
    //console.log("tree_vnleaf", tree_vnleaf);


    const appNode = document.getElementById(app_id);
    // appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    // const _map_id = "vn-map-" + id_number.toString();
    // const _mapnode = document.createElement('div');
    // _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    // _mapnode.setAttribute("id", _map_id);
    // appNode.appendChild(_mapnode);


    
    // https://www.w3schools.com/w3css/w3css_sidebar.asp
    const sidepanelNode = document.createElement('div');
    this.sidepanel_id = "vn-sidepanel-" + this.id_number.toString();
    sidepanelNode.setAttribute("id", this.sidepanel_id);
    sidepanelNode.setAttribute("class", "w3-sidebar w3-bar-block w3-border-right");
    sidepanelNode.setAttribute("style", "display:none;z-index:2000;width:300px;");
    appNode.appendChild(sidepanelNode);

    const topGridRow = document.createElement('div');
    topGridRow.setAttribute("class", "w3-row");
    sidepanelNode.appendChild(topGridRow);
    const spCloseButtCol = document.createElement('div');
    spCloseButtCol.setAttribute("class", "w3-col w3-right w3-blue-grey");
    spCloseButtCol.setAttribute("style", "width:90px;height:50px;");
    topGridRow.appendChild(spCloseButtCol);

    const spCloseButton = document.createElement('button');
    spCloseButton.setAttribute("class", "w3-bar-item w3-button w3-dark-grey");
    //spCloseButton.setAttribute("style", "text-align:right;");
    //spCloseButton.setAttribute("id_number", this.id_number.toString());
    spCloseButton.onclick = (evt) => {
      this.sidepanel_close();
    }
    spCloseButton.innerHTML = "close &times;";
    spCloseButtCol.appendChild(spCloseButton);

    const topRestCol = document.createElement('div');
    topRestCol.setAttribute("class", "w3-rest w3-center w3-blue-grey");
    topRestCol.setAttribute("style", "height:50px;");
    const topRestColContent = document.createElement('p');
    let topRestColContent_id = "vn-sidepanel-title-" + this.id_number.toString();
    topRestColContent.setAttribute("id", topRestColContent_id);
    topRestColContent.innerHTML = "Visinum GIS";
    topRestCol.appendChild(topRestColContent);
    topGridRow.appendChild(topRestCol);


    //sidepanelNode.appendChild(spCloseButton);
    //appNode.appendChild(sidepanelNode);

    // const spCloseButtonTooltip = document.createElement('span');
    // spCloseButtonTooltip.setAttribute("class", "w3-text w3-tag");
    // spCloseButtonTooltip.setAttribute("style", "position:absolute;font-size:12px;right:90px;top:10px;");
    // spCloseButtonTooltip.innerHTML = "click to close side panel";
    // spCloseButton.appendChild(spCloseButtonTooltip);

    // const datatreeNode = document.createElement('div');
    // let datatree_id = "vn-datatree-" + this.id_number.toString();
    // datatreeNode.setAttribute("id", datatree_id);
    // sidepanelNode.appendChild(datatreeNode);

    let sp_title_node = document.getElementById(topRestColContent_id);
    sp_title_node.innerHTML = "Select map layers";

    appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    const _map_id = "vn-map-" + id_number.toString();
    const _mapnode = document.createElement('div');
    _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    _mapnode.setAttribute("id", _map_id);
    appNode.appendChild(_mapnode);

    this.gis = new Vnleafmap({id_number:this.id_number, gisOptions:gisOptions});
    //this.sidepanel_open();


    const datatreeNode = document.createElement('div');
    let datatree_id = "vn-datatree-" + this.id_number.toString();
    datatreeNode.setAttribute("id", datatree_id);
    sidepanelNode.appendChild(datatreeNode);
    attachDatatree(tree_vnleaf, this.id_number, this.gis);



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