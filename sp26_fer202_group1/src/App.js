import AuthProvider from "./context/AuthContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Contact from "./pages/Contact";
import AdminContact from "./pages/AdminContact";
import Register from "./pages/Register";

function App() {

  return (

    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/contacts" element={<AdminContact />} />



        </Routes>
      </Router >
    </AuthProvider >
  );
}

export default App;