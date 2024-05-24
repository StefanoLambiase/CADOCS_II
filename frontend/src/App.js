// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import AppShell from "./AppShell";

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
            <Route path="/culture_inspector" element={<AppShell> <CountrySelector/></AppShell> }/>
            <Route path="/chatbot" element={<AppShell> <ChatbotPage/> </AppShell>}/>
        </Routes>
    )
}


const App = () => {
  return (
    <div className="sfondoPagina contenitorePaginaHomePage">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
