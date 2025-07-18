
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Save, Trash2 } from "lucide-react";
import { supabaseService, Persona } from "@/services/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Personas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    profissao: "",
    localizacao: "",
    interesses: "",
    dores: "",
    objetivos: "",
    comportamento_digital: "",
    plataformas_preferidas: "",
    renda: "",
    escolaridade: "",
  });

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const allPersonas = await supabaseService.getPersonas();
      setPersonas(allPersonas);
    } catch (error) {
      console.error("Erro ao carregar personas:", error);
      toast.error("Erro ao carregar personas");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.idade || !formData.profissao) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const newPersona = await supabaseService.savePersona({
        name: formData.nome,
        age: parseInt(formData.idade) || undefined,
        position_degree: formData.profissao,
        location: formData.localizacao,
        main_objective: formData.objetivos,
        challenge: formData.dores,
        favoriteVoice: formData.plataformas_preferidas,
        buyJourney: formData.escolaridade,
        interestTrigger: formData.renda,
        gender: "Não informado",
      });
      setPersonas(prev => [...prev, newPersona]);
      
      // Reset form
      setFormData({
        nome: "",
        idade: "",
        profissao: "",
        localizacao: "",
        interesses: "",
        dores: "",
        objetivos: "",
        comportamento_digital: "",
        plataformas_preferidas: "",
        renda: "",
        escolaridade: "",
      });
      
      setIsDialogOpen(false);
      toast.success("Persona criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar persona:", error);
      toast.error("Erro ao criar persona. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePersona = async (personaId: number) => {
    try {
      await supabaseService.deletePersona(personaId);
      setPersonas(prev => prev.filter(persona => persona.id !== personaId));
      toast.success("Persona removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar persona:", error);
      toast.error("Erro ao deletar persona");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Personas</h1>
            <p className="text-muted-foreground">
              Gerencie as personas do seu público-alvo
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Persona
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Persona</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Persona *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Ex: Ana Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input
                    id="idade"
                    value={formData.idade}
                    onChange={(e) => handleInputChange("idade", e.target.value)}
                    placeholder="Ex: 28-35 anos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão *</Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => handleInputChange("profissao", e.target.value)}
                    placeholder="Ex: Gerente de Marketing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => handleInputChange("localizacao", e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interesses">Interesses</Label>
                <Textarea
                  id="interesses"
                  value={formData.interesses}
                  onChange={(e) => handleInputChange("interesses", e.target.value)}
                  placeholder="Descreva os principais interesses e hobbies"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dores">Dores e Desafios</Label>
                <Textarea
                  id="dores"
                  value={formData.dores}
                  onChange={(e) => handleInputChange("dores", e.target.value)}
                  placeholder="Quais são as principais dores e desafios?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivos">Objetivos</Label>
                <Textarea
                  id="objetivos"
                  value={formData.objetivos}
                  onChange={(e) => handleInputChange("objetivos", e.target.value)}
                  placeholder="Quais são os principais objetivos?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comportamento_digital">Comportamento Digital</Label>
                <Textarea
                  id="comportamento_digital"
                  value={formData.comportamento_digital}
                  onChange={(e) => handleInputChange("comportamento_digital", e.target.value)}
                  placeholder="Como se comporta no mundo digital?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plataformas_preferidas">Plataformas Preferidas</Label>
                  <Input
                    id="plataformas_preferidas"
                    value={formData.plataformas_preferidas}
                    onChange={(e) => handleInputChange("plataformas_preferidas", e.target.value)}
                    placeholder="Ex: Instagram, LinkedIn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renda">Faixa de Renda</Label>
                  <Select value={formData.renda} onValueChange={(value) => handleInputChange("renda", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-2sm">Até 2 SM</SelectItem>
                      <SelectItem value="2-5sm">2 a 5 SM</SelectItem>
                      <SelectItem value="5-10sm">5 a 10 SM</SelectItem>
                      <SelectItem value="10-20sm">10 a 20 SM</SelectItem>
                      <SelectItem value="acima-20sm">Acima de 20 SM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escolaridade">Escolaridade</Label>
                <Select value={formData.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escolaridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="medio">Ensino Médio</SelectItem>
                    <SelectItem value="superior">Ensino Superior</SelectItem>
                    <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Persona
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.length > 0 ? (
          personas.map((persona) => (
            <Card key={persona.id} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{persona.name}</CardTitle>
                     <Badge variant="secondary" className="text-xs">
                        {persona.age}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePersona(persona.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                   <div className="text-sm">
                     <span className="font-medium">Profissão:</span> {persona.position_degree}
                   </div>
                   <div className="text-sm">
                     <span className="font-medium">Localização:</span> {persona.location}
                   </div>
                   <div className="text-sm">
                     <span className="font-medium">Objetivo:</span> {persona.main_objective}
                   </div>
                   <div className="text-sm">
                     <span className="font-medium">Desafio:</span> {persona.challenge}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma persona criada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie sua primeira persona para personalizar melhor seus conteúdos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Persona
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
