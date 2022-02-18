import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      isLoggedIn: false,
      thing: null,
      sessionID: "",
      latestData: null,
      pm2Data: null,
      value: "Admin",
      value1: "zabbix",
      enteredNumber: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.getHosts = this.getHosts.bind(this);
    this.getAlerts = this.getAlerts.bind(this);
    this.getPing = this.getPing.bind(this);
    this.getTriggers = this.getTriggers.bind(this);
    this.getProblems = this.getProblems.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getPM2 = this.getPM2.bind(this);
    this.sendText = this.sendText.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    // this.setState({ value: "Admin", value1: "zabbix" });
    // alert(this.state.value, this.state.value1);
    this.handleSubmit();
  }

  async handleSubmit(event) {
    event?.preventDefault();

    const userData = {
      username: this.state.value,
      password: this.state.value1,
    };

    // alert("A name was submitted: " + this.state.value + this.state.value1);

    await axios.post("/login", userData).then((response) => {
      if (response?.data?.result?.sessionid) {
        console.log(response.data.result.sessionid);
        let theID = response.data.result.sessionid;
        this.setState({ sessionID: theID });
      } else {
        alert("Invalid Login");
      }
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleChange2(e) {
    this.setState({ value1: e.target.value });
  }

  async getHosts() {
    this.setState({ pm2Data: null });
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getHosts", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  async getProblems() {
    this.setState({ pm2Data: null });
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getProblems", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  async getTriggers() {
    this.setState({ pm2Data: null });
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getTriggers", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  async getPing() {
    this.setState({ latestData: "" });
    this.setState({ pm2Data: null });
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getPing", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  async getAlerts() {
    this.setState({ pm2Data: null });
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getAlerts", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  async getPM2() {
    this.setState({ latestData: null });
    await axios.get("/getPM2").then((res) => {
      console.log(res.data);
      this.setState({ pm2Data: JSON.stringify(res.data) });
    });
  }

  refresh() {
    window.location.reload(false);
  }

  async sendText() {
    let theStuff;

    if (!this.state.latestData && !this.state.pm2Data) {
      alert("no data");
      return;
    }

    this.state.latestData ? (theStuff = this.state.latestData) : console.log();

    this.state.pm2Data ? (theStuff = this.state.pm2Data) : console.log();

    const enteredNumber = prompt("Enter number including area code");

    this.setState({ enteredNumber: enteredNumber });

    if (enteredNumber.length !== 10) {
      alert("invalid phone number");
      return;
    } else {
      console.log();
    }

    const userData = {
      Data: `SERVER STATUS UPDATE: ${theStuff}`,
      Number: this.state.enteredNumber
        ? `+1${this.state.enteredNumber}`
        : "+14065390742",
    };

    await axios.post("/sendText", userData).then((response) => {
      console.log(response);
    });
  }

  async sendEmail() {
    let theStuff;

    if (!this.state.latestData && !this.state.pm2Data) {
      alert("no data");
      return;
    }

    this.state.latestData ? (theStuff = this.state.latestData) : console.log();
    this.state.pm2Data ? (theStuff = this.state.pm2Data) : console.log();

    const enteredEmail = prompt("Enter email");
    const userData = { Data: theStuff, Email: enteredEmail };

    await axios.post("/sendEmail", userData).then((response) => {
      console.log(response);
    });
  }

  render() {
    const ifSessionID = () => {
      if (this.state.sessionID !== "") {
        // return <div>session ID: {this.state.sessionID}</div>;
        console.log("session ID:", this.state.sessionID);
      }
    };

    const renderAuthButton = () => {
      if (this.state.sessionID !== "") {
        return (
          <>
            <button className="btn btn-primary bt" onClick={this.getHosts}>
              Get Hosts
            </button>

            <button className="btn btn-primary bt " onClick={this.getTriggers}>
              Get Triggers
            </button>

            <button className="btn btn-primary bt" onClick={this.getProblems}>
              Get Problems
            </button>

            <button className="btn btn-primary bt" onClick={this.getAlerts}>
              Get Alerts
            </button>

            <button className="btn btn-primary bt" onClick={this.getPing}>
              Ping Server
            </button>

            <button className="btn btn-primary bt" onClick={this.getPM2}>
              Get PM2 Data
            </button>
            <br />
            <br />
            <div id="dataReturn">
              {this.state.latestData === "[]"
                ? this.setState({ latestData: "none" })
                : ""}
              {this.state.latestData
                ? this.state.latestData
                    .replaceAll("[", "")
                    .replaceAll("]", "")
                    .replaceAll("{", "")
                    .replaceAll("}", "")
                    .replaceAll(",", " | ")
                    .replaceAll('"', " ")
                : ""}
            </div>

            <div id="dataReturn">
              {this.state.pm2Data
                ? this.state.pm2Data
                    .replaceAll("[", "")
                    .replaceAll("]", "")
                    .replaceAll("{", "")
                    .replaceAll("}", "")
                    .replaceAll(",", " | ")
                    .replaceAll('"', " ")
                : ""}
            </div>

            <button className="btn btn-danger bt" onClick={this.sendText}>
              Send Text
            </button>

            <button className="btn btn-danger bt" onClick={this.sendEmail}>
              Send Email
            </button>
          </>
        );
      } else {
      }
    };

    const loginForm = () => {
      if (this.state.sessionID === "") {
        return (
          <>
            <form onSubmit={this.handleSubmit}>
              <label for="Username" id="un">
                Username{" "}
              </label>
              <br></br>
              <input
                type="text"
                name="Username"
                id="Username"
                onChange={this.handleChange}
              />
              <br></br>
              <label for="Password" id="pw">
                Password{" "}
              </label>
              <br></br>
              <input
                type="text"
                name="Password"
                id="Password"
                onChange={this.handleChange2}
              />
              <br></br>
              <button className="btn btn-primary" type="submit" value="Submit">
                Submit
              </button>
            </form>
          </>
        );
      }
    };

    return (
      <>
        <div>
          <div id="container">
            <iframe
              title="frame"
              id="frame"
              src="https://app.pm2.io/bucket/620c29dcf4a2ce1b3e32890d/backend/overview/servers"
              frameborder="0"
            ></iframe>
            <div id="content">
              <br />
              <br />
              <h3>Zabbix / PM2 Dashboard</h3>
              {/* {loginForm()} */}
              {ifSessionID()}
              <br />
              {renderAuthButton()} <br />
              <br></br>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
