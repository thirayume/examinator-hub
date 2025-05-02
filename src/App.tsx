
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/AuthGuard";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import UsersPage from "@/pages/Users";
import Venues from "@/pages/Venues";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Registrations from "@/pages/Registrations";
import RegistrationDetail from "@/pages/RegistrationDetail";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<AuthGuard><Outlet /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/registrations/:id" element={<RegistrationDetail />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
