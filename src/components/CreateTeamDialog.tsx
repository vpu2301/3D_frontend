
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X } from 'lucide-react';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamCreated: (team: any) => void;
}

const CreateTeamDialog = ({ open, onOpenChange, onTeamCreated }: CreateTeamDialogProps) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [leader, setLeader] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

  const handleInviteMember = () => {
    if (memberEmail && !invitedMembers.includes(memberEmail)) {
      setInvitedMembers([...invitedMembers, memberEmail]);
      setMemberEmail('');
    }
  };

  const removeMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter(member => member !== email));
  };

  const handleCreateTeam = () => {
    if (!teamName || !leader) return;

    const newTeam = {
      id: Date.now(),
      name: teamName,
      description,
      leader,
      members: invitedMembers.length + 1, // +1 for leader
      aiEmployees: 0,
      invitedMembers,
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-100 to-indigo-100'
    };

    onTeamCreated(newTeam);
    
    // Reset form
    setTeamName('');
    setDescription('');
    setLeader('');
    setInvitedMembers([]);
    setMemberEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Create New Team</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief team description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leader">Team Leader *</Label>
            <Input
              id="leader"
              placeholder="Team leader name"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Invite Members</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteMember()}
              />
              <Button onClick={handleInviteMember} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {invitedMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Invited Members</Label>
              <div className="flex flex-wrap gap-2">
                {invitedMembers.map((email) => (
                  <Badge key={email} variant="secondary" className="pr-1">
                    {email}
                    <button
                      onClick={() => removeMember(email)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!teamName || !leader}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Create Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
