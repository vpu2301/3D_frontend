
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import AIEmployees from './pages/AIEmployees';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import AIAgents from './pages/AIAgents';
import Workflows from './pages/Workflows';
import IntegrationsPage from './pages/IntegrationsPage';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Help from './pages/Help';
import AssistantProfile from './pages/AssistantProfile';
import AssistantConfiguration from './pages/AssistantConfiguration';
import Tasks from './pages/Tasks';
import DevPlayground from './pages/dev/Playground';
import DevAPI from './pages/dev/Api';
import DevDocs from './pages/dev/Docs';
import AIFineTuning from './pages/AIFineTuning';
import AIAgentsPage from './pages/AIAgentsPage';
import GetStarted from './pages/GetStarted';
import StartFreeTrial from './pages/StartFreeTrial';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

function App() {
  console.log('=== APP COMPONENT DEBUG ===');
  console.log('App: Rendering App component');
  console.log('App: Current pathname:', window.location.pathname);
  console.log('App: Current href:', window.location.href);
  console.log('App: Home component:', Home);
  console.log('App: Signup component:', Signup);
  console.log('App: Features component:', Features);
  console.log('App: About component:', About);
  console.log('=== END APP DEBUG ===');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={
            <>
              {console.log('Rendering Home component for /')}
              <Home />
            </>
          } />
          <Route path="/home" element={
            <>
              {console.log('Rendering Home component for /home')}
              <Home />
            </>
          } />
          <Route path="/features" element={
            <>
              {console.log('Rendering Features component')}
              <Features />
            </>
          } />
          <Route path="/about" element={
            <>
              {console.log('Rendering About component')}
              <About />
            </>
          } />
          <Route path="/login" element={
            <>
              {console.log('Rendering Login component')}
              <Login />
            </>
          } />
          <Route path="/signup" element={
            <>
              {console.log('Rendering Signup component')}
              <Signup />
            </>
          } />
          <Route path="/get-started" element={
            <>
              {console.log('Rendering GetStarted component')}
              <GetStarted />
            </>
          } />
          <Route path="/start-free-trial" element={
            <>
              {console.log('Rendering StartFreeTrial component')}
              <StartFreeTrial />
            </>
          } />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/ai-employees" element={<ProtectedRoute><AIEmployees /></ProtectedRoute>} />
          <Route path="/ai-assistants/:id" element={<ProtectedRoute><AssistantProfile /></ProtectedRoute>} />
          <Route path="/ai-assistants/:id/configure" element={<ProtectedRoute><AssistantConfiguration /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="/teams/:id" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
          <Route path="/ai-agents" element={<ProtectedRoute><AIAgents /></ProtectedRoute>} />
          <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
          <Route path="/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/dev/playground" element={<ProtectedRoute><DevPlayground /></ProtectedRoute>} />
          <Route path="/dev/api" element={<ProtectedRoute><DevAPI /></ProtectedRoute>} />
          <Route path="/dev/docs" element={<ProtectedRoute><DevDocs /></ProtectedRoute>} />
          <Route path="/ai-fine-tuning" element={<ProtectedRoute><AIFineTuning /></ProtectedRoute>} />
          
          {/* 404 catch-all route */}
          <Route path="*" element={
            <>
              {console.log('Rendering NotFound component for unknown route')}
              <NotFound />
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
