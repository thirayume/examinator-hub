
import { DashboardLayout } from "@/components/DashboardLayout";

const Users = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-muted-foreground">User management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
