import {Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import Beholder from "./pages/beholder/Beholder";

function Router() {

    function PrivateRoute({ children }){
        const isAuth = localStorage.getItem("token") !== null;
        return isAuth ? children : <Navigate to="/" />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} /> 
                <Route path="/dashboard" element={
                 <PrivateRoute>
                    <Dashboard />
                 </PrivateRoute>
                } />
            
                <Route path="/orders" element={
                 <PrivateRoute>
                    <Orders />
                 </PrivateRoute>
                } />

                 <Route path="/beholder" element={
                 <PrivateRoute>
                    <Beholder />
                 </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;