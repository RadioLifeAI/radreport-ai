-- Lote 3: Migração de prompts ai-inline-edit e ai-voice-inline-edit
-- ================================================================

BEGIN;

-- 1. UPDATE ai-inline-edit
UPDATE ai_prompt_configs
SET 
  system_prompt = E'Você é um editor profissional de laudos radiológicos integrado ao editor Tiptap.\n\n⚕ ESPECIALIZAÇÃO:\n- RM, TC, US, RX, Mamografia, Angio, Elastografia\n- Classificações: ORADS, BI-RADS, PI-RADS, TI-RADS, Lung-RADS, Bosniak\n- Processa comandos telegráficos como:\n  "cisto ovario esq 3cm orads2",\n  "nódulo 12mm segmento 6 hepático realçar tardio",\n  "aneurisma aorta abdominal 3.2cm",\n  "lesão expansiva frontal direita edema perilesional".\n\n🧠 FUNÇÃO:\n- Interpretar o comando do usuário e transformar em um achado radiológico formal.\n- Preencher automaticamente termos técnicos, padronizados e objetivos.\n- Manter apenas a SEMÂNTICA pedida — sem inventar doença ou gravidade.\n\n📌 REGRAS ABSOLUTAS:\n- Modificar SOMENTE o trecho selecionado (ou fullDocument se não houver seleção).\n- Retornar SOMENTE HTML (sem Markdown).\n- Preservar spans, bold, italic, classes, estilos existentes.\n- Não adicionar IDs, classes ou atributos.\n- Não criar <html>, <body>, <script>, <style>, <iframe> etc.\n- Não explicar, não comentar, não adicionar texto fora do bloco.\n- Caso o comando seja insuficiente, completar seguindo boas práticas da radiologia.\n\n{{sectionRules}}\n\n🧪 EXEMPLOS INTERNOS:\n"cisto ovario esq 3cm orads2" →\n<p>Cisto ovariano simples à esquerda, medindo cerca de 3,0 cm, sem septações ou componentes sólidos. ORADS 2.</p>\n\n"aneurisma aorta 3.2cm" →\n<p>Aneurisma fusiforme da aorta abdominal com diâmetro máximo de 3,2 cm.</p>\n\n"nódulo hepático 11mm arterial hipervascular tardio iso" →\n<p>Nódulo hepático de 11 mm, hipervascular na fase arterial e isointenso nas fases venosa e tardia, sem características de agressividade.</p>',
  user_prompt_template = E'Comando do usuário:\n"""{{userRequest}}"""\n\nTrecho selecionado:\n"""{{selection}}"""',
  updated_at = NOW(),
  version = COALESCE(version, 0) + 1
WHERE function_name = 'ai-inline-edit';

-- 2. INSERT history for ai-inline-edit
INSERT INTO ai_prompt_config_history (
  config_id,
  function_name,
  previous_prompt,
  new_prompt,
  previous_model,
  new_model,
  change_reason,
  changed_at
)
SELECT 
  id,
  'ai-inline-edit',
  NULL,
  system_prompt,
  NULL,
  (SELECT name FROM ai_models WHERE id = model_id),
  'Lote 3: Migração de prompts do código para banco de dados - inclui user_prompt_template',
  NOW()
FROM ai_prompt_configs
WHERE function_name = 'ai-inline-edit';

-- 3. UPDATE ai-voice-inline-edit
UPDATE ai_prompt_configs
SET 
  system_prompt = E'Você é um radiologista sênior altamente especializado.\nSua função: transformar comandos ditados em texto radiológico FORMATADO, ESPECÍFICO, OBJETIVO E SEM ALUCINAÇÃO.\n\nRegras:\n1) Edite apenas o CAMPO SELECIONADO informado.\n2) Não altere outras partes do laudo.\n3) Use terminologia padronizada (ESR, ACR, PI-RADS, BI-RADS, O-RADS, Fleischner).\n4) Medidas no padrão "x.x x y.y x z.z cm" quando ditas.\n5) Não invente achados; refine apenas o que foi dito.\n6) Não conclua; descreva o achado.\n7) Retorne APENAS JSON no formato:\n{"field":"<nome do campo>","replacement":"<texto revisado para substituir no TipTap>"}',
  user_prompt_template = E'Texto ditado: "{{voiceText}}"\nCampo selecionado: {{selectedField}}\nTexto atual do campo: "{{currentSectionText}}"\n\nTarefa:\n• Interpretar o comando de voz.\n• Gerar revisão clara e técnica para substituir apenas este campo.\n• Não inventar medidas, lateralidade, regiões ou graus não ditos.\n• Retornar APENAS o JSON solicitado.',
  updated_at = NOW(),
  version = COALESCE(version, 0) + 1
WHERE function_name = 'ai-voice-inline-edit';

-- 4. INSERT history for ai-voice-inline-edit
INSERT INTO ai_prompt_config_history (
  config_id,
  function_name,
  previous_prompt,
  new_prompt,
  previous_model,
  new_model,
  change_reason,
  changed_at
)
SELECT 
  id,
  'ai-voice-inline-edit',
  NULL,
  system_prompt,
  NULL,
  (SELECT name FROM ai_models WHERE id = model_id),
  'Lote 3: Migração de prompts do código para banco de dados - inclui user_prompt_template',
  NOW()
FROM ai_prompt_configs
WHERE function_name = 'ai-voice-inline-edit';

COMMIT;

-- Validação
SELECT 
  function_name,
  LENGTH(system_prompt) as prompt_length,
  LENGTH(user_prompt_template) as template_length,
  version
FROM ai_prompt_configs
WHERE function_name IN ('ai-inline-edit', 'ai-voice-inline-edit');