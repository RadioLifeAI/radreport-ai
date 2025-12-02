-- Migration: Fix placeholder inconsistencies in ai_prompt_configs
-- Aligns user_prompt_template placeholders with Edge Function user_data keys (snake_case)

-- 1. ai-generate-conclusion: {{examTitle}} → {{exam_title}}, {{findingsHtml}} → {{findings}}
UPDATE ai_prompt_configs
SET user_prompt_template = 'Modalidade: {{modality}}
Título do Exame: {{exam_title}}

=== ACHADOS DO LAUDO ===
{{findings}}
=== FIM DOS ACHADOS ===

TAREFA: INTERPRETAR os achados acima como radiologista experiente.
- O que cada descrição radiológica SIGNIFICA clinicamente?
- Traduzir terminologia da modalidade ({{modality}}) em diagnósticos.
- NUNCA repetir o achado - SEMPRE dar o diagnóstico.

Retorne JSON: {"replacement": "<p>- Diagnóstico 1.</p><p>- Diagnóstico 2.</p>", "note": "Observações opcionais"}',
    updated_at = now()
WHERE function_name = 'ai-generate-conclusion';

-- 2. ai-rads-classification: {{examTitle}} → {{exam_title}}, {{paragraphsText}} → {{findings}}
UPDATE ai_prompt_configs
SET user_prompt_template = 'Modalidade: {{modality}}
Exame: {{exam_title}}

Achados:
{{findings}}

Analise os achados acima e forneça a classificação RADS apropriada para a modalidade.',
    updated_at = now()
WHERE function_name = 'ai-rads-classification';

-- 3. ai-inline-edit: {{userRequest}} → {{user_request}}, ADD {{section_rules}}
UPDATE ai_prompt_configs
SET user_prompt_template = '{{section_rules}}

Comando do usuário:
"""{{user_request}}"""

Trecho selecionado:
"""{{selection}}"""

Retorne APENAS o HTML corrigido, sem explicações.',
    updated_at = now()
WHERE function_name = 'ai-inline-edit';

-- 4. ai-voice-inline-edit: camelCase → snake_case
UPDATE ai_prompt_configs
SET user_prompt_template = 'Texto ditado: "{{voice_text}}"
Campo selecionado: {{selected_field}}
Texto atual do campo: "{{current_section_text}}"

Tarefa:
• Interpretar o comando de voz.
• Gerar revisão clara e técnica para substituir apenas este campo.
• Não inventar medidas, lateralidade, regiões ou graus não ditos.
• Retornar APENAS JSON: {"replacement": "texto formatado"}'
WHERE function_name = 'ai-voice-inline-edit';