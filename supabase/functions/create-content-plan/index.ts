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
      title,
      description,
      target_audience,
      post_count,
      platforms,
      frequency,
      duration_days,
      content_types,
      objectives,
      brand_id,
      theme_id,
      team_id
    } = await req.json();

    console.log('Creating content plan for:', title);

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

    // Generate AI suggestions for the content plan
    const prompt = `
      Como especialista em marketing de conteúdo, crie um plano detalhado de publicação com as seguintes informações:
      
      Título: ${title}
      Descrição: ${description}
      Público-alvo: ${target_audience}
      Número de posts: ${post_count}
      Plataformas: ${platforms?.join(', ')}
      Frequência: ${frequency}
      Duração: ${duration_days} dias
      Tipos de conteúdo: ${content_types?.join(', ')}
      Objetivos: ${objectives?.join(', ')}
      
      Marca: ${brand?.name}
      Missão da marca: ${brand?.brand_mission}
      Personalidade da marca: ${brand?.brand_personality}
      
      Tema: ${theme?.title}
      Descrição do tema: ${theme?.description}
      
      Forneça um plano detalhado incluindo:
      1. Cronograma de publicação
      2. Ideias específicas para cada post
      3. Tipos de conteúdo recomendados para cada plataforma
      4. Estratégias de engajamento
      5. Hashtags recomendadas
      6. Métricas para acompanhar
      7. Chamadas para ação sugeridas
      
      Seja específico e prático, focando na consistência com a marca e tema fornecidos.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em marketing de conteúdo e planejamento estratégico de redes sociais.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const aiSuggestions = aiData.choices[0].message.content;

    console.log('AI suggestions generated');

    // Save the content plan to database
    const { data: contentPlan, error } = await supabaseClient
      .from('content_plans')
      .insert({
        user_id: user.id,
        team_id,
        brand_id,
        theme_id,
        title,
        description,
        target_audience,
        post_count,
        platforms,
        frequency,
        duration_days,
        content_types,
        objectives,
        ai_suggestions: aiSuggestions
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Content plan created:', contentPlan.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        contentPlan,
        aiSuggestions 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-content-plan:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});