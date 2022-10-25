let goTeam = async () => {
  var request = require("request");
  var options = {
    method: "GET",
    url: "http://localhost:3800",
    headers: {},
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
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
