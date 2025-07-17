import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CriarMarca() {
  const [formData, setFormData] = useState({
    name: "",
    valueProposition: "",
    brandPillars: "",
    brandMission: "",
    brandInspiration: "",
    currentObjective: "",
    numericTarget: "",
    restrictions: "",
    brandHashtags: "",
    referenceContents: "",
    importantDates: "",
    relevantContent: "",
    brandCrisis: "",
    influencersAction: 0,
    brandManual: 0
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const salvarMarca = async () => {
    if (!formData.name.trim()) {
      toast.error("Por favor, insira o nome da marca");
      return;
    }

    // Validar campos obrigatórios
    const requiredFields = [
      'valueProposition', 'brandPillars', 'brandMission', 'brandInspiration',
      'currentObjective', 'numericTarget', 'restrictions', 'brandHashtags',
      'referenceContents', 'importantDates', 'relevantContent', 'brandCrisis'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        toast.error(`Por favor, preencha o campo ${field}`);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from("Brand")
        .insert([
          {
            ...formData,
            teamId: 1, // Usando teamId fixo por enquanto
            userId: 1  // Usando userId fixo por enquanto
          }
        ]);

      if (error) {
        console.error("Erro ao salvar marca:", error);
        toast.error("Erro ao criar marca");
      } else {
        toast.success("Marca criada com sucesso!");
        setFormData({
          name: "",
          valueProposition: "",
          brandPillars: "",
          brandMission: "",
          brandInspiration: "",
          currentObjective: "",
          numericTarget: "",
          restrictions: "",
          brandHashtags: "",
          referenceContents: "",
          importantDates: "",
          relevantContent: "",
          brandCrisis: "",
          influencersAction: 0,
          brandManual: 0
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Marca</h1>
          <p className="text-muted-foreground">Defina a identidade completa da sua marca</p>
        </div>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Informações da Marca</CardTitle>
          <CardDescription>
            Preencha todos os dados para criar uma marca completa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Marca *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: TechSolutions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numericTarget">Meta Numérica *</Label>
              <Input
                id="numericTarget"
                value={formData.numericTarget}
                onChange={(e) => handleInputChange("numericTarget", e.target.value)}
                placeholder="Ex: 100k seguidores em 6 meses"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valueProposition">Proposta de Valor *</Label>
            <Textarea
              id="valueProposition"
              value={formData.valueProposition}
              onChange={(e) => handleInputChange("valueProposition", e.target.value)}
              placeholder="Qual é a proposta de valor única da marca?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandPillars">Pilares da Marca *</Label>
            <Textarea
              id="brandPillars"
              value={formData.brandPillars}
              onChange={(e) => handleInputChange("brandPillars", e.target.value)}
              placeholder="Quais são os pilares que sustentam a marca?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandMission">Missão da Marca *</Label>
              <Textarea
                id="brandMission"
                value={formData.brandMission}
                onChange={(e) => handleInputChange("brandMission", e.target.value)}
                placeholder="Qual é a missão da marca?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandInspiration">Inspiração da Marca *</Label>
              <Textarea
                id="brandInspiration"
                value={formData.brandInspiration}
                onChange={(e) => handleInputChange("brandInspiration", e.target.value)}
                placeholder="O que inspira a marca?"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentObjective">Objetivo Atual *</Label>
            <Textarea
              id="currentObjective"
              value={formData.currentObjective}
              onChange={(e) => handleInputChange("currentObjective", e.target.value)}
              placeholder="Qual é o objetivo atual da marca?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandHashtags">Hashtags da Marca *</Label>
              <Input
                id="brandHashtags"
                value={formData.brandHashtags}
                onChange={(e) => handleInputChange("brandHashtags", e.target.value)}
                placeholder="Ex: #inovacao #qualidade #sustentabilidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="importantDates">Datas Importantes *</Label>
              <Input
                id="importantDates"
                value={formData.importantDates}
                onChange={(e) => handleInputChange("importantDates", e.target.value)}
                placeholder="Ex: Aniversário da empresa, Black Friday"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restrictions">Restrições *</Label>
            <Textarea
              id="restrictions"
              value={formData.restrictions}
              onChange={(e) => handleInputChange("restrictions", e.target.value)}
              placeholder="Quais são as restrições da marca? (cores, temas, abordagens a evitar)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceContents">Conteúdos de Referência *</Label>
            <Textarea
              id="referenceContents"
              value={formData.referenceContents}
              onChange={(e) => handleInputChange("referenceContents", e.target.value)}
              placeholder="Descreva conteúdos que servem de referência para a marca"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relevantContent">Conteúdo Relevante *</Label>
            <Textarea
              id="relevantContent"
              value={formData.relevantContent}
              onChange={(e) => handleInputChange("relevantContent", e.target.value)}
              placeholder="Que tipo de conteúdo é relevante para a marca?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandCrisis">Gestão de Crise *</Label>
            <Textarea
              id="brandCrisis"
              value={formData.brandCrisis}
              onChange={(e) => handleInputChange("brandCrisis", e.target.value)}
              placeholder="Como a marca deve lidar com situações de crise?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="influencersAction">Trabalha com Influenciadores</Label>
              <Select 
                value={formData.influencersAction.toString()} 
                onValueChange={(value) => handleInputChange("influencersAction", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não</SelectItem>
                  <SelectItem value="1">Sim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandManual">Possui Manual da Marca</Label>
              <Select 
                value={formData.brandManual.toString()} 
                onValueChange={(value) => handleInputChange("brandManual", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não</SelectItem>
                  <SelectItem value="1">Sim</SelectItem>
                </SelectContent>
              </Select>
            </div>
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