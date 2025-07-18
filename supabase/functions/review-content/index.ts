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
      content_text,
      content_image_url,
      content_video_url,
      review_type,
      brand_id,
      theme_id,
      team_id,
      platform
    } = await req.json();

    console.log('Reviewing content:', review_type);

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

    // Generate comprehensive review
    const reviewPrompt = `
      Como especialista em marketing de conteúdo e análise de performance, faça uma análise completa do seguinte conteúdo:
      
      CONTEÚDO PARA ANÁLISE:
      Texto: ${content_text}
      ${content_image_url ? `Imagem: ${content_image_url}` : ''}
      ${content_video_url ? `Vídeo: ${content_video_url}` : ''}
      Plataforma: ${platform}
      Tipo de revisão: ${review_type}
      
      CONTEXTO DA MARCA:
      Nome: ${brand?.name}
      Missão: ${brand?.brand_mission}
      Personalidade: ${brand?.brand_personality}
      Tom de voz: ${brand?.brand_voice}
      Público-alvo: ${brand?.target_audience}
      Diferenciais: ${brand?.brand_differentials}
      
      CONTEXTO DO TEMA:
      Título: ${theme?.title}
      Descrição: ${theme?.description}
      Objetivos: ${theme?.objectives?.join(', ')}
      
      Forneça uma análise detalhada incluindo:
      
      1. PONTOS POSITIVOS:
      - O que está funcionando bem
      - Alinhamento com a marca
      - Adequação à plataforma
      
      2. PONTOS NEGATIVOS:
      - Oportunidades de melhoria
      - Inconsistências com a marca
      - Problemas de adequação à plataforma
      
      3. SUGESTÕES DE MELHORIA:
      - Mudanças específicas no texto
      - Otimizações para a plataforma
      - Melhorias na mensagem
      
      4. DICAS DE ENGAJAMENTO:
      - Estratégias para aumentar interação
      - Horários ideais para publicação
      - Hashtags mais eficazes
      - Chamadas para ação mais atrativas
      
      5. PONTUAÇÃO GERAL (1-10):
      - Justifique a nota considerando todos os aspectos
      
      Seja específico e prático em suas recomendações.
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
          { role: 'system', content: 'Você é um especialista em marketing de conteúdo e análise de performance, fornecendo feedback construtivo e acionável.' },
          { role: 'user', content: reviewPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const aiAnalysis = aiData.choices[0].message.content;

    // Parse the AI response to extract structured data
    const analysisLines = aiAnalysis.split('\n').filter(line => line.trim());
    
    let positivePoints = '';
    let negativePoints = '';
    let improvementSuggestions = '';
    let engagementTips = '';
    let overallScore = 7; // Default score

    // Extract sections from AI response
    let currentSection = '';
    for (const line of analysisLines) {
      if (line.includes('PONTOS POSITIVOS') || line.includes('1.')) {
        currentSection = 'positive';
        continue;
      } else if (line.includes('PONTOS NEGATIVOS') || line.includes('2.')) {
        currentSection = 'negative';
        continue;
      } else if (line.includes('SUGESTÕES DE MELHORIA') || line.includes('3.')) {
        currentSection = 'improvement';
        continue;
      } else if (line.includes('DICAS DE ENGAJAMENTO') || line.includes('4.')) {
        currentSection = 'engagement';
        continue;
      } else if (line.includes('PONTUAÇÃO GERAL') || line.includes('5.')) {
        currentSection = 'score';
        continue;
      }

      if (currentSection === 'positive') {
        positivePoints += line + '\n';
      } else if (currentSection === 'negative') {
        negativePoints += line + '\n';
      } else if (currentSection === 'improvement') {
        improvementSuggestions += line + '\n';
      } else if (currentSection === 'engagement') {
        engagementTips += line + '\n';
      } else if (currentSection === 'score') {
        const scoreMatch = line.match(/(\d+)/);
        if (scoreMatch) {
          overallScore = parseInt(scoreMatch[1]);
        }
      }
    }

    console.log('AI analysis generated');

    // Save the review to database
    const { data: review, error } = await supabaseClient
      .from('content_reviews')
      .insert({
        user_id: user.id,
        team_id,
        brand_id,
        theme_id,
        content_text,
        content_image_url,
        content_video_url,
        review_type,
        positive_points: positivePoints.trim(),
        negative_points: negativePoints.trim(),
        improvement_suggestions: improvementSuggestions.trim(),
        engagement_tips: engagementTips.trim(),
        overall_score: overallScore,
        ai_analysis: aiAnalysis
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Review saved:', review.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        review: {
          ...review,
          ai_analysis: aiAnalysis
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in review-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});