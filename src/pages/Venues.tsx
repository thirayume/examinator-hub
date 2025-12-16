
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Building, MapPin, Users, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { sanitizeError, logError } from "@/lib/error-utils";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

const ITEMS_PER_PAGE = 9;

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalCapacity: 0,
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: 0,
    is_active: true
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVenues(data);

      // Calculate statistics
      const stats = data.reduce((acc, venue) => {
        acc.total++;
        acc[venue.is_active ? 'active' : 'inactive']++;
        acc.totalCapacity += venue.capacity;
        return acc;
      }, { total: 0, active: 0, inactive: 0, totalCapacity: 0 });

      setStatistics(stats);
    } catch (error) {
      logError('fetchVenues', error);
      toast({
        title: "Error",
        description: sanitizeError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("venues")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue created successfully",
      });

      setIsCreateDialogOpen(false);
      setFormData({ name: "", address: "", capacity: 0, is_active: true });
      fetchVenues();
    } catch (error) {
      logError('handleSubmit:venues', error);
      toast({
        title: "Error",
        description: sanitizeError(error),
        variant: "destructive",
      });
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = 
      activeFilter === "all" || 
      (activeFilter === "active" && venue.is_active) || 
      (activeFilter === "inactive" && !venue.is_active);
    
    return matchesSearch && matchesActive;
  });

  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE);

  const exportVenues = () => {
    const csvContent = [
      ["Name", "Address", "Capacity", "Status"],
      ...filteredVenues.map(venue => [
        venue.name,
        venue.address,
        venue.capacity.toString(),
        venue.is_active ? "Active" : "Inactive"
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "venues.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Venues</h1>
          <div className="flex gap-4">
            <Button onClick={exportVenues}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Building className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Venues</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.inactive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalCapacity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Venue</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Venue name"
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Venue address"
                  />
                </div>

                <div>
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    placeholder="Venue capacity"
                  />
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.is_active ? "active" : "inactive"}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      is_active: value === "active"
                    }))}
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
                  onClick={() => setIsCreateDialogOpen(false)}
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

        {/* Search and Filters */}
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
          <Select
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              <SelectItem value="active">Active Venues</SelectItem>
              <SelectItem value="inactive">Inactive Venues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Venues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedVenues.map((venue) => (
            <div key={venue.id} className="bg-card rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">
                  {venue.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  venue.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredVenues.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

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
