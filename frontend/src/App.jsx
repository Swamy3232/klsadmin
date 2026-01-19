import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AddCustomer from "./pages/new";
// import Create from "./pages/updated";
import CreatePayment from "./pages/updated";
import GoldUsersSummary from "./pages/allcustomer";
import UpdateCustomer from "./pages/updated";
import LoginPage from "./pages/login";
import AdminNavbar from "./components/nav";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentForm from "./pages/payment";
import Payments from "./pages/updateamount";
// import UpdateRate from "./pages/updaterate";
import MetalRates from "./pages/updaterate";
import KLSGoldAdmin from "./pages/adgold";
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
              <GoldUsersSummary />
            </ProtectedRoute>
          }
        />
        <Route
           path="/update-rates"
            element={
              <ProtectedRoute>
                <AdminNavbar />
                <MetalRates />
              </ProtectedRoute>
            }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <PaymentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-payments"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-collection"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <KLSGoldAdmin />
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
