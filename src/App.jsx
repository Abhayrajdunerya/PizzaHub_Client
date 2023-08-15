import { useEffect } from "react"
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "./firebase";
import { currentUser } from './functions/auth';

import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Order from './pages/Order'
import Account from './pages/Account'
import Cart from './pages/Cart'
import ForgotPassword from './pages/auth/ForgotPassword'
import RegisterComplete from './pages/auth/RegisterComplete'
// import Test from './pages/Test'
import AdminDashboard from "./pages/admin/AdminDashboard";
import Pizza from "./pages/admin/Pizza";
import SubIngredient from "./pages/admin/SubIngredient";
import Ingredient from "./pages/admin/Ingredient";
import AddPizza from "./pages/admin/AddPizza";
import Checkout from "./pages/Checkout";

import AdminRoute from './components/routes/AdminRoute'
import UserRoute from './components/routes/UserRoute'
import AddStock from "./pages/admin/AddStock";

const App = () => {

  const dispatch = useDispatch();

  useEffect (() => {

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
        })
        .catch(err => console.log(err))
      }
    });

    return () => unsubscribe();

  }, []);


  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* General Routes */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/register/complete" element={<RegisterComplete />} />
        <Route exact path="/forgot/password" element={<ForgotPassword />} />
        <Route exact path="/cart" element={<Cart />} />

        {/* User Routes */}
        <Route exact path="/user/orders" element={<UserRoute> <Order /> </UserRoute>} />
        <Route exact path="/checkout" element={<UserRoute> <Checkout /> </UserRoute>} />
        <Route exact path="/account" element={<UserRoute> <Account /> </UserRoute>} />

        {/* Admin Routes */}
        <Route exact path="/admin/dashboard" element={<AdminRoute> <AdminDashboard /> </AdminRoute>} />
        <Route exact path="/admin/pizza" element={<AdminRoute> <Pizza /> </AdminRoute>} />
        <Route exact path="/admin/ingredient" element={<AdminRoute> <Ingredient /> </AdminRoute>} />
        <Route exact path="/admin/sub-ingredient" element={<AdminRoute> <SubIngredient /> </AdminRoute>} />
        <Route exact path="/admin/add-pizza" element={<AdminRoute> <AddPizza /> </AdminRoute>} />
        <Route exact path="/admin/add-stock" element={<AdminRoute> <AddStock /> </AdminRoute>} />

        {/* Test Routes */}
        {/* <Route exact path="/test" element={<Test />} /> */}

      </Routes>
      <Footer />
    </>
    
  )
}

export default App