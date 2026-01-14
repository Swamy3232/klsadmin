// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddCustomer from "./pages/new";
import AdminNavbar from "./components/nav";
import UpdateCustomer from "./pages/updated";
import AllCustomers from "./pages/allcustomer";

function App() {
  return (
    <Router>
      {/* Only Admin Navbar */}
      <AdminNavbar />

      <Routes>
        <Route path="/add-member" element={<AddCustomer />} />
        <Route path="/approve-members" element={<UpdateCustomer />} />
        <Route path="/all-chitti" element={<AllCustomers />} />
      </Routes>
    </Router>
  );
}

export default App;
