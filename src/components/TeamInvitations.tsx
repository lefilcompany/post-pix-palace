import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { teamService, TeamInvitation } from "@/services/teamService";
import { toast } from "sonner";
import { UserCheck, UserX, Users } from "lucide-react";

interface TeamInvitationsProps {
  teamId: number;
}

export const TeamInvitations = ({ teamId }: TeamInvitationsProps) => {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvitations = async () => {
    try {
      const data = await teamService.getPendingInvitations(teamId);
      setInvitations(data);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [teamId]);

  const handleApprove = async (invitationId: number) => {
    setIsLoading(true);
    try {
      await teamService.approveInvitation(invitationId);
      toast.success("Usuário aprovado com sucesso!");
      fetchInvitations();
    } catch (error: any) {
      toast.error("Erro ao aprovar usuário: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (invitationId: number) => {
    setIsLoading(true);
    try {
      await teamService.rejectInvitation(invitationId);
      toast.success("Solicitação rejeitada");
      fetchInvitations();
    } catch (error: any) {
      toast.error("Erro ao rejeitar solicitação: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Solicitações de Acesso
          </CardTitle>
          <CardDescription>
            Gerencie as solicitações para entrar na sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhuma solicitação pendente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Solicitações de Acesso
          <Badge variant="secondary">{invitations.length}</Badge>
        </CardTitle>
        <CardDescription>
          Gerencie as solicitações para entrar na sua equipe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">
                  {(invitation as any).profiles?.full_name || 'Usuário'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Solicitou acesso em {new Date(invitation.created_at || '').toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(invitation.id)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(invitation.id)}
                  disabled={isLoading}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};