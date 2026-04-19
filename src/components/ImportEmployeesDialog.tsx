
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload, Check, ChevronRight, ChevronLeft, X, FileSpreadsheet,
  Link, RefreshCw, AlertCircle, CheckCircle2, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee } from './AddEmployeeDialog';

/* ──────────────────────────────────────────────
   Source definitions
────────────────────────────────────────────── */
interface Source {
  id: string;
  name: string;
  description: string;
  category: 'hr' | 'crm' | 'communication' | 'file' | 'directory';
  color: string;
  abbrev: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const SOURCES: Source[] = [
  { id: 'csv',        name: 'CSV / Excel',         description: 'Upload a spreadsheet file',                category: 'file',          color: 'bg-emerald-100 text-emerald-700', abbrev: 'CSV',  popular: true },
  { id: 'slack',      name: 'Slack',                description: 'Sync workspace members',                  category: 'communication', color: 'bg-purple-100 text-purple-700',   abbrev: 'SL',   popular: true },
  { id: 'google',     name: 'Google Workspace',     description: 'Import from Google Directory',            category: 'directory',     color: 'bg-blue-100 text-blue-700',       abbrev: 'GW',   popular: true },
  { id: 'microsoft',  name: 'Microsoft 365',        description: 'Sync from Azure Active Directory',        category: 'directory',     color: 'bg-sky-100 text-sky-700',         abbrev: 'M365' },
  { id: 'hubspot',    name: 'HubSpot CRM',          description: 'Import contacts & employees',             category: 'crm',           color: 'bg-orange-100 text-orange-700',   abbrev: 'HS' },
  { id: 'salesforce', name: 'Salesforce',           description: 'Import from Salesforce org',              category: 'crm',           color: 'bg-sky-100 text-sky-700',         abbrev: 'SF' },
  { id: 'bamboohr',   name: 'BambooHR',             description: 'Sync employees from BambooHR',            category: 'hr',            color: 'bg-green-100 text-green-700',     abbrev: 'BHR' },
  { id: 'datev',      name: 'DATEV',                description: 'Import from DATEV HR & payroll',          category: 'hr',            color: 'bg-red-100 text-red-700',         abbrev: 'DTV' },
  { id: 'personio',   name: 'Personio',             description: 'Sync HR data from Personio',              category: 'hr',            color: 'bg-violet-100 text-violet-700',   abbrev: 'PSN' },
  { id: 'workday',    name: 'Workday',              description: 'Enterprise HR integration',               category: 'hr',            color: 'bg-amber-100 text-amber-700',     abbrev: 'WD',  comingSoon: true },
  { id: 'sap',        name: 'SAP SuccessFactors',   description: 'Enterprise HCM integration',              category: 'hr',            color: 'bg-blue-100 text-blue-700',       abbrev: 'SAP', comingSoon: true },
  { id: 'linkedin',   name: 'LinkedIn Export',      description: 'Import from exported contacts',           category: 'file',          color: 'bg-blue-100 text-blue-700',       abbrev: 'LI' },
];

/* sample CSV columns → employee fields mapping */
const CSV_SAMPLE_COLUMNS = ['First Name', 'Last Name', 'Email Address', 'Phone', 'Job Title', 'Department', 'Employment Status'];
const EMPLOYEE_FIELDS = ['name', 'email', 'phone', 'role', 'department', 'status', '(skip)'];

/* sample preview employees (shown in step 4) */
const PREVIEW_EMPLOYEES: Partial<Employee>[] = [
  { name: 'Sarah Johnson',   email: 'sarah.j@company.com',   role: 'Sales Manager',       department: 'Sales',       status: 'Active',   phone: '+1 555-0101' },
  { name: 'Michael Chen',    email: 'm.chen@company.com',    role: 'Marketing Lead',      department: 'Marketing',   status: 'Active',   phone: '+1 555-0102' },
  { name: 'Emily Rodriguez', email: 'e.rodriguez@company.com', role: 'HR Specialist',     department: 'HR',          status: 'On Leave', phone: '+1 555-0103' },
  { name: 'David Kim',       email: 'd.kim@company.com',     role: 'DevOps Engineer',     department: 'Engineering', status: 'Active',   phone: '+1 555-0104' },
  { name: 'Priya Patel',     email: 'p.patel@company.com',   role: 'Finance Analyst',     department: 'Finance',     status: 'Active',   phone: '+1 555-0105' },
  { name: 'James Wilson',    email: 'j.wilson@company.com',  role: 'Customer Success Mgr',department: 'Customer Success', status: 'Remote', phone: '+1 555-0106' },
];

/* ──────────────────────────────────────────────
   Step components
────────────────────────────────────────────── */

/** Step 1: pick a source */
const SourcePicker = ({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) => {
  const categories = [
    { key: 'file',          label: 'File Upload' },
    { key: 'communication', label: 'Communication' },
    { key: 'directory',     label: 'Directory' },
    { key: 'hr',            label: 'HR Systems' },
    { key: 'crm',           label: 'CRM' },
  ];

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const sources = SOURCES.filter(s => s.category === cat.key);
        if (!sources.length) return null;
        return (
          <div key={cat.key}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{cat.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {sources.map(src => (
                <button
                  key={src.id}
                  disabled={src.comingSoon}
                  onClick={() => !src.comingSoon && onSelect(src.id)}
                  className={cn(
                    'relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-150',
                    src.comingSoon && 'opacity-50 cursor-not-allowed',
                    selected === src.id
                      ? 'border-gray-900 bg-gray-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  {src.popular && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Popular</span>
                  )}
                  {src.comingSoon && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Soon</span>
                  )}
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-2', src.color)}>
                    {src.abbrev}
                  </div>
                  <span className="text-xs font-medium text-gray-900 leading-tight">{src.name}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 leading-tight">{src.description}</span>
                  {selected === src.id && (
                    <CheckCircle2 className="absolute bottom-2 right-2 h-4 w-4 text-gray-900" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Step 2: configure / connect */
const ConfigureSource = ({ source, onFileSelect }: { source: Source | undefined; onFileSelect: (f: File) => void }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!source) return null;

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setConnected(true); }, 1800);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); onFileSelect(dropped); }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) { setFile(picked); onFileSelect(picked); }
  };

  if (source.category === 'file') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0', source.color)}>
            {source.abbrev}
          </div>
          <div>
            <p className="text-sm font-medium">{source.name}</p>
            <p className="text-xs text-gray-500">{source.description}</p>
          </div>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
            dragging ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
            file && 'border-green-400 bg-green-50'
          )}
        >
          <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls,.vcf" className="hidden" onChange={handleFileInput} />
          {file ? (
            <>
              <FileSpreadsheet className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">{file.name}</p>
              <p className="text-xs text-green-600 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Drop your file here, or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Supports .csv, .xlsx, .xls, .vcf</p>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">Need a template?</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <Button variant="outline" size="sm" className="w-full text-xs">
          <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
          Download CSV template
        </Button>
      </div>
    );
  }

  /* OAuth-style connection for integrations */
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0', source.color)}>
          {source.abbrev}
        </div>
        <div>
          <p className="text-sm font-medium">{source.name}</p>
          <p className="text-xs text-gray-500">{source.description}</p>
        </div>
        {connected && <Badge className="ml-auto bg-green-100 text-green-700 border-0">Connected</Badge>}
      </div>

      {!connected ? (
        <div className="rounded-xl border border-gray-200 p-6 text-center space-y-4">
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold mx-auto', source.color)}>
            {source.abbrev}
          </div>
          <div>
            <p className="text-sm font-medium">Connect to {source.name}</p>
            <p className="text-xs text-gray-500 mt-1">You'll be redirected to authorize access to your {source.name} account</p>
          </div>
          <Button
            onClick={handleConnect}
            disabled={connecting}
            className="bg-gray-900 text-white hover:bg-gray-800 w-full"
          >
            {connecting ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Connecting…</>
            ) : (
              <><Link className="h-4 w-4 mr-2" /> Connect {source.name}</>
            )}
          </Button>
          <p className="text-[10px] text-gray-400">Read-only access · Your data stays private</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-xs text-green-700 font-medium">Successfully connected to {source.name}</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-medium text-gray-700">Found in your account:</p>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total users / employees</span>
              <span className="text-sm font-semibold text-gray-900">6</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Available to import</span>
              <span className="text-sm font-semibold text-green-700">6</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Step 3: field mapping */
const FieldMapping = () => {
  const [mapping, setMapping] = useState<Record<string, string>>({
    'First Name':        'name',
    'Last Name':         '(skip)',
    'Email Address':     'email',
    'Phone':             'phone',
    'Job Title':         'role',
    'Department':        'department',
    'Employment Status': 'status',
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Map columns from your source to employee fields. Columns marked "(skip)" will be ignored.</p>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 gap-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">Source column</span>
          <span className="text-xs font-medium text-gray-500">Maps to</span>
        </div>
        {CSV_SAMPLE_COLUMNS.map(col => (
          <div key={col} className="grid grid-cols-2 items-center px-4 py-2.5 border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
            <span className="text-sm text-gray-700 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded w-fit">{col}</span>
            <select
              value={mapping[col] || '(skip)'}
              onChange={e => setMapping(prev => ({ ...prev, [col]: e.target.value }))}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              {EMPLOYEE_FIELDS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
        <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-700">Fields <strong>name</strong> and <strong>email</strong> are required for import</p>
      </div>
    </div>
  );
};

/** Step 4: preview & confirm */
const PreviewImport = ({ onImport, importing, progress }: { onImport: () => void; importing: boolean; progress: number }) => {
  const statusColor = (s?: string) => {
    if (s === 'Active') return 'bg-green-100 text-green-700';
    if (s === 'On Leave') return 'bg-amber-100 text-amber-700';
    if (s === 'Remote') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{PREVIEW_EMPLOYEES.length} employees ready to import</p>
        <Badge variant="outline" className="text-xs">{PREVIEW_EMPLOYEES.length} records</Badge>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden max-h-56 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">Name</th>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">Role</th>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">Department</th>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {PREVIEW_EMPLOYEES.map((emp, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-semibold text-gray-600 flex-shrink-0">
                      {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-gray-900">{emp.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-600">{emp.role}</td>
                <td className="px-3 py-2 text-gray-600">{emp.department}</td>
                <td className="px-3 py-2">
                  <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium', statusColor(emp.status))}>{emp.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {importing && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Importing employees…</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {!importing && (
        <Button
          onClick={onImport}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Users className="h-4 w-4 mr-2" />
          Import {PREVIEW_EMPLOYEES.length} Employees
        </Button>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Main dialog
────────────────────────────────────────────── */

interface ImportEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: (employees: Employee[]) => void;
}

const STEPS = ['Source', 'Connect', 'Map Fields', 'Preview'];

const ImportEmployeesDialog = ({ open, onOpenChange, onImported }: ImportEmployeesDialogProps) => {
  const [step, setStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const source = SOURCES.find(s => s.id === selectedSource);

  const canNext = () => {
    if (step === 0) return !!selectedSource;
    if (step === 1) return true; // file or connected (simplified)
    return true;
  };

  const handleImport = () => {
    setImporting(true);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setTimeout(() => {
          setImporting(false);
          setDone(true);
          const imported = PREVIEW_EMPLOYEES.map((e, i) => ({
            id: Date.now() + i,
            name: e.name ?? '',
            email: e.email ?? '',
            phone: e.phone ?? '',
            role: e.role ?? '',
            department: e.department ?? '',
            status: (e.status ?? 'Active') as Employee['status'],
            joinDate: new Date().toISOString().split('T')[0],
          }));
          onImported(imported);
        }, 400);
      }
      setProgress(p);
    }, 200);
  };

  const handleClose = () => {
    onOpenChange(false);
    // reset after close animation
    setTimeout(() => {
      setStep(0); setSelectedSource(null); setSelectedFile(null);
      setImporting(false); setProgress(0); setDone(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <span>Import Employees</span>
          </DialogTitle>
        </DialogHeader>

        {done ? (
          /* Success state */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{PREVIEW_EMPLOYEES.length} employees imported!</p>
              <p className="text-sm text-gray-500 mt-1">They've been added to your employee directory</p>
            </div>
            <Button onClick={handleClose} className="bg-gray-900 text-white hover:bg-gray-800">
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Step progress */}
            <div className="flex items-center space-x-1 mb-1">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                      i < step  ? 'bg-gray-900 text-white' :
                      i === step ? 'bg-gray-900 text-white ring-2 ring-gray-900/20' :
                                   'bg-gray-100 text-gray-400'
                    )}>
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={cn('text-[10px] mt-1 font-medium', i === step ? 'text-gray-900' : 'text-gray-400')}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('flex-1 h-px mx-1 mb-4', i < step ? 'bg-gray-900' : 'bg-gray-200')} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="mt-2">
              {step === 0 && (
                <SourcePicker selected={selectedSource} onSelect={id => { setSelectedSource(id); }} />
              )}
              {step === 1 && (
                <ConfigureSource source={source} onFileSelect={f => setSelectedFile(f)} />
              )}
              {step === 2 && <FieldMapping />}
              {step === 3 && (
                <PreviewImport onImport={handleImport} importing={importing} progress={progress} />
              )}
            </div>

            {/* Navigation */}
            {step < 3 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <Button
                  variant="outline"
                  onClick={() => step === 0 ? handleClose() : setStep(s => s - 1)}
                  disabled={importing}
                >
                  {step === 0 ? <><X className="h-4 w-4 mr-1.5" />Cancel</> : <><ChevronLeft className="h-4 w-4 mr-1.5" />Back</>}
                </Button>
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext() || importing}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  {step === 2 ? 'Preview import' : 'Continue'}
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            )}
            {step === 3 && !importing && (
              <div className="flex justify-start pt-4 border-t border-gray-100 mt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-1.5" />Back
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
