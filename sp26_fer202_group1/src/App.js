import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import NavigationBar from "./components/Header";
import SearchBar from "./components/SearchBar";
import AddShoe from "./pages/AddShoe";
import Contact from "./pages/Contact";
import EditShoe from "./pages/EditShoe";
import ProductList from "./pages/ProductList";
import ShoeDetail from "./pages/ShoeDetail";
import OrderForm from "./pages/OrderForm";
import OrderSuccess from "./pages/OrderSuccess";
import OrderList from "./pages/OrderList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import MyMessages from "./pages/MyMessages";
import AdminContacts from "./pages/AdminContacts";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavigationBar />
          <div style={{ paddingTop: "80px", minHeight: "calc(100vh - 160px)" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shoe-detail/:id" element={<ShoeDetail />} />
              <Route path="/order/:id" element={<OrderForm />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/orders" element={<OrderList />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-messages"
                element={
                  <PrivateRoute>
                    <MyMessages />
                  </PrivateRoute>
                }
              />{" "}
              {/* Thêm route */}
              {/* Admin Protected Routes */}
              <Route
                path="/product-list"
                element={
                  <PrivateRoute adminOnly>
                    <ProductList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-shoe"
                element={
                  <PrivateRoute adminOnly>
                    <AddShoe />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-shoe/:id"
                element={
                  <PrivateRoute adminOnly>
                    <EditShoe />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-contacts"
                element={
                  <PrivateRoute adminOnly>
                    <AdminContacts />
                  </PrivateRoute>
                }
              />{" "}
              {/* Thêm route */}
            </Routes>
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
