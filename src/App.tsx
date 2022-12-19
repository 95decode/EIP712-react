import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connect from "pages/Connect";
import Buy from "pages/Buy";
import Sell from "pages/Sell";
import NotFound from "pages/NotFound";
import './App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Connect />} />
                    <Route path="/buy" element={<Buy />} />
                    <Route path="/sell" element={<Sell />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;