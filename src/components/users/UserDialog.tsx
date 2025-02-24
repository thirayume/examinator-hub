
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formData: {
    first_name: string;
    last_name: string;
    phone: string;
    role: UserProfile["role"];
    email: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
  showEmailField?: boolean;
}

export const UserDialog = ({
  isOpen,
  onClose,
  title,
  formData,
  onSubmit,
  onChange,
  showEmailField = false,
}: UserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            {showEmailField && (
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="Email address"
                  required
                />
              </div>
            )}

            <div>
              <Label>First Name</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => onChange("first_name", e.target.value)}
                placeholder="First name"
                required
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => onChange("last_name", e.target.value)}
                placeholder="Last name"
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div>
              <Label>Role</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) => onChange("role", e.target.value)}
                required
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
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {title === "Create New User" ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
