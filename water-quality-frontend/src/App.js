mport { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import OfficialDashboard from './pages/OfficialDashboard';
import StatsPage from './pages/StatsPage';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<MapPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<OfficialDashboard />} />
        <Route path='/stats' element={<StatsPage />} />
      </Routes>
      <ToastContainer position='top-right' />
    </BrowserRouter>
  );
}
export default App;
