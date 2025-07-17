
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Save, Trash2 } from "lucide-react";
import { localStorageService, Brand } from "@/services/localStorage";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Marcas() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    setor: "",
    publico_alvo: "",
    tom_voz: "",
    valores: "",
    cor_primaria: "#3b82f6",
    cor_secundaria: "#6366f1",
    logo_url: "",
    site_url: "",
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () => {
    const allBrands = localStorageService.getBrands();
    setBrands(allBrands);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.setor) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const newBrand = localStorageService.saveBrand({
        nome: formData.nome,
        descricao: formData.descricao,
        setor: formData.setor,
        publico_alvo: formData.publico_alvo,
        tom_voz: formData.tom_voz,
        valores: formData.valores.split(',').map(v => v.trim()),
        cores_primarias: [formData.cor_primaria],
        cores_secundarias: [formData.cor_secundaria],
        tipografia: "Arial",
        estilo_visual: "Moderno",
      });
      setBrands(prev => [...prev, newBrand]);
      
      // Reset form
      setFormData({
        nome: "",
        descricao: "",
        setor: "",
        publico_alvo: "",
        tom_voz: "",
        valores: "",
        cor_primaria: "#3b82f6",
        cor_secundaria: "#6366f1",
        logo_url: "",
        site_url: "",
      });
      
      setIsDialogOpen(false);
      toast.success("Marca criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      toast.error("Erro ao criar marca. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrand = (brandId: string) => {
    localStorageService.deleteBrand(brandId);
    setBrands(prev => prev.filter(brand => brand.id !== brandId));
    toast.success("Marca removida com sucesso!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Marcas</h1>
            <p className="text-muted-foreground">
              Gerencie suas marcas e identidades visuais
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Marca
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Marca</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Marca *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome da marca"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Select value={formData.setor} onValueChange={(value) => handleInputChange("setor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="alimentacao">Alimentação</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descreva a marca, seus produtos e serviços"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publico_alvo">Público Alvo</Label>
                  <Input
                    id="publico_alvo"
                    value={formData.publico_alvo}
                    onChange={(e) => handleInputChange("publico_alvo", e.target.value)}
                    placeholder="Descreva o público alvo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tom_voz">Tom de Voz</Label>
                  <Select value={formData.tom_voz} onValueChange={(value) => handleInputChange("tom_voz", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profissional">Profissional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="amigavel">Amigável</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="criativo">Criativo</SelectItem>
                      <SelectItem value="inspirador">Inspirador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valores">Valores da Marca</Label>
                <Textarea
                  id="valores"
                  value={formData.valores}
                  onChange={(e) => handleInputChange("valores", e.target.value)}
                  placeholder="Descreva os valores e princípios da marca"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="cor_primaria"
                      value={formData.cor_primaria}
                      onChange={(e) => handleInputChange("cor_primaria", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.cor_primaria}
                      onChange={(e) => handleInputChange("cor_primaria", e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="cor_secundaria"
                      value={formData.cor_secundaria}
                      onChange={(e) => handleInputChange("cor_secundaria", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.cor_secundaria}
                      onChange={(e) => handleInputChange("cor_secundaria", e.target.value)}
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => handleInputChange("logo_url", e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_url">URL do Site</Label>
                  <Input
                    id="site_url"
                    value={formData.site_url}
                    onChange={(e) => handleInputChange("site_url", e.target.value)}
                    placeholder="https://www.exemplo.com"
                  />
                </div>
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
                    Criar Marca
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <Card key={brand.id} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: brand.cores_primarias[0] }}
                    >
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{brand.nome}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {brand.setor}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBrand(brand.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {brand.descricao}
                </p>
                <div className="space-y-2">
                  {brand.publico_alvo && (
                    <div className="text-sm">
                      <span className="font-medium">Público:</span> {brand.publico_alvo}
                    </div>
                  )}
                  {brand.tom_voz && (
                    <div className="text-sm">
                      <span className="font-medium">Tom:</span> {brand.tom_voz}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <div 
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: brand.cores_primarias[0] }}
                    />
                    <div 
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: brand.cores_secundarias[0] }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma marca criada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie sua primeira marca para começar a gerar conteúdos personalizados
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Marca
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
