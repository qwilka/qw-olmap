import {Vnleafmap} from "./gis"

export class VnApp {



  constructor(app_id, id_number=0, title="vn-app") {
    //super({ direction: 'left-to-right', spacing: 0, node: VnApp.createNode(id_number) });
    this.id_number = id_number;
    this.id = app_id; //"vnapp-" + id_number.toString();

    // if (parent_id === null) {
    //   const parentNode = document.body;
    // }
    //const appNode = document.createElement('div');
    const appNode = document.getElementById(app_id);
    //appNode.setAttribute("src", "");
    appNode.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0;");
    //appNode.setAttribute("id", this.id);
    //parentNode.appendChild(appNode);

    //this.id = id_stem + id_number.toString();
    
    //const _appnode = document.getElementById(this.id);
    const _map_id = "vnmap-" + id_number.toString();
    const _mapnode = document.createElement('div');
    //_mapnode.setAttribute("src", "");
    _mapnode.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
    _mapnode.setAttribute("id", _map_id);
    appNode.appendChild(_mapnode);

    this.gis = new Vnleafmap(this.id_number);




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