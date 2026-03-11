import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Contact from "./pages/Contact";
import AdminContact from "./pages/AdminContact";
import AddShoe from "./pages/AddShoe";
import EditShoe from "./pages/EditShoe";

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/contacts" element={<AdminContact />} />

        <Route path="/add-shoe" element={<AddShoe />} />

        <Route path="/edit-shoe/:id" element={<EditShoe />} />

      </Routes>

    </Router>

  );
}

export default App;