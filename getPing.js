const axios = require("axios");

let server = "http://www.google.com";

let getPingGeneric = async () => {
  await axios
    .post(`http://localhost:3800/sendPingGeneric?server=${server}`)
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
}, 10000);
