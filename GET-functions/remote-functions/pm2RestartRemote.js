let gogoRestart = async (para) => {
  var request = require("request");

  var options = {
    method: "GET",
    url: `http://10.0.0.174:3800/restart/${para}`,
    headers: {},
  };

  try {
    request(options, function (error, response) {
      // if (error) throw new Error(error);
      console.log(response.body);
    });
  } catch (error) {
    console.log("error sending response...");
  }
};

let goTeam = async (para) => {
  var request = require("request");

  var options = {
    method: "GET",
    url: `http://10.0.0.174:3800/getStoppedProcess?password=b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342`,
    headers: {},
  };
  request(options, function (error, response) {
    try {
      // if (error) throw new Error(error);

      console.log(response.body);
      if (response.body == "all processes online") {
        return;
      }

      if (!response.body) {
        console.log("data not recieved");
        return;
      }

      // console.log(JSON?.parse(response?.body));
      let parsedReturn = JSON?.parse(response?.body);

      for (let i in parsedReturn) {
        if (
          parsedReturn[i]?.status == "stopped" ||
          parsedReturn[i]?.status == "errored"
        ) {
        }
        console.log(
          `process with Id ${parsedReturn[i]?.pm2_ID} is ${parsedReturn[i]?.status}`
        );
        // console.log(parsedReturn[i]?.pm2_ID);
        gogoRestart(parsedReturn[i]?.pm2_ID);
      }
    } catch (error) {
      console.log("error connecting...");
    }
  });
};

goTeam();

setInterval(function () {
  goTeam();

  var date = new Date(); // Or the date you'd like converted.
  var isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();

  let timeString = isoDateTime.slice(0, 19).replace("T", " ").replace("Z", "");
  console.log(timeString);
}, 10000);
