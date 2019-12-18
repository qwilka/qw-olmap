
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
    const spTopGridRow = document.createElement('div');
    spTopGridRow.setAttribute("class", "w3-row");
    sidepanelNode.appendChild(spTopGridRow);
    const spCloseButtCol = document.createElement('div');
    spCloseButtCol.setAttribute("class", "w3-col w3-right w3-blue-grey");
    spCloseButtCol.setAttribute("style", "width:40px;height:50px;");
    spTopGridRow.appendChild(spCloseButtCol);

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


    const spTopTitleCol = document.createElement('div');
    spTopTitleCol.setAttribute("class", "w3-rest w3-center w3-blue-grey");
    spTopTitleCol.setAttribute("style", "height:50px;");
    // const spTopTitleColContent = document.createElement('p');
    // let spTopTitleColContent_id = "vn-sidepanel-title-" + this.id_number.toString();
    // spTopTitleColContent.setAttribute("id", spTopTitleColContent_id);
    // spTopTitleColContent.innerHTML = "Visinum GIS";
    // spTopTitleCol.appendChild(spTopTitleColContent);
    spTopGridRow.appendChild(spTopTitleCol);
    this.spTopTitleCol = spTopTitleCol;



    // Side-panel main content ------------------------------------
    const spMainGridRow = document.createElement('div');
    spMainGridRow.setAttribute("class", "w3-row");
    spMainGridRow.setAttribute("style", "height:100%;");
    sidepanelNode.appendChild(spMainGridRow);
    const spTabCol = document.createElement('div');
    spTabCol.setAttribute("class", "w3-col w3-border w3-light-gray");
    spTabCol.setAttribute("style", "width:32px;height:100%;");
    //spTabCol.innerHTML = "g";
    spMainGridRow.appendChild(spTabCol);
    this.spTabCol = spTabCol;

    const spMainCol = document.createElement('div');
    spMainCol.setAttribute("class", "w3-rest");
    //spMainCol.setAttribute("style", "height:50px;");
    spMainGridRow.appendChild(spMainCol);
    this.spMainCol = spMainCol;




    // GIS map ------------------------------------
    appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    const _map_id = "vn-map-" + id_number.toString();
    const _mapnode = document.createElement('div');
    _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    _mapnode.setAttribute("id", _map_id);
    appNode.appendChild(_mapnode);
    this.gis = new Vnleafmap({id_number:this.id_number, gisOptions:gisOptions});


    // Data tree ------------------------------------
    const datatreeNode = this.createSpWidget("layers", "Select map layers", "fas fa-layer-group");
    //const datatreeNode = document.createElement('div');
    let datatree_id = "vn-datatree-" + this.id_number.toString();
    datatreeNode.setAttribute("id", datatree_id);
    //datatreeNode.setAttribute("data-ident", "layers");
    //datatreeNode.setAttribute("data-title", "Select map layers");
    //sidepanelNode.appendChild(datatreeNode);
    //spMainCol.appendChild(datatreeNode);
    attachDatatree(tree_vnleaf, this.id_number, this.gis);



    // // Map layers select ------------------------------------
    // const layersButton = document.createElement('button');
    // layersButton.setAttribute("class", "w3-button w3-dark-grey");
    // layersButton.setAttribute("style", "margin:1px;padding:4px 2px 2px 2px;height:32px;width:32px;");
    // layersButton.setAttribute("title", "select map layers");
    // layersButton.onclick = (evt) => {
    //   // console.log("layersButton clicked!!!");
    //   // let sp_title_node = document.getElementById(spTopTitleColContent_id);
    //   // sp_title_node.innerHTML = "<p>Select map layers</p>";
    //   // spTopTitleCol.innerHTML = "<p>Select map layers</p>";
    //   // datatreeNode.style.display = "block";
    //   // spAttribNode.style.display = "none";
    //   this.showSidepanelWidget("layers");
    // }
    // const layersButtIcon = document.createElement('i');
    // layersButtIcon.setAttribute("class", "fas fa-layer-group w3-xlarge");
    // layersButton.appendChild(layersButtIcon);
    // spTabCol.appendChild(layersButton);
    // ** this.createSpWidget("layers", "Select map layers", "fas fa-layer-group");

    
    // // Attribution button ------------------------------------
    // const attriButton = document.createElement('button');
    // attriButton.setAttribute("class", "w3-button w3-dark-grey");
    // attriButton.setAttribute("style", "margin:1px;padding:4px 2px 2px 2px;height:32px;width:32px;");
    // attriButton.setAttribute("title", "show map attributions");

    // let attriFunc = (evt) => {
    //   this.showSidepanelWidget("attributions");
    //   let _atts = this.gis.getAllAttributions();
    //   let _html = "<ul class='w3-ul w3-small'>";
    //   for (let ii=0; ii<_atts.length; ii++) {
    //     if (!_atts[ii]) continue;
    //     _html += "<li>" + _atts[ii] + "</li>";
    //   }
    //   _html += "</ul>";
    //   spAttribNode.innerHTML = _html;
    // }
    // attriButton.onclick = attriFunc;

    // const attriButtIcon = document.createElement('i');
    // attriButtIcon.setAttribute("class", "far fa-copyright w3-xlarge");
    // attriButton.appendChild(attriButtIcon);
    // spTabCol.appendChild(attriButton);

    // const spAttribNode = document.createElement('div');
    // // let spAttribNode_id = "vn-sp-attr-" + this.id_number.toString();
    // // spAttribNode.setAttribute("id", spAttribNode_id);
    // spAttribNode.setAttribute("style", "display:none;");
    // spAttribNode.setAttribute("data-ident", "attributions");
    // spAttribNode.setAttribute("data-title", "Map attributions");
    // //spAttribNode.innerHTML ="<h3>this is the first line </h3> <p>this is a test with a very long string that should wrap around. this is the second testing sentence.</p>";
    // //sidepanelNode.appendChild(datatreeNode);
    // spMainCol.appendChild(spAttribNode);

    // let attriFunc = (evt) => {
    //   this.showSidepanelWidget("attributions");
    //   let _atts = this.gis.getAllAttributions();
    //   let _html = "<ul class='w3-ul w3-small'>";
    //   for (let ii=0; ii<_atts.length; ii++) {
    //     if (!_atts[ii]) continue;
    //     _html += "<li>" + _atts[ii] + "</li>";
    //   }
    //   _html += "</ul>";
    //   spWidgetNode.innerHTML = _html;
    // }
    this.createSpWidget("attributions", "Map attributions", "far fa-copyright");

    this.showSidepanelWidget("layers");


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

  showSidepanelWidget(dataIdent) {
    //this.spTabCol
    //this.spMainCol.childNodes
    for (let ii=0; ii<this.spMainCol.childNodes.length; ii++) {
      let currNode = this.spMainCol.childNodes[ii];
      //console.log("showSidepanelWidget", ii, currNode);
      let currIdent = currNode.getAttribute("data-ident");
      //console.log("data-ident", ii, currIdent);
      if (dataIdent===currIdent) {
        let title = currNode.getAttribute("data-title");
        this.spTopTitleCol.innerHTML = "<p>" + title + "</p>";
        currNode.style.display = "block";
      } else {
        currNode.style.display = "none";
      }
    }

  }

  createSpWidget(ident, title, iconClass) {
    const spWidgetNode = document.createElement('div');
    spWidgetNode.setAttribute("style", "display:none;");
    spWidgetNode.setAttribute("data-ident", ident);
    spWidgetNode.setAttribute("data-title", title);
    this.spMainCol.appendChild(spWidgetNode);  

    const spTabButton = document.createElement('button');
    spTabButton.setAttribute("class", "w3-button w3-dark-grey");
    spTabButton.setAttribute("style", "margin:1px;padding:4px 2px 2px 2px;height:32px;width:32px;");
    spTabButton.setAttribute("title", title);   

    let cFunc;  // cannot call this onClickFunc ????
    switch (ident) {
      case 'attributions':
        cFunc = (evt) => {
          this.showSidepanelWidget(ident);
          let _atts = this.gis.getAllAttributions();
          let _html = "<ul class='w3-ul w3-small'>";
          for (let ii=0; ii<_atts.length; ii++) {
            if (!_atts[ii]) continue;
            _html += "<li>" + _atts[ii] + "</li>";
          }
          _html += "</ul>";
          spWidgetNode.innerHTML = _html;
        }
        break;
      default:
        cFunc = (evt) => {
          this.showSidepanelWidget(ident);
        }
    }
    spTabButton.onclick = cFunc;
    const spTabButtonIcon = document.createElement('i');
    spTabButtonIcon.setAttribute("class", iconClass);
    spTabButton.appendChild(spTabButtonIcon);
    this.spTabCol.appendChild(spTabButton);

    return spWidgetNode;
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