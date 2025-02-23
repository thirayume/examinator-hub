
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VenueFormData {
  name: string;
  address: string;
  capacity: number;
  is_active: boolean;
}

interface VenueCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VenueFormData;
  onFormDataChange: (data: VenueFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function VenueCreateDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
}: VenueCreateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                placeholder="Venue name"
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
                placeholder="Venue address"
              />
            </div>

            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => onFormDataChange({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="Venue capacity"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.is_active ? "active" : "inactive"}
                onValueChange={(value) => onFormDataChange({ 
                  ...formData, 
                  is_active: value === "active"
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
              Create Venue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
