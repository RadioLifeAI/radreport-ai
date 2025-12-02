import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Editor from "./pages/Editor";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import EditorTest from "./components/editor/EditorTest";
import Recursos from "./pages/Recursos";
import Precos from "./pages/Precos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import LGPD from "./pages/LGPD";
import Cookies from "./pages/Cookies";
import { CookieBanner } from "./components/CookieBanner";
import { AdminProtectedRoute } from "./components/admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AIConfigPage from "./pages/admin/AIConfigPage";
import TemplatesPage from "./pages/admin/TemplatesPage";
import FrasesPage from "./pages/admin/FrasesPage";
import SubscriptionsPage from "./pages/admin/SubscriptionsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor-test" element={<EditorTest />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/precos" element={<Precos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/lgpd" element={<LGPD />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/ai-config" element={<AdminProtectedRoute><AIConfigPage /></AdminProtectedRoute>} />
            <Route path="/admin/templates" element={<AdminProtectedRoute><TemplatesPage /></AdminProtectedRoute>} />
            <Route path="/admin/frases" element={<AdminProtectedRoute><FrasesPage /></AdminProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<AdminProtectedRoute><SubscriptionsPage /></AdminProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
