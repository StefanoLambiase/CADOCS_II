// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import AppShell from "./AppShell";
import Menu from "./components/menu";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  redirect
} from "react-router-dom";
import CountrySelector from './pages/CountrySelector';
import ChatbotPage from './pages/ChatbotPage';
import menu from "./components/menu";

const AppRoutes = () =>{
    return (
        <Routes>
            <Route path="/" element={<AppShell> <Menu/> <CountrySelector/> </AppShell> }/>
            <Route path="/chatbot" element={<AppShell> <Menu/><ChatbotPage/> </AppShell>}/>
        </Routes>
    )
}


const App = () => {
  return (
    <div className="contenitorePaginaHomePage">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>

    </div>
  );
};

export default App;
