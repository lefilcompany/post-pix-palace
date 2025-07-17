import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Save } from "lucide-react";
import { toast } from "sonner";
import { localStorageService, Brand } from "@/services/localStorage";

export default function CriarPersona() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [persona, setPersona] = useState({
    brandId: "",
    name: "",
    gender: "",
    age: "",
    location: "",
    positionDegree: "",
    beliefs: "",
    contentHabit: "",
    mainObjective: "",
    challenge: "",
    favoriteVoice: "",
    buyJourney: "",
    interestTrigger: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    try {
      const data = localStorageService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
      toast.error("Erro ao carregar marcas");
    }
  };

  const salvarPersona = async () => {
    if (!persona.name.trim()) {
      toast.error("Por favor, insira o nome da persona");
      return;
    }

    if (!persona.brandId) {
      toast.error("Por favor, selecione uma marca");
      return;
    }

    if (!persona.age.trim()) {
      toast.error("Por favor, insira a idade");
      return;
    }

    try {
      localStorageService.createPersona({
        brandId: parseInt(persona.brandId),
        name: persona.name,
        gender: persona.gender || "não especificado",
        age: persona.age,
        location: persona.location || "não especificado",
        positionDegree: persona.positionDegree || "não especificado",
        beliefs: persona.beliefs || "não especificado",
        contentHabit: persona.contentHabit || "não especificado",
        mainObjective: persona.mainObjective || "não especificado",
        challenge: persona.challenge || "não especificado",
        favoriteVoice: persona.favoriteVoice || "não especificado",
        buyJourney: persona.buyJourney || "não especificado",
        interestTrigger: persona.interestTrigger || "não especificado"
      });

      toast.success("Persona criada com sucesso!");
      setPersona({
        brandId: "",
        name: "",
        gender: "",
        age: "",
        location: "",
        positionDegree: "",
        beliefs: "",
        contentHabit: "",
        mainObjective: "",
        challenge: "",
        favoriteVoice: "",
        buyJourney: "",
        interestTrigger: "",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado");
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
              <Label htmlFor="brandId">Marca *</Label>
              <Select value={persona.brandId} onValueChange={(value) => setPersona(prev => ({ ...prev, brandId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={persona.name}
                onChange={(e) => setPersona(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Maria Silva"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade *</Label>
                <Input
                  id="age"
                  value={persona.age}
                  onChange={(e) => setPersona(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Ex: 28 anos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select 
                  value={persona.gender} 
                  onValueChange={(value) => setPersona(prev => ({ ...prev, gender: value }))}
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
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={persona.location}
                onChange={(e) => setPersona(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: São Paulo, SP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionDegree">Cargo e Formação</Label>
              <Input
                id="positionDegree"
                value={persona.positionDegree}
                onChange={(e) => setPersona(prev => ({ ...prev, positionDegree: e.target.value }))}
                placeholder="Ex: Designer Gráfica, Formada em Design"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beliefs">Crenças e Interesses</Label>
              <Textarea
                id="beliefs"
                value={persona.beliefs}
                onChange={(e) => setPersona(prev => ({ ...prev, beliefs: e.target.value }))}
                placeholder="Quais são as crenças e valores da persona?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentHabit">Hábitos de Consumo de Conteúdo</Label>
              <Textarea
                id="contentHabit"
                value={persona.contentHabit}
                onChange={(e) => setPersona(prev => ({ ...prev, contentHabit: e.target.value }))}
                placeholder="Como e onde consome conteúdo?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comportamento e Objetivos */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Comportamento e Objetivos</CardTitle>
            <CardDescription>
              Como a persona se comporta e o que busca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainObjective">Objetivo Principal</Label>
              <Textarea
                id="mainObjective"
                value={persona.mainObjective}
                onChange={(e) => setPersona(prev => ({ ...prev, mainObjective: e.target.value }))}
                placeholder="Qual é o principal objetivo da persona?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge">Desafios</Label>
              <Textarea
                id="challenge"
                value={persona.challenge}
                onChange={(e) => setPersona(prev => ({ ...prev, challenge: e.target.value }))}
                placeholder="Quais são os principais desafios enfrentados?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteVoice">Tom de Voz Preferido</Label>
              <Input
                id="favoriteVoice"
                value={persona.favoriteVoice}
                onChange={(e) => setPersona(prev => ({ ...prev, favoriteVoice: e.target.value }))}
                placeholder="Ex: Formal, casual, descontraído, técnico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyJourney">Jornada de Compra</Label>
              <Textarea
                id="buyJourney"
                value={persona.buyJourney}
                onChange={(e) => setPersona(prev => ({ ...prev, buyJourney: e.target.value }))}
                placeholder="Descreva como é o processo de decisão de compra"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestTrigger">Gatilhos de Interesse</Label>
              <Textarea
                id="interestTrigger"
                value={persona.interestTrigger}
                onChange={(e) => setPersona(prev => ({ ...prev, interestTrigger: e.target.value }))}
                placeholder="O que desperta o interesse da persona?"
                rows={3}
              />
            </div>

            {/* Preview da Persona */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Preview da Persona</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Nome:</strong> {persona.name || "Não definido"}</div>
                <div><strong>Marca:</strong> {brands.find(b => b.id.toString() === persona.brandId)?.name || "Não selecionada"}</div>
                {persona.age && <div><strong>Idade:</strong> {persona.age}</div>}
                {persona.gender && <div><strong>Gênero:</strong> {persona.gender}</div>}
                {persona.positionDegree && <div><strong>Cargo:</strong> {persona.positionDegree}</div>}
                {persona.location && <div><strong>Local:</strong> {persona.location}</div>}
                {persona.favoriteVoice && <div><strong>Tom preferido:</strong> {persona.favoriteVoice}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
