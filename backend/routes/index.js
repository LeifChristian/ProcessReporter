var express = require("express");
var router = express.Router();
var axios = require("axios");
const app = express();
const cors = require("cors");
const pm2 = require("pm2");
const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res) => {
  // Form validation

  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);

  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      username: username,
      password: password,
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

router.post("/getHosts", (req, res) => {
  console.log(req.body, "body");

  // var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "host.get",
    params: {
      output: ["hostid", "host"],
      selectInterfaces: ["interfaceid", "ip"],
    },
    id: 2,
    auth: req.body.sessionID,
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

router.post("/getAlerts", (req, res) => {
  console.log(req.body, "body");

  // var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alert.get",
    params: {
      output: ["hostid", "host"],
      selectInterfaces: ["interfaceid", "ip"],
    },
    id: 2,
    auth: req.body.sessionID,
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

router.post("/getPing", (req, res) => {
  console.log(req.body, "body");

  var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "script.execute",
    params: {
      scriptid: "1",
      hostid: "10084",
    },
    auth: req.body.sessionID,
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

router.post("/getTriggers", (req, res) => {
  console.log(req.body, "body");

  var axios = require("axios");
  var data = JSON.stringify({
    jsonrpc: "2.0",
    method: "trigger.get",
    params: {
      output: ["triggerid", "description", "priority"],
      filter: {
        value: 1,
      },
      sortfield: "priority",
      sortorder: "DESC",
    },
    auth: req.body.sessionID,
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

router.post("/getProblems", (req, res) => {
  console.log(req.body, "body");

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
    auth: req.body.sessionID,
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
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/getPM2", async (req, res) => {
  pm2.connect(function (err) {
    pm2.list((err, list) => {
      console.log(err);
      // console.log(err, list);
      // console.log(list[0].monit);
      // console.log(list[0].pm_id);
      // console.log(list[0].pm2_env);

      // console.log(list[0].pm2_env);
      // console.log(list[0].pm2_env.created_at);
      // console.log(list[0].pm2_env.pm_uptime);

      console.log(list);

      let response = [];

      for (let i in list) {
        let item = {
          process_ID: list[i].pid,
          createdAt: list[i].pm2_env.created_at,
          uptime: list[i].pm2_env.pm_uptime,
          status: list[i].node_version,
          status2: list[i].pm2_env.status,
        };
        response.push(item);
      }

      res.send(response);
    });
  });
});

module.exports = router;