const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

// const cors = require("cors");
// app.use(cors());

const cors = require("cors");
const corsOpts = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Routes

router.post("/login", (req, res) => {
  res.json("fuck");
});

// router.post("/login", (req, res) => {
//   // Form validation

//   const username = req.body.username;
//   const password = req.body.password;

//   console.log(username, password);

//   var data = JSON.stringify({
//     jsonrpc: "2.0",
//     method: "user.login",
//     params: {
//       username: username,
//       password: password,
//       userData: true,
//     },
//     id: 1,
//   });

//   var config = {
//     method: "post",
//     url: "https://secret-beyond-63219.herokuapp.com/https://zabbix.unitedlocating.net/api_jsonrpc.php",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
