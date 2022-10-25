var request = require("request");

let interval = 30000;

var options = {
  method: "POST",
  url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "problem.get",
    params: {
      output: "extend",
      selectAcknowledges: "extend",
      selectTags: "extend",
      selectSuppressionData: "extend",
      recent: "true",
      sortfield: ["eventid"],
      sortorder: "DESC",
      acknowledged: "0",
    },
    auth: "feddab2dfbf4d30b63b1383def84b6d1",
    id: 2,
  }),
};

let goTeam = async () => {
  var items = [];

  request(options, function (error, response) {
    if (error) throw new Error(error);
    let thedata = JSON.parse(response.body);
    // let thing = response.body.forEach((item) => {
    //   return item.name;
    // });
    // console.log(result);
    // console.log(thedata.result[0].name);

    console.log(thedata.result.length);

    // console.log(thedata.length);

    for (let i in thedata.result) {
      let item = {
        name: thedata.result[i].name,
        objectid: thedata.result[i].objectid,
      };

      items.push(item);

      //   console.log(i);
    }

    console.log(items);
    return items;
  });
};

goTeam();

setInterval(function () {
  var date = new Date(); // Or the date you'd like converted.
  var isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();

  let timeString = isoDateTime.slice(0, 19).replace("T", " ").replace("Z", "");
  console.log(timeString);

  goTeam();
}, interval);
