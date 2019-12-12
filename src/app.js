
import { attachDatatree } from './datatree';
import {Vnleafmap} from "./gis"

import './libs/w3.css';

export class VnApp {



  constructor({app_id, mapOptions, tree_vnleaf, id_number=0, title="vnleaf testing..."} = {}) {
    //super({ direction: 'left-to-right', spacing: 0, node: VnApp.createNode(id_number) });
    this.id_number = id_number;
    this.id = app_id; //"vnapp-" + id_number.toString();
    document.title = title;
    console.log("app_id", app_id);
    console.log("mapOptions", mapOptions);
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
    sidepanelNode.setAttribute("style", "display:none;z-index:2000;width:400px;");
    const spClose = document.createElement('button');
    //spClose.onclick = this.sidepanel_close;

    spClose.setAttribute("class", "w3-bar-item w3-large");
    spClose.setAttribute("style", "text-align:right;");
    spClose.setAttribute("id_number", this.id_number.toString());
    spClose.onclick = (evt) => {
      //console.log("sidepanel_close evt", evt);
      this.sidepanel_close();
    }
    spClose.innerHTML = "close &times;";
    sidepanelNode.appendChild(spClose);
    appNode.appendChild(sidepanelNode);

    const datatreeNode = document.createElement('div');
    let datatree_id = "vn-datatree-" + this.id_number.toString();
    datatreeNode.setAttribute("id", datatree_id);
    sidepanelNode.appendChild(datatreeNode);
    //attachDatatree(datatree_id, treeData);

    appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    const _map_id = "vn-map-" + id_number.toString();
    const _mapnode = document.createElement('div');
    _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    _mapnode.setAttribute("id", _map_id);
    appNode.appendChild(_mapnode);

    this.gis = new Vnleafmap(this.id_number, mapOptions);
    //this.sidepanel_open();
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