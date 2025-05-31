import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Company from "./pages/Company";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StartFreeTrial from "./pages/StartFreeTrial";
import WatchDemo from "./pages/WatchDemo";
import Pricing from "./pages/Pricing";
import ScheduleDemo from "./pages/ScheduleDemo";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import Blog from "./pages/resources/Blog";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Platform pages
import Automation from "./pages/platform/Automation";
import Workflow from "./pages/platform/Workflow";
import Analytics from "./pages/platform/Analytics";
import Integrations from "./pages/platform/Integrations";
import Documents from "./pages/platform/Documents";
import Tasks from "./pages/platform/Tasks";
import Api from "./pages/platform/Api";
import Security from "./pages/platform/Security";

// Solutions pages
import Sales from "./pages/solutions/Sales";
import Marketing from "./pages/solutions/Marketing";
import Operations from "./pages/solutions/Operations";
import Hr from "./pages/solutions/Hr";
import Finance from "./pages/solutions/Finance";
import Support from "./pages/solutions/Support";
import It from "./pages/solutions/It";
import Legal from "./pages/solutions/Legal";

// AI Employee solution pages
import Aria from "./pages/solutions/Aria";
import Atlas from "./pages/solutions/Atlas";
import Felix from "./pages/solutions/Felix";
import Maya from "./pages/solutions/Maya";
import Sage from "./pages/solutions/Sage";
import Nova from "./pages/solutions/Nova";
import Emma from "./pages/solutions/Emma";

// Use Cases pages
import DocumentProcessing from "./pages/use-cases/DocumentProcessing";
import DataEntry from "./pages/use-cases/DataEntry";
import CustomerOnboarding from "./pages/use-cases/CustomerOnboarding";
import ComplianceMonitoring from "./pages/use-cases/ComplianceMonitoring";
import ReportGeneration from "./pages/use-cases/ReportGeneration";
import EmailManagement from "./pages/use-cases/EmailManagement";

// Roles pages
import CEO from "./pages/roles/CEO";
import OperationsManager from "./pages/roles/OperationsManager";
import ITDirector from "./pages/roles/ITDirector";
import FinanceTeams from "./pages/roles/FinanceTeams";
import HRProfessionals from "./pages/roles/HRProfessionals";
import SalesLeaders from "./pages/roles/SalesLeaders";

// Product pages
import AIAssistants from "./pages/product/AIAssistants";
import Agents from "./pages/product/Agents";
import WorkflowBuilder from "./pages/product/WorkflowBuilder";
import FineTuning from "./pages/product/FineTuning";

// Customer pages
import SuccessStories from "./pages/customers/SuccessStories";
import CaseStudies from "./pages/customers/CaseStudies";
import Testimonials from "./pages/customers/Testimonials";
import RoiCalculator from "./pages/customers/RoiCalculator";

// Resources pages
import ImplementationGuide from "./pages/resources/ImplementationGuide";
import BestPractices from "./pages/resources/BestPractices";
import Training from "./pages/resources/Training";
import Community from "./pages/resources/Community";

// Support pages
import HelpCenter from "./pages/support/HelpCenter";
import Documentation from "./pages/support/Documentation";
import ContactCenter from "./pages/support/ContactCenter";
import SystemStatus from "./pages/support/SystemStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/company" element={<Company />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/start-free-trial" element={<StartFreeTrial />} />
              <Route path="/watch-demo" element={<WatchDemo />} />
              <Route path="/schedule-demo" element={<ScheduleDemo />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/job/:id" element={<JobDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              
              {/* Resources routes */}
              <Route path="/resources" element={<Training />} />
              <Route path="/resources/blog" element={<Blog />} />
              <Route path="/resources/implementation-guide" element={<ImplementationGuide />} />
              <Route path="/resources/best-practices" element={<BestPractices />} />
              <Route path="/resources/training" element={<Training />} />
              <Route path="/resources/community" element={<Community />} />
              
              {/* Platform routes */}
              <Route path="/platform/automation" element={<Automation />} />
              <Route path="/platform/workflow" element={<Workflow />} />
              <Route path="/platform/analytics" element={<Analytics />} />
              <Route path="/platform/integrations" element={<Integrations />} />
              <Route path="/platform/documents" element={<Documents />} />
              <Route path="/platform/tasks" element={<Tasks />} />
              <Route path="/platform/api" element={<Api />} />
              <Route path="/platform/security" element={<Security />} />
              
              {/* Solutions routes */}
              <Route path="/solutions" element={<Sales />} />
              <Route path="/solutions/sales" element={<Sales />} />
              <Route path="/solutions/marketing" element={<Marketing />} />
              <Route path="/solutions/operations" element={<Operations />} />
              <Route path="/solutions/hr" element={<Hr />} />
              <Route path="/solutions/finance" element={<Finance />} />
              <Route path="/solutions/support" element={<Support />} />
              <Route path="/solutions/it" element={<It />} />
              <Route path="/solutions/legal" element={<Legal />} />
              
              {/* AI Employee solution routes */}
              <Route path="/solutions/aria" element={<Aria />} />
              <Route path="/solutions/atlas" element={<Atlas />} />
              <Route path="/solutions/felix" element={<Felix />} />
              <Route path="/solutions/maya" element={<Maya />} />
              <Route path="/solutions/sage" element={<Sage />} />
              <Route path="/solutions/nova" element={<Nova />} />
              <Route path="/solutions/emma" element={<Emma />} />
              
              {/* Use Cases routes */}
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
              
              {/* Product routes */}
              <Route path="/product/ai-assistants" element={<AIAssistants />} />
              <Route path="/product/agents" element={<Agents />} />
              <Route path="/product/workflow-builder" element={<WorkflowBuilder />} />
              <Route path="/product/fine-tuning" element={<FineTuning />} />
              
              {/* Customer routes */}
              <Route path="/customers/success-stories" element={<SuccessStories />} />
              <Route path="/customers/case-studies" element={<CaseStudies />} />
              <Route path="/customers/testimonials" element={<Testimonials />} />
              <Route path="/customers/roi-calculator" element={<RoiCalculator />} />
              
              {/* Support routes */}
              <Route path="/support/help-center" element={<HelpCenter />} />
              <Route path="/support/documentation" element={<Documentation />} />
              <Route path="/support/contact" element={<ContactCenter />} />
              <Route path="/support/status" element={<SystemStatus />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
