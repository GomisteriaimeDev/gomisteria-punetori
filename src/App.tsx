import React from "react";

import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectIfAuthenticated from "./utils/RedirectIfAuth";
import Statistics from "./pages/Statistics/Statistics";
import Sales from "./pages/Sales/Sales";
import Services from "./pages/Services/Services";
import SalesDetails from "./pages/Sales/Details/SalesDetails";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

        {/* <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <IntroPage />
            </RedirectIfAuthenticated>
          }
        /> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/:id" element={<SalesDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
