


export function load_config(url, callback=null) {
  //console.log("load_config server:", window.location.href);
  fetch(url)
  .then((resp) => {
    if (resp.status != 200) {
      console.log(`load_config failure\nurl=«${url}»\nfetch response status code: ${resp.status}`);
    };
    resp.json()
    .catch((err) => {
      console.log("load_config failure\nresp.json():", err);
    })
    .then((confData) => {
      if (callback) callback(confData);
    })
    // .catch((err) => {
    //   console.log("load_config failure in callback:", err);
    // });      
  })
  .catch((err) => {
    console.log("load_config failure top-level:", err);
  });
}
