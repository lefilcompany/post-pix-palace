import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const {
      main_message,
      feeling,
      format,
      content_type,
      platform,
      brand_id,
      theme_id,
      team_id,
      generate_image = false,
      image_prompt
    } = await req.json();

    console.log('Generating content for:', main_message);

    // Get brand and theme information for context
    const { data: brand } = await supabaseClient
      .from('brands')
      .select('*')
      .eq('id', brand_id)
      .single();

    const { data: theme } = await supabaseClient
      .from('themes')
      .select('*')
      .eq('id', theme_id)
      .single();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate text content
    const textPrompt = `
      Como especialista em copywriting para redes sociais, crie um post com as seguintes especificações:
      
      Mensagem principal: ${main_message}
      Sentimento: ${feeling}
      Formato: ${format}
      Tipo de conteúdo: ${content_type}
      Plataforma: ${platform}
      
      Contexto da marca:
      Nome: ${brand?.name}
      Missão: ${brand?.brand_mission}
      Personalidade: ${brand?.brand_personality}
      Tom de voz: ${brand?.brand_voice}
      Público-alvo: ${brand?.target_audience}
      
      Tema:
      Título: ${theme?.title}
      Descrição: ${theme?.description}
      Objetivos: ${theme?.objectives?.join(', ')}
      
      Crie um texto envolvente que:
      1. Mantenha consistência com a personalidade da marca
      2. Seja adequado para a plataforma ${platform}
      3. Transmita o sentimento "${feeling}"
      4. Inclua chamadas para ação relevantes
      5. Use hashtags apropriadas do tema: ${theme?.hashtags?.join(' ')}
      
      Retorne apenas o texto do post, otimizado para ${platform}.
    `;

    const textResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em copywriting para redes sociais, criando conteúdo envolvente e otimizado para cada plataforma.' },
          { role: 'user', content: textPrompt }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    const textData = await textResponse.json();
    const generatedText = textData.choices[0].message.content;

    console.log('Text content generated');

    let imageUrl = null;
    
    // Generate image if requested
    if (generate_image && image_prompt) {
      console.log('Generating image with prompt:', image_prompt);
      
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: `${image_prompt}. Estilo visual consistente com a marca ${brand?.name}. ${brand?.brand_personality}. Adequado para ${platform}.`,
          n: 1,
          size: '1024x1024',
          quality: 'high',
          output_format: 'webp'
        }),
      });

      const imageData = await imageResponse.json();
      if (imageData.data && imageData.data[0]) {
        imageUrl = imageData.data[0].b64_json ? `data:image/webp;base64,${imageData.data[0].b64_json}` : imageData.data[0].url;
      }
      
      console.log('Image generated');
    }

    // Save the content to database
    const { data: content, error } = await supabaseClient
      .from('contents')
      .insert({
        user_id: user.id,
        team_id,
        brand_id,
        theme_id,
        main_message,
        feeling,
        format,
        content_type,
        platform,
        response_ai: generatedText,
        image_url: imageUrl,
        micro_result: `Conteúdo gerado para ${platform}`,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Content saved:', content.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: {
          ...content,
          generated_text: generatedText,
          image_url: imageUrl
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});