
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface UserFormData {
  first_name: string;
  last_name: string;
  phone: string;
  role: UserProfile["role"];
}

interface UserEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  onFormDataChange: (data: UserFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UserEditDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
}: UserEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => onFormDataChange({ ...formData, first_name: e.target.value })}
                placeholder="First name"
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => onFormDataChange({ ...formData, last_name: e.target.value })}
                placeholder="Last name"
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>

            <div>
              <Label>Role</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) => onFormDataChange({ 
                  ...formData, 
                  role: e.target.value as UserProfile["role"]
                })}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
