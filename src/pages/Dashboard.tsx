
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Users, Palette, Building, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { localStorageService, Content } from "@/services/localStorage";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [brands, setBrands] = useState(0);
  const [themes, setThemes] = useState(0);
  const [personas, setPersonas] = useState(0);
  
  // Simular usuário logado - em produção viria do sistema de auth
  const userName = "Usuário";

  useEffect(() => {
    // Carregar dados do localStorage
    const allContents = localStorageService.getContents();
    const allBrands = localStorageService.getBrands();
    const allThemes = localStorageService.getThemes();
    const allPersonas = localStorageService.getPersonas();
    
    setContents(allContents.slice(0, 3)); // Mostrar apenas os 3 mais recentes
    setBrands(allBrands.length);
    setThemes(allThemes.length);
    setPersonas(allPersonas.length);
  }, []);

  const metrics = [
    {
      title: "Conteúdos Criados",
      value: contents.length.toString(),
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Marcas Ativas",
      value: brands.toString(),
      change: "+1",
      trend: "up",
      icon: Building,
    },
    {
      title: "Temas Ativos",
      value: themes.toString(),
      change: "+2",
      trend: "up",
      icon: Palette,
    },
    {
      title: "Personas Ativas",
      value: personas.toString(),
      change: "+1",
      trend: "up",
      icon: Users,
    },
  ];

  const handleContentClick = (contentId: string) => {
    navigate(`/conteudo/${contentId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Saudação ao usuário */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Home className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, {userName}</h1>
          <p className="text-muted-foreground">Bem-vindo ao creator, seu espaço corporativo inteligente</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{metric.change}</span> desde o último mês
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conteúdos Recentes */}
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Conteúdos Recentes</CardTitle>
              <CardDescription>
                Acompanhe seus últimos conteúdos criados
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/criar-conteudo">
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contents.length > 0 ? (
                contents.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleContentClick(content.id)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{content.titulo}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{content.plataforma}</span>
                        <span>•</span>
                        <span>{new Date(content.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="default">
                      Criado
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum conteúdo criado ainda. 
                  <Link to="/criar-conteudo" className="text-primary hover:underline ml-1">
                    Criar seu primeiro conteúdo
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as ferramentas mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/criar-conteudo">
                  <Plus className="h-6 w-6" />
                  <span>Criar Conteúdo</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/marcas">
                  <Building className="h-6 w-6" />
                  <span>Marcas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/personas">
                  <Users className="h-6 w-6" />
                  <span>Personas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/temas">
                  <Palette className="h-6 w-6" />
                  <span>Temas</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
