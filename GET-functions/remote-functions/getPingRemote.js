const axios = require("axios");

let server = "http://www.google.com";

let getPingGeneric = async () => {
  await axios
    .post(`http://10.0.0.174:3800/sendPingGeneric?server=${server}`)
    .then((response) => {
      const { alive, host } = response?.data;

      //   console.log(response.data);

      let hostStatus;

      alive ? (hostStatus = "alive") : (hostStatus = "offline");

      console.log(`host: ${host}, status: ${hostStatus}`);

      if (response?.data?.alive == true) {
        console.log("ITS ALIVE! 👾👽");
      }

      if (response?.data?.alive == !true) {
        console.log("ITS not ALIVE! 👾👽");
        // return;
      }
    });
};
getPingGeneric();
setInterval(function () {
  getPingGeneric();
  var date = new Date(); // Or the date you'd like converted.
  var isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();

  let timeString = isoDateTime.slice(0, 19).replace("T", " ").replace("Z", "");
  console.log(timeString);
}, 10000);
