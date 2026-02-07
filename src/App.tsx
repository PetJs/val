import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { CreateInvitePage } from './pages/CreateInvitePage';
import { SharePage } from './pages/SharePage';
import { ValentinePage } from './pages/ValentinePage';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateInvitePage />} />
        <Route path="/share/:token" element={<SharePage />} />
        <Route path="/v/:token" element={<ValentinePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
