
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/AuthGuard";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import Users from "@/pages/Users";
import Venues from "@/pages/Venues";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/users" element={<Users />} />
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
