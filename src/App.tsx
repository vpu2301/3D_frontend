
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import AIEmployees from './pages/AIEmployees';
import Teams from './pages/Teams';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/ai-employees" element={<AIEmployees />} />
          <Route path="/ai-assistants/:id" element={<AssistantProfile />} />
          <Route path="/ai-assistants/:id/configure" element={<AssistantConfiguration />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/ai-agents" element={<AIAgents />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/help" element={<Help />} />
          <Route path="/dev/playground" element={<DevPlayground />} />
          <Route path="/dev/api" element={<DevAPI />} />
          <Route path="/dev/docs" element={<DevDocs />} />
          <Route path="/ai-fine-tuning" element={<AIFineTuning />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
