let goTeam = async () => {
  var request = require("request");
  var options = {
    method: "GET",
    url: "http://10.0.0.174:3800",
    headers: {},
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};

goTeam();

setInterval(function () {
  console.log("firing");
  goTeam();
  console.log("fired");
}, 10000);
