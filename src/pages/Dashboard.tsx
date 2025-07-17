import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Zap, Plus, Palette, Building } from "lucide-react";
import { Link } from "react-router-dom";
import PostGenerator from "./PostGenerator";

const metrics = [
  {
    title: "Posts Criados",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Engajamento Médio",
    value: "8.5%",
    change: "+2.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Personas Ativas",
    value: "5",
    change: "+1",
    trend: "up",
    icon: Users,
  },
  {
    title: "Campanhas",
    value: "23",
    change: "+7%",
    trend: "up",
    icon: Zap,
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
  return (
    <div className="p-6 space-y-6">
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
        {/* Criador de Conteúdo */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-foreground">Criar Novo Post</CardTitle>
            <CardDescription>
              Use IA para gerar posts incríveis para suas redes sociais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostGenerator />
          </CardContent>
        </Card>

        {/* Posts Recentes */}
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Posts Recentes</CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos seus últimos posts
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{post.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.platform}</span>
                      <span>•</span>
                      <span>Engajamento: {post.engagement}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={post.status === "Ativo" ? "default" : 
                             post.status === "Programado" ? "secondary" : "outline"}
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as ferramentas mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link to="/criar-tema">
                <Palette className="h-6 w-6" />
                <span>Criar Tema</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link to="/criar-persona">
                <Users className="h-6 w-6" />
                <span>Criar Persona</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link to="/criar-marca">
                <Building className="h-6 w-6" />
                <span>Criar Marca</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}