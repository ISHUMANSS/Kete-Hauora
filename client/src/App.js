
import './App.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


//import SearchAll from './components/searchall';
import HomePage from './components/homepage/Homepage.jsx';
import AboutPage from './components/about/About.jsx';
import LoginPage from './components/login/Login.jsx';

//<SearchAll/>

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
