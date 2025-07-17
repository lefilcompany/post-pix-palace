import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Brand = Tables<"Brand">;

export default function Marcas() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marca, setMarca] = useState({
    nome: "",
  });

  const carregarMarcas = async () => {
    try {
      const { data, error } = await supabase
        .from('Brand')
        .select('*')
        .eq('isDeleted', 0)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      setBrands(data || []);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
      toast.error("Erro ao carregar marcas");
    } finally {
      setLoading(false);
    }
  };

  const salvarMarca = async () => {
    if (!marca.nome) {
      toast.error("Preencha o nome da marca");
      return;
    }

    try {
      const { error } = await supabase
        .from('Brand')
        .insert({
          teamId: 1, // Temporário
          userId: 1, // Temporário
          name: marca.nome,
          valueProposition: "Proposta de valor padrão",
          brandPillars: "Pilares padrão",
          brandMission: "Missão padrão", 
          brandInspiration: "Inspiração padrão",
          currentObjective: "Objetivo padrão",
          numericTarget: "Meta padrão",
          restrictions: "Sem restrições",
          brandHashtags: "#marca",
          referenceContents: "Conteúdo de referência",
          importantDates: "Datas importantes",
          relevantContent: "Conteúdo relevante",
          brandCrisis: "Gestão de crise padrão",
          influencersAction: 0,
          brandManual: 0
        });

      if (error) {
        throw error;
      }

      toast.success("Marca criada com sucesso!");
      
      setMarca({ nome: "" });
      setShowForm(false);
      carregarMarcas();
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      toast.error("Erro ao criar marca. Tente novamente.");
    }
  };

  useEffect(() => {
    carregarMarcas();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marcas</h1>
            <p className="text-muted-foreground">Gerencie suas marcas</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      {showForm && (
        <Card className="border-border/40 mb-6">
          <CardHeader>
            <CardTitle>Nova Marca</CardTitle>
            <CardDescription>
              Criar uma nova marca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Marca *</Label>
              <Input
                id="nome"
                value={marca.nome}
                onChange={(e) => setMarca(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: TechSolutions"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={salvarMarca}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Marca
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Card key={brand.id} className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {brand.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Criada em: {new Date(brand.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma marca encontrada</h3>
          <p className="text-muted-foreground mb-4">Comece criando sua primeira marca</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Marca
          </Button>
        </div>
      )}
    </div>
  );
}