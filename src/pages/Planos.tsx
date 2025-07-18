import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Building, Palette, UserCheck, FileText, Calendar, MessageSquare, CheckCircle } from "lucide-react";
import { supabaseService, Plan } from "@/services/supabase";
import { toast } from "sonner";

export default function Planos() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await supabaseService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      toast.error("Erro ao carregar planos");
    }
  };

  const getPlanIcon = (planType: string) => {
    const icons: { [key: string]: JSX.Element } = {
      free: <UserCheck className="h-6 w-6" />,
      basic: <Building className="h-6 w-6" />,
      premium: <Crown className="h-6 w-6" />,
      enterprise: <Users className="h-6 w-6" />,
    };
    return icons[planType.toLowerCase()] || <UserCheck className="h-6 w-6" />;
  };

  const getPlanColor = (planType: string) => {
    const colors: { [key: string]: string } = {
      free: "from-gray-500 to-gray-600",
      basic: "from-blue-500 to-blue-600",
      premium: "from-purple-500 to-purple-600",
      enterprise: "from-amber-500 to-amber-600",
    };
    return colors[planType.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  const handleSubscribe = async (planId: number, planName: string) => {
    setIsLoading(true);
    try {
      // Here you would implement the subscription logic
      // For now, just show a success message
      toast.success(`Plano ${planName} selecionado! Em breve implementaremos a integração com pagamento.`);
    } catch (error) {
      console.error("Erro ao assinar plano:", error);
      toast.error("Erro ao processar assinatura");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Users className="h-4 w-4" />, label: "Membros", key: "members_limit" },
    { icon: <Building className="h-4 w-4" />, label: "Marcas", key: "brands_limit" },
    { icon: <Palette className="h-4 w-4" />, label: "Temas", key: "themes_limit" },
    { icon: <UserCheck className="h-4 w-4" />, label: "Personas", key: "personas_limit" },
    { icon: <FileText className="h-4 w-4" />, label: "Conteúdos", key: "content_limit" },
    { icon: <Calendar className="h-4 w-4" />, label: "Planejamentos", key: "planning_limit" },
    { icon: <MessageSquare className="h-4 w-4" />, label: "Revisões", key: "review_limit" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Escolha Seu Plano</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Encontre o plano perfeito para suas necessidades de marketing de conteúdo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`border-border/40 relative overflow-hidden ${
              plan.plan_type === 'premium' ? 'border-2 border-primary shadow-lg scale-105' : ''
            }`}
          >
            {plan.plan_type === 'premium' && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                POPULAR
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${getPlanColor(plan.plan_type)} flex items-center justify-center text-white`}>
                  {getPlanIcon(plan.plan_type)}
                </div>
                <Badge 
                  variant={plan.plan_type === 'free' ? 'secondary' : 'default'}
                  className="capitalize"
                >
                  {plan.plan_type}
                </Badge>
              </div>
              <div>
                <CardTitle className="text-xl mb-1">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm">/mês</span>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">
                        {feature.icon}
                      </div>
                      <span>{feature.label}</span>
                    </div>
                    <span className="font-semibold">
                      {plan[feature.key as keyof Plan] === -1 ? '∞' : plan[feature.key as keyof Plan]?.toString()}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6"
                variant={plan.plan_type === 'free' ? 'outline' : 'default'}
                onClick={() => handleSubscribe(plan.id, plan.name)}
                disabled={isLoading}
              >
                {plan.plan_type === 'free' ? 'Começar Grátis' : 'Assinar Plano'}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {plan.plan_type === 'free' ? 
                    'Ideal para começar' : 
                    plan.plan_type === 'enterprise' ? 
                    'Suporte prioritário incluído' :
                    'Cancelar a qualquer momento'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="max-w-4xl mx-auto border-border/40">
          <CardHeader>
            <CardTitle className="text-2xl">Recursos Inclusos em Todos os Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Dashboard intuitivo",
                "Análise de performance",
                "Templates prontos",
                "Suporte por email",
                "Backups automáticos",
                "SSL e segurança",
                "Integrações via API",
                "Relatórios básicos",
                "Mobile responsivo"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Tem dúvidas? Entre em contato conosco para encontrar o plano ideal para você.
        </p>
        <Button variant="outline" className="mt-4">
          Falar com Vendas
        </Button>
      </div>
    </div>
  );
}