/*
Copyright (C) 2022 Qwilka Limited - All Rights Reserved.
Proprietary and confidential.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Written by Stephen McEntee <apps@qwilka.com>, January 2022.
*/

import {makeGis} from "./gismap"

async function main() {
  let confFile = default_conf_path;          // , url_string = window.location.href;
  let url = new URL( window.location.href );
  if (url.searchParams.has("c")) {
    confFile = url.searchParams.get("c");
    confFile = "/qwol/" + confFile + ".qwol";
  } else if (url.searchParams.has("z")) {
      let zconf = url.searchParams.get("z");
      console.log(`Z-conf = ${zconf}`);
  }



  let conf, response, flength, mainApp;

  // // TEST: check the size of the file w/o downloading....
  // response = await fetch(confFile, {method: 'HEAD'});
  // flength = response.headers.get('content-length');
  // console.log(`File ${confFile} content-length is ${flength}  bytes`);

  // TEST: POST
  // response = await fetch(confFile, {method: 'POST', body: 'title=hello&message=world'});


  response = await fetch(confFile);
  //console.log(`await fetch(confFile) response.statusText:`, response.statusText);
  if (response.ok) {
    flength = response.headers.get('content-length');
    console.log(`File ${confFile} ${response.statusText}; content-length is ${flength} bytes`);
    conf = await response.json();
    if (!conf) {
      let err = `response.json: file «${confFile}» not valid.`;
      console.error(err);
      throw new Error(err);      
    }
    
  } else {
    console.error(`fetch(confFile): file «${confFile}» not loaded.`);
    throw response.statusText;
  }

  if (conf.title) {
    document.title = conf.title;
  }
  if (conf.appType === "qwol") {

    //mainApp = await createGisWidget(conf.confFile);
    mainApp="TEST: setup mainApp...";
    console.log("mainApp = ", mainApp );
    let retVal = makeGis(conf);
  }



}


window.onload = () => {
    main();
}


