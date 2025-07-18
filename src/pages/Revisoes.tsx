import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Save, Trash2, Eye } from "lucide-react";
import { supabaseService, Review, Brand } from "@/services/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Revisoes() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_id: "",
    ia_text: "",
    content_type: "image",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsData, brandsData] = await Promise.all([
        supabaseService.getReviews(),
        supabaseService.getBrands(),
      ]);
      setReviews(reviewsData);
      setBrands(brandsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand_id || !formData.ia_text) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const newReview = await supabaseService.saveReview({
        brand_id: parseInt(formData.brand_id),
        team_id: 0, // Will be updated when team functionality is implemented
        ia_text: formData.ia_text,
      });
      
      setReviews(prev => [...prev, newReview]);
      
      // Reset form
      setFormData({
        brand_id: "",
        ia_text: "",
        content_type: "image",
      });
      
      setIsDialogOpen(false);
      toast.success("Revisão criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar revisão:", error);
      toast.error("Erro ao criar revisão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await supabaseService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success("Revisão removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar revisão:", error);
      toast.error("Erro ao deletar revisão");
    }
  };

  const getContentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      image: "bg-green-500",
      video: "bg-red-500",
      text: "bg-blue-500",
      carousel: "bg-purple-500",
    };
    return colors[type.toLowerCase()] || "bg-gray-500";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Revisões</h1>
            <p className="text-muted-foreground">
              Analise e revise seus conteúdos com IA
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Revisão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Revisão</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand_id">Marca *</Label>
                  <Select value={formData.brand_id} onValueChange={(value) => handleInputChange("brand_id", value)}>
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
                  <Label htmlFor="content_type">Tipo de Conteúdo</Label>
                  <Select value={formData.content_type} onValueChange={(value) => handleInputChange("content_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="carousel">Carrossel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ia_text">Descrição do Conteúdo *</Label>
                <Textarea
                  id="ia_text"
                  value={formData.ia_text}
                  onChange={(e) => handleInputChange("ia_text", e.target.value)}
                  placeholder="Descreva o conteúdo que você quer revisar. Se for uma imagem, descreva o que ela contém. Se for um texto, cole o texto aqui..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Seja específico na descrição para obter uma revisão mais precisa da IA.
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Revisão
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Revisões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Revisão #{review.id}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {(review as any).brands?.name || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Conteúdo Analisado:</span>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {review.ia_text}
                    </p>
                  </div>
                  
                  {review.response_ai && (
                    <div>
                      <span className="font-medium text-sm">Análise da IA:</span>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-4">
                        {review.response_ai}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma revisão criada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie sua primeira revisão para analisar seus conteúdos com IA
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Revisão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}