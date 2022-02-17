import logo from "./logo.svg";
import Login from "./Login";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
