
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import CriarConteudo from "@/pages/CriarConteudo";
import VisualizarConteudo from "@/pages/VisualizarConteudo";
import Marcas from "@/pages/Marcas";
import Personas from "@/pages/Personas";
import Temas from "@/pages/Temas";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/criar-conteudo" element={
              <ProtectedRoute>
                <Layout>
                  <CriarConteudo />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/conteudo/:id" element={
              <ProtectedRoute>
                <Layout>
                  <VisualizarConteudo />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/marcas" element={
              <ProtectedRoute>
                <Layout>
                  <Marcas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/personas" element={
              <ProtectedRoute>
                <Layout>
                  <Personas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/temas" element={
              <ProtectedRoute>
                <Layout>
                  <Temas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
