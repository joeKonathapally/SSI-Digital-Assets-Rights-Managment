import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Route, Redirect, Link, BrowserRouter, Switch } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Landing from "./components/landing/Landing";
import reportWebVitals from "./reportWebVitals";
import Endorser from "./components/endorser/Endorser";
import Cavendish from "./components/cavendish/Cavendish";
import Ruth from "./components/ruth/Ruth";
import Thoday from "./components/thoday/Thoday";
import Franklin from "./components/franklin/Franklin";
import Competition from "./components/artCompetition/ArtCompetition";
import Home from "./components/home/Home";
import Error404 from "./components/404/Error404";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/controller/endorser" component={Endorser} />
        <Route path="/controller/cavendish" component={Cavendish} />
        <Route path="/controller/ruth" component={Ruth} />
        <Route path="/controller/thoday" component={Thoday} />
        <Route path="/controller/franklin" component={Franklin} />
        <Route path="/competition" component={Competition} />
        <Route path="/public/thoday">
          <Home
            name="Thoday"
            api_url={process.env.REACT_APP_THODAY_API}
            hook_url={process.env.REACT_APP_THODAY_HOOK}
          />
        </Route>
        <Route path="/public/cavendish">
          <Home
            name="Cavendish"
            api_url={process.env.REACT_APP_CAVENDISH_API}
            hook_url={process.env.REACT_APP_CAVENDISH_HOOK}
          />
        </Route>
        <Route exact path="/404" component={Error404} />
        <Route path="/*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
