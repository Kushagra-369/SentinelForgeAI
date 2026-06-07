import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./components/Home/Home";
import About from "./components/About/About";
import EmailScanner from "./components/EmailScanner/EmailScanner";
import UrlScanner from "./components/UrlScanner/UrlScanner";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route  path="/" element={<Home  />} />

        <Route
          path="/email-scanner"
          element={<EmailScanner />}
        />

        <Route
          path="/url-scanner"
          element={<UrlScanner />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/about"
          element={<About />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;