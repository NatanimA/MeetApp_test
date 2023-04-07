import VideoCallWrapper from './components/pages/VideoCallWrapper';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Waiting from './components/pages/Waiting';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<VideoCallWrapper />} />
          <Route exact path="/waiting" element={<Waiting />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
