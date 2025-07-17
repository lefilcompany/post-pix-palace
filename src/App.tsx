
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import CriarConteudo from "@/pages/CriarConteudo";
import VisualizarConteudo from "@/pages/VisualizarConteudo";
import Marcas from "@/pages/Marcas";
import Personas from "@/pages/Personas";
import Temas from "@/pages/Temas";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/criar-conteudo" element={<CriarConteudo />} />
            <Route path="/conteudo/:id" element={<VisualizarConteudo />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/temas" element={<Temas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
