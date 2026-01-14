import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AddCustomer from "./pages/new";
import UpdateCustomer from "./pages/updated";
import AllCustomers from "./pages/allcustomer";
import LoginPage from "./pages/login";
import AdminNavbar from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/add-member"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <AddCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approve-members"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <UpdateCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-chitti"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <AllCustomers />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
