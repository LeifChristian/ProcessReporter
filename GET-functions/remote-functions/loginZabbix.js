var request = require("request");
var ok = "";

let goTeam = async (sessionid) => {
  var options = {
    method: "POST",
    url: "http://10.0.0.174:3800/loginZabbix",
    headers: {},
  };

  try {
    request(options, function (error, response) {
      // if (error) throw new Error(error);

      if (!response?.body) {
        console.log("no login response");
        return;
      }
      let res = JSON.parse(response.body);
      sessionid = res.result.sessionid;
      ok = sessionid;
      console.log(ok + " --sessionID!");

      var options2 = {
        method: "POST",
        url: `http://10.0.0.174:3800/getProblems?sessionid=${sessionid}`,
        headers: {},
      };

      request(options2, function (error, response) {
        console.log(JSON.stringify(response));
        //   console.log(response.statusCode);
        // console.log(response.body);

        if (!response.body) {
          console.log("unable to get problems");
          return;
        }

        let theresult = JSON.parse(response.body);
        console.log(theresult.result);

        if (!theresult.length) {
          console.log("no problems to report");
        } else {
          console.log("some problems");
        }
      });
    });
  } catch (error) {}
};

goTeam();
