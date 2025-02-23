
import { MapPin, Users } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6">
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
  );
}
