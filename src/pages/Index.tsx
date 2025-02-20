
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          {/* Quick Stats */}
          <div className="p-6 bg-card rounded-lg shadow card-hover">
            <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">5</span>
            </div>
          </div>
          {/* Add more stat cards */}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-card rounded-lg shadow p-6">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
