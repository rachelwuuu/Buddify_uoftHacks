import logo from "./logo.svg";
import "./App.css";
import { LoginDialog } from "./auth/LoginDialog";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
        
        <Switch>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/">
            <MainPage />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
