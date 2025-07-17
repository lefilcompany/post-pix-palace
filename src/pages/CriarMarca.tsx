import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Save, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CriarMarca() {
  const [marca, setMarca] = useState({
    nome: "",
    segmento: "",
    missao: "",
    visao: "",
    valores: [] as string[],
    tomVoz: "",
    personalidade: [] as string[],
    corPrimaria: "#3b82f6",
    corSecundaria: "#6366f1",
    fonte: "",
    logo: "",
    diferenciais: [] as string[],
    publicoAlvo: "",
  });

  const [novoValor, setNovoValor] = useState("");
  const [novaPersonalidade, setNovaPersonalidade] = useState("");
  const [novoDiferencial, setNovoDiferencial] = useState("");

  const adicionarItem = (tipo: string, valor: string, setter: (value: string) => void) => {
    if (valor.trim() && !marca[tipo as keyof typeof marca].includes(valor.trim())) {
      setMarca(prev => ({
        ...prev,
        [tipo]: [...(prev[tipo as keyof typeof marca] as string[]), valor.trim()]
      }));
      setter("");
    }
  };

  const removerItem = (tipo: string, item: string) => {
    setMarca(prev => ({
      ...prev,
      [tipo]: (prev[tipo as keyof typeof marca] as string[]).filter(i => i !== item)
    }));
  };

  const salvarMarca = () => {
    if (!marca.nome || !marca.segmento || !marca.missao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você salvaria a marca no backend
    toast.success("Marca criada com sucesso!");
    
    // Reset form
    setMarca({
      nome: "",
      segmento: "",
      missao: "",
      visao: "",
      valores: [],
      tomVoz: "",
      personalidade: [],
      corPrimaria: "#3b82f6",
      corSecundaria: "#6366f1",
      fonte: "",
      logo: "",
      diferenciais: [],
      publicoAlvo: "",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Criar Marca</h1>
          <p className="text-muted-foreground">Defina a identidade da sua marca</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados fundamentais da marca
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

            <div className="space-y-2">
              <Label htmlFor="segmento">Segmento *</Label>
              <Select 
                value={marca.segmento} 
                onValueChange={(value) => setMarca(prev => ({ ...prev, segmento: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="moda">Moda</SelectItem>
                  <SelectItem value="imobiliario">Imobiliário</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="missao">Missão *</Label>
              <Textarea
                id="missao"
                value={marca.missao}
                onChange={(e) => setMarca(prev => ({ ...prev, missao: e.target.value }))}
                placeholder="Por que a empresa existe?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visao">Visão</Label>
              <Textarea
                id="visao"
                value={marca.visao}
                onChange={(e) => setMarca(prev => ({ ...prev, visao: e.target.value }))}
                placeholder="Onde a empresa quer chegar?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicoAlvo">Público-Alvo</Label>
              <Textarea
                id="publicoAlvo"
                value={marca.publicoAlvo}
                onChange={(e) => setMarca(prev => ({ ...prev, publicoAlvo: e.target.value }))}
                placeholder="Descreva seu público-alvo"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Identidade Visual */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>
              Cores, tipografia e elementos visuais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corPrimaria">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="corPrimaria"
                    value={marca.corPrimaria}
                    onChange={(e) => setMarca(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={marca.corPrimaria}
                    onChange={(e) => setMarca(prev => ({ ...prev, corPrimaria: e.target.value }))}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="corSecundaria">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="corSecundaria"
                    value={marca.corSecundaria}
                    onChange={(e) => setMarca(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={marca.corSecundaria}
                    onChange={(e) => setMarca(prev => ({ ...prev, corSecundaria: e.target.value }))}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonte">Tipografia</Label>
              <Select 
                value={marca.fonte} 
                onValueChange={(value) => setMarca(prev => ({ ...prev, fonte: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderna">Moderna (Sans-serif)</SelectItem>
                  <SelectItem value="classica">Clássica (Serif)</SelectItem>
                  <SelectItem value="elegante">Elegante</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="tecnologica">Tecnológica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Arraste uma imagem ou clique para fazer upload
                </p>
                <Button variant="outline" className="mt-2" size="sm">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>

            {/* Preview das Cores */}
            <div className="space-y-2">
              <Label>Preview das Cores</Label>
              <div className="flex gap-2">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: marca.corPrimaria }}
                >
                  Primária
                </div>
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: marca.corSecundaria }}
                >
                  Secundária
                </div>
                <div 
                  className="w-32 h-16 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${marca.corPrimaria}, ${marca.corSecundaria})`
                  }}
                >
                  Gradiente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalidade e Valores */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Personalidade da Marca</CardTitle>
            <CardDescription>
              Como a marca se comunica e seus valores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tomVoz">Tom de Voz</Label>
              <Select 
                value={marca.tomVoz} 
                onValueChange={(value) => setMarca(prev => ({ ...prev, tomVoz: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Como a marca se comunica?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="inovador">Inovador</SelectItem>
                  <SelectItem value="inspirador">Inspirador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valores</Label>
              <div className="flex gap-2">
                <Input
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                  placeholder="Adicionar valor"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('valores', novoValor, setNovoValor)}
                />
                <Button 
                  onClick={() => adicionarItem('valores', novoValor, setNovoValor)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {marca.valores.map((valor, index) => (
                  <Badge key={index} variant="default" className="gap-1">
                    {valor}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerItem('valores', valor)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Traços de Personalidade</Label>
              <div className="flex gap-2">
                <Input
                  value={novaPersonalidade}
                  onChange={(e) => setNovaPersonalidade(e.target.value)}
                  placeholder="Ex: Inovadora"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('personalidade', novaPersonalidade, setNovaPersonalidade)}
                />
                <Button 
                  onClick={() => adicionarItem('personalidade', novaPersonalidade, setNovaPersonalidade)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {marca.personalidade.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {trait}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerItem('personalidade', trait)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diferenciais</Label>
              <div className="flex gap-2">
                <Input
                  value={novoDiferencial}
                  onChange={(e) => setNovoDiferencial(e.target.value)}
                  placeholder="O que torna única?"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarItem('diferenciais', novoDiferencial, setNovoDiferencial)}
                />
                <Button 
                  onClick={() => adicionarItem('diferenciais', novoDiferencial, setNovoDiferencial)} 
                  size="icon" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {marca.diferenciais.map((diferencial, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {diferencial}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removerItem('diferenciais', diferencial)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={salvarMarca} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Marca
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}