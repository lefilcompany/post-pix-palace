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

export default function CriarPersona() {
  const [persona, setPersona] = useState({
    nome: "",
    idade: "",
    ocupacao: "",
    localizacao: "",
    bio: "",
    interesses: [] as string[],
    doresPontos: [] as string[],
    objetivos: [] as string[],
    plataformasPreferidas: [] as string[],
    comportamento: "",
    personalidade: "",
  });

  const [novoInteresse, setNovoInteresse] = useState("");
  const [novaDor, setNovaDor] = useState("");
  const [novoObjetivo, setNovoObjetivo] = useState("");
  const [novaPlataforma, setNovaPlataforma] = useState("");

  const adicionarItem = (tipo: string, valor: string, setter: (value: string) => void) => {
    if (valor.trim() && !persona[tipo as keyof typeof persona].includes(valor.trim())) {
      setPersona(prev => ({
        ...prev,
        [tipo]: [...(prev[tipo as keyof typeof persona] as string[]), valor.trim()]
      }));
      setter("");
    }
  };

  const removerItem = (tipo: string, item: string) => {
    setPersona(prev => ({
      ...prev,
      [tipo]: (prev[tipo as keyof typeof persona] as string[]).filter(i => i !== item)
    }));
  };

  const salvarPersona = () => {
    if (!persona.nome || !persona.ocupacao || !persona.bio) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você salvaria a persona no backend
    toast.success("Persona criada com sucesso!");
    
    // Reset form
    setPersona({
      nome: "",
      idade: "",
      ocupacao: "",
      localizacao: "",
      bio: "",
      interesses: [],
      doresPontos: [],
      objetivos: [],
      plataformasPreferidas: [],
      comportamento: "",
      personalidade: "",
    });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <Label>Interesses</Label>
              <div className="flex gap-2">
                <Input
                  value={novoInteresse}
                  onChange={(e) => setNovoInteresse(e.target.value)}
                  placeholder="Adicionar interesse"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('interesses', novoInteresse, setNovoInteresse)}
                />
                <Button 
                  onClick={() => adicionarItem('interesses', novoInteresse, setNovoInteresse)} 
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
                      onClick={() => removerItem('interesses', interesse)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dores e Pontos de Tensão</Label>
              <div className="flex gap-2">
                <Input
                  value={novaDor}
                  onChange={(e) => setNovaDor(e.target.value)}
                  placeholder="Adicionar dor/problema"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('doresPontos', novaDor, setNovaDor)}
                />
                <Button 
                  onClick={() => adicionarItem('doresPontos', novaDor, setNovaDor)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.doresPontos.map((dor, index) => (
                  <Badge key={index} variant="destructive" className="gap-1">
                    {dor}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/40"
                      onClick={() => removerItem('doresPontos', dor)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Objetivos</Label>
              <div className="flex gap-2">
                <Input
                  value={novoObjetivo}
                  onChange={(e) => setNovoObjetivo(e.target.value)}
                  placeholder="Adicionar objetivo"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('objetivos', novoObjetivo, setNovoObjetivo)}
                />
                <Button 
                  onClick={() => adicionarItem('objetivos', novoObjetivo, setNovoObjetivo)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.objetivos.map((objetivo, index) => (
                  <Badge key={index} variant="default" className="gap-1">
                    {objetivo}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerItem('objetivos', objetivo)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comportamento">Comportamento Online</Label>
              <Select 
                value={persona.comportamento} 
                onValueChange={(value) => setPersona(prev => ({ ...prev, comportamento: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Como se comporta online?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Muito Ativo</SelectItem>
                  <SelectItem value="moderado">Moderadamente Ativo</SelectItem>
                  <SelectItem value="passivo">Passivo (lurker)</SelectItem>
                  <SelectItem value="esporadico">Esporádico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalidade">Personalidade</Label>
              <Select 
                value={persona.personalidade} 
                onValueChange={(value) => setPersona(prev => ({ ...prev, personalidade: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de personalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extrovertido">Extrovertido</SelectItem>
                  <SelectItem value="introvertido">Introvertido</SelectItem>
                  <SelectItem value="analitico">Analítico</SelectItem>
                  <SelectItem value="criativo">Criativo</SelectItem>
                  <SelectItem value="pragmatico">Pragmático</SelectItem>
                  <SelectItem value="emocional">Emocional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Plataformas e Preview */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Plataformas Digitais</CardTitle>
            <CardDescription>
              Onde a persona está presente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Plataformas Preferidas</Label>
              <div className="flex gap-2">
                <Input
                  value={novaPlataforma}
                  onChange={(e) => setNovaPlataforma(e.target.value)}
                  placeholder="Ex: Instagram"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('plataformasPreferidas', novaPlataforma, setNovaPlataforma)}
                />
                <Button 
                  onClick={() => adicionarItem('plataformasPreferidas', novaPlataforma, setNovaPlataforma)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {persona.plataformasPreferidas.map((plataforma, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {plataforma}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerItem('plataformasPreferidas', plataforma)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preview da Persona */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Preview da Persona</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Nome:</strong> {persona.nome || "Não definido"}</div>
                {persona.idade && <div><strong>Idade:</strong> {persona.idade}</div>}
                {persona.ocupacao && <div><strong>Ocupação:</strong> {persona.ocupacao}</div>}
                {persona.localizacao && <div><strong>Local:</strong> {persona.localizacao}</div>}
                {persona.personalidade && <div><strong>Personalidade:</strong> {persona.personalidade}</div>}
                {persona.comportamento && <div><strong>Comportamento:</strong> {persona.comportamento}</div>}
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