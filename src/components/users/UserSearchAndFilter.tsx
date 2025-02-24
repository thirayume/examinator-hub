
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface UserSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: UserProfile["role"] | "all";
  onRoleFilterChange: (value: UserProfile["role"] | "all") => void;
}

export const UserSearchAndFilter = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UserSearchAndFilterProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={roleFilter}
        onValueChange={(value) => onRoleFilterChange(value as typeof roleFilter)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="student">Students</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
