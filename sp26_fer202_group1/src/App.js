import AuthContext from "./context/AuthContext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Contact from "./pages/Contact";
import AdminContact from "./pages/AdminContact";

function App() {

  return (

    <AuthContext>
      <Router>
        <Routes>
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/contacts" element={<AdminContact />} />



        </Routes>
      </Router >
    </AuthContext >
  );
}

export default App;