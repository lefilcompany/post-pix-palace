import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Theme = Tables<"Theme">;

export default function Temas() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tema, setTema] = useState({
    titulo: "",
    descricao: "",
    cores: "",
    objetivos: "",
    universoAlvo: "",
    hashtags: "",
    informacoesAdicionais: "",
    vozIA: "",
  });

  const carregarTemas = async () => {
    try {
      const { data, error } = await supabase
        .from('Theme')
        .select('*')
        .eq('isDeleted', 0)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      setThemes(data || []);
    } catch (error) {
      console.error("Erro ao carregar temas:", error);
      toast.error("Erro ao carregar temas");
    } finally {
      setLoading(false);
    }
  };

  const salvarTema = async () => {
    if (!tema.titulo || !tema.descricao) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from('Theme')
        .insert({
          brandId: 1, // Temporário
          teamId: 1, // Temporário
          title: tema.titulo,
          description: tema.descricao,
          colors: tema.cores,
          objectives: tema.objetivos,
          universeTarget: tema.universoAlvo,
          hashtags: tema.hashtags,
          addInfo: tema.informacoesAdicionais,
          voiceAI: tema.vozIA,
        });

      if (error) {
        throw error;
      }

      toast.success("Tema criado com sucesso!");
      
      setTema({
        titulo: "",
        descricao: "",
        cores: "",
        objetivos: "",
        universoAlvo: "",
        hashtags: "",
        informacoesAdicionais: "",
        vozIA: "",
      });
      setShowForm(false);
      carregarTemas();
    } catch (error) {
      console.error("Erro ao criar tema:", error);
      toast.error("Erro ao criar tema. Tente novamente.");
    }
  };

  useEffect(() => {
    carregarTemas();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Temas</h1>
            <p className="text-muted-foreground">Gerencie seus temas</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tema
        </Button>
      </div>

      {showForm && (
        <Card className="border-border/40 mb-6">
          <CardHeader>
            <CardTitle>Novo Tema</CardTitle>
            <CardDescription>
              Criar um novo tema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={tema.titulo}
                  onChange={(e) => setTema(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ex: Lançamento de Produto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cores">Cores</Label>
                <Input
                  id="cores"
                  value={tema.cores}
                  onChange={(e) => setTema(prev => ({ ...prev, cores: e.target.value }))}
                  placeholder="Ex: #FF0000, #00FF00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={tema.descricao}
                onChange={(e) => setTema(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o tema..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objetivos">Objetivos</Label>
                <Textarea
                  id="objetivos"
                  value={tema.objetivos}
                  onChange={(e) => setTema(prev => ({ ...prev, objetivos: e.target.value }))}
                  placeholder="Objetivos do tema..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universoAlvo">Universo Alvo</Label>
                <Textarea
                  id="universoAlvo"
                  value={tema.universoAlvo}
                  onChange={(e) => setTema(prev => ({ ...prev, universoAlvo: e.target.value }))}
                  placeholder="Público alvo..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input
                  id="hashtags"
                  value={tema.hashtags}
                  onChange={(e) => setTema(prev => ({ ...prev, hashtags: e.target.value }))}
                  placeholder="Ex: #marketing #vendas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vozIA">Voz da IA</Label>
                <Input
                  id="vozIA"
                  value={tema.vozIA}
                  onChange={(e) => setTema(prev => ({ ...prev, vozIA: e.target.value }))}
                  placeholder="Tom de voz da IA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="informacoesAdicionais">Informações Adicionais</Label>
              <Textarea
                id="informacoesAdicionais"
                value={tema.informacoesAdicionais}
                onChange={(e) => setTema(prev => ({ ...prev, informacoesAdicionais: e.target.value }))}
                placeholder="Informações extras..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={salvarTema}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Tema
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card key={theme.id} className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {theme.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {theme.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Criado em: {new Date(theme.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum tema encontrado</h3>
          <p className="text-muted-foreground mb-4">Comece criando seu primeiro tema</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Tema
          </Button>
        </div>
      )}
    </div>
  );
}