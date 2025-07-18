import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teamService, Team } from "@/services/teamService";
import { toast } from "sonner";

interface TeamOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'create-team' | 'join-team' | 'team-found' | 'request-sent';

export const TeamOnboarding = ({ isOpen, onComplete }: TeamOnboardingProps) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [teamData, setTeamData] = useState({
    name: '',
    code: ''
  });
  const [joinCode, setJoinCode] = useState('');
  const [foundTeam, setFoundTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamData.name.trim()) {
      toast.error("Nome da equipe é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      const teamCode = teamData.code || teamService.generateTeamCode();
      await teamService.createTeam({
        name: teamData.name,
        team_code: teamCode
      });
      
      toast.success("Equipe criada com sucesso!");
      onComplete();
    } catch (error: any) {
      toast.error("Erro ao criar equipe: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTeam = async () => {
    if (!joinCode.trim()) {
      toast.error("Código da equipe é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      const team = await teamService.getTeamByCode(joinCode);
      if (team) {
        setFoundTeam(team);
        setStep('team-found');
      } else {
        toast.error("Equipe não encontrada com este código");
      }
    } catch (error: any) {
      toast.error("Erro ao buscar equipe: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!foundTeam) return;

    setIsLoading(true);
    try {
      await teamService.createInvitation({ team_id: foundTeam.id });
      toast.success("Solicitação enviada! Aguarde a aprovação do administrador.");
      setStep('request-sent');
    } catch (error: any) {
      toast.error("Erro ao enviar solicitação: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        {step === 'welcome' && (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">L</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Vamos Começar!</h2>
              <p className="text-muted-foreground">
                Crie ou entre em uma equipe para gerenciar marcas, gerar conteúdos personalizados 
                e acompanhar o desempenho de suas campanhas em um só lugar.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Escolha uma opção para continuar
              </p>
            </div>

            <div className="flex space-x-4 w-full">
              <Button 
                onClick={() => setStep('create-team')} 
                className="flex-1"
              >
                Criar Equipe
              </Button>
              <Button 
                onClick={() => setStep('join-team')} 
                variant="outline" 
                className="flex-1"
              >
                Entrar em Equipe
              </Button>
            </div>
          </div>
        )}

        {step === 'create-team' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Crie sua Equipe de Conteúdo</h2>
              <p className="text-muted-foreground">
                Organize sua marca, convide colaboradores e comece a gerar conteúdos de forma inteligente.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Nome da Equipe</Label>
                <Input
                  id="teamName"
                  placeholder="Digite o nome da sua equipe"
                  value={teamData.name}
                  onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="teamCode">Código da Equipe (opcional)</Label>
                <Input
                  id="teamCode"
                  placeholder="Deixe em branco para gerar automaticamente"
                  value={teamData.code}
                  onChange={(e) => setTeamData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Este será o espaço onde sua equipe poderá planejar, criar e gerenciar conteúdos e campanhas.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => setStep('welcome')} 
                variant="outline" 
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleCreateTeam} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Equipe"}
              </Button>
            </div>
          </div>
        )}

        {step === 'join-team' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Entre na sua Equipe de Criação</h2>
              <p className="text-muted-foreground">
                Colabore, gerencie e crie conteúdos incríveis com sua equipe.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="joinCode">Código de Acesso da Equipe</Label>
                <Input
                  id="joinCode"
                  placeholder="Digite o código da equipe"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Insira o código compartilhado pela sua equipe para acessar projetos, conteúdos e análises.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => setStep('welcome')} 
                variant="outline" 
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSearchTeam} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Buscando..." : "Buscar Equipe"}
              </Button>
            </div>
          </div>
        )}

        {step === 'team-found' && foundTeam && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Equipe Encontrada!</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{foundTeam.name}</CardTitle>
                <CardDescription>
                  Administrador: {(foundTeam as any).profiles?.full_name || 'Não informado'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Solicite acesso para começar a colaborar com esta equipe.
                </p>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button 
                onClick={() => setStep('join-team')} 
                variant="outline" 
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleRequestAccess} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Solicitar Acesso"}
              </Button>
            </div>
          </div>
        )}

        {step === 'request-sent' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Solicitação Enviada!</h2>
              <p className="text-muted-foreground">
                Sua solicitação foi enviada para o administrador da equipe. 
                Você receberá uma notificação quando for aprovado.
              </p>
            </div>

            <Button onClick={onComplete} className="w-full">
              Entendi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};