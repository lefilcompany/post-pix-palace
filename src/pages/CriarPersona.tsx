import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CriarPersona() {
  const [persona, setPersona] = useState({
    nome: "",
    idade: "",
    genero: "",
    ocupacao: "",
    localizacao: "",
    bio: "",
    interesses: [] as string[],
    habitos: "",
    objetivos: "",
    desafios: "",
  });

  const [novoInteresse, setNovoInteresse] = useState("");

  const adicionarInteresse = () => {
    if (novoInteresse.trim() && !persona.interesses.includes(novoInteresse.trim())) {
      setPersona(prev => ({
        ...prev,
        interesses: [...prev.interesses, novoInteresse.trim()]
      }));
      setNovoInteresse("");
    }
  };

  const removerInteresse = (interesse: string) => {
    setPersona(prev => ({
      ...prev,
      interesses: prev.interesses.filter(i => i !== interesse)
    }));
  };

  const salvarPersona = async () => {
    if (!persona.nome || !persona.ocupacao || !persona.bio) {
      toast.error("Preencha todos os campos obrigatórios");
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
          positionDegree: persona.ocupacao,
          hobbies: persona.interesses.join(", "),
          consumeHabit: persona.habitos,
          goals: persona.objetivos,
          challenge: persona.desafios,
        });

      if (error) {
        throw error;
      }

      toast.success("Persona criada com sucesso!");
      
      // Reset form
      setPersona({
        nome: "",
        idade: "",
        genero: "",
        ocupacao: "",
        localizacao: "",
        bio: "",
        interesses: [],
        habitos: "",
        objetivos: "",
        desafios: "",
      });
    } catch (error) {
      console.error("Erro ao criar persona:", error);
      toast.error("Erro ao criar persona. Tente novamente.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Persona</h1>
          <p className="text-muted-foreground">Defina seu público-alvo ideal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados demográficos da persona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={persona.nome}
                onChange={(e) => setPersona(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Maria Silva"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  value={persona.idade}
                  onChange={(e) => setPersona(prev => ({ ...prev, idade: e.target.value }))}
                  placeholder="Ex: 28 anos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select 
                  value={persona.genero} 
                  onValueChange={(value) => setPersona(prev => ({ ...prev, genero: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ocupacao">Ocupação *</Label>
              <Input
                id="ocupacao"
                value={persona.ocupacao}
                onChange={(e) => setPersona(prev => ({ ...prev, ocupacao: e.target.value }))}
                placeholder="Ex: Designer Gráfica"
              />
            </div>

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
              <Label htmlFor="bio">Bio/Descrição *</Label>
              <Textarea
                id="bio"
                value={persona.bio}
                onChange={(e) => setPersona(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Descreva a persona em detalhes"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="habitos">Hábitos de Consumo</Label>
              <Textarea
                id="habitos"
                value={persona.habitos}
                onChange={(e) => setPersona(prev => ({ ...prev, habitos: e.target.value }))}
                placeholder="Como consome conteúdo e produtos?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comportamento e Interesses */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Comportamento e Interesses</CardTitle>
            <CardDescription>
              Como a persona se comporta e o que gosta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Interesses/Hobbies</Label>
              <div className="flex gap-2">
                <Input
                  value={novoInteresse}
                  onChange={(e) => setNovoInteresse(e.target.value)}
                  placeholder="Adicionar interesse"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarInteresse()}
                />
                <Button 
                  onClick={adicionarInteresse} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.interesses.map((interesse, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {interesse}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerInteresse(interesse)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <Textarea
                id="objetivos"
                value={persona.objetivos}
                onChange={(e) => setPersona(prev => ({ ...prev, objetivos: e.target.value }))}
                placeholder="Quais são os objetivos da persona?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desafios">Desafios</Label>
              <Textarea
                id="desafios"
                value={persona.desafios}
                onChange={(e) => setPersona(prev => ({ ...prev, desafios: e.target.value }))}
                placeholder="Quais são os principais desafios?"
                rows={3}
              />
            </div>

            {/* Preview da Persona */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Preview da Persona</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Nome:</strong> {persona.nome || "Não definido"}</div>
                {persona.idade && <div><strong>Idade:</strong> {persona.idade}</div>}
                {persona.genero && <div><strong>Gênero:</strong> {persona.genero}</div>}
                {persona.ocupacao && <div><strong>Ocupação:</strong> {persona.ocupacao}</div>}
                {persona.localizacao && <div><strong>Local:</strong> {persona.localizacao}</div>}
                {persona.interesses.length > 0 && (
                  <div><strong>Interesses:</strong> {persona.interesses.join(", ")}</div>
                )}
              </div>
            </div>

            <Button onClick={salvarPersona} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Persona
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}