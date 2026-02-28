import "./App.css";
import Navbar from "./component/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Homepage from "./pages/Homepage/Homepage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar></Navbar>
              <Homepage></Homepage>
            </>
          }
        ></Route>
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar></Navbar>
              <Dashboard></Dashboard>
            </>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
