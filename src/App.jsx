import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Generala from './pages/Generala';
import TenThousand from './pages/TenThousand';
import Truco from './pages/Truco';
import Rules from './pages/Rules';
import ReloadPrompt from './components/ReloadPrompt';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="generala" element={<Generala />} />
                    <Route path="10000" element={<TenThousand />} />
                    <Route path="truco" element={<Truco />} />
                    <Route path="rules" element={<Rules />} />
                </Route>
            </Routes>
            <ReloadPrompt />
        </BrowserRouter >
    );
}

export default App;
