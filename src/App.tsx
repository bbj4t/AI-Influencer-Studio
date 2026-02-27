import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateInfluencer } from './pages/CreateInfluencer';
import { InfluencerDetail } from './pages/InfluencerDetail';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateInfluencer />} />
            <Route path="influencer/:id" element={<InfluencerDetail />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}
