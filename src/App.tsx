
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
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/start-free-trial" element={<StartFreeTrial />} />
              <Route path="/watch-demo" element={<WatchDemo />} />
              <Route path="/schedule-demo" element={<ScheduleDemo />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/job/:id" element={<JobDetail />} />
              
              {/* Resources routes */}
              <Route path="/resources/blog" element={<Blog />} />
              
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
              <Route path="/solutions/sales" element={<Sales />} />
              <Route path="/solutions/marketing" element={<Marketing />} />
              <Route path="/solutions/operations" element={<Operations />} />
              <Route path="/solutions/hr" element={<Hr />} />
              <Route path="/solutions/finance" element={<Finance />} />
              <Route path="/solutions/support" element={<Support />} />
              <Route path="/solutions/it" element={<It />} />
              <Route path="/solutions/legal" element={<Legal />} />
              
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
