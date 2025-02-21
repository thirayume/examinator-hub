
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Venue } from "@/types/events";

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: 0,
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order('name');

      if (error) throw error;
      setVenues(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load venues: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("venues")
        .insert({
          name: formData.name,
          address: formData.address,
          capacity: formData.capacity,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue created successfully",
      });

      setIsCreateDialogOpen(false);
      setFormData({ name: "", address: "", capacity: 0 });
      fetchVenues();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create venue: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;

    try {
      const { error } = await supabase
        .from("venues")
        .update({
          name: formData.name,
          address: formData.address,
          capacity: formData.capacity,
        })
        .eq('id', selectedVenue.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedVenue(null);
      setFormData({ name: "", address: "", capacity: 0 });
      fetchVenues();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update venue: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleVenueStatus = async (venue: Venue) => {
    try {
      const { error } = await supabase
        .from("venues")
        .update({ is_active: !venue.is_active })
        .eq('id', venue.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Venue ${venue.is_active ? 'deactivated' : 'activated'} successfully`,
      });

      fetchVenues();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update venue status: " + error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      capacity: venue.capacity,
    });
    setIsEditDialogOpen(true);
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const VenueDialog = ({ isOpen, onOpenChange, mode }: { isOpen: boolean; onOpenChange: (open: boolean) => void; mode: 'create' | 'edit' }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Venue' : 'Edit Venue'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={mode === 'create' ? handleCreateVenue : handleEditVenue} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Venue Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Main Campus"
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address"
              />
            </div>

            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                min="1"
                placeholder="Maximum number of people"
              />
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
              {mode === 'create' ? 'Create Venue' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Venues</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Venue
          </Button>
        </div>

        {/* Create and Edit Dialogs */}
        <VenueDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          mode="create"
        />
        <VenueDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mode="edit"
        />

        {/* Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search venues..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="bg-card rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{venue.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  venue.is_active 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {venue.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {venue.address}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Capacity: {venue.capacity}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleToggleVenueStatus(venue)}
                >
                  {venue.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button onClick={() => openEditDialog(venue)}>
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && !isLoading && (
          <div className="bg-card rounded-lg shadow p-6 text-center">
            <p className="text-muted-foreground">No venues found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Venues;
