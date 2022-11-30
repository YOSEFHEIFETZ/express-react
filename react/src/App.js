import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Info from './componets/Info';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Info />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
