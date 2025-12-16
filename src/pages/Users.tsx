import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, Users as UsersIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { sanitizeError, logError } from "@/lib/error-utils";
import { nanoid } from "nanoid";
import { UserStatisticsCards } from "@/components/users/UserStatisticsCards";
import { UserSearchAndFilter } from "@/components/users/UserSearchAndFilter";
import { UserCard } from "@/components/users/UserCard";
import { UserDialog } from "@/components/users/UserDialog";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

const ITEMS_PER_PAGE = 9;

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserProfile["role"] | "all">("all");
  const [statistics, setStatistics] = useState({
    total: 0,
    students: 0,
    staff: 0,
    admin: 0,
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    role: "student" as UserProfile["role"],
    email: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);

      const stats = data.reduce((acc, user) => {
        acc.total++;
        acc[user.role + 's']++;
        return acc;
      }, { total: 0, students: 0, staff: 0, admin: 0 });

      setStatistics(stats);
    } catch (error) {
      logError('fetchUsers', error);
      toast({
        title: "Error",
        description: sanitizeError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use cryptographically secure random password
      const tempPassword = nanoid(24);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
          }
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          phone: formData.phone,
          role: formData.role
        })
        .eq('id', authData.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "User created successfully. A confirmation email has been sent.",
      });

      setIsCreateDialogOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        role: "student",
        email: ""
      });
      fetchUsers();
    } catch (error) {
      logError('handleCreateUser', error);
      toast({
        title: "Error",
        description: sanitizeError(error),
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          role: formData.role
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        role: "student",
        email: ""
      });
      fetchUsers();
    } catch (error) {
      logError('handleEditUser', error);
      toast({
        title: "Error",
        description: sanitizeError(error),
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openEditDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
      role: user.role,
      email: user.email
    });
    setIsEditDialogOpen(true);
  };

  const exportUsers = () => {
    const csvContent = [
      ["First Name", "Last Name", "Email", "Phone", "Role"],
      ...users.map(user => [
        user.first_name,
        user.last_name,
        user.email,
        user.phone || "",
        user.role
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Users</h1>
          <div className="flex gap-4">
            <Button onClick={exportUsers}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UsersIcon className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        <UserStatisticsCards {...statistics} />

        <UserSearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={openEditDialog}
            />
          ))}
        </div>

        <UserDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          title="Create New User"
          formData={formData}
          onSubmit={handleCreateUser}
          onChange={handleFormChange}
          showEmailField={true}
        />

        <UserDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Edit User"
          formData={formData}
          onSubmit={handleEditUser}
          onChange={handleFormChange}
        />

        {/* Pagination */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
