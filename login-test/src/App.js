import logo from "./logo.svg";
import "./App.css";
import { LoginDialog } from "./auth/LoginDialog";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage";
import TestPage from "./client/TestPage";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./client";
import MatchPage from "./pages/MatchPage";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Switch>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/test">
            <TestPage />
          </Route>
          <Route exact path="/match">
            <MatchPage />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
