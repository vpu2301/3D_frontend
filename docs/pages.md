# Pages

All pages live under `src/pages/`. They are plain React functional components imported directly in `src/App.tsx`.

## Marketing Pages (Public)

### Top-Level

| File | Route | Description |
|------|-------|-------------|
| `Home.tsx` | `/` | Landing page — hero, features, CTAs |
| `Login.tsx` | `/login` | Login form (localStorage-based auth) |
| `NotFound.tsx` | `*` | 404 fallback page |

### Solutions (`src/pages/solutions/`)

Department and named AI-agent landing pages.

| File | Route |
|------|-------|
| `Sales.tsx` | `/solutions/sales` |
| `Marketing.tsx` | `/solutions/marketing` |
| `Operations.tsx` | `/solutions/operations` |
| `Hr.tsx` | `/solutions/hr` |
| `Finance.tsx` | `/solutions/finance` |
| `Support.tsx` | `/solutions/support` |
| `It.tsx` | `/solutions/it` |
| `Legal.tsx` | `/solutions/legal` |
| `Aria.tsx` | `/solutions/aria` |
| `Atlas.tsx` | `/solutions/atlas` |
| `Felix.tsx` | `/solutions/felix` |
| `Maya.tsx` | `/solutions/maya` |
| `Nova.tsx` | `/solutions/nova` |
| `Emma.tsx` | `/solutions/emma` |
| `Sage.tsx` | `/solutions/sage` |

### Product (`src/pages/product/`)

Product feature deep-dives.

| File | Route |
|------|-------|
| `AIAssistants.tsx` | `/product/ai-assistants` |
| `Agents.tsx` | `/product/agents` |
| `CrossCompanyCollaboration.tsx` | `/product/cross-company-collaboration` |
| `WorkflowBuilder.tsx` | `/product/workflow-builder` |
| `FineTuning.tsx` | `/product/fine-tuning` |

### Platform (`src/pages/platform/`)

Technical platform capability pages.

| File | Route |
|------|-------|
| `Analytics.tsx` | `/platform/analytics` |
| `Integrations.tsx` | `/platform/integrations` |
| `Api.tsx` | `/platform/api` |
| `Security.tsx` | `/platform/security` |
| `AgenticCommunication.tsx` | `/platform/agentic-communication` |
| `Automation.tsx` | `/platform/automation` |
| `Tasks.tsx` | `/platform/tasks` |
| `Documents.tsx` | `/platform/documents` |
| `Flows.tsx` | `/platform/flows` |

### Use Cases (`src/pages/use-cases/`)

| File | Route |
|------|-------|
| `DocumentProcessing.tsx` | `/use-cases/document-processing` |
| `DataEntry.tsx` | `/use-cases/data-entry` |
| `Onboarding.tsx` | `/use-cases/onboarding` |
| `Compliance.tsx` | `/use-cases/compliance` |
| `Reporting.tsx` | `/use-cases/reporting` |
| `EmailManagement.tsx` | `/use-cases/email-management` |

### Roles (`src/pages/roles/`)

Pages targeted at specific buyer personas.

| File | Route |
|------|-------|
| `Ceo.tsx` | `/roles/ceo` |
| `OperationsManager.tsx` | `/roles/operations-manager` |
| `ItDirector.tsx` | `/roles/it-director` |
| `FinanceTeams.tsx` | `/roles/finance-teams` |
| `HrProfessionals.tsx` | `/roles/hr-professionals` |
| `SalesLeaders.tsx` | `/roles/sales-leaders` |

### Customers (`src/pages/customers/`)

| File | Route |
|------|-------|
| `CaseStudies.tsx` | `/customers/case-studies` |
| `SuccessStories.tsx` | `/customers/success-stories` |
| `Testimonials.tsx` | `/customers/testimonials` |
| `RoiCalculator.tsx` | `/customers/roi-calculator` |

### Resources (`src/pages/resources/`)

| File | Route |
|------|-------|
| `Blog.tsx` | `/resources/blog` |
| `ImplementationGuide.tsx` | `/resources/implementation-guide` |
| `BestPractices.tsx` | `/resources/best-practices` |
| `Training.tsx` | `/resources/training` |
| `Community.tsx` | `/resources/community` |

### Support (`src/pages/support/`)

| File | Route |
|------|-------|
| `HelpCenter.tsx` | `/support/help-center` |
| `Documentation.tsx` | `/support/documentation` |
| `Contact.tsx` | `/support/contact` |
| `SystemStatus.tsx` | `/support/system-status` |

### Developer (`src/pages/dev/`)

| File | Route |
|------|-------|
| `Playground.tsx` | `/dev/playground` |
| `Api.tsx` | `/dev/api` |
| `Docs.tsx` | `/dev/docs` |

---

## Dashboard Pages (Protected)

These pages require authentication and render inside the `AppSidebar` layout.

| File | Route | Description |
|------|-------|-------------|
| `Dashboard.tsx` | `/dashboard` | Main dashboard — KPIs, activity, agent overview |
| `Chat.tsx` | `/chat` | Real-time chat interface |
| `Tasks.tsx` | `/tasks` | Task management list |
| `Staff.tsx` | `/staff` | Employee/staff directory |
| `AIEmployees.tsx` | `/ai-employees` | AI employee roster and status |
| `AIAgents.tsx` | `/ai-agents` | Agent builder and management |
| `Teams.tsx` | `/teams` | Team directory |
| `Workflows.tsx` | `/workflows` | Workflow builder |
| `IntegrationsPage.tsx` | `/integrations` | Connected integrations management |
| `ChannelsPage.tsx` | `/channels` | Communication channels |
| `Settings.tsx` | `/settings` | User/org settings |
| `Billing.tsx` | `/billing` | Subscription and billing |
| `Help.tsx` | `/help` | In-app help |
| `Demos.tsx` | `/demos` | Product demos |
| `AIFineTuning.tsx` | `/ai-fine-tuning` | Model fine-tuning interface |
