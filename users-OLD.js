const express = require("express");
const router = express.Router();

const cors = require("cors");
app.use(cors());

// Load input validation

router.post("/login", (req, res) => {
  // Form validation

  const username = req.body.username;
  const password = req.body.password;

  console.log(username, password);

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
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
