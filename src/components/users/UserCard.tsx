
import { Button } from "@/components/ui/button";
import { Mail, Phone, UserCog } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface UserCardProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
}

export const UserCard = ({ user, onEdit }: UserCardProps) => {
  const getRoleBadgeColor = (role: UserProfile["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">
          {user.first_name} {user.last_name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </span>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <Mail className="w-4 h-4 mr-2" />
          {user.email}
        </div>
        {user.phone && (
          <div className="flex items-center text-muted-foreground">
            <Phone className="w-4 h-4 mr-2" />
            {user.phone}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
        <Button onClick={() => onEdit(user)}>
          <UserCog className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
};
