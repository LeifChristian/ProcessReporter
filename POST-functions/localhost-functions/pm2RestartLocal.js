var request = require("request");

let gogoRestart = async (para) => {
  var options = {
    method: "POST",
    url: `http://localhost:3800/restart/${para}`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password:
        "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    }),
  };

  // console.log("made it");
  // console.log(para);

  request(options, function (error, response) {
    // if (error) throw new Error(error);
    // console.log(response.body);
  });
};

let goTeam = async (para) => {
  var options = {
    method: "POST",
    url: "http://localhost:3800/getStoppedProcess",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password:
        "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342",
    }),
  };

  request(options, function (error, response) {
    // console.log(response);

    try {
      // if (error) throw new Error(error);
      // console.log(response.body);
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

  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(response.body);
  // });
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
