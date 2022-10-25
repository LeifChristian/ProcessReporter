var request = require("request");
var ok = "";

let goTeam = async (sessionid) => {
  var options = {
    method: "POST",
    url: "http://localhost:3800/loginZabbix",
    headers: {},
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    let res = JSON.parse(response.body);
    sessionid = res.result.sessionid;
    ok = sessionid;
    console.log(ok + " --sessionID!");

    var options2 = {
      method: "POST",
      url: `http://localhost:3800/getProblems?sessionid=${sessionid}`,
      headers: {},
    };

    request(options2, function (error, response) {
      if (error) throw new Error(error);
      console.log("OKOKOKOKO" + JSON.stringify(response) + "OKOKOKOKOK");
      //   console.log(response.statusCode);
      // console.log(response.body);

      let theresult = JSON.parse(response.body);
      console.log(theresult.result);

      if (theresult.length == 0) {
        console.log("no problems to report");
      } else {
        console.log(theresult.result.length + " problems");
      }
    });
  });
};

goTeam();
