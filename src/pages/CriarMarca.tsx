import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CriarMarca() {
  const [marca, setMarca] = useState({
    nome: "",
  });

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
          name: marca.nome,
        });

      if (error) {
        throw error;
      }

      toast.success("Marca criada com sucesso!");
      
      // Reset form
      setMarca({
        nome: "",
      });
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      toast.error("Erro ao criar marca. Tente novamente.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Marca</h1>
          <p className="text-muted-foreground">Defina a identidade da sua marca</p>
        </div>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Informações da Marca</CardTitle>
          <CardDescription>
            Dados básicos da marca
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

          <Button onClick={salvarMarca} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Salvar Marca
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}