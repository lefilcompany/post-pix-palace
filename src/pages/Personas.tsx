import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Persona = Tables<"Persona">;

export default function Personas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState({
    nome: "",
    genero: "",
    idade: "",
    localizacao: "",
    posicaoFormacao: "",
    hobbies: "",
    habitosConsumo: "",
    objetivos: "",
    desafios: "",
  });

  const carregarPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('Persona')
        .select('*')
        .eq('isDeleted', 0)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      setPersonas(data || []);
    } catch (error) {
      console.error("Erro ao carregar personas:", error);
      toast.error("Erro ao carregar personas");
    } finally {
      setLoading(false);
    }
  };

  const salvarPersona = async () => {
    if (!persona.nome || !persona.genero || !persona.idade) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const { error } = await supabase
        .from('Persona')
        .insert({
          brandId: 1, // Temporário
          teamId: 1, // Temporário
          name: persona.nome,
          gender: persona.genero,
          age: persona.idade,
          location: persona.localizacao,
          positionDegree: persona.posicaoFormacao,
          beliefs: persona.hobbies,
          contentHabit: persona.habitosConsumo,
          mainObjective: persona.objetivos,
          challenge: persona.desafios,
          favoriteVoice: "Tom padrão",
          buyJourney: "Jornada padrão",
          interestTrigger: "Gatilhos padrão"
        });

      if (error) {
        throw error;
      }

      toast.success("Persona criada com sucesso!");
      
      setPersona({
        nome: "",
        genero: "",
        idade: "",
        localizacao: "",
        posicaoFormacao: "",
        hobbies: "",
        habitosConsumo: "",
        objetivos: "",
        desafios: "",
      });
      setShowForm(false);
      carregarPersonas();
    } catch (error) {
      console.error("Erro ao criar persona:", error);
      toast.error("Erro ao criar persona. Tente novamente.");
    }
  };

  useEffect(() => {
    carregarPersonas();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Personas</h1>
            <p className="text-muted-foreground">Gerencie suas personas</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Persona
        </Button>
      </div>

      {showForm && (
        <Card className="border-border/40 mb-6">
          <CardHeader>
            <CardTitle>Nova Persona</CardTitle>
            <CardDescription>
              Criar uma nova persona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={persona.nome}
                  onChange={(e) => setPersona(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Maria Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero *</Label>
                <Input
                  id="genero"
                  value={persona.genero}
                  onChange={(e) => setPersona(prev => ({ ...prev, genero: e.target.value }))}
                  placeholder="Ex: Feminino"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idade">Idade *</Label>
                <Input
                  id="idade"
                  value={persona.idade}
                  onChange={(e) => setPersona(prev => ({ ...prev, idade: e.target.value }))}
                  placeholder="Ex: 25-35 anos"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={persona.localizacao}
                  onChange={(e) => setPersona(prev => ({ ...prev, localizacao: e.target.value }))}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posicaoFormacao">Posição/Formação</Label>
                <Input
                  id="posicaoFormacao"
                  value={persona.posicaoFormacao}
                  onChange={(e) => setPersona(prev => ({ ...prev, posicaoFormacao: e.target.value }))}
                  placeholder="Ex: Gerente de Marketing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Textarea
                  id="hobbies"
                  value={persona.hobbies}
                  onChange={(e) => setPersona(prev => ({ ...prev, hobbies: e.target.value }))}
                  placeholder="Ex: Leitura, cinema, viagens"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habitosConsumo">Hábitos de Consumo</Label>
                <Textarea
                  id="habitosConsumo"
                  value={persona.habitosConsumo}
                  onChange={(e) => setPersona(prev => ({ ...prev, habitosConsumo: e.target.value }))}
                  placeholder="Ex: Compras online, pesquisa preços"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="objetivos">Objetivos</Label>
                <Textarea
                  id="objetivos"
                  value={persona.objetivos}
                  onChange={(e) => setPersona(prev => ({ ...prev, objetivos: e.target.value }))}
                  placeholder="Ex: Crescer profissionalmente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desafios">Desafios</Label>
                <Textarea
                  id="desafios"
                  value={persona.desafios}
                  onChange={(e) => setPersona(prev => ({ ...prev, desafios: e.target.value }))}
                  placeholder="Ex: Falta de tempo"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={salvarPersona}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Persona
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map((persona) => (
          <Card key={persona.id} className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {persona.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p><strong>Idade:</strong> {persona.age}</p>
                <p><strong>Gênero:</strong> {persona.gender}</p>
                <p><strong>Localização:</strong> {persona.location}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Criada em: {new Date(persona.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {personas.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma persona encontrada</h3>
          <p className="text-muted-foreground mb-4">Comece criando sua primeira persona</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Persona
          </Button>
        </div>
      )}
    </div>
  );
}