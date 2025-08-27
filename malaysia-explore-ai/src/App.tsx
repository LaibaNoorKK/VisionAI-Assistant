import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

import NotFound from "./pages/NotFound";
import Signup from "./pages/auth/signup";   // ✅ import Signup
import Signin from "./pages/auth/signin";   // ✅ import Signin
import Chat from "./pages/auth/chat";       // ✅ import Chat
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider> 
      <BrowserRouter>
        <Routes>
          {/* Main Landing - Redirect to signup */}
          <Route path="/" element={<Signup />} />
          
          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Chat Route - Protected */}
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
