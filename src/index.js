/*
Copyright (C) 2021 Qwilka Limited - All Rights Reserved.
Proprietary and confidential.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Written by Stephen McEntee <apps@qwilka.com>, June 2021.
*/

// import {
//   BoxPanel, Widget, DockPanel
// } from '@lumino/widgets';

// import './vn-styles.css';

// import { createMenus, datatreeContextmenu } from './menus';
// import { commands } from './commands';
// import { attachDatatree } from './datatree';

// import { createGisWidget} from './gis-app';


// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/vnol/sw.js')
//     .then(reg => {
//       console.log("Registered ServiceWorker successfully: sw.js", reg);
//     }).catch(err => {
//       console.log("ServiceWorker not registered: sw.js", err);
//     });   
// }

// export let mainApp;

async function main() {
  let confFile;          // , url_string = window.location.href;
  let url = new URL( window.location.href );
  if (url.searchParams.has("conf")) {
    confFile = url.searchParams.get("conf");
    confFile = "/assets/" + confFile;
  } else {
    confFile = default_conf_path;  // global variable set in index.html
  }


  // https://www.pentarem.com/blog/how-to-use-settimeout-with-async-await-in-javascript/
  // function delay(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
  // console.log("Before setTimeout");
  // async function someFunction() {
  //  await delay(4000);
  //  //await someOtherFunction();
  // }
  // await someFunction();
  // console.log("After setTimeout");

// https://www.youtube.com/watch?v=Ri7WRoRcl_U&list=PLNYkxOF6rcIB2xHBZ7opgc2Mv009X87Hh&index=8
// Using the Fetch API - Progressive Web App Training

  let conf, response, flength;

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
  if (conf.dockLayout) {

    //addCommands();



    //mainApp = new createDockLayout(conf);
  } else {
    //mainApp = await createGisWidget(conf.confFile);
    console.log("mainApp = ", mainApp );
  }



}


window.onload = () => {
    main();
}


