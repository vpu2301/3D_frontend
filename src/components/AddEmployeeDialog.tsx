
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Remote';
  avatar?: string;
  joinDate: string;
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded: (employee: Employee) => void;
}

const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Success', 'Design', 'Product'];
const statuses = ['Active', 'Inactive', 'On Leave', 'Remote'] as const;

const AddEmployeeDialog = ({ open, onOpenChange, onEmployeeAdded }: AddEmployeeDialogProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'Active' as Employee['status'],
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isValid = form.name.trim() && form.email.trim() && form.role.trim() && form.department;

  const handleSubmit = () => {
    if (!isValid) return;
    const newEmployee: Employee = {
      id: Date.now(),
      ...form,
      joinDate: new Date().toISOString().split('T')[0],
    };
    onEmployeeAdded(newEmployee);
    setForm({ name: '', email: '', phone: '', role: '', department: '', status: 'Active' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-green-600" />
            <span>Add Employee</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="emp-name">Full Name *</Label>
              <Input
                id="emp-name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-email">Email *</Label>
              <Input
                id="emp-email"
                type="email"
                placeholder="jane@company.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-phone">Phone</Label>
              <Input
                id="emp-phone"
                placeholder="+1 555-0100"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-role">Job Title *</Label>
              <Input
                id="emp-role"
                placeholder="Senior Engineer"
                value={form.role}
                onChange={e => handleChange('role', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={v => handleChange('department', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => handleChange('status', v as Employee['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
export type { Employee };
