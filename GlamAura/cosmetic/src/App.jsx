import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";

import Shop from "./Pages/Shop";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Payment from "./Pages/Payment";
import PaymentMethod from "./Pages/PaymentMethod";
import ProductDetails from "./Pages/ProductDetails";
import Success from "./pages/Success";
import ConfirmOrder from "./Pages/ConfirmOrder";   // ✅ ADD THIS
import OTPVerification from "./Pages/OTPVerification";
import Adminlogin from "./components/Adminlogin";
import AdminDashboard from "./components/Admindashboard";
import Adminusers from "./components/Adminusers";
import Adminproducts from "./components/Adminproducts";
import Adminorders from "./components/Adminorders";

import ProtectedAdminRoute from "./components/Adminprotected";
import AdminSidebar from "./components/AdminSidebar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER ROUTES */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Shop />} />
          <Route path="/category/:category" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* ✅ NEW FLOW */}
          <Route path="/confirm-order" element={<ConfirmOrder />} />   {/* 🔥 ADD */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/success" element={<Success />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Adminlogin />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminSidebar />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Adminusers />} />
          <Route path="products" element={<Adminproducts />} />
          <Route path="orders" element={<Adminorders />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;