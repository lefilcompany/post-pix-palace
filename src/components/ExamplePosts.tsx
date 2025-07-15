import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import marketingExample from "@/assets/marketing-example.jpg";

const examplePosts = [
  {
    id: 1,
    title: "Lançamento de Produto",
    platform: "instagram",
    imageUrl: marketingExample,
    description: "Post promocional com design moderno e cores vibrantes",
    tags: ["produto", "lançamento", "moderno"]
  },
  {
    id: 2,
    title: "Campanha de Engajamento",
    platform: "facebook",
    imageUrl: marketingExample,
    description: "Layout profissional com call-to-action marcante",
    tags: ["engajamento", "campanha", "cta"]
  },
  {
    id: 3,
    title: "Conteúdo Educacional",
    platform: "linkedin",
    imageUrl: marketingExample,
    description: "Design corporativo com informações relevantes",
    tags: ["educacional", "corporativo", "informativo"]
  }
];

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function ExamplePosts() {
  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Exemplos de Posts Gerados</h3>
        <p className="text-muted-foreground">
          Veja alguns exemplos do que você pode criar com nosso gerador
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examplePosts.map((post) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
          
          return (
            <Card key={post.id} className="group hover:shadow-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-primary">
                      <PlatformIcon size={12} className="mr-1" />
                      {post.platform}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{post.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Cada imagem é gerada única e personalizadamente baseada nas suas especificações
        </p>
      </div>
    </div>
  );
}