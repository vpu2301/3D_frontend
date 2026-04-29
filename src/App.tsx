import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import AIEmployees from './pages/AIEmployees';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import AIAgents from './pages/AIAgents';
import Staff from './pages/Staff';
import CreateAIWorker from './pages/CreateAIWorker';
import Workflows from './pages/Workflows';
import CreateWorkflow from './pages/CreateWorkflow';
import IntegrationsPage from './pages/IntegrationsPage';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Help from './pages/Help';
import Profile from './pages/Profile';
import AssistantProfile from './pages/AssistantProfile';
import AssistantConfiguration from './pages/AssistantConfiguration';
import Tasks from './pages/Tasks';
import DevPlayground from './pages/dev/Playground';
import DevAPI from './pages/dev/Api';
import DevDocs from './pages/dev/Docs';
import Demos from './pages/Demos';
import AIFineTuning from './pages/AIFineTuning';
import HumanEmployeeCard from './pages/HumanEmployeeCard';
import AIAgentsPage from './pages/AIAgentsPage';
import GetStarted from './pages/GetStarted';
import StartFreeTrial from './pages/StartFreeTrial';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Company from './pages/Company';
import Careers from './pages/Careers';
import HowItWorks from './pages/HowItWorks';
import WatchDemo from './pages/WatchDemo';
import ScheduleDemo from './pages/ScheduleDemo';
import ChannelsPage from './pages/ChannelsPage';
import SkillsHub from './pages/SkillsHub';

// Solution pages
import Sales from './pages/solutions/Sales';
import Marketing from './pages/solutions/Marketing';
import Operations from './pages/solutions/Operations';
import Hr from './pages/solutions/Hr';
import Finance from './pages/solutions/Finance';
import Support from './pages/solutions/Support';
import It from './pages/solutions/It';
import Legal from './pages/solutions/Legal';
import Aria from './pages/solutions/Aria';
import Atlas from './pages/solutions/Atlas';
import Felix from './pages/solutions/Felix';
import Sage from './pages/solutions/Sage';
import Maya from './pages/solutions/Maya';
import Nova from './pages/solutions/Nova';
import Emma from './pages/solutions/Emma';

// Product pages
import AIAssistants from './pages/product/AIAssistants';
import Agents from './pages/product/Agents';
import CrossCompanyCollaboration from './pages/product/CrossCompanyCollaboration';
import WorkflowBuilder from './pages/product/WorkflowBuilder';
import FineTuning from './pages/product/FineTuning';

// Platform pages
import Analytics from './pages/platform/Analytics';
import Integrations from './pages/platform/Integrations';
import Api from './pages/platform/Api';
import Security from './pages/platform/Security';
import AgenticCommunication from './pages/platform/AgenticCommunication';

// Use cases
import DocumentProcessing from './pages/use-cases/DocumentProcessing';
import DataEntry from './pages/use-cases/DataEntry';
import CustomerOnboarding from './pages/use-cases/CustomerOnboarding';
import ComplianceMonitoring from './pages/use-cases/ComplianceMonitoring';
import ReportGeneration from './pages/use-cases/ReportGeneration';
import EmailManagement from './pages/use-cases/EmailManagement';

// Roles
import CEO from './pages/roles/CEO';
import OperationsManager from './pages/roles/OperationsManager';
import ITDirector from './pages/roles/ITDirector';
import FinanceTeams from './pages/roles/FinanceTeams';
import HRProfessionals from './pages/roles/HRProfessionals';
import SalesLeaders from './pages/roles/SalesLeaders';

// Customer pages
import CaseStudies from './pages/customers/CaseStudies';
import SuccessStories from './pages/customers/SuccessStories';
import Testimonials from './pages/customers/Testimonials';
import RoiCalculator from './pages/customers/RoiCalculator';

// Resources
import Blog from './pages/resources/Blog';
import ImplementationGuide from './pages/resources/ImplementationGuide';
import BestPractices from './pages/resources/BestPractices';
import Training from './pages/resources/Training';
import Community from './pages/resources/Community';

// Support
import HelpCenter from './pages/support/HelpCenter';
import Documentation from './pages/support/Documentation';
import ContactCenter from './pages/support/ContactCenter';
import SystemStatus from './pages/support/SystemStatus';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes with shared Header + Footer layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/company" element={<Company />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/watch-demo" element={<WatchDemo />} />
              <Route path="/schedule-demo" element={<ScheduleDemo />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/start-free-trial" element={<StartFreeTrial />} />
              <Route path="/skills-hub" element={<SkillsHub />} />

              {/* Solutions routes */}
              <Route path="/solutions/sales" element={<Sales />} />
              <Route path="/solutions/marketing" element={<Marketing />} />
              <Route path="/solutions/operations" element={<Operations />} />
              <Route path="/solutions/hr" element={<Hr />} />
              <Route path="/solutions/finance" element={<Finance />} />
              <Route path="/solutions/support" element={<Support />} />
              <Route path="/solutions/it" element={<It />} />
              <Route path="/solutions/legal" element={<Legal />} />
              <Route path="/solutions/aria" element={<Aria />} />
              <Route path="/solutions/atlas" element={<Atlas />} />
              <Route path="/solutions/felix" element={<Felix />} />
              <Route path="/solutions/sage" element={<Sage />} />
              <Route path="/solutions/maya" element={<Maya />} />
              <Route path="/solutions/nova" element={<Nova />} />
              <Route path="/solutions/emma" element={<Emma />} />

              {/* Product routes */}
              <Route path="/product/ai-assistants" element={<AIAssistants />} />
              <Route path="/product/agents" element={<Agents />} />
              <Route path="/product/cross-company-collaboration" element={<CrossCompanyCollaboration />} />
              <Route path="/product/workflow-builder" element={<WorkflowBuilder />} />
              <Route path="/product/fine-tuning" element={<FineTuning />} />

              {/* Platform routes */}
              <Route path="/platform/analytics" element={<Analytics />} />
              <Route path="/platform/integrations" element={<Integrations />} />
              <Route path="/platform/api" element={<Api />} />
              <Route path="/platform/security" element={<Security />} />
              <Route path="/platform/agentic-communication" element={<AgenticCommunication />} />

              {/* Use cases routes */}
              <Route path="/use-cases/document-processing" element={<DocumentProcessing />} />
              <Route path="/use-cases/data-entry" element={<DataEntry />} />
              <Route path="/use-cases/customer-onboarding" element={<CustomerOnboarding />} />
              <Route path="/use-cases/compliance-monitoring" element={<ComplianceMonitoring />} />
              <Route path="/use-cases/report-generation" element={<ReportGeneration />} />
              <Route path="/use-cases/email-management" element={<EmailManagement />} />

              {/* Roles routes */}
              <Route path="/roles/ceo" element={<CEO />} />
              <Route path="/roles/operations-manager" element={<OperationsManager />} />
              <Route path="/roles/it-director" element={<ITDirector />} />
              <Route path="/roles/finance-teams" element={<FinanceTeams />} />
              <Route path="/roles/hr-professionals" element={<HRProfessionals />} />
              <Route path="/roles/sales-leaders" element={<SalesLeaders />} />

              {/* Customer routes */}
              <Route path="/customers/case-studies" element={<CaseStudies />} />
              <Route path="/customers/success-stories" element={<SuccessStories />} />
              <Route path="/customers/testimonials" element={<Testimonials />} />
              <Route path="/customers/roi-calculator" element={<RoiCalculator />} />

              {/* Resources routes */}
              <Route path="/resources/blog" element={<Blog />} />
              <Route path="/resources/implementation-guide" element={<ImplementationGuide />} />
              <Route path="/resources/best-practices" element={<BestPractices />} />
              <Route path="/resources/training" element={<Training />} />
              <Route path="/resources/community" element={<Community />} />

              {/* Support routes */}
              <Route path="/support/help-center" element={<HelpCenter />} />
              <Route path="/support/documentation" element={<Documentation />} />
              <Route path="/support/contact" element={<ContactCenter />} />
              <Route path="/support/status" element={<SystemStatus />} />
            </Route>

            {/* Login — no layout wrapper */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes — require authentication, use platform layout */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
            <Route path="/staff/create-ai-worker" element={<ProtectedRoute><CreateAIWorker /></ProtectedRoute>} />
            <Route path="/staff/human/:id" element={<ProtectedRoute><HumanEmployeeCard /></ProtectedRoute>} />
            <Route path="/ai-employees" element={<ProtectedRoute><AIEmployees /></ProtectedRoute>} />
            <Route path="/ai-assistants/:id" element={<ProtectedRoute><AssistantProfile /></ProtectedRoute>} />
            <Route path="/ai-assistants/:id/configure" element={<ProtectedRoute><AssistantConfiguration /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
            <Route path="/teams/:id" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
            <Route path="/ai-agents" element={<ProtectedRoute><AIAgents /></ProtectedRoute>} />
            <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
            <Route path="/workflows/create" element={<ProtectedRoute><CreateWorkflow /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
            <Route path="/channels" element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dev/playground" element={<ProtectedRoute><DevPlayground /></ProtectedRoute>} />
            <Route path="/dev/api" element={<ProtectedRoute><DevAPI /></ProtectedRoute>} />
            <Route path="/dev/docs" element={<ProtectedRoute><DevDocs /></ProtectedRoute>} />
            <Route path="/demos" element={<ProtectedRoute><Demos /></ProtectedRoute>} />
            <Route path="/ai-fine-tuning" element={<ProtectedRoute><AIFineTuning /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
