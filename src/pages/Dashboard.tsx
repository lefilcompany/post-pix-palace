import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Users, Palette, Building, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getMetrics = (contentCount: number, brandCount: number, themeCount: number, personaCount: number) => [
  {
    title: "Conteúdos Criados",
    value: contentCount.toString(),
    change: "+12%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Marcas Ativas",
    value: brandCount.toString(),
    change: "+2",
    trend: "up",
    icon: Building,
  },
  {
    title: "Temas Ativos",
    value: themeCount.toString(),
    change: "+1",
    trend: "up",
    icon: Palette,
  },
  {
    title: "Personas Ativas",
    value: personaCount.toString(),
    change: "+1",
    trend: "up",
    icon: Users,
  },
];

const recentPosts = [
  {
    id: 1,
    title: "Campanha de Verão 2024",
    platform: "Instagram",
    engagement: "12.5%",
    status: "Ativo",
  },
  {
    id: 2,
    title: "Lançamento Produto X",
    platform: "LinkedIn",
    engagement: "8.3%",
    status: "Programado",
  },
  {
    id: 3,
    title: "Black Friday Preview",
    platform: "Facebook",
    engagement: "15.2%",
    status: "Concluído",
  },
];

export default function Dashboard() {
  const [contentCount, setContentCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [themeCount, setThemeCount] = useState(0);
  const [personaCount, setPersonaCount] = useState(0);
  const [recentContents, setRecentContents] = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchRecentContents();
  }, []);

  const fetchCounts = async () => {
    try {
      const [contentData, brandData, themeData, personaData] = await Promise.all([
        supabase.from('Content').select('*', { count: 'exact', head: true }),
        supabase.from('Brand').select('*', { count: 'exact', head: true }),
        supabase.from('Theme').select('*', { count: 'exact', head: true }),
        supabase.from('Persona').select('*', { count: 'exact', head: true }),
      ]);

      setContentCount(contentData.count || 0);
      setBrandCount(brandData.count || 0);
      setThemeCount(themeData.count || 0);
      setPersonaCount(personaData.count || 0);
    } catch (error) {
      console.error('Erro ao buscar contadores:', error);
    }
  };

  const fetchRecentContents = async () => {
    try {
      const { data } = await supabase
        .from('Content')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(5);
      
      setRecentContents(data || []);
    } catch (error) {
      console.error('Erro ao buscar conteúdos recentes:', error);
    }
  };

  const metrics = getMetrics(contentCount, brandCount, themeCount, personaCount);

  return (
    <div className="p-6 space-y-6">
      {/* Saudação */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Home className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, Usuário</h1>
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
                Acompanhe os seus últimos conteúdos criados
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/historico">
                <Plus className="h-4 w-4 mr-2" />
                Ver Todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => window.open(`/conteudo/${content.id}`, '_blank')}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{content.mainMessage}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{content.format}</span>
                      <span>•</span>
                      <span>{content.feeling}</span>
                    </div>
                  </div>
                  <Badge variant="default">
                    Ativo
                  </Badge>
                </div>
              ))}
              {recentContents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum conteúdo criado ainda
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/criar-conteudo">
                  <Plus className="h-6 w-6" />
                  <span>Criar Conteúdo</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/temas">
                  <Palette className="h-6 w-6" />
                  <span>Temas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/personas">
                  <Users className="h-6 w-6" />
                  <span>Personas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/marcas">
                  <Building className="h-6 w-6" />
                  <span>Marcas</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}