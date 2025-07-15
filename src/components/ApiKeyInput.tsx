import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink, Shield } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      // Salvar a chave no localStorage para persistência
      localStorage.setItem('openai_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
    } catch (error) {
      console.error('Erro ao configurar API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-elegant">
        <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Key size={24} />
            Configurar API OpenAI
          </CardTitle>
          <CardDescription className="text-white/90">
            Configure sua chave da API OpenAI para começar a usar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Alert className="border-primary/20 bg-primary/5">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Sua chave da API será armazenada apenas localmente no seu navegador e não será enviada para nenhum servidor externo.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API OpenAI</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={!apiKey.trim() || isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                {isLoading ? "Configurando..." : "Confirmar e Continuar"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Não tem uma chave da API?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Obter Chave da API OpenAI
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Como obter sua chave da API:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Acesse platform.openai.com/api-keys</li>
                <li>Faça login na sua conta OpenAI</li>
                <li>Clique em "Create new secret key"</li>
                <li>Copie a chave gerada</li>
                <li>Cole aqui e clique em "Confirmar"</li>
              </ol>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}