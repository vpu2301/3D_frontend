
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5ede3] via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Fine-Tuning</h1>
                  <p className="text-gray-600">Train your AI employees with custom data and knowledge</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Brain className="h-3 w-3 mr-1" />
                    Custom Training
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="training" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="training">Training Data</TabsTrigger>
                  <TabsTrigger value="pages">Knowledge Pages</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="training">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Bot className="h-5 w-5" />
                          <span>Select AI Employee</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an AI employee to fine-tune" />
                          </SelectTrigger>
                          <SelectContent>
                            {aiEmployees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{employee.name}</span>
                                  <span className="text-gray-500">({employee.role})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div>
                          <Label>Training Category</Label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
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
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-black/50 mb-2" />
                            <p className="text-gray-600">Drag and drop files or click to browse</p>
                            <p className="text-sm text-black/50 mt-1">Supports PDF, TXT, CSV, DOCX</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Database className="h-5 w-5" />
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
                              className="min-h-[200px]"
                            />
                          </div>
                          
                          <Button 
                            onClick={handleFineTune}
                            className="w-full bg-purple-600 hover:bg-purple-700"
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>Knowledge Pages</span>
                        </div>
                        <Button onClick={addPage} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Page
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {pages.map((page, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Page {index + 1}</h4>
                              {pages.length > 1 && (
                                <Button
                                  onClick={() => removePage(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
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
                                />
                              </div>
                              
                              <div>
                                <Label>Category</Label>
                                <Select 
                                  value={page.category} 
                                  onValueChange={(value) => updatePage(index, 'category', value)}
                                >
                                  <SelectTrigger>
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
                                className="min-h-[120px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categories">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
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
                          />
                          <Button onClick={addCategory}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {categories.map((category) => (
                            <Badge key={category} variant="outline" className="p-2 text-center">
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
