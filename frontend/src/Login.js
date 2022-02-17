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
      latestData: "",
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
  }

  componentDidMount() {}

  async handleSubmit(event) {
    event.preventDefault();

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
    const sessionData = {
      sessionID: this.state.sessionID,
    };

    await axios.post("/getAlerts", sessionData).then((response) => {
      console.log(response.data);
      let theResult = response.data.result;
      this.setState({ latestData: JSON.stringify(theResult) });
    });
  }

  refresh() {
    window.location.reload(false);
  }

  render() {
    const ifSessionID = () => {
      if (this.state.sessionID !== "") {
        return <div>session ID: {this.state.sessionID}</div>;
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
              Run Ping
            </button>
            <div id="dataReturn">{this.state.latestData}</div>
            <br />

            <button className="btn btn-danger bt" onClick={this.refresh}>
              Logout
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
      <div className="container">
        <div>
          <br></br>
          {loginForm()}
          <br></br>
          {ifSessionID()}
          <br />
          {renderAuthButton()} <br />
          <br></br>
        </div>
      </div>
    );
  }
}

export default Login;
