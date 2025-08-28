import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
  kyc_status: string;
}

export function UserManagementDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, first_name, last_name, role, kyc_status')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string, userName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`${userName} has been promoted to admin`);
      
      // Refresh the users list
      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, role: 'admin' }
          : user
      ));
    } catch (error) {
      toast.error('Failed to promote user to admin');
      console.error('Error promoting user:', error);
    }
  };

  const demoteFromAdmin = async (userId: string, userName: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`${userName} has been demoted to user`);
      
      // Refresh the users list
      setUsers(users.map(user => 
        user.user_id === userId 
          ? { ...user, role: 'user' }
          : user
      ));
    } catch (error) {
      toast.error('Failed to demote user');
      console.error('Error demoting user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="btn-primary"
          onClick={fetchUsers}
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
            />
          </div>
          
          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-2">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role === 'admin' ? (
                          <><Crown className="w-3 h-3 mr-1" /> Admin</>
                        ) : (
                          <><Shield className="w-3 h-3 mr-1" /> User</>
                        )}
                      </Badge>
                      <Badge variant="outline">{user.kyc_status}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {user.role === 'admin' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => demoteFromAdmin(user.user_id, `${user.first_name} ${user.last_name}`)}
                      >
                        Demote
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => promoteToAdmin(user.user_id, `${user.first_name} ${user.last_name}`)}
                      >
                        Promote to Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}