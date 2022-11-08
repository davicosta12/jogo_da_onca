import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Board from "./Components/ContentComponent/Board/Board";
import ContentComponent from "./Components/ContentComponent/ContentComponent";
import Season from "./Components/ContentComponent/Season/Season";
import Skin from "./Components/ContentComponent/Skin/Skin";
import Users from "./Components/ContentComponent/Users/Users";
import GameBoard from "./Components/GameBoard/Gameboard";
import Home from "./Components/Home/Home";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";

import { isAdmin, isAuthenticated, userExist } from "./Services/AuthService/Auth";
import { useContext, useEffect } from "react";
import { ThemeContext } from "./App";
import AuthHelper from "./helpers/AuthHelper";

const verifyWhatPathChoice = () => {
  return userExist() ? (!isAdmin() ? '/home' : '/config/season') : '/';
}

const PrivateRoute = ({ children, ...options }: any) => {

  return isAuthenticated() && userExist() && !isAdmin() ?
    <>
      {children}
    </>
    : <Navigate to={verifyWhatPathChoice()} />
}

const PrivateContentComponent = ({ children, ...options }: any) => {

  return isAuthenticated() && userExist() && isAdmin() ?
    <>
      <ContentComponent screenRender={children} />
    </>
    : <Navigate to={verifyWhatPathChoice()} />
}

const NavigationRoutes = () => {

  const { dispatch } = useContext(ThemeContext);

  useEffect(() => {
    AuthHelper.restoreAuthFromCache(dispatch);
  }, []);

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<SignIn />} />

        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }>
        </Route>

        <Route path="/signup" element={<SignUp />} />

        <Route path="/jaguarboard" element={
          <PrivateRoute>
            <GameBoard />
          </PrivateRoute>
        }>
        </Route>

        <Route path="/config" element={
          <PrivateContentComponent />
        }>
        </Route>

        <Route path="/config/user" element={
          <PrivateContentComponent>
            <Users />
          </PrivateContentComponent>}>
        </Route>

        <Route path="/config/season" element={
          <PrivateContentComponent>
            <Season />
          </PrivateContentComponent>}>
        </Route>

        <Route path="/config/board" element={
          <PrivateContentComponent>
            <Board />
          </PrivateContentComponent>}>
        </Route>

        <Route path="/config/skin" element={
          <PrivateContentComponent>
            <Skin />
          </PrivateContentComponent>}>
        </Route>

        <Route path="*" element={<Navigate to={verifyWhatPathChoice()} replace />} />

      </Routes>

    </BrowserRouter>
  );
}

export default NavigationRoutes;