
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Upload, Database, Settings, Bot, FileText, Plus, Trash2 } from 'lucide-react';

/* Shared presentation classes (platform design system). */
const PANEL = '!rounded-[14px] !border !border-[color:var(--line-soft)] !bg-white !shadow-none';
const FIELD = '!rounded-[10px] !bg-white !border-[color:var(--line)]';
const TAB =
  '!rounded-full !border !border-[color:var(--line)] !px-4 !py-1.5 !text-xs !text-[color:var(--text-2)] data-[state=active]:!border-[color:var(--ink)] data-[state=active]:!bg-[color:var(--ink)] data-[state=active]:!text-white data-[state=active]:!shadow-none';

const AIFineTuning = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [trainingData, setTrainingData] = useState('');
  const [categories, setCategories] = useState(['General', 'Customer Service', 'Sales', 'Technical']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [pages, setPages] = useState([{ title: '', content: '', category: '' }]);

  const aiEmployees = [
    { id: 'aria', name: 'Aria', role: 'Executive Assistant', status: 'Active' },
    { id: 'atlas', name: 'Atlas', role: 'Customer Support', status: 'Active' },
    { id: 'felix', name: 'Felix', role: 'Finance Analyst', status: 'Active' },
    { id: 'maya', name: 'Maya', role: 'Marketing Specialist', status: 'Active' },
    { id: 'sage', name: 'Sage', role: 'Research Analyst', status: 'Active' },
    { id: 'nova', name: 'Nova', role: 'HR Specialist', status: 'Active' },
    { id: 'emma', name: 'Emma', role: 'Sales Specialist', status: 'Active' }
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const addPage = () => {
    setPages([...pages, { title: '', content: '', category: '' }]);
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const updatePage = (index: number, field: string, value: string) => {
    const updatedPages = [...pages];
    updatedPages[index] = { ...updatedPages[index], [field]: value };
    setPages(updatedPages);
  };

  const handleFineTune = () => {
    // Here you would implement the fine-tuning logic
    console.log('Fine-tuning with:', {
      employee: selectedEmployee,
      trainingData,
      category: selectedCategory,
      pages: pages.filter(p => p.title && p.content)
    });
  };

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="plat-crumb">3days.fine-tuning</p>
                  <h1 className="mt-1 text-3xl">AI Fine-Tuning</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Train your AI employees with custom data and knowledge</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="plat-pill plat-pill-mute !border-transparent">
                    <Brain className="h-3 w-3 mr-1" />
                    Custom Training
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="training" className="space-y-6">
                <TabsList className="!h-auto !gap-2 !rounded-full !bg-transparent !p-0">
                  <TabsTrigger value="training" className={TAB}>Training Data</TabsTrigger>
                  <TabsTrigger value="pages" className={TAB}>Knowledge Pages</TabsTrigger>
                  <TabsTrigger value="categories" className={TAB}>Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="training">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className={PANEL}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 !text-base">
                          <Bot className="h-5 w-5" style={{ color: 'var(--text-4)' }} strokeWidth={1.75} />
                          <span>Select AI Employee</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger className={FIELD}>
                            <SelectValue placeholder="Choose an AI employee to fine-tune" />
                          </SelectTrigger>
                          <SelectContent>
                            {aiEmployees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{employee.name}</span>
                                  <span style={{ color: 'var(--text-4)' }}>({employee.role})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div>
                          <Label>Training Category</Label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className={FIELD}>
                              <SelectValue placeholder="Select training category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Upload Training Files</Label>
                          <div
                            className="border border-dashed rounded-[12px] p-6 text-center"
                            style={{ borderColor: 'var(--line)', background: 'var(--sand)' }}
                          >
                            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-5)' }} strokeWidth={1.5} />
                            <p className="text-sm" style={{ color: 'var(--text-3)' }}>Drag and drop files or click to browse</p>
                            <p className="mt-1 text-xs" style={{ color: 'var(--text-5)' }}>Supports PDF, TXT, CSV, DOCX</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={PANEL}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 !text-base">
                          <Database className="h-5 w-5" style={{ color: 'var(--text-4)' }} strokeWidth={1.75} />
                          <span>Training Data</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label>Custom Training Data</Label>
                            <Textarea
                              placeholder="Enter custom training data, examples, or instructions..."
                              value={trainingData}
                              onChange={(e) => setTrainingData(e.target.value)}
                              className="min-h-[200px] !rounded-[10px] !bg-white !border-[color:var(--line)]"
                            />
                          </div>

                          <Button
                            onClick={handleFineTune}
                            className="plat-btn w-full !justify-center"
                            disabled={!selectedEmployee || (!trainingData && pages.every(p => !p.title || !p.content))}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            Start Fine-Tuning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pages">
                  <Card className={PANEL}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between !text-base">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" style={{ color: 'var(--text-4)' }} strokeWidth={1.75} />
                          <span>Knowledge Pages</span>
                        </div>
                        <Button onClick={addPage} size="sm" className="plat-btn !h-8 !px-4 !text-xs">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Page
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {pages.map((page, index) => (
                          <div key={index} className="rounded-[12px] p-4 space-y-4" style={{ border: '1px solid var(--line-soft)' }}>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Page {index + 1}</h4>
                              {pages.length > 1 && (
                                <Button
                                  onClick={() => removePage(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="!rounded-[10px] !text-[color:var(--bad-fg)] hover:!text-[color:var(--bad-fg)]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Page Title</Label>
                                <Input
                                  placeholder="Enter page title"
                                  value={page.title}
                                  onChange={(e) => updatePage(index, 'title', e.target.value)}
                                  className={FIELD}
                                />
                              </div>

                              <div>
                                <Label>Category</Label>
                                <Select
                                  value={page.category}
                                  onValueChange={(value) => updatePage(index, 'category', value)}
                                >
                                  <SelectTrigger className={FIELD}>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label>Content</Label>
                              <Textarea
                                placeholder="Enter page content and knowledge..."
                                value={page.content}
                                onChange={(e) => updatePage(index, 'content', e.target.value)}
                                className="min-h-[120px] !rounded-[10px] !bg-white !border-[color:var(--line)]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categories">
                  <Card className={PANEL}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 !text-base">
                        <Settings className="h-5 w-5" style={{ color: 'var(--text-4)' }} strokeWidth={1.75} />
                        <span>Manage Categories</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter new category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className={FIELD}
                          />
                          <Button onClick={addCategory} className="plat-btn !shrink-0">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {categories.map((category) => (
                            <Badge
                              key={category}
                              variant="outline"
                              className="p-2 justify-center text-center !rounded-[10px] !border-[color:var(--line)] !bg-white !font-medium !text-[color:var(--text-2)]"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AIFineTuning;
