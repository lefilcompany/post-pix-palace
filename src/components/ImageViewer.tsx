import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ImageViewerProps {
  imageUrl: string;
  postData: {
    title: string;
    content: string;
    platform: string;
    tone: string;
    keywords: string[];
  };
}

export function ImageViewer({ imageUrl, postData }: ImageViewerProps) {
  const [copied, setCopied] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `post-${postData.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem baixada com sucesso!");
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(postData.content);
      setCopied(true);
      toast.success("Conteúdo copiado para área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar conteúdo");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postData.title,
          text: postData.content,
          url: imageUrl,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      toast.info("Compartilhamento não suportado neste navegador");
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Post Gerado</CardTitle>
        <CardDescription className="text-white/90">
          Sua imagem foi gerada com sucesso
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Imagem */}
          <div className="relative">
            <img
              ref={imageRef}
              src={imageUrl}
              alt={postData.title}
              className="w-full h-auto rounded-lg shadow-lg transition-transform hover:scale-105"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white"
              >
                <Download size={16} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleShare}
                className="bg-white/90 hover:bg-white"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>

          {/* Informações do Post */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">{postData.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="capitalize">
                  {postData.platform}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {postData.tone}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Conteúdo do Post:</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyContent}
                  className="h-8"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
              <div className="p-3 bg-secondary rounded-lg text-sm">
                {postData.content}
              </div>
            </div>

            {postData.keywords.length > 0 && (
              <div>
                <Label className="font-semibold">Palavras-chave:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {postData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Imagem
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 transition-smooth"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-sm font-medium ${className}`}>{children}</span>;
}