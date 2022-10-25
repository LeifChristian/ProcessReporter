var express = require("express");
const app = express();
require("dotenv").config();
const ping = require("ping");
const axios = require("axios");
const bodyParser = require("body-parser");
const pm2 = require("pm2");
const cors = require("cors");
// const fs = require("fs");

const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
app.use(bodyParser.json());

const PORT = 3800;
// const data = require(`./test.json`);

let accountSid = process.env.MY_ACCT_SID;
let authToken = process.env.MY_TOKEN;
const client = require("twilio")(accountSid, authToken);

const getPingLocal = require("./POST-functions/localhost-functions/getPingLocal.js");
const loginZabbixLocal = require("./POST-functions/localhost-functions/loginZabbixLocal.js");

// console.log(getPingLocal);

app.post("/pm2Auth", (req, res) => {
  // if (req) console.log(req) && res.send(req);

  console.log(req.body);

  // console.log(res);

  if (req?.body?.password == process.env.PASSWORD) {
    pm2.connect(function (err) {
      pm2.list((err, list) => {
        // console.log(list[0].monit);
        // console.log(list[0].pm_id);
        // console.log(list[0].pm2_env);
        // console.log(list[0]?.pm2_env.pm_id);
        // console.log(list[0].pm2_env.created_at);
        // console.log(list[0].pm2_env.pm_uptime)

        let response = [];

        for (let i in list) {
          let item = {
            Item: i,
            name: list[i].name,
            process_ID: list[i].pid,
            created: new Date(list[i].pm2_env.created_at * 1000)
              .toString()
              .slice(0, -37),
            // created: list[i].pm2_env.created_at
            // uptime: list[i].pm2_env.pm_uptime,
            // status: list[i].node_version,
            pm2_ID: list[i].pm2_env.pm2_id,
            status: list[i].pm2_env.status,
          };
          response.push(item);
        }

        console.log(response);

        // console.log(res);

        let erroredResponse = [];

        for (let i in response) {
          // console.log(response[i].status);

          if (response[i].status !== "online") {
            erroredResponse.push(response[i]);
            response.splice(i, 1);
          } else {
          }
        }

        if (erroredResponse.length > 0) {
          // console.log(erroredResponse);
          // res.send(erroredResponse);
          console.log(list);
          // client.messages
          //   .create({
          //     body: "WARNING - process offline " + JSON.stringify(erroredResponse),
          //     messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
          //     to: "14065390742",
          //   })
          //   .then((message) => console.log(message.sid))
          //   .done();

          list.push(erroredResponse);

          res.send(list);
        } else {
          // res.send(ok);
          // res.send("all processes online");

          if (list.length == 0) {
            res.send("no processes to show");
          } else {
            res.send(list);
            console.log("all processes online");
            console.log(list);
          }
          // res.send(list);
        }
      });
    });
  } else {
    console.log("invalid password");
    res.send("invalid password");
  }
});

app.post("/pm2GetProcess", (req, res) => {
  // console.log(req.body);
  // if (req) console.log(req) && res.send(req);
  // console.log(res);

  if (req?.body?.password == process.env.PASSWORD) {
    pm2.connect(function (err) {
      pm2.list((err, list) => {
        // console.log(list[0].monit);
        // console.log(list[0].pm_id);
        // console.log(list[0].pm2_env);
        // console.log(list[0]?.pm2_env.pm_id);
        // console.log(list[0].pm2_env.created_at);
        // console.log(list[0].pm2_env.pm_uptime)

        let response = [];

        for (let i in list) {
          let item = {
            Item: i,
            name: list[i].name,
            process_ID: list[i].pid,
            created: new Date(list[i].pm2_env.created_at * 1000)
              .toString()
              .slice(0, -37),
            // created: list[i].pm2_env.created_at
            // uptime: list[i].pm2_env.pm_uptime,
            // status: list[i].node_version,
            pm2_ID: list[i].pm2_env.pm_id,
            status: list[i].pm2_env.status,
          };
          response.push(item);
        }

        console.log(response);

        response.length > 0
          ? res.send(response)
          : res.send("no processes to show");

        // if (response.length > 0){res.send(response)}

        // console.log(res);
      });
    });
  } else {
    console.log("invalid password");
    res.send("invalid password");
  }
});

app.post("/getStoppedProcess", (req, res) => {
  // console.log(req.query.password);
  const { password } = req?.body;
  let response = [];
  if (password == process.env.PASSWORD) {
    pm2.connect(function (err) {
      pm2.list((err, list) => {
        // console.log(list[0]?.pm2_env.pm_id);

        for (let i in list) {
          let item = {
            // Item: i,
            name: list[i].name,
            process_ID: list[i].pid,
            created: new Date(list[i].pm2_env.created_at * 1000)
              .toString()
              .slice(0, -37),
            pm2_ID: list[i].pm2_env.pm_id,
            status: list[i].pm2_env.status,
          };
          response.push(item);
        }

        // console.log(response, "!!!!!!");
        let erroredResponse = [];

        for (let i in response) {
          // console.log(response[i].status);

          if (response[i].status !== "online") {
            erroredResponse.push(response[i]);
          } else {
          }
        }

        if (erroredResponse.length > 0) {
          console.log(erroredResponse);
          res.send(erroredResponse);

          client.messages
            .create({
              body:
                "WARNING - process offline " + JSON.stringify(erroredResponse),
              messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
              to: "14065390742",
            })
            .then((message) => console.log(message.sid))
            .done();
        } else {
          if (response.length == 0) {
            res.send("no processes to show");
            console.log("no processes to show");
            return;
          }
          // console.log(response.length, "!!!!!!!!!!!!!!!!");
          // res.send(ok);
          res.send("all processes online");
        }
      });
    });
  } else {
    console.log("error");
  }
});

app.post("/restart/:id", (req, res) => {
  // const { password } = req?.body;
  console.log(req.body);

  let message = "";

  let response = [];

  if (req.body.password == process.env.PASSWORD) {
    pm2.list((err, list) => {
      // console.log(list[0].monit);
      console.log(list[0].pm_id);
      // console.log(list[0].pm2_env);
      // console.log(list[0]?.pm2_env.pm_id);
      // console.log(list[0].pm2_env.created_at);
      // console.log(list[0].pm2_env.pm_uptime)

      if (list.length == 0) {
        res.send("no processes running");
      }

      if (list.length > 0) {
        for (let i in list) {
          // console.log(list.length, "length");
          // console.log(list[i].pm2_env.pm_id, "");
          // console.log(list[i]?.pm_id, "id!!!");
          // console.log(req.params.id, "request");

          list[i].pm_id == req.params.id
            ? response.push(list[i].pm_id) && console.log("yay")
            : "";
          // console.log(list[i].pid, "?");
          // console.log(req.params.id, "/");
        }

        pm2.restart(response[0], (err, proc) => {
          // console.log(req.params.id); console.log(proc); console.log(req.params);

          console.log(`pm2 restarted process ${req.params.id}`);
          message = `process with Id ${req.params.id} restarted`;

          res.send(message);

          pm2.disconnect();
        });
      }

      // console.log(res);
    });
  } else {
    console.log("invalid password");
    res.send("invalid password");
  }
});

app.post("/stopProcess/:id", (req, res) => {
  // const { password } = req?.body;
  // console.log(req.body);

  let response = [];

  let message = "";

  if (req.body?.password == process.env.PASSWORD) {
    pm2.list((err, list) => {
      // console.log(list[0].monit);
      console.log(list[0]?.pm2_id);
      // console.log(list[0].pm2_env);
      // console.log(list[0]?.pm2_env.pm_id);
      // console.log(list[0].pm2_env.created_at);
      // console.log(list[0].pm2_env.pm_uptime)

      if (list.length > 0) {
        for (let i in list) {
          // console.log(list.length, "length");
          // console.log(list[i].pm2_env.pm_id, "");
          // console.log(list[i]?.pm_id, "id!!!");
          // console.log(req.params.id, "request");

          list[i].pm_id == req.params.id
            ? response.push(list[i].pm_id) && console.log("yay")
            : "";
          // console.log(list[i].pid, "?");
          // console.log(req.params.id, "/");
        }
      }

      // console.log(response.length);

      if (response.length == 0) {
        console.log("no processes available");
        res.send("no processes available");
        return;
      }

      pm2.stop(response[0], (err, proc) => {
        // console.log(req.params.id);
        console.log(`pm2 stopped process ${req.params.id}`);
        // console.log(proc);
        // console.log(req.params);
        res.send(`process with Id ${req.params.id} stopped`);
        console.log(`process with Id ${req.params.id} stopped`);
        pm2.disconnect();
      });

      // console.log(response.length);
      // if (response.length > 0){res.send(response)}
    });
  } else {
    console.log("invalid password");
    res.send("invalid password");
  }
});

app.post("/loginZabbix", (req, res) => {
  // const username = req.body.username;
  // const password = req.body.password;

  // const username = req.query.username;
  // const password = req.query.password;

  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      username: "Admin",
      password: "zabbix",
      userData: true,
    },
    id: 1,
  });

  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/getProblems", (req, res) => {
  // console.log(req, "body");
  // console.log(req.query);

  var axios = require("axios");
  var data = JSON.stringify({
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
    auth: req.query.sessionid,
    id: 2,
  });
  var config = {
    method: "post",
    url: "https://zabbix.unitedlocating.net/api_jsonrpc.php",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/sendPingGeneric", async (req, res) => {
  console.log(req.query);

  // console.log(process.env.TWILIO_ACCOUNT_SID);

  // var hosts = ["192.168.1.1", "google.com", "yahoo.com"];
  // var hosts = ["10.0.0.174"];

  var host = req?.query?.server;

  let response = await ping.promise.probe(host);
  console.log(response);

  res.send(response);

  //below is for multiple hosts..

  // var hosts = req.body.Server;
  // for (let host of hosts) {
  //   let res = await ping.promise.probe(host);
  //   console.log(res);
  // }
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

// unused routes //

// app.get("/restart", (req, res) => {
//   const { password } = req?.query;
//   if (password == process.env.PASSWORD) {
//     pm2.restart("server", (err, proc) => {
//       console.log("pm2 restarted prowewerwercess");
//       console.log(proc);
//       res.send("process restarted");
//       pm2.disconnect();
//     });
//   } else {
//     console.log("invalid password");
//     res.send("invalid password");
//   }
// });

// app.get("/pm2Auth", (req, res) => {
//   // if (req) console.log(req) && res.send(req);

//   console.log(req.body);
//   // console.log(res);
//   if (req.query.pass == process.env.PASSWORD) {
//     pm2.connect(function (err) {
//       pm2.list((err, list) => {
//         // console.log(list[0].monit);
//         // console.log(list[0].pm_id);
//         // console.log(list[0].pm2_env);
//         // console.log(list[0]?.pm2_env.pm_id);
//         // console.log(list[0].pm2_env.created_at);
//         // console.log(list[0].pm2_env.pm_uptime)

//         let response = [];

//         for (let i in list) {
//           let item = {
//             Item: i,
//             name: list[i].name,
//             process_ID: list[i].pid,
//             created: new Date(list[i].pm2_env.created_at * 1000)
//               .toString()
//               .slice(0, -37),
//             // created: list[i].pm2_env.created_at
//             // uptime: list[i].pm2_env.pm_uptime,
//             // status: list[i].node_version,
//             pm2_ID: list[i].pm2_env.pm_id,
//             status: list[i].pm2_env.status,
//           };
//           response.push(item);
//         }

//         console.log(response);

//         // console.log(res);

//         let erroredResponse = [];

//         for (let i in response) {
//           // console.log(response[i].status);

//           if (response[i].status !== "online") {
//             erroredResponse.push(response[i]);
//             response.splice(i, 1);
//           } else {
//           }
//         }

//         let ok =
//           JSON.stringify(erroredResponse) + " " + JSON.stringify(response);
//         //   res.send(ok);
//         superOK.push(ok);

//         if (erroredResponse.length > 0) {
//           // console.log(erroredResponse);
//           res.send(erroredResponse);
//           console.log(list);
//           // client.messages
//           //   .create({
//           //     body: "WARNING - process offline " + JSON.stringify(erroredResponse),
//           //     messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
//           //     to: "14065390742",
//           //   })
//           //   .then((message) => console.log(message.sid))
//           //   .done();
//         } else {
//           // res.send(ok);
//           // res.send("all processes online");

//           res.send(list);
//           console.log("all processes online");
//         }
//       });
//     });
//   } else {
//     cosnole.log("invalid password");
//     res.send("invalid password");
//   }
// });

// app.get("/", (req, res) => {
//   pm2.connect(function (err) {
//     pm2.list((err, list) => {
//       // console.log(list[0].monit);
//       // console.log(list[0].pm_id);
//       // console.log(list[0].pm2_env);
//       console.log(list[0]?.pm2_env.pm_id);
//       // console.log(list[0].pm2_env.created_at);
//       // console.log(list[0].pm2_env.pm_uptime)

//       let response = [];

//       for (let i in list) {
//         let item = {
//           Item: i,
//           name: list[i].name,
//           process_ID: list[i].pid,
//           created: new Date(list[i].pm2_env.created_at * 1000)
//             .toString()
//             .slice(0, -37),
//           // created: list[i].pm2_env.created_at
//           // uptime: list[i].pm2_env.pm_uptime,
//           // status: list[i].node_version,
//           pm2_ID: list[i].pm2_env.pm_id,
//           status: list[i].pm2_env.status,
//         };
//         response.push(item);
//       }

//       console.log(response);

//       console.log(res);

//       let erroredResponse = [];

//       for (let i in response) {
//         console.log(response[i].status);

//         if (response[i].status !== "online") {
//           erroredResponse.push(response[i]);
//           response.splice(i, 1);
//         } else {
//         }
//       }

//       let ok = JSON.stringify(erroredResponse) + " " + JSON.stringify(response);
//       //   res.send(ok);
//       superOK.push(ok);

//       if (erroredResponse.length > 0) {
//         console.log(erroredResponse);
//         res.send(erroredResponse);

//         // client.messages
//         //   .create({
//         //     body: "WARNING - process offline " + JSON.stringify(erroredResponse),
//         //     messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
//         //     to: "14065390742",
//         //   })
//         //   .then((message) => console.log(message.sid))
//         //   .done();
//       } else {
//         // res.send(ok);
//         res.send("all processes online");
//       }
//     });
//   });
// });



// client.messages
// .create({
//     body: message,
//     messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
//     to: "+14065390742",
// })
// .then((message) => console.log(message.sid))
// .done();