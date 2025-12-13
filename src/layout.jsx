import React from "react";
import { Outlet,ScrollRestoration } from "react-router-dom";
import ScrollToHash from "./scrollToHash";
import Footer from './components/Footer'
import { AuthProvider } from "./contexts/AuthContext";


export default function Layout(){
   
    return(
            <>
            <AuthProvider>
            <ScrollRestoration/>
            <ScrollToHash/>
                <Outlet/>
                <Footer/>
                </AuthProvider>
                </>
            )
}