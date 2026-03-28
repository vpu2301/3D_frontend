
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAgentWizard from '@/components/dashboard/CreateAgentWizard';

const CreateAIWorker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); }
  }, [navigate]);

  const handleComplete = (agentConfig: any) => {
    const gradientOptions = [
      { iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
      { iconColor: 'text-emerald-600', bgColor: 'from-emerald-100 to-teal-100' },
      { iconColor: 'text-amber-600', bgColor: 'from-amber-100 to-yellow-100' },
      { iconColor: 'text-rose-600', bgColor: 'from-rose-100 to-pink-100' },
      { iconColor: 'text-cyan-600', bgColor: 'from-cyan-100 to-blue-100' },
    ];
    const avatarOptions = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face',
    ];
    const stored = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    const idx = stored.length;
    const colorScheme = gradientOptions[idx % gradientOptions.length];
    const newWorker = {
      id: `assistant-${Date.now()}`,
      name: agentConfig.name,
      department: agentConfig.autonomyLevel.replace('-', ' '),
      status: 'Active',
      tasks: Math.floor(Math.random() * 20) + 1,
      conversations: Math.floor(Math.random() * 100) + 1,
      type: agentConfig.autonomyLevel.replace('-', ' '),
      ...colorScheme,
      scope: 'team',
      avatar: avatarOptions[idx % avatarOptions.length],
      isAssistant: true,
    };
    localStorage.setItem('aiAssistants', JSON.stringify([...stored, newWorker]));
    navigate('/staff');
  };

  return (
    <CreateAgentWizard
      open={true}
      onClose={() => navigate('/staff')}
      onComplete={handleComplete}
    />
  );
};

export default CreateAIWorker;
