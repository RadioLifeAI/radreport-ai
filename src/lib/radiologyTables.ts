export interface RadiologyTable {
  id: string
  name: string
  category: string
  subcategory?: string
  modality?: string[]
  htmlContent: string
}

export interface TableCategory {
  id: string
  name: string
  icon: string
  tables: RadiologyTable[]
}

export const RADIOLOGY_TABLES: TableCategory[] = [
  {
    id: 'rads',
    name: 'Classificações RADS',
    icon: 'Award',
    tables: [
      {
        id: 'birads',
        name: 'BI-RADS (Mama)',
        category: 'rads',
        modality: ['MG', 'US', 'RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">BI-RADS - Sistema de Classificação Mamária</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Avaliação</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Risco</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Incompleto</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">-</td><td style="border:1px solid #ddd; padding:6px 8px;">Necessita avaliação adicional</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Negativo</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0%</td><td style="border:1px solid #ddd; padding:6px 8px;">Rastreamento de rotina</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Achado benigno</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0%</td><td style="border:1px solid #ddd; padding:6px 8px;">Rastreamento de rotina</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">Provavelmente benigno</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;2%</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento de curto prazo (6 meses)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4A</td><td style="border:1px solid #ddd; padding:6px 8px;">Baixa suspeita</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2-10%</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia recomendada</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4B</td><td style="border:1px solid #ddd; padding:6px 8px;">Moderada suspeita</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">10-50%</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia recomendada</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4C</td><td style="border:1px solid #ddd; padding:6px 8px;">Alta suspeita</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">50-95%</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia altamente recomendada</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">5</td><td style="border:1px solid #ddd; padding:6px 8px;">Altamente sugestivo de malignidade</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&gt;95%</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia obrigatória</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">6</td><td style="border:1px solid #ddd; padding:6px 8px;">Malignidade comprovada</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">100%</td><td style="border:1px solid #ddd; padding:6px 8px;">Tratamento oncológico</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'tirads',
        name: 'TI-RADS ACR (Tireoide)',
        category: 'rads',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">TI-RADS ACR 2017 - Sistema de Pontuação para Nódulos Tireoideanos</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontos</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Risco</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">TR1 - Benigno</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0,3%</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem indicação de PAAF</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">TR2 - Não suspeito</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1,5%</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem indicação de PAAF</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">TR3 - Levemente suspeito</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4,8%</td><td style="border:1px solid #ddd; padding:6px 8px;">PAAF se ≥2,5cm / Seguimento se ≥1,5cm</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">TR4 - Moderadamente suspeito</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4-6</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">9,1%</td><td style="border:1px solid #ddd; padding:6px 8px;">PAAF se ≥1,5cm / Seguimento se ≥1,0cm</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">TR5 - Altamente suspeito</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≥7</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">35%</td><td style="border:1px solid #ddd; padding:6px 8px;">PAAF se ≥1,0cm / Seguimento se ≥0,5cm</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'pirads',
        name: 'PI-RADS v2.1 (Próstata)',
        category: 'rads',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">PI-RADS v2.1 - Probabilidade de Câncer de Próstata Clinicamente Significativo</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Probabilidade</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">PI-RADS 1</td><td style="border:1px solid #ddd; padding:6px 8px;">Muito baixa (câncer clinicamente significativo altamente improvável)</td><td style="border:1px solid #ddd; padding:6px 8px;">Vigilância ativa ou seguimento de rotina</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">PI-RADS 2</td><td style="border:1px solid #ddd; padding:6px 8px;">Baixa (câncer clinicamente significativo improvável)</td><td style="border:1px solid #ddd; padding:6px 8px;">Vigilância ativa ou seguimento de rotina</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">PI-RADS 3</td><td style="border:1px solid #ddd; padding:6px 8px;">Intermediária (presença de câncer clinicamente significativo equívoca)</td><td style="border:1px solid #ddd; padding:6px 8px;">Avaliar biópsia ou seguimento, considerar PSA e contexto clínico</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">PI-RADS 4</td><td style="border:1px solid #ddd; padding:6px 8px;">Alta (câncer clinicamente significativo provável)</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia guiada por RM recomendada</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">PI-RADS 5</td><td style="border:1px solid #ddd; padding:6px 8px;">Muito alta (câncer clinicamente significativo altamente provável)</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia guiada por RM fortemente recomendada</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'lirads',
        name: 'LI-RADS v2018 (Fígado)',
        category: 'rads',
        modality: ['TC', 'RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">LI-RADS v2018 - Classificação de Lesões Hepáticas em Pacientes com Risco de CHC</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Probabilidade de CHC</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-1</td><td style="border:1px solid #ddd; padding:6px 8px;">Definitivamente benigno (0%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento de rotina</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-2</td><td style="border:1px solid #ddd; padding:6px 8px;">Provavelmente benigno (&lt;5%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento de rotina ou curto prazo</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-3</td><td style="border:1px solid #ddd; padding:6px 8px;">Probabilidade intermediária (~50%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento multifásico em 3-6 meses</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-4</td><td style="border:1px solid #ddd; padding:6px 8px;">Provável CHC (~75%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Considerar biópsia, tratamento ou seguimento curto</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-5</td><td style="border:1px solid #ddd; padding:6px 8px;">Definitivamente CHC (&gt;95%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Tratamento oncológico</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-M</td><td style="border:1px solid #ddd; padding:6px 8px;">Provável malignidade (não CHC)</td><td style="border:1px solid #ddd; padding:6px 8px;">Investigação adicional (biópsia)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">LR-TIV</td><td style="border:1px solid #ddd; padding:6px 8px;">Tumor em veia (definitivamente maligno)</td><td style="border:1px solid #ddd; padding:6px 8px;">Tratamento oncológico</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'orads',
        name: 'O-RADS (Ovário)',
        category: 'rads',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">O-RADS US - Classificação de Massas Anexiais</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Risco de Malignidade</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 0</td><td style="border:1px solid #ddd; padding:6px 8px;">Incompleto</td><td style="border:1px solid #ddd; padding:6px 8px;">Avaliação adicional (RM recomendada)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 1</td><td style="border:1px solid #ddd; padding:6px 8px;">Fisiológico normal (&lt;1%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento de rotina</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 2</td><td style="border:1px solid #ddd; padding:6px 8px;">Benigno quase certamente (&lt;1%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento de rotina ou anual</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 3</td><td style="border:1px solid #ddd; padding:6px 8px;">Baixo risco (1-10%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento anual</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 4</td><td style="border:1px solid #ddd; padding:6px 8px;">Risco intermediário (10-50%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Avaliação ginecológica/oncológica</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">O-RADS 5</td><td style="border:1px solid #ddd; padding:6px 8px;">Alto risco (&gt;50%)</td><td style="border:1px solid #ddd; padding:6px 8px;">Avaliação ginecológica/oncológica urgente</td></tr>
  </tbody>
</table>`
      }
    ]
  },
  {
    id: 'obstetrics',
    name: 'Obstetrícia',
    icon: 'Baby',
    tables: [
      {
        id: 'peso_fetal_hadlock',
        name: 'Peso Fetal (Hadlock)',
        category: 'obstetrics',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Peso Fetal Estimado (Hadlock) - Percentis por Idade Gestacional</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">IG (semanas)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P10 (g)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P50 (g)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P90 (g)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">24</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">490</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">630</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">780</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">28</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">870</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1100</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1350</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">32</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1440</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1800</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2180</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">36</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2150</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2700</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3230</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">40</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2850</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3500</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4190</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'ila',
        name: 'ILA (Índice de Líquido Amniótico)',
        category: 'obstetrics',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Índice de Líquido Amniótico (ILA) - Valores de Referência</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">IG (semanas)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P5 (cm)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P50 (cm)</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">P95 (cm)</th>
      <th style="border:1px solid #333; padding:6px 8px;">Interpretação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">16-20</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">8,0</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">12,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">18,5</td><td style="border:1px solid #ddd; padding:6px 8px;" rowspan="5">ILA &lt;5cm: Oligoâmnio<br>ILA 5-8cm: Reduzido<br>ILA 8-18cm: Normal<br>ILA 18-24cm: Aumentado<br>ILA &gt;24cm: Polidrâmnio</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">21-25</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">8,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">14,0</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">20,0</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">26-30</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">8,0</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">14,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">21,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">31-35</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">7,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">14,0</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">20,5</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">36-40</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">6,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">12,5</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">18,5</td></tr>
  </tbody>
</table>`
      }
    ]
  },
  {
    id: 'abdominal',
    name: 'Abdome',
    icon: 'Activity',
    tables: [
      {
        id: 'figado_dimensoes',
        name: 'Fígado - Dimensões Normais',
        category: 'abdominal',
        modality: ['US', 'TC', 'RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Fígado - Valores de Referência por Lobo</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Lobo</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Dimensão Normal</th>
      <th style="border:1px solid #333; padding:6px 8px;">Observações</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">Lobo Direito (crânio-caudal)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≤15,0 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Medida na linha hemiclavicular</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">Lobo Esquerdo (espessura)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≤7,0 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Medida abaixo do xifóide</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">Veia Porta (calibre)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≤1,3 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Dilatação sugere hipertensão portal</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">Colédoco (calibre)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≤0,7 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Até 1,0cm pode ser normal em idosos</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'rins_dimensoes',
        name: 'Rins - Dimensões Normais',
        category: 'abdominal',
        modality: ['US', 'TC', 'RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Rins - Valores de Referência em Adultos</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Parâmetro</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Valor Normal</th>
      <th style="border:1px solid #333; padding:6px 8px;">Observações</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">Comprimento</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">9,0 - 13,0 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Rim direito tipicamente 0,5cm menor</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">Largura</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4,0 - 5,0 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Medida no eixo transverso</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">Espessura parenquimatosa</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1,5 - 2,5 cm</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia se &lt;1,0cm</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">Relação córtico-medular</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1:1 a 2:1</td><td style="border:1px solid #ddd; padding:6px 8px;">Perda de diferenciação sugere doença renal</td></tr>
  </tbody>
</table>`
      }
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoesquelético',
    icon: 'Bone',
    tables: [
      {
        id: 'cobb_escoliose',
        name: 'Ângulo de Cobb (Escoliose)',
        category: 'musculoskeletal',
        modality: ['RX'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Ângulo de Cobb - Classificação da Escoliose</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Ângulo</th>
      <th style="border:1px solid #333; padding:6px 8px;">Classificação</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta Habitual</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;10°</td><td style="border:1px solid #ddd; padding:6px 8px;">Assimetria postural (não é escoliose estrutural)</td><td style="border:1px solid #ddd; padding:6px 8px;">Observação clínica</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">10-25°</td><td style="border:1px solid #ddd; padding:6px 8px;">Escoliose leve</td><td style="border:1px solid #ddd; padding:6px 8px;">Observação, fisioterapia</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">25-40°</td><td style="border:1px solid #ddd; padding:6px 8px;">Escoliose moderada</td><td style="border:1px solid #ddd; padding:6px 8px;">Colete ortopédico em pacientes em crescimento</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">40-50°</td><td style="border:1px solid #ddd; padding:6px 8px;">Escoliose grave</td><td style="border:1px solid #ddd; padding:6px 8px;">Considerar cirurgia em pacientes em crescimento</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&gt;50°</td><td style="border:1px solid #ddd; padding:6px 8px;">Escoliose muito grave</td><td style="border:1px solid #ddd; padding:6px 8px;">Cirurgia recomendada</td></tr>
  </tbody>
</table>`
      },
      {
        id: 'graf_ddq',
        name: 'Classificação de Graf (DDQ)',
        category: 'musculoskeletal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Classificação de Graf - Displasia do Desenvolvimento do Quadril (DDQ)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Tipo</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Ângulo α</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Ângulo β</th>
      <th style="border:1px solid #333; padding:6px 8px;">Diagnóstico</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Ia</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≥60°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;55°</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal maduro</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem tratamento</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Ib</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">≥60°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">55-77°</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal imaturo</td><td style="border:1px solid #ddd; padding:6px 8px;">Observação</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">IIa</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">50-59°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;77°</td><td style="border:1px solid #ddd; padding:6px 8px;">Imaturidade fisiológica</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento ecográfico</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">IIb</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">50-59°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&gt;77°</td><td style="border:1px solid #ddd; padding:6px 8px;">Atraso de maturação</td><td style="border:1px solid #ddd; padding:6px 8px;">Suspensório de Pavlik</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">D</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">43-49°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&gt;77°</td><td style="border:1px solid #ddd; padding:6px 8px;">Displasia (descentralização)</td><td style="border:1px solid #ddd; padding:6px 8px;">Suspensório de Pavlik</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">III</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;43°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&gt;77°</td><td style="border:1px solid #ddd; padding:6px 8px;">Luxação excêntrica</td><td style="border:1px solid #ddd; padding:6px 8px;">Tratamento ortopédico/cirúrgico</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">IV</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">&lt;43°</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">-</td><td style="border:1px solid #ddd; padding:6px 8px;">Luxação alta</td><td style="border:1px solid #ddd; padding:6px 8px;">Tratamento cirúrgico</td></tr>
  </tbody>
</table>`
      }
    ]
  }
]
