import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, History } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Content = Tables<"Content">;

export default function Historico() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarConteudos = async () => {
    try {
      const { data, error } = await supabase
        .from('Content')
        .select('*')
        .eq('isDeleted', 0)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      setContents(data || []);
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
      toast.error("Erro ao carregar conteúdos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConteudos();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <History className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico de Conteúdos</h1>
          <p className="text-muted-foreground">Todos os conteúdos criados e revisados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg">
                {content.mainMessage.substring(0, 50)}...
              </CardTitle>
              <CardDescription>
                {content.format} • {content.feeling}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Micro Resultado:</strong> {content.microResult}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Próximo Passo:</strong> {content.nextStep}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </p>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-12">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum conteúdo encontrado</h3>
          <p className="text-muted-foreground">Você ainda não criou nenhum conteúdo</p>
        </div>
      )}
    </div>
  );
}