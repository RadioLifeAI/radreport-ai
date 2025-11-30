export interface RadiologyTable {
  id: string
  name: string
  category: string
  type: 'informative' | 'dynamic'
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
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">ACR. BI-RADS Atlas, 5th Edition. American College of Radiology, 2013.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/BI-RADS" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR BI-RADS Official
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'tirads',
        name: 'TI-RADS ACR (Tireoide)',
        category: 'rads',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Tessler FN et al. ACR Thyroid Imaging, Reporting and Data System (TI-RADS). JACR 2017;14(5):587-595.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/TI-RADS" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR TI-RADS Official
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'pirads',
        name: 'PI-RADS v2.1 (Próstata)',
        category: 'rads',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Turkbey B et al. Prostate Imaging Reporting and Data System v2.1. Eur Urol 2019;76(3):340-351.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR PI-RADS Official
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'lirads',
        name: 'LI-RADS v2018 (Fígado)',
        category: 'rads',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">ACR. LI-RADS v2018. American College of Radiology, 2018.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR LI-RADS Official
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'orads',
        name: 'O-RADS (Ovário)',
        category: 'rads',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Andreotti RF et al. O-RADS US Risk Stratification and Management System. Radiology 2020;294(1):168-185.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR O-RADS Official
        </a>
      </td>
    </tr>
  </tfoot>
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
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Hadlock FP et al. Estimation of fetal weight with the use of head, body, and femur measurements. Radiology 1985;150:535-540.</span>
        <br/>
        <a href="https://fetalmedicine.org/research/assess/growth" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Fetal Medicine Foundation
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'ila',
        name: 'ILA (Índice de Líquido Amniótico)',
        category: 'obstetrics',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="5" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Phelan JP et al. Amniotic fluid index measurements during pregnancy. J Reprod Med 1987;32:601-604.</span>
        <br/>
        <a href="https://www.perinatology.com/Reference/glossary/A/Amniotic%20Fluid%20Index.htm" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Perinatology Reference
        </a>
      </td>
    </tr>
  </tfoot>
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
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Niederau C et al. Sonographic measurements of the normal liver, spleen, pancreas, and portal vein. Radiology 1983;149:537-540.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/liver-size" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'rins_dimensoes',
        name: 'Rins - Dimensões Normais',
        category: 'abdominal',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Emamian SA et al. Kidney dimensions at sonography: correlation with age, sex, and habitus in 665 adult volunteers. AJR 1993;160:83-86.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/kidney-dimensions" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
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
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Cobb JR. Outline for the study of scoliosis. AAOS Instructional Course Lectures 1948;5:261-275.</span>
        <br/>
        <a href="https://www.srs.org/" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Scoliosis Research Society
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'graf_ddq',
        name: 'Classificação de Graf (DDQ)',
        category: 'musculoskeletal',
        type: 'informative',
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
  <tfoot>
    <tr>
      <td colspan="5" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Graf R. Fundamentals of sonographic diagnosis of infant hip dysplasia. J Pediatr Orthop 1984;4:735-740.</span>
        <br/>
        <a href="https://www.grafmethod.org/" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Graf Method Official Site
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      }
    ]
  },
  {
    id: 'pediatric',
    name: 'Pediatria',
    icon: 'HeartPulse',
    tables: [
      {
        id: 'graf-ddq',
        name: 'Graf - Displasia do Desenvolvimento do Quadril',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Quadril Infantil',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Classificação de Graf - DDQ (Displasia do Desenvolvimento do Quadril)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Tipo</th>
      <th style="border:1px solid #333; padding:6px;">Ângulo α</th>
      <th style="border:1px solid #333; padding:6px;">Ângulo β</th>
      <th style="border:1px solid #333; padding:6px;">Descrição</th>
      <th style="border:1px solid #333; padding:6px;">Conduta</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">Ia</td><td>≥60°</td><td>&lt;55°</td><td>Quadril maduro normal</td><td>Observação</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Ib</td><td>≥60°</td><td>&lt;55°</td><td>Quadril maduro (ossificação incompleta)</td><td>Observação</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">IIa</td><td>50-59°</td><td>55-77°</td><td>Quadril imaturo (&lt;3 meses)</td><td>Controle 4-6 sem</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">IIb</td><td>50-59°</td><td>55-77°</td><td>Atraso maturação (&gt;3 meses)</td><td>Suspensório</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">IIc</td><td>43-49°</td><td>&gt;70°</td><td>Deficiência acetabular crítica</td><td>Abdução imediata</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">D</td><td>43-49°</td><td>&gt;77°</td><td>Displasia (descentrado)</td><td>Tratamento ortopédico</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">IIIa</td><td>&lt;43°</td><td>&gt;77°</td><td>Luxação (acetábulo detectável)</td><td>Redução + aparelho</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">IIIb</td><td>&lt;43°</td><td>&gt;77°</td><td>Luxação (acetábulo não detectável)</td><td>Redução + aparelho</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">IV</td><td>&lt;43°</td><td>-</td><td>Luxação grave (labrum invertido)</td><td>Redução cirúrgica</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="5" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Graf R. Fundamentals of sonographic diagnosis of infant hip dysplasia. J Pediatr Orthop 1984;4:735-740.</span>
        <br/>
        <a href="https://www.grafmethod.org/" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Graf Method Official Site
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'acetabular-index',
        name: 'Índice Acetabular por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Quadril Infantil',
        modality: ['RX'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Índice Acetabular - Valores Normais por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Valor Normal (°)</th>
      <th style="border:1px solid #333; padding:6px;">Limite Superior</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">Recém-nascido</td><td>27,5° ± 5°</td><td>&lt;30°</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">3 meses</td><td>26° ± 5°</td><td>&lt;30°</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">6 meses</td><td>24° ± 5°</td><td>&lt;28°</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">1 ano</td><td>22° ± 4°</td><td>&lt;25°</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">2 anos</td><td>20° ± 4°</td><td>&lt;23°</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">3 anos</td><td>18° ± 3°</td><td>&lt;21°</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">4 anos</td><td>17° ± 3°</td><td>&lt;20°</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">5 anos</td><td>16° ± 3°</td><td>&lt;19°</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Tönnis D. Congenital Dysplasia and Dislocation of the Hip in Children and Adults. Springer 1987.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/acetabular-index" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'figado-pediatrico',
        name: 'Fígado - Comprimento por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Fígado - Comprimento por Idade (Linha Hemiclavicular)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Comprimento (cm)</th>
      <th style="border:1px solid #333; padding:6px;">P95 (cm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-3 meses</td><td>4,0 - 5,5</td><td>6,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">3-12 meses</td><td>5,5 - 6,5</td><td>7,5</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-2 anos</td><td>6,5 - 7,5</td><td>8,5</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2-5 anos</td><td>7,5 - 9,0</td><td>10,0</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>9,0 - 11,0</td><td>12,5</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">10-16 anos</td><td>10,5 - 13,0</td><td>14,5</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Fórmula alternativa: Comprimento (cm) = 5,0 + 0,1 × idade (meses) até 2 anos</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Konus OL et al. Normal liver, spleen, and kidney dimensions in neonates, infants, and children. Eur Radiol 1998;8:1153-1157.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'baco-pediatrico',
        name: 'Baço - Comprimento por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Baço - Comprimento Longitudinal por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Comprimento (cm)</th>
      <th style="border:1px solid #333; padding:6px;">P95 (cm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-3 meses</td><td>3,5 - 5,0</td><td>5,5</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">3-12 meses</td><td>5,0 - 6,5</td><td>7,0</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-2 anos</td><td>6,0 - 7,5</td><td>8,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2-5 anos</td><td>7,0 - 8,5</td><td>9,5</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>8,0 - 10,0</td><td>11,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">10-16 anos</td><td>9,5 - 11,5</td><td>12,5</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Fórmula de Rosenberg: Comprimento (cm) = 5,7 + 0,31 × idade (anos)</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Megremis SD et al. Spleen length in childhood with US: normal values based on age, sex, and somatometric parameters. Radiology 2004;231:129-134.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'rins-pediatricos',
        name: 'Rins - Comprimento por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Rins - Comprimento Longitudinal por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Comprimento (cm)</th>
      <th style="border:1px solid #333; padding:6px;">P95 (cm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-3 meses</td><td>4,0 - 5,5</td><td>6,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">3-12 meses</td><td>5,0 - 6,5</td><td>7,0</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-2 anos</td><td>6,0 - 7,5</td><td>8,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2-5 anos</td><td>7,0 - 8,5</td><td>9,5</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>8,0 - 10,0</td><td>11,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">10-16 anos</td><td>9,5 - 11,5</td><td>12,5</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Diferença &gt;1,5 cm entre os rins sugere assimetria patológica. Fórmula: Comprimento (cm) = 4,98 + 0,155 × idade (meses)</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Dinkel E et al. Kidney size in childhood: sonographical growth charts. Pediatr Radiol 1985;15:38-43.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'pancreas-pediatrico',
        name: 'Pâncreas - Dimensões por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Pâncreas - Diâmetro Anteroposterior por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Cabeça (mm)</th>
      <th style="border:1px solid #333; padding:6px;">Corpo (mm)</th>
      <th style="border:1px solid #333; padding:6px;">Cauda (mm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-1 mês</td><td>10-14</td><td>6-10</td><td>10-14</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">1-12 meses</td><td>11-15</td><td>7-11</td><td>11-15</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-5 anos</td><td>12-17</td><td>8-12</td><td>12-18</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>15-20</td><td>9-13</td><td>15-22</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">10-19 anos</td><td>17-25</td><td>10-14</td><td>18-24</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Siegel MJ et al. Normal and abnormal pancreas in children: US studies. Radiology 1987;165:15-18.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'vesicula-pediatrica',
        name: 'Vesícula Biliar - Dimensões',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Vesícula Biliar - Dimensões em Jejum por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Comprimento (cm)</th>
      <th style="border:1px solid #333; padding:6px;">Espessura Parede (mm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-1 ano</td><td>2,0 - 4,0</td><td>&lt;3</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">1-5 anos</td><td>3,0 - 5,5</td><td>&lt;3</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>4,5 - 7,0</td><td>&lt;3</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">10-16 anos</td><td>6,0 - 9,0</td><td>&lt;3</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Avaliação após jejum de 4-6h. Espessura parede &gt;3mm sugere colecistite.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">McGahan JP et al. Sonographic measurement of fetal gallbladder. J Ultrasound Med 1982;1:133-135.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'suprarrenais-pediatricas',
        name: 'Glândulas Suprarrenais - RN',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Órgãos Abdominais',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Glândulas Suprarrenais - Recém-Nascido e Involução</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Comprimento (mm)</th>
      <th style="border:1px solid #333; padding:6px;">Espessura (mm)</th>
      <th style="border:1px solid #333; padding:6px;">Observação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">RN (0-7 dias)</td><td>15-25</td><td>3-6</td><td>Hiperecoica (cortical fetal)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">1-6 meses</td><td>12-20</td><td>2-5</td><td>Involução cortical</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">6-12 meses</td><td>10-18</td><td>2-4</td><td>Padrão adulto</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">&gt;1 ano</td><td>10-15</td><td>2-3</td><td>Difícil visualização</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Razão rim/suprarrenal no RN: 2,5:1. Massa suprarrenal neonatal: hemorragia (70%) ou neuroblastoma.</td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Oppenheimer DA et al. Normal adrenal glands in small for gestational age neonates: CT appearance. Radiology 1983;148:501-504.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'piloro-pediatrico',
        name: 'Estenose Hipertrófica do Piloro',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Gastrointestinal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Estenose Hipertrófica do Piloro - Critérios Ultrassonográficos</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Parâmetro</th>
      <th style="border:1px solid #333; padding:6px;">Normal</th>
      <th style="border:1px solid #333; padding:6px;">Borderline</th>
      <th style="border:1px solid #333; padding:6px;">Estenose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">Espessura muscular</td><td>&lt;3 mm</td><td>3,0-3,5 mm</td><td><strong>≥3 mm</strong></td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Comprimento pilórico</td><td>&lt;15 mm</td><td>15-17 mm</td><td><strong>≥15 mm</strong></td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Diâmetro pilórico</td><td>&lt;13 mm</td><td>13-15 mm</td><td><strong>≥13 mm</strong></td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Volume pilórico</td><td>&lt;1,5 cm³</td><td>1,5-2,0 cm³</td><td><strong>≥2,0 cm³</strong></td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Critérios mais específicos: espessura ≥3mm + comprimento ≥15mm. Pico de incidência: 2-8 semanas de vida. Meninos 4:1.</td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Blumhagen JD et al. Sonographic diagnosis of hypertrophic pyloric stenosis. AJR 1988;150:1367-1370.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/hypertrophic-pyloric-stenosis" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'apendice-pediatrico',
        name: 'Apêndice - Diâmetro Normal',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Gastrointestinal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Apêndice Pediátrico - Critérios Diagnósticos por Ultrassom</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Critério</th>
      <th style="border:1px solid #333; padding:6px;">Normal</th>
      <th style="border:1px solid #333; padding:6px;">Apendicite</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">Diâmetro máximo</td><td><strong>&lt;6 mm</strong></td><td><strong>≥7 mm</strong></td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Espessura da parede</td><td>&lt;3 mm</td><td>≥3 mm</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Compressibilidade</td><td>Compressível</td><td>Não compressível</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Hipervascularização</td><td>Ausente</td><td>Presente (Doppler)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Líquido periapendicular</td><td>Ausente</td><td>Presente</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Apendicolito</td><td>Ausente</td><td>Presente (30-40%)</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Sensibilidade do US: 85-90%. Diâmetro &gt;6mm + não compressível = apendicite (VPP 95%).</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Puylaert JB. Acute appendicitis: US evaluation using graded compression. Radiology 1986;158:355-360.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/acute-appendicitis" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'intussuscepcao',
        name: 'Intussuscepção - Critérios US',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Gastrointestinal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Intussuscepção - Critérios Ultrassonográficos</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Achado</th>
      <th style="border:1px solid #333; padding:6px;">Descrição</th>
      <th style="border:1px solid #333; padding:6px;">Significado Clínico</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Sinal do alvo</strong></td><td>Transversal: múltiplas camadas concêntricas</td><td>Diagnóstico (sensibilidade 98%)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Sinal do pseudorim</strong></td><td>Longitudinal: estrutura alongada multicamadas</td><td>Diagnóstico (especificidade 100%)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Diâmetro &gt;2,5 cm</td><td>Diâmetro externo da invaginação</td><td>Menor chance redução hidrostática</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Líquido aprisionado</td><td>Líquido entre camadas intestinais</td><td>Edema de parede, isquemia</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Ausência de fluxo Doppler</td><td>Sem sinal vascular na parede</td><td>Isquemia, indicação cirúrgica</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Linfonodo aumentado</td><td>Ponto de cabeça (lead point)</td><td>Causa em 10% dos casos</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Mais comum: ileocólica (80%), pico 6-18 meses. Redução hidrostática: sucesso 80-90% se &lt;24h sintomas.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">del-Pozo G et al. Intussusception in children: current concepts in diagnosis and enema reduction. Radiographics 1999;19:299-319.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/intussusception" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'capacidade-vesical',
        name: 'Capacidade Vesical por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Urológico',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Capacidade Vesical Esperada por Idade (Fórmula de Koff)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Capacidade (ml)</th>
      <th style="border:1px solid #333; padding:6px;">Cálculo</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">1 ano</td><td>90 ml</td><td>(1+2) × 30</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2 anos</td><td>120 ml</td><td>(2+2) × 30</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">3 anos</td><td>150 ml</td><td>(3+2) × 30</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">4 anos</td><td>180 ml</td><td>(4+2) × 30</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5 anos</td><td>210 ml</td><td>(5+2) × 30</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">8 anos</td><td>300 ml</td><td>(8+2) × 30</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">10 anos</td><td>360 ml</td><td>(10+2) × 30</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">12 anos</td><td>420 ml</td><td>(12+2) × 30</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;"><strong>Fórmula de Koff:</strong> Capacidade (ml) = (Idade em anos + 2) × 30. Válida até 12-14 anos. Bexiga neurogênica: capacidade reduzida.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Koff SA. Estimating bladder capacity in children. Urology 1983;21:248-251.</span>
        <br/>
        <a href="https://www.sciencedirect.com/topics/medicine-and-dentistry/bladder-capacity" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ScienceDirect Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'hidronefrose-sfu',
        name: 'Hidronefrose - Classificação SFU',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Urológico',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Hidronefrose - Classificação SFU (Society for Fetal Urology)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Grau</th>
      <th style="border:1px solid #333; padding:6px;">Pelve Renal</th>
      <th style="border:1px solid #333; padding:6px;">Cálices</th>
      <th style="border:1px solid #333; padding:6px;">Parênquima</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau 0</strong></td><td>Normal</td><td>Normais</td><td>Normal</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau I</strong></td><td>Dilatação leve da pelve</td><td>Normais ou minimamente dilatados</td><td>Normal</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau II</strong></td><td>Dilatação moderada da pelve</td><td>Cálices levemente dilatados</td><td>Normal</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau III</strong></td><td>Dilatação acentuada da pelve</td><td>Cálices moderadamente dilatados</td><td>Espessura preservada</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau IV</strong></td><td>Dilatação acentuada da pelve</td><td>Cálices acentuadamente dilatados</td><td><strong>Afilamento cortical</strong></td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Graus I-II: seguimento clínico. Graus III-IV: investigação com cintilografia + uretrocistografia. Diâmetro pelve AP &gt;10mm RN = significativo.</td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Fernbach SK et al. Grading of hydronephrosis: United States Sonography Society for Fetal Urology consensus on grading system. Pediatr Radiol 1993;23:478-480.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/sfu-grading-system-of-hydronephrosis" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'ventriculos-cerebrais',
        name: 'Ventrículos Cerebrais - Dimensões RN',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Craniano Neonatal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Ventrículos Cerebrais - Valores Normais no Recém-Nascido</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Estrutura</th>
      <th style="border:1px solid #333; padding:6px;">Medida Normal</th>
      <th style="border:1px solid #333; padding:6px;">Limite Superior</th>
      <th style="border:1px solid #333; padding:6px;">Patológico</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">Ventrículo lateral (corpo)</td><td>2-4 mm</td><td>&lt;10 mm</td><td>≥10 mm</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Corno frontal (largura)</td><td>1-3 mm</td><td>&lt;5 mm</td><td>≥5 mm</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Terceiro ventrículo</td><td>2-3 mm</td><td>&lt;3 mm</td><td>≥4 mm</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Quarto ventrículo (AP)</td><td>3-6 mm</td><td>&lt;8 mm</td><td>≥10 mm</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">Espaço interhemisférico</td><td>2-3 mm</td><td>&lt;5 mm</td><td>≥6 mm</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">Espaço subaracnóideo</td><td>1-3 mm</td><td>&lt;5 mm</td><td>≥6 mm</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Medidas no corte coronal pela fontanela anterior. Ventriculomegalia: VL ≥10mm. Índice ventricular: VL/hemisfério &gt;0,35 = anormal.</td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Levene MI et al. Normal cerebral ventricular size in newborn infants. Arch Dis Child 1981;56:416-418.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/spine/neonatal-brain-us" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'hemorragia-intraventricular',
        name: 'HIV - Classificação de Papile',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Craniano Neonatal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Hemorragia Intraventricular (HIV) - Classificação de Papile</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Grau</th>
      <th style="border:1px solid #333; padding:6px;">Localização</th>
      <th style="border:1px solid #333; padding:6px;">Descrição</th>
      <th style="border:1px solid #333; padding:6px;">Prognóstico</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau I</strong></td><td>Matriz germinativa</td><td>Hemorragia subependimária isolada, sem extensão intraventricular</td><td>Bom (90% normal)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau II</strong></td><td>Intraventricular</td><td>HIV sem dilatação ventricular (&lt;50% do ventrículo)</td><td>Bom (80-85% normal)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau III</strong></td><td>Intraventricular</td><td>HIV com dilatação ventricular (&gt;50% do ventrículo)</td><td>Reservado (50-60% sequelas)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau IV</strong></td><td>Intraparenquimatosa</td><td>HIV + hemorragia intraparenquimatosa (infarto hemorrágico periventricular)</td><td>Grave (70-90% sequelas)</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Incidência: 25% em prematuros &lt;32 sem. Pico: 24-72h de vida. Graus III-IV: risco de hidrocefalia pós-hemorrágica (35%).</td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Papile LA et al. Incidence and evolution of subependymal and intraventricular hemorrhage in premature infants. J Pediatr 1978;92:529-534.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/germinal-matrix-haemorrhage" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'leucomalacia-periventricular',
        name: 'Leucomalácia Periventricular',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Craniano Neonatal',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Leucomalácia Periventricular (LPV) - Classificação de Vries</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Grau</th>
      <th style="border:1px solid #333; padding:6px;">Achados US</th>
      <th style="border:1px solid #333; padding:6px;">Evolução</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau I</strong></td><td>Hiperecogenicidade transitória periventricular (&lt;7 dias), sem cistos</td><td>Resolução completa (bom prognóstico)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau II</strong></td><td>Hiperecogenicidade persistente (&gt;7 dias), sem cistos ou com pequenos cistos frontais</td><td>Sequelas leves em 50%</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;"><strong>Grau III</strong></td><td>Cistos periventriculares extensos (região occipital)</td><td>Sequelas motoras em 75% (diplegia espástica)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;"><strong>Grau IV</strong></td><td>Cistos extensos difusos + atrofia subcortical</td><td>Sequelas graves em 90% (tetraplegia, atraso cognitivo)</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Cistos aparecem 2-4 semanas após evento isquêmico. RM é superior ao US para detecção de LPV leve. Incidência: 5-15% em prematuros &lt;32 sem.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">de Vries LS et al. Ultrasound abnormalities preceding cerebral palsy in high-risk preterm infants. J Pediatr 1988;113:452-459.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/periventricular-leukomalacia-grading-2" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'timo-pediatrico',
        name: 'Timo - Índice Tímico por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Tórax',
        modality: ['RX', 'US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Timo - Índice Tímico e Dimensões por Idade</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Índice Tímico (RX)</th>
      <th style="border:1px solid #333; padding:6px;">Dimensões US (mm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-6 meses</td><td>0,33-0,43</td><td>35-55 × 20-35</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">6-12 meses</td><td>0,30-0,40</td><td>40-60 × 20-35</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-2 anos</td><td>0,28-0,38</td><td>45-65 × 20-35</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2-5 anos</td><td>0,25-0,35</td><td>50-70 × 20-35</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>0,20-0,30</td><td>Involução progressiva</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Índice tímico = largura timo / largura tórax no RX PA. Sinal da onda tímica (ondulação costelas) = normal. Timo hiperplásico: reversão após stress.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Hasselbalch H et al. Thymus size evaluated by sonography: a longitudinal study on infants during the first year of life. Acta Radiol 1997;38:222-227.</span>
        <br/>
        <a href="https://radiopaedia.org/articles/normal-thymus" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiopaedia Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'aorta-pediatrica',
        name: 'Aorta Abdominal - Diâmetro por Idade',
        category: 'pediatric',
        type: 'informative',
        subcategory: 'Vascular',
        modality: ['US'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Aorta Abdominal - Diâmetro Normal por Idade (Nível Diafragma)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px;">Idade</th>
      <th style="border:1px solid #333; padding:6px;">Diâmetro (mm)</th>
      <th style="border:1px solid #333; padding:6px;">P95 (mm)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px;">0-1 mês</td><td>5,0-7,0</td><td>8,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">1-12 meses</td><td>6,0-8,0</td><td>9,0</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">1-2 anos</td><td>7,0-9,0</td><td>10,0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">2-5 anos</td><td>8,0-10,0</td><td>11,5</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px;">5-10 anos</td><td>9,0-12,0</td><td>13,5</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px;">10-16 anos</td><td>11,0-15,0</td><td>17,0</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">Medida no plano transversal, diâmetro externo-externo. Aorta diminui ~2mm do diafragma à bifurcação. Dilatação: &gt;P95 para idade.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Knisley BL et al. Normal sonographic anatomy of the abdominal aorta and inferior vena cava in children. AJR 1989;152:149-152.</span>
        <br/>
        <a href="https://radiologyassistant.nl/pediatrics/normal-values/normal-values-ultrasound" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Assistant Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      }
    ]
  },
  {
    id: 'neuroradiology',
    name: 'Neurorradiologia',
    icon: 'Brain',
    tables: [
      {
        id: 'aspects_score',
        name: 'ASPECTS Score (AVC)',
        category: 'neuroradiology',
        subcategory: 'AVC / Isquemia',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">ASPECTS Score - Alberta Stroke Program Early CT Score</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Região</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontuação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">C - Cápsula Interna</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">L - Núcleo Lenticular</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">I - Ínsula</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">IC - Córtex da Ínsula</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">M1 - ACM anterior</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">M2 - ACM lateral</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">M3 - ACM posterior</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1 ponto</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">M4 - M5 - M6 (território ACM)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3 pontos</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Interpretação:</strong> Score 10 = normal | Score ≤7 = prognóstico desfavorável | Cada região comprometida subtrai 1 ponto do total de 10
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Barber PA et al. Validity and reliability of a quantitative computed tomography score in predicting outcome of hyperacute stroke. Lancet 2000;355:1670-1674.</span>
        <br/>
        <a href="https://www.ahajournals.org/doi/10.1161/STROKEAHA.119.026698" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AHA/ASA ASPECTS Guidelines
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'fisher_scale',
        name: 'Escala de Fisher (HSA)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Escala de Fisher - Hemorragia Subaracnóidea (HSA)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Achados TC</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Risco Vasoespasmo</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem HSA visível</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Baixo</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA difusa <1mm espessura</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Baixo</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA localizada/coágulo >1mm</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Alto (70%)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA intraventricular ou parenquimatosa</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Variável</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Fisher CM et al. Relation of cerebral vasospasm to subarachnoid hemorrhage visualized by CT scanning. Neurosurgery 1980;6:1-9.</span>
        <br/>
        <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6738452/" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Neurocritical Care Guidelines
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'modified_fisher',
        name: 'Fisher Modificada (HSA)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Escala de Fisher Modificada (Predição de Vasoespasmo)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Achados TC</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Vasoespasmo (%)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem HSA ou HVI</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">6%</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA fina sem HVI</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">24%</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA fina com HVI</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">33%</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA espessa sem HVI</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">33%</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4</td><td style="border:1px solid #ddd; padding:6px 8px;">HSA espessa com HVI</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">40%</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:6px; font-size:9pt; font-style:italic;">HSA espessa: >1mm em qualquer cisterna. HVI = Hemorragia intraventricular. Escala preditora mais acurada que Fisher original.</td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Frontera JA et al. Prediction of symptomatic vasospasm after subarachnoid hemorrhage: the modified Fisher scale. Neurosurgery 2006;59:21-27.</span>
        <br/>
        <a href="https://www.neurosurgery-online.com/article/S0090-3019(06)00443-8" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Modified Fisher Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'hunt_hess',
        name: 'Hunt e Hess (HSA)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Escala de Hunt e Hess - Graduação Clínica da HSA</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Apresentação Clínica</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Mortalidade</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">I</td><td style="border:1px solid #ddd; padding:6px 8px;">Assintomático ou cefaleia leve, rigidez de nuca leve</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0-5%</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">II</td><td style="border:1px solid #ddd; padding:6px 8px;">Cefaleia moderada/intensa, rigidez de nuca, sem déficit exceto paralisia de nervos cranianos</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">5-10%</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">III</td><td style="border:1px solid #ddd; padding:6px 8px;">Sonolência, confusão, déficit focal leve</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">10-15%</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">IV</td><td style="border:1px solid #ddd; padding:6px 8px;">Estupor, hemiparesia moderada/grave, rigidez de descerebração precoce</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">60-70%</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">V</td><td style="border:1px solid #ddd; padding:6px 8px;">Coma profundo, rigidez de descerebração, aparência moribunda</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">70-100%</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Hunt WE, Hess RM. Surgical risk as related to time of intervention in the repair of intracranial aneurysms. J Neurosurg 1968;28:14-20.</span>
        <br/>
        <a href="https://thejns.org/view/journals/j-neurosurg/28/1/article-p14.xml" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 J Neurosurgery Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'ich_score',
        name: 'ICH Score (HIC)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">ICH Score - Prognóstico de Hemorragia Intracerebral</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Variável</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontuação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Glasgow ≥13</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Glasgow 5-12</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Glasgow 3-4</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Volume HIC ≥30 cm³</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Hemorragia intraventricular</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Localização infratentorial</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Idade ≥80 anos</strong></td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Mortalidade 30 dias:</strong> Score 0=0% | 1=13% | 2=26% | 3=72% | 4=97% | 5-6=100%
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Hemphill JC et al. The ICH Score: a simple, reliable grading scale for intracerebral hemorrhage. Stroke 2001;32:891-897.</span>
        <br/>
        <a href="https://www.ahajournals.org/doi/10.1161/01.STR.32.4.891" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AHA Stroke Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'abc2_formula',
        name: 'Fórmula ABC/2 (Volume)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Fórmula ABC/2 - Cálculo de Volume de Hematoma</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Medida</th>
      <th style="border:1px solid #333; padding:6px 8px;">Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>A</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Maior diâmetro da lesão (cm)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>B</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Diâmetro perpendicular a A (cm)</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>C</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Número de cortes com hematoma × espessura do corte (cm)</td></tr>
    <tr style="background:#f8f8f8;"><td colspan="2" style="border:1px solid #ddd; padding:12px; text-align:center; font-size:14pt; font-weight:bold; color:#1e3a5f;">
      Volume (cm³) = (A × B × C) / 2
    </td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Método rápido e acurado (correlação r=0.96 com volumetria). Volume >30cm³ associado a pior prognóstico. Válido para lesões elipsoides/ovoides.
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Kothari RU et al. The ABCs of measuring intracerebral hemorrhage volumes. Stroke 1996;27:1304-1305.</span>
        <br/>
        <a href="https://www.ahajournals.org/doi/10.1161/01.STR.27.8.1304" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AHA Stroke Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'graeb_score',
        name: 'Escala de Graeb (HVI)',
        category: 'neuroradiology',
        subcategory: 'Hemorragia Intracraniana',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Escala de Graeb - Hemorragia Intraventricular (HVI)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Região Ventricular</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontuação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Ventrículo lateral D/E</strong> (cada)</td><td style="border:1px solid #ddd; padding:6px 8px;">0: sem sangue | 1: traço | 2: <50% | 3: >50% | 4: expansão</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>III ventrículo</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">0: sem sangue | 1: traço | 2: preenchido com sangue</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>IV ventrículo</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">0: sem sangue | 1: traço | 2: preenchido com sangue</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; font-weight:bold;">Score Total</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center; font-weight:bold;">0-12 pontos</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Interpretação:</strong> Score 0-4=leve | 5-8=moderado | 9-12=grave. Score ≥5 associado a hidrocefalia e pior prognóstico.
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Graeb DA et al. Computed tomographic diagnosis of intraventricular hemorrhage. Etiology and prognosis. Radiology 1982;143:91-96.</span>
        <br/>
        <a href="https://pubs.rsna.org/doi/10.1148/radiology.143.1.6977795" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Radiology Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'fazekas_scale',
        name: 'Escala de Fazekas',
        category: 'neuroradiology',
        subcategory: 'Substância Branca / Demência',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Escala de Fazekas - Lesões de Substância Branca</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Lesões Periventriculares</th>
      <th style="border:1px solid #333; padding:6px 8px;">Lesões Subcorticais</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Ausentes</td><td style="border:1px solid #ddd; padding:6px 8px;">Ausentes</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">"Caps" ou fina borda</td><td style="border:1px solid #ddd; padding:6px 8px;">Focos puntiformes</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Halo suave</td><td style="border:1px solid #ddd; padding:6px 8px;">Focos começando a confluir</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">Extensão irregular para a substância branca profunda</td><td style="border:1px solid #ddd; padding:6px 8px;">Grandes áreas confluentes</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Avaliação em FLAIR ou T2. Graduação separada para lesões periventriculares e subcorticais (profundas). Grau ≥2 associado a risco aumentado de demência e AVC.
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Fazekas F et al. MR signal abnormalities at 1.5T in Alzheimer's dementia and normal aging. AJR 1987;149:351-356.</span>
        <br/>
        <a href="https://www.ajronline.org/doi/10.2214/ajr.149.2.351" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AJR Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'mta_scheltens',
        name: 'MTA Score (Scheltens)',
        category: 'neuroradiology',
        subcategory: 'Substância Branca / Demência',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">MTA Score - Medial Temporal Atrophy (Scheltens)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Score</th>
      <th style="border:1px solid #333; padding:6px 8px;">Fissura Coroidea</th>
      <th style="border:1px solid #333; padding:6px 8px;">Corno Temporal</th>
      <th style="border:1px solid #333; padding:6px 8px;">Hipocampo</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento leve</td><td style="border:1px solid #ddd; padding:6px 8px;">Leve alargamento</td><td style="border:1px solid #ddd; padding:6px 8px;">Volume normal</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento moderado</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento moderado</td><td style="border:1px solid #ddd; padding:6px 8px;">Redução volumétrica</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento acentuado</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento acentuado</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia grave</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4</td><td style="border:1px solid #ddd; padding:6px 8px;">Perda da arquitetura</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento severo</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia final</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="4" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Valores de referência:</strong> <65 anos: score ≥2 anormal | 65-75 anos: score ≥3 anormal | >75 anos: score 4 anormal. Avaliar em coronal T1 perpendicular ao hipocampo.
    </td></tr>
    <tr>
      <td colspan="4" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Scheltens P et al. Atrophy of medial temporal lobes on MRI in "probable" Alzheimer's disease and normal ageing. J Neurol Neurosurg Psychiatry 1992;55:967-972.</span>
        <br/>
        <a href="https://jnnp.bmj.com/content/55/10/967" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 JNNP Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'gca_scale',
        name: 'GCA Scale (Atrofia Global)',
        category: 'neuroradiology',
        subcategory: 'Substância Branca / Demência',
        type: 'informative',
        modality: ['RM', 'TC'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">GCA Scale - Global Cortical Atrophy Scale</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Sulcos Corticais</th>
      <th style="border:1px solid #333; padding:6px 8px;">Ventrículos</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Sulcos finos, giros cheios</td><td style="border:1px solid #ddd; padding:6px 8px;">Ventrículos normais</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Abertura discreta dos sulcos</td><td style="border:1px solid #ddd; padding:6px 8px;">Ventrículos levemente alargados</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento moderado dos sulcos</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento ventricular moderado</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">Sulcos extremamente alargados, giros afilados</td><td style="border:1px solid #ddd; padding:6px 8px;">Ventriculomegalia acentuada</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Avaliação visual global, não específica para regiões. Útil para triagem rápida. Grau ≥2 sugere atrofia significativa.
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Pasquier F et al. Inter- and intraobserver reproducibility of cerebral atrophy assessment on MRI scans with hemispheric infarcts. Eur Neurol 1996;36:268-272.</span>
        <br/>
        <a href="https://www.karger.com/Article/Abstract/117270" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 European Neurology Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'koedam_score',
        name: 'Koedam Score (Atrofia Parietal)',
        category: 'neuroradiology',
        subcategory: 'Substância Branca / Demência',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Koedam Score - Atrofia Cortical Posterior (Parietal)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Score</th>
      <th style="border:1px solid #333; padding:6px 8px;">Sulco Parieto-Occipital</th>
      <th style="border:1px solid #333; padding:6px 8px;">Precuneus / Cuneus</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Sem atrofia</td><td style="border:1px solid #ddd; padding:6px 8px;">Normal</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento leve</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia leve</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Alargamento moderado/acentuado</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia moderada</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">"Knife-blade" atrophy</td><td style="border:1px solid #ddd; padding:6px 8px;">Atrofia grave</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Útil para Atrofia Cortical Posterior (ACP) e variante posterior da doença de Alzheimer. Avaliar em cortes sagitais T1. Score ≥2 sugere ACP.
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Koedam EL et al. Visual assessment of posterior atrophy development of a MRI rating scale. Eur Radiol 2011;21:2618-2625.</span>
        <br/>
        <a href="https://link.springer.com/article/10.1007/s00330-011-2205-4" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 European Radiology Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'who_gliomas_2021',
        name: 'WHO Gliomas 2021',
        category: 'neuroradiology',
        subcategory: 'Tumores Cerebrais',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Classificação WHO 2021 - Gliomas (Simplificada)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Tipo</th>
      <th style="border:1px solid #333; padding:6px 8px;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px;">Marcador Molecular</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Astrocitoma IDH-mutante</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">2, 3, 4</td><td style="border:1px solid #ddd; padding:6px 8px;">IDH1/2 mutado</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Oligodendroglioma IDH-mutante</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">2, 3</td><td style="border:1px solid #ddd; padding:6px 8px;">IDH + 1p/19q codeleted</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Glioblastoma IDH-wildtype</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">4</td><td style="border:1px solid #ddd; padding:6px 8px;">IDH selvagem, TERT+, EGFR+, +7/-10</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Astrocitoma pilocítico</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">BRAF fusão ou mutação</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>Ependimoma</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">2, 3</td><td style="border:1px solid #ddd; padding:6px 8px;">Subgrupos moleculares (RELA, YAP1)</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Classificação WHO 2021 integra histologia + marcadores moleculares. IDH-mutante: melhor prognóstico. IDH-wildtype (glioblastoma): agressivo.
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Louis DN et al. The 2021 WHO Classification of Tumors of the Central Nervous System: a summary. Neuro Oncol 2021;23(8):1231-1251.</span>
        <br/>
        <a href="https://academic.oup.com/neuro-oncology/article/23/8/1231/6311214" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 WHO CNS5 Official Publication
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'btrads',
        name: 'BT-RADS (Brain Tumor)',
        category: 'neuroradiology',
        subcategory: 'Tumores Cerebrais',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">BT-RADS - Brain Tumor Reporting and Data System (Proposta)</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Achados RM</th>
      <th style="border:1px solid #333; padding:6px 8px;">Conduta</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0</td><td style="border:1px solid #ddd; padding:6px 8px;">Incompleto/Indeterminado</td><td style="border:1px solid #ddd; padding:6px 8px;">Exames adicionais</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td><td style="border:1px solid #ddd; padding:6px 8px;">Benigno (sem realce, sem efeito de massa)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento opcional</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td><td style="border:1px solid #ddd; padding:6px 8px;">Provavelmente benigno (realce homogêneo, bem delimitado)</td><td style="border:1px solid #ddd; padding:6px 8px;">Seguimento curto prazo (3-6m)</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td><td style="border:1px solid #ddd; padding:6px 8px;">Indeterminado (realce heterogêneo, suspeito)</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia ou seguimento rigoroso</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4</td><td style="border:1px solid #ddd; padding:6px 8px;">Suspeito de malignidade (realce irregular, edema, necrose)</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia recomendada</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">5</td><td style="border:1px solid #ddd; padding:6px 8px;">Altamente sugestivo de malignidade (necrose, realce anelar)</td><td style="border:1px solid #ddd; padding:6px 8px;">Biópsia/tratamento urgente</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Sistema proposto para padronização de laudos. Baseado em características de imagem (realce, necrose, edema, difusão restrita, perfusão).
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">ACR Brain Tumor Reporting Initiative 2022. American College of Radiology.</span>
        <br/>
        <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 ACR Reporting Systems
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'phases_score',
        name: 'PHASES Score (Aneurisma)',
        category: 'neuroradiology',
        subcategory: 'Aneurismas e Vascular',
        type: 'informative',
        modality: ['AngioTC', 'AngioRM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">PHASES Score - Risco de Ruptura de Aneurisma Intracraniano</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Fator</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontos</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>P</strong>opulation: América do Norte/Europa (vs. Japão/Finlândia)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0 vs. 3-5</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>H</strong>ypertension (Hipertensão arterial)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>A</strong>ge: <70 anos (0) | 70-79 anos (1) | ≥80 anos (0)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0-1</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>S</strong>ize: <7mm (0) | 7-9.9mm (3) | 10-19.9mm (6) | ≥20mm (10)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0-10</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>E</strong>arlier SAH (história prévia de HSA de outro aneurisma)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">1</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>S</strong>ite: ACI (0) | ACM (2) | Circ. posterior (4) | AcomA/AcomP (0-2)</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">0-4</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Risco 5 anos:</strong> Score 0-2=0.4% | 3-4=0.7% | 5-6=0.9% | 7-9=1.3% | 10-11=1.7% | 12-14=2.4% | ≥15=4.3%
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Greving JP et al. Development of the PHASES score for prediction of risk of rupture of intracranial aneurysms: a pooled analysis of six prospective cohort studies. Lancet Neurol 2014;13:59-66.</span>
        <br/>
        <a href="https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(13)70263-1/fulltext" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Lancet Neurology Original Study
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'wfns_scale',
        name: 'WFNS Scale (HSA)',
        category: 'neuroradiology',
        subcategory: 'Aneurismas e Vascular',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">WFNS Scale - World Federation of Neurological Surgeons</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Grau</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Glasgow (GCS)</th>
      <th style="border:1px solid #333; padding:6px 8px;">Déficit Motor</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">I</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">15</td><td style="border:1px solid #ddd; padding:6px 8px;">Ausente</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">II</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">13-14</td><td style="border:1px solid #ddd; padding:6px 8px;">Ausente</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">III</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">13-14</td><td style="border:1px solid #ddd; padding:6px 8px;">Presente</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">IV</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">7-12</td><td style="border:1px solid #ddd; padding:6px 8px;">Presente ou ausente</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">V</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3-6</td><td style="border:1px solid #ddd; padding:6px 8px;">Presente ou ausente</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Graduação clínica mais utilizada mundialmente para HSA. Correlaciona-se com prognóstico: Grau I-II (bom), Grau III (moderado), Grau IV-V (reservado).
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Drake CG et al. Report of World Federation of Neurological Surgeons Committee on a Universal Subarachnoid Hemorrhage Grading Scale. J Neurosurg 1988;68:985-986.</span>
        <br/>
        <a href="https://thejns.org/view/journals/j-neurosurg/68/6/article-p985.xml" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 J Neurosurgery WFNS Classification
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'nihss_scale',
        name: 'NIHSS (AVC Clínico)',
        category: 'neuroradiology',
        subcategory: 'AVC / Isquemia',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">NIHSS - National Institutes of Health Stroke Scale</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Domínio</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Pontuação Máxima</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">1. Nível de consciência</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">2. Questões LOC</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">3. Comandos LOC</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">4. Melhor olhar</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">5. Campos visuais</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">6. Paresia facial</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">7. Motor MSD / 8. Motor MSE</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4 cada</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">9. Motor MID / 10. Motor MIE</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">4 cada</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">11. Ataxia de membros</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">12. Sensibilidade</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">13. Melhor linguagem</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">3</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;">14. Disartria</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;">15. Extinção/desatenção</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">2</td></tr>
    <tr style="background:#ffeb3b;"><td style="border:1px solid #ddd; padding:6px 8px; font-weight:bold;">TOTAL</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center; font-weight:bold;">0-42 pontos</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt;">
      <strong>Interpretação:</strong> 0=sem déficit | 1-4=leve | 5-15=moderado | 16-20=moderado/grave | 21-42=grave. Score >15 sugere benefício de trombólise/trombectomia.
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Brott T et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke 1989;20:864-870.</span>
        <br/>
        <a href="https://www.ahajournals.org/doi/10.1161/01.STR.20.7.864" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AHA/ASA NIHSS Reference
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'toast_classification',
        name: 'Classificação TOAST (Etiologia AVC)',
        category: 'neuroradiology',
        subcategory: 'AVC / Isquemia',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Classificação TOAST - Etiologia do AVC Isquêmico</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Categoria</th>
      <th style="border:1px solid #333; padding:6px 8px;">Características</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>1. Aterosclerose de grande vaso</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Estenose >50% artéria extracraniana/intracraniana | Placa aterosclerótica</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>2. Cardioembolismo</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">FA, flutter, prótese valvar, trombo atrial, IAM recente, mixoma</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>3. Oclusão de pequeno vaso (lacunar)</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Infarto <1,5cm subcortical/tronco | Hipertensão, diabetes</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>4. Outra etiologia determinada</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Dissecção arterial, vasculite, hipercoagulabilidade, drogas</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>5. Etiologia indeterminada</strong></td><td style="border:1px solid #ddd; padding:6px 8px;">Investigação negativa | Múltiplas causas possíveis | Investigação incompleta</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Sistema de classificação etiológica mais utilizado para AVC isquêmico. Orienta prevenção secundária específica.
    </td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Adams HP Jr et al. Classification of subtype of acute ischemic stroke (TOAST). Stroke 1993;24:35-41.</span>
        <br/>
        <a href="https://www.ahajournals.org/doi/10.1161/01.STR.24.1.35" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 AHA Stroke TOAST Classification
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      },
      {
        id: 'bamford_classification',
        name: 'Classificação de Bamford/Oxford',
        category: 'neuroradiology',
        subcategory: 'AVC / Isquemia',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:10pt; margin:10px 0;">
  <caption style="font-weight:bold; text-align:left; margin-bottom:8px; font-size:11pt;">Classificação de Bamford/Oxford - Síndromes Clínicas do AVC</caption>
  <thead>
    <tr style="background:#1e3a5f; color:white;">
      <th style="border:1px solid #333; padding:6px 8px;">Síndrome</th>
      <th style="border:1px solid #333; padding:6px 8px;">Critérios Clínicos</th>
      <th style="border:1px solid #333; padding:6px 8px; text-align:center;">Prognóstico</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>TACS</strong> (Total Anterior Circulation)</td><td style="border:1px solid #ddd; padding:6px 8px;">Todos 3: disfunção cortical + defeito hemianóptico + déficit motor/sensitivo em ≥2 áreas</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Grave</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>PACS</strong> (Partial Anterior Circulation)</td><td style="border:1px solid #ddd; padding:6px 8px;">2 de 3 critérios TACS | OU disfunção cortical isolada | OU déficit motor/sensitivo limitado</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Moderado</td></tr>
    <tr><td style="border:1px solid #ddd; padding:6px 8px;"><strong>LACS</strong> (Lacunar)</td><td style="border:1px solid #ddd; padding:6px 8px;">Síndrome lacunar pura: hemiparesia motora pura, AVC sensitivo puro, hemiparesia atáxica, disartria-mão desajeitada</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Bom</td></tr>
    <tr style="background:#f8f8f8;"><td style="border:1px solid #ddd; padding:6px 8px;"><strong>POCS</strong> (Posterior Circulation)</td><td style="border:1px solid #ddd; padding:6px 8px;">Qualquer: paralisia de nervo craniano + déficit contralateral motor/sensitivo | déficit motor/sensitivo bilateral | distúrbio conjugado do olhar | disfunção cerebelar | hemianopsia isolada</td><td style="border:1px solid #ddd; padding:6px 8px; text-align:center;">Variável</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3" style="border:1px solid #ddd; padding:8px; font-size:9pt; font-style:italic;">
      Classificação clínica correlacionada com território vascular e prognóstico. TACS: pior (60% mortalidade 1 ano) | LACS: melhor (10% mortalidade).
    </td></tr>
    <tr>
      <td colspan="3" style="border:1px solid #ddd; padding:8px 12px; font-size:9pt; background:#f8f9fa; line-height:1.4;">
        <strong style="color:#1e3a5f;">📚 Referência:</strong> 
        <span style="font-style:italic;">Bamford J et al. Classification and natural history of clinically identifiable subtypes of cerebral infarction. Lancet 1991;337:1521-1526.</span>
        <br/>
        <a href="https://www.thelancet.com/journals/lancet/article/PII0140-6736(91)93206-O/fulltext" 
           target="_blank" 
           rel="noopener noreferrer"
           style="color:#0066cc; text-decoration:none; font-weight:500;">
          🔗 Lancet Bamford Original Article
        </a>
      </td>
    </tr>
  </tfoot>
</table>`
      }
    ]
  },
  {
    id: "head-neck",
    name: "Cabeça e Pescoço",
    icon: "Stethoscope",
    tables: [
      {
        id: "ni-rads-v2025",
        name: "NI-RADS v2025 - Vigilância Pós-Tratamento Câncer Cabeça e Pescoço",
        category: "headNeck",
        subcategory: "Sistemas RADS",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">NI-RADS (Neck Imaging Reporting and Data System) v2025</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Definição</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Recomendação</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>NI-RADS 1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem evidência de recidiva tumoral</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento de rotina</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>NI-RADS 2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alterações pós-tratamento benignas</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento de rotina (6-12 meses)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>NI-RADS 3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recidiva improvável (&lt;50%)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento de curto prazo (3 meses)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>NI-RADS 4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recidiva provável (&gt;50%)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Correlação clínica/PET-CT ou biópsia</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>NI-RADS 5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recidiva altamente sugestiva</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Biópsia recomendada</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> American College of Radiology. <em>NI-RADS v2025: Neck Imaging Reporting and Data System</em>. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/NI-RADS" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR NI-RADS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "ene-criteria",
        name: "Critérios de Extensão Extranodal (ENE)",
        category: "headNeck",
        subcategory: "Sistemas RADS",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Extensão Extranodal (ENE) em Linfonodos Cervicais</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ENE Definitiva</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão macroscópica de tecidos adjacentes ou vasos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ENE Provável</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Irregularidade capsular focal ou densidade perilinfonodal</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Necrose Central</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Áreas hipodensas/hipointensas sem realce central</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tamanho Suspeito</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nível Ia-II: &gt;15mm, III-VI: &gt;10mm, VII: &gt;7mm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Realce Heterogêneo</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Realce irregular com áreas de não-realce</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> Aiken AH, et al. <em>ACR Appropriateness Criteria: Neck Mass/Adenopathy</em>. J Am Coll Radiol. 2018. 
                  <a href="https://www.acr.org/Clinical-Resources/ACR-Appropriateness-Criteria" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "lund-mackay-score",
        name: "Lund-Mackay Score - Rinossinusite Crônica",
        category: "headNeck",
        subcategory: "Seios Paranasais",
        type: "informative",
        modality: ["TC"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Lund-Mackay Score para Rinossinusite Crônica</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estrutura</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">0 (Normal)</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">1 (Parcial)</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">2 (Total)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Seio Maxilar (D/E)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Sem opacificação</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Parcialmente opaco</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Totalmente opaco</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Células Etmoidais Anteriores (D/E)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Sem opacificação</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Parcialmente opaco</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Totalmente opaco</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Células Etmoidais Posteriores (D/E)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Sem opacificação</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Parcialmente opaco</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Totalmente opaco</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Seio Esfenoidal (D/E)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Sem opacificação</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Parcialmente opaco</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Totalmente opaco</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Seio Frontal (D/E)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Sem opacificação</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Parcialmente opaco</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Totalmente opaco</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Complexo Ostiomeatal (D/E)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0 (Pérvio)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" colspan="2"><strong>2 (Obstruído)</strong></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Pontuação Total:</strong> 0-24 (cada lado pontuado separadamente: 0-12)<br>
                  <strong>Referência:</strong> Lund VJ, Mackay IS. <em>Staging in rhinosinusitis</em>. Rhinology. 1993;31:183-4. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/8140385/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-sinonasal-ajcc8",
        name: "TNM Tumores Sinonasais - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Seios Paranasais",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Seios Paranasais (Seio Maxilar) - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor limitado à mucosa do seio maxilar, sem erosão óssea</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Erosão óssea ou destruição incluindo palato duro e/ou meato nasal médio, exceto parede posterior do seio maxilar e placas pterigoides</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de: parede posterior do seio maxilar, tecido subcutâneo, assoalho/parede medial da órbita, fossa pterigóide, seios etmoidais</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de: conteúdo orbital anterior, pele da bochecha, placas pterigoides, fossa infratemporal, lâmina cribiforme, seio esfenoidal ou frontal</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de: ápice orbital, dura-máter, cérebro, fossa craniana média, nervos cranianos (exceto V2), nasofaringe, clivus</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. American Joint Committee on Cancer. 2017. 
                  <a href="https://www.cancer.org/cancer/nasal-cavity-and-paranasal-sinus-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-larynx-ajcc8",
        name: "TNM Carcinoma de Laringe - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Laringe e Hipofaringe",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Laringe (Glote) - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor limitado a uma prega vocal com mobilidade normal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor envolve ambas as pregas vocais</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor estende-se à supraglote e/ou subglote, ou com mobilidade reduzida da prega vocal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor limitado à laringe com fixação da prega vocal e/ou invasão de: espaço paraglótico, erosão leve da cartilagem tireoide</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão através da cartilagem tireoide ou tecidos além da laringe (traqueia, partes moles do pescoço, músculos extrínsecos da língua, músculos strap, tireoide, esôfago)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de espaço pré-vertebral, encasamento de artéria carótida ou estruturas mediastinais</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/laryngeal-and-hypopharyngeal-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Laringe</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-hypopharynx-ajcc8",
        name: "TNM Carcinoma de Hipofaringe - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Laringe e Hipofaringe",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Hipofaringe - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤2 cm e limitado a um subsítio da hipofaringe</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;2 cm mas ≤4 cm, ou invade mais de um subsítio sem fixação de hemilaringe</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;4 cm ou com fixação de hemilaringe ou extensão para esôfago</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de: cartilagem tireoide/cricoide, osso hioide, glândula tireoide, esôfago, compartimento central de partes moles</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de fáscia pré-vertebral, encasamento de artéria carótida ou estruturas mediastinais</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Subsítios:</strong> Seio piriforme, parede faríngea posterior, área pós-cricoide<br>
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/laryngeal-and-hypopharyngeal-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Hipofaringe</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-nasopharynx-ajcc8",
        name: "TNM Carcinoma de Nasofaringe - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Laringe e Hipofaringe",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Nasofaringe - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor limitado à nasofaringe, ou extensão para orofaringe/cavidade nasal sem extensão parafaríngea</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Extensão parafaríngea, ou envolvimento adjacente de partes moles (músculos mediais do pterigoide, músculos pterigoides laterais, espaço pré-vertebral)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de estruturas ósseas (base do crânio, vértebra cervical, ossos pterigoides, seios paranasais)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Extensão intracraniana, envolvimento de nervos cranianos, hipofaringe, órbita, glândula parótida, ou extensão além da fáscia látero-faríngea para espaço mastigador</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Associação com EBV (vírus Epstein-Barr)<br>
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/nasopharyngeal-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Nasofaringe</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-oral-cavity-ajcc8",
        name: "TNM Carcinoma de Cavidade Oral - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Cavidade Oral e Orofaringe",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Cavidade Oral - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤2 cm, profundidade de invasão (DOI) ≤5 mm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤2 cm com DOI &gt;5 mm ≤10 mm, OU tumor &gt;2 cm mas ≤4 cm com DOI ≤10 mm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;4 cm OU qualquer tumor com DOI &gt;10 mm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cavidade oral: invade estruturas adjacentes (cortical óssea, língua profunda/extrínseca, seio maxilar, pele da face). Lábio: invade osso mandibular/maxilar ou nervo alveolar inferior</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invade espaço mastigador, placas pterigoides, base do crânio, ou encasa artéria carótida interna</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>DOI (Depth of Invasion):</strong> Profundidade de invasão medida da membrana basal até o ponto mais profundo de invasão<br>
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/oral-cavity-and-oropharyngeal-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Cavidade Oral</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-oropharynx-ajcc8",
        name: "TNM Carcinoma de Orofaringe (HPV+/HPV-) - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Cavidade Oral e Orofaringe",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Carcinoma de Orofaringe HPV-positivo (p16+) - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição (HPV+)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤2 cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;2 cm mas ≤4 cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;4 cm ou extensão para superfície lingual da epiglote</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de laringe, músculo extrínseco da língua, pterigoide medial, palato duro, mandíbula, ou além</td>
              </tr>
            </tbody>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição (HPV-)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1-T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Estadiamento semelhante à cavidade oral (ver TNM Cavidade Oral)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão de espaço mastigador, placas pterigoides, base do crânio ou encasamento de artéria carótida</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> HPV+ (p16+) tem melhor prognóstico e estadiamento separado no AJCC 8th<br>
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/oral-cavity-and-oropharyngeal-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Orofaringe</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "cervical-lymph-node-levels",
        name: "Níveis de Linfonodos Cervicais I-VII (Som-Curtin)",
        category: "headNeck",
        subcategory: "Linfonodos Cervicais",
        type: "informative",
        modality: ["TC", "RM", "USG"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Níveis de Linfonodos Cervicais (Classificação de Som-Curtin)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Nível</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Localização Anatômica</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Drenagem Primária</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Ia</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Submentonianos (entre ventres anteriores dos mm. digástricos)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lábio inferior, assoalho bucal anterior, ponta da língua</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Ib</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Submandibulares (entre ventre anterior e posterior do m. digástrico)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cavidade oral, glândula submandibular</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>IIa</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Jugulares superiores anteriores (anterior à v. jugular interna)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cavidade oral, nasofaringe, orofaringe</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>IIb</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Jugulares superiores posteriores (posterior à v. jugular interna)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nasofaringe, orofaringe</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>III</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Jugulares médios (do osso hioide até cricoide)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Orofaringe, hipofaringe, laringe</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>IV</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Jugulares inferiores (abaixo da cartilagem cricoide)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hipofaringe, laringe, tireoide, esôfago cervical</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Va</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cervicais posteriores superiores (acima do cricoide)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nasofaringe, orofaringe, tireoide</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Vb</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cervicais posteriores inferiores (abaixo do cricoide)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tireoide, faringe, laringe</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>VI</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Compartimento central anterior (do hioide à fúrcula esternal)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tireoide, laringe, hipofaringe, esôfago cervical</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>VII</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Mediastino superior (abaixo da fúrcula esternal)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tireoide, esôfago, pulmão</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> Som PM, Curtin HD, Mancuso AA. <em>Imaging-based nodal classification for evaluation of neck metastatic adenopathy</em>. AJR. 2000;174:837-844. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/10701636/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "metastatic-lymph-node-criteria",
        name: "Critérios de Linfonodo Cervical Metastático",
        category: "headNeck",
        subcategory: "Linfonodos Cervicais",
        type: "informative",
        modality: ["TC", "RM", "USG"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Linfonodo Cervical Metastático (TC/RM/USG)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Significado</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tamanho</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Nível Ia-II: &gt;15 mm<br>
                  Nível III-VI: &gt;10 mm<br>
                  Nível VII: &gt;7 mm
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alta suspeita de metástase</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Necrose Central</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Área hipodensa/hipointensa central sem realce</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Altamente específico para metástase</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Extensão Extranodal (ENE)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Irregularidade capsular, densidade perilinfonodal, invasão de estruturas adjacentes</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Indica doença localmente avançada</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Forma</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Forma arredondada (razão L/T &lt;2)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Suspeito se associado a outros critérios</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Realce Heterogêneo</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Realce irregular, não uniforme</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sugere necrose incipiente ou metástase</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Conglomerado</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Múltiplos linfonodos fundidos (≥3)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Carga tumoral elevada</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Perda do Hilo Gorduroso</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ausência de hilo hipodenso central</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sugestivo de substituição metastática</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> van den Brekel MW, et al. <em>Detection of lymph node metastases in the neck: radiologic criteria</em>. Radiology. 1998. 
                  <a href="https://pubs.rsna.org/doi/10.1148/radiology.177.2.2217762" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "who-salivary-glands-2022",
        name: "WHO Classificação de Tumores de Glândulas Salivares 5th Ed 2022",
        category: "headNeck",
        subcategory: "Glândulas Salivares",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">WHO Tumores de Glândulas Salivares 5th Ed (2022)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Exemplos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumores Benignos</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Adenoma pleomórfico (tumor misto benigno)<br>
                  - Tumor de Warthin (cistoadenoma papilar linfomatoso)<br>
                  - Oncocitoma<br>
                  - Adenoma de células basais
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Carcinomas de Baixo Grau</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Carcinoma acinic cell<br>
                  - Carcinoma adenoide cístico (padrão tubular/cribriforme)<br>
                  - Carcinoma mucoepidermóide de baixo grau<br>
                  - Carcinoma secretório (ETV6-NTRK3)
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Carcinomas de Alto Grau</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Carcinoma mucoepidermóide de alto grau<br>
                  - Carcinoma adenoide cístico (padrão sólido)<br>
                  - Carcinoma de células claras<br>
                  - Carcinoma ex-adenoma pleomórfico<br>
                  - Carcinoma pobremente diferenciado NOS<br>
                  - Carcinoma de células escamosas
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumores Raros</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Carcinoma mioepitelial<br>
                  - Carcinoma epitelial-mioepitelial<br>
                  - Adenocarcinoma NOS<br>
                  - Linfoma de zona marginal (MALT)
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> WHO Classification of Head and Neck Tumours, 5th Edition. 2022. 
                  <a href="https://publications.iarc.fr/616" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">WHO 5th Ed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "tnm-salivary-glands-ajcc8",
        name: "TNM Tumores de Glândulas Salivares Maiores - AJCC 8th Edition",
        category: "headNeck",
        subcategory: "Glândulas Salivares",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Glândulas Salivares Maiores - AJCC 8th Ed</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤2 cm sem extensão extraparenquimatosa</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;2 cm mas ≤4 cm sem extensão extraparenquimatosa</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;4 cm e/ou extensão extraparenquimatosa (tecidos moles/pele)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invade: pele, mandíbula, canal auditivo, nervo facial</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invade: base do crânio, placas pterigoides, encasa artéria carótida</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Aplica-se a parótida, submandibular e sublingual<br>
                  <strong>Referência:</strong> AJCC Cancer Staging Manual, 8th Edition. 2017. 
                  <a href="https://www.cancer.org/cancer/salivary-gland-cancer/detection-diagnosis-staging/staging.html" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC Salivary</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "stamco-cholesteatoma",
        name: "STAMCO Classification - Colesteatoma de Orelha Média",
        category: "headNeck",
        subcategory: "Orelha e Osso Temporal",
        type: "informative",
        modality: ["TC"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">STAMCO (Staging of Middle Ear Cholesteatoma) Classification</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Componente</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Classificação</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>S (Size)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  S0 = oculto<br>
                  S1 = 1 subsítio<br>
                  S2 = 2 subsítios<br>
                  S3 = &gt;2 subsítios
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T (Tympanic membrane)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  T0 = íntegra<br>
                  T1 = perfuração central<br>
                  T2 = perfuração marginal<br>
                  T3 = perfuração subtotal/total
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>A (Atelectasis)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  A0 = sem atelectasia<br>
                  A1 = retração leve<br>
                  A2 = retração grave
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>M (Mastoid)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  M0 = sem acometimento mastoideo<br>
                  M1 = células mastoideas acometidas<br>
                  M2 = ápice petroso acometido
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>C (Complications)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  C0 = sem complicações<br>
                  C1 = erosão ossicular<br>
                  C2 = canal semicircular lateral<br>
                  C3 = nervo facial<br>
                  C4 = outras complicações graves
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>O (Otorrhea)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  O0 = sem otorreia<br>
                  O1 = otorreia intermitente<br>
                  O2 = otorreia persistente
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> Yung M, et al. <em>EAONO/JOS Joint Consensus Statements on the Definitions, Classification and Staging of Middle Ear Cholesteatoma</em>. J Int Adv Otol. 2017. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/28476051/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "pittsburgh-temporal-bone",
        name: "Pittsburgh Classification - Tumores de Osso Temporal",
        category: "headNeck",
        subcategory: "Orelha e Osso Temporal",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Pittsburgh Classification - Câncer de Osso Temporal</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estágio</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Limitado ao canal auditivo externo, sem erosão óssea ou tecidos moles</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Erosão óssea do CAE (não incluindo TMJ) ou evidência limitada (&lt;5 mm) de invasão de tecidos moles</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Erosão completa do osso do CAE com (&gt;5 mm) invasão de tecidos moles, ou TMJ, ou orelha média<br>
                  Sem envolvimento de mastoide ou paralisia facial
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>T4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Erosão da cóclea, ápice petroso, parede medial da orelha média, canal carotídeo, jugular, dura-máter<br>
                  OU paralisia facial
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Carcinoma espinocelular é o tipo histológico mais comum<br>
                  <strong>Referência:</strong> Arriaga M, et al. <em>Staging proposal for external auditory meatus carcinoma: the University of Pittsburgh staging system</em>. Arch Otolaryngol Head Neck Surg. 1990. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/2317324/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: "who-orbit-eye-2022",
        name: "WHO Classificação de Tumores de Órbita e Olho 5th Ed",
        category: "headNeck",
        subcategory: "Órbita",
        type: "informative",
        modality: ["TC", "RM"],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">WHO Tumores de Órbita e Olho 5th Ed (2022)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Exemplos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumores Vasculares</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Hemangioma cavernoso (mais comum em adultos)<br>
                  - Hemangioma capilar (mais comum em crianças)<br>
                  - Linfangioma<br>
                  - Varizes orbitais
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumores Neurais</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Glioma do nervo óptico (associado a NF1)<br>
                  - Meningioma do nervo óptico<br>
                  - Schwannoma<br>
                  - Neurofibroma
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumores de Glândula Lacrimal</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Adenoma pleomórfico (benigno)<br>
                  - Carcinoma adenoide cístico<br>
                  - Carcinoma mucoepidermóide<br>
                  - Linfoma MALT
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Linfoma e Leucemia</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Linfoma de zona marginal extranodal (MALT)<br>
                  - Linfoma folicular<br>
                  - Linfoma difuso de grandes células B<br>
                  - Leucemia (infiltração orbital)
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Lesões Inflamatórias</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Pseudotumor orbital (doença inflamatória orbital idiopática)<br>
                  - Doença de Graves (orbitopatia tireoidiana)<br>
                  - Sarcoidose<br>
                  - Doença relacionada a IgG4
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Metástases</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Adultos: mama, pulmão, próstata, melanoma<br>
                  - Crianças: neuroblastoma, tumor de Ewing, leucemia
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> WHO Classification of Tumours of the Eye, 5th Edition. 2022. 
                  <a href="https://publications.iarc.fr/Book-And-Report-Series/Who-Classification-Of-Tumours/WHO-Classification-Of-Tumours-Of-The-Eye-2023" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">WHO Eye 5th Ed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
    ],
  },
  {
    id: 'thorax',
    name: 'Tórax',
    icon: 'Activity',
    tables: [
      {
        id: 'lung_rads_v2022',
        name: 'Lung-RADS v2022 (ACR)',
        category: 'thorax',
        subcategory: 'Sistemas RADS',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Lung-RADS v2022 - Rastreamento de Câncer de Pulmão (ACR)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Risco Câncer</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Incompleto - avaliação adicional necessária</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC de tórax adicional ou comparação com exames prévios</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Negativo - sem nódulos</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rastreamento anual</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Benigno - nódulos calcificados, cicatrizes</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rastreamento anual</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente benigno - nódulos &lt;6mm ou subsólidos estáveis</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1-2%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 6 meses</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4A</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Suspeito - nódulos sólidos 6-8mm ou subsólidos com crescimento</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">5-15%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 3 meses; considerar PET-CT</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4B</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Muito suspeito - nódulos ≥8mm ou com características malignas</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;15%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 3 meses ou PET-CT/biópsia</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4X</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Categoria adicional para achados suspeitos não pulmonares</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Avaliação apropriada para achado específico</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> ACR Lung-RADS v2022. American College of Radiology. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/Lung-Rads" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR Lung-RADS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'co_rads',
        name: 'CO-RADS (Classificação COVID-19)',
        category: 'thorax',
        subcategory: 'Sistemas RADS',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">CO-RADS - Classificação de Suspeita de COVID-19 na TC de Tórax</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Nível de Suspeita</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados Típicos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Não interpretável</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Qualidade inadequada para interpretação</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Muito baixa</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC normal ou achados não infecciosos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Baixa</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Achados típicos de outras infecções (pneumonia lobar, broncopneumonia, cavitações)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Indeterminada</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades em vidro fosco perihilares, padrão de pneumonia em organização</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alta</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades em vidro fosco multifocais, bilaterais, periféricas</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Muito alta</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Padrão pavimentoso (crazy-paving), consolidações periféricas, sinal do halo reverso</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>6</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">RT-PCR positivo</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Confirmação laboratorial de COVID-19</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Referência:</strong> Prokop M, et al. CO-RADS: A Categorical CT Assessment Scheme for Patients Suspected of Having COVID-19. Radiology 2020. 
                  <a href="https://www.radiologyassistant.nl/chest/covid-19/corads-classification" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">CO-RADS Official</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'fleischner_solid_2017',
        name: 'Fleischner 2017 - Nódulos Sólidos',
        category: 'thorax',
        subcategory: 'Nódulos Pulmonares',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Fleischner Society 2017 - Seguimento de Nódulos Pulmonares Sólidos</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tamanho</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Baixo Risco<br/><span style="font-weight: normal; font-size: 9pt;">(sem fatores de risco)</span></th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Alto Risco<br/><span style="font-weight: normal; font-size: 9pt;">(tabagismo, história familiar)</span></th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&lt;6mm</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento de rotina</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opcional: TC em 12 meses</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>6-8mm</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 6-12 meses, depois considerar TC em 18-24 meses</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 6-12 meses, depois TC em 18-24 meses</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;8mm</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar TC em 3 meses, PET-CT ou biópsia</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar TC em 3 meses, PET-CT ou biópsia</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Múltiplos</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2;">Seguir baseado no nódulo de maior tamanho e características mais suspeitas</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Fatores de alto risco incluem: tabagismo, história familiar de câncer pulmonar, exposição a radon, asbesto ou radioatividade.<br/>
                  <strong>Referência:</strong> MacMahon H, et al. Guidelines for Management of Incidental Pulmonary Nodules. Radiology 2017;284(1):228-243. 
                  <a href="https://pubs.rsna.org/doi/10.1148/radiol.2017161659" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">RSNA Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'fleischner_subsolid_2017',
        name: 'Fleischner 2017 - Nódulos Subsólidos',
        category: 'thorax',
        subcategory: 'Nódulos Pulmonares',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Fleischner Society 2017 - Seguimento de Nódulos Subsólidos (Vidro Fosco)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tipo</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tamanho</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Conduta Recomendada</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" rowspan="2"><strong>Único<br/>Vidro Fosco Puro</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;6mm</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento de rotina</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥6mm</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 6-12 meses para confirmar persistência, depois TC a cada 2 anos até 5 anos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Único<br/>Parcialmente Sólido</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 3-6 meses para confirmar persistência. Se persistir, vigilância anual por 5 anos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" rowspan="2"><strong>Múltiplos<br/>Vidro Fosco Puro</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;6mm</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar TC em 3-6 meses; se estáveis, considerar vigilância anual por 5 anos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥6mm</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 3-6 meses; subsequentes vigilâncias a cada 2-4 anos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Múltiplos<br/>Parcialmente Sólidos</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC em 3-6 meses; vigilância subsequente baseada no nódulo mais suspeito</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Nódulos subsólidos têm maior probabilidade de representar adenocarcinoma ou lesões pré-invasivas (AAH/AIS).<br/>
                  <strong>Referência:</strong> MacMahon H, et al. Guidelines for Management of Incidental Pulmonary Nodules. Radiology 2017;284(1):228-243. 
                  <a href="https://pubs.rsna.org/doi/10.1148/radiol.2017161659" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">RSNA Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'uip_criteria_2022',
        name: 'Critérios UIP ATS/ERS/JRS/ALAT 2022',
        category: 'thorax',
        subcategory: 'Doenças Intersticiais',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Pneumonia Intersticial Usual (UIP) na TC - ATS/ERS/JRS/ALAT 2022</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Padrão</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados na TC</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Diagnóstico FPI</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>UIP</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Faveolamento subpleural e basal predominante<br/>
                  - Reticulação periférica<br/>
                  - Distribuição heterogênea<br/>
                  - Ausência de achados inconsistentes
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #d4edda;"><strong>Definitivo</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Provável UIP</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Reticulação subpleural e basal<br/>
                  - Faveolamento pode estar ausente<br/>
                  - Distribuição heterogênea<br/>
                  - Ausência de achados inconsistentes
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #fff3cd;"><strong>Provável</strong><br/><span style="font-size: 9pt;">(considerar biópsia)</span></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Indeterminado</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Fibrose sutil com vidro fosco<br/>
                  - Reticulação sem faveolamento claro<br/>
                  - Padrão geográfico ou difuso
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #fff3cd;"><strong>Incerto</strong><br/><span style="font-size: 9pt;">(biópsia recomendada)</span></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Padrão Alternativo</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Predomínio peribroncovascular ou superior<br/>
                  - Consolidações extensas<br/>
                  - Cistos múltiplos<br/>
                  - Mosaico de atenuação proeminente<br/>
                  - Vidro fosco extenso
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; background-color: #f8d7da;"><strong>Improvável FPI</strong><br/><span style="font-size: 9pt;">(considerar outras ILD)</span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Abreviações:</strong> UIP = Usual Interstitial Pneumonia; FPI = Fibrose Pulmonar Idiopática; ILD = Interstitial Lung Disease.<br/>
                  <strong>Referência:</strong> Raghu G, et al. Diagnosis of Idiopathic Pulmonary Fibrosis. ATS/ERS/JRS/ALAT Clinical Practice Guideline 2022. Am J Respir Crit Care Med 2022;205(9):e18-e47. 
                  <a href="https://www.atsjournals.org/doi/10.1164/rccm.202203-0468ST" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJRCCM 2022</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'ild_classification',
        name: 'Classificação das Pneumonias Intersticiais',
        category: 'thorax',
        subcategory: 'Doenças Intersticiais',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação das Pneumonias Intersticiais Idiopáticas (ATS/ERS 2013)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Tipo</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados Principais na TC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" rowspan="3"><strong>Crônicas Fibrosantes</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>FPI/UIP</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Faveolamento subpleural basal, reticulação, distribuição heterogênea</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PINE</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Vidro fosco subpleural periférico, reticulação, faveolamento ocasional</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PIf (fibrosante não classificável)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Fibrose sem padrão definido de UIP ou PINE</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;" rowspan="2"><strong>Agudas/Subagudas</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PO</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Consolidações periféricas e peribrônquicas migratórias, padrão "atolamide inverso"</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PIA</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades bilaterais difusas em vidro fosco, consolidação, fase exsudativa DAD</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" rowspan="2"><strong>Relacionadas ao Tabagismo</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PILD</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cistos de paredes finas, nódulos centrolobulares, vidro fosco</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>BRID</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Bronquiectasias de tração, vidro fosco centrolobular, nódulos centrilobulares</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Rara</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>PID</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cistos irregulares difusos de paredes espessas, vidro fosco</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Abreviações:</strong> FPI = Fibrose Pulmonar Idiopática; UIP = Usual Interstitial Pneumonia; PINE = Pneumonia Intersticial Não Específica; PIf = Pneumonia Intersticial fibrosante; PO = Pneumonia em Organização; PIA = Pneumonia Intersticial Aguda; DAD = Dano Alveolar Difuso; PILD = Pneumonia Intersticial Linfoide; BRID = Doença Respiratória Intersticial Relacionada a Bronquiolite; PID = Pneumonia Intersticial Descamativa.<br/>
                  <strong>Referência:</strong> Travis WD, et al. An Official ATS/ERS Statement: Update of the International Multidisciplinary Classification of the Idiopathic Interstitial Pneumonias. Am J Respir Crit Care Med 2013;188(6):733-748. 
                  <a href="https://www.atsjournals.org/doi/10.1164/rccm.201308-1483ST" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJRCCM 2013</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'wells_tep',
        name: 'Critérios de Wells (TEP)',
        category: 'thorax',
        subcategory: 'Tromboembolismo Pulmonar',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Wells para Tromboembolismo Pulmonar (TEP)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério Clínico</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Sinais e sintomas de TVP (edema, dor à palpação em trajeto venoso profundo)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3,0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">TEP é o diagnóstico mais provável ou igualmente provável que alternativas</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3,0</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Frequência cardíaca &gt;100 bpm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,5</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Imobilização ≥3 dias ou cirurgia nas últimas 4 semanas</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,5</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">TEP ou TVP prévios</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,5</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Hemoptise</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,0</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Malignidade ativa (tratamento em andamento ou paliativo, ou diagnóstico nos últimos 6 meses)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,0</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Interpretação do Score de Wells</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontuação</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Probabilidade Clínica</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&lt;2,0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Baixa probabilidade</strong> (TEP improvável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">D-dímero; se negativo, exclui TEP</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2,0-6,0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Probabilidade moderada</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">D-dímero; se positivo, angioTC</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;6,0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Alta probabilidade</strong> (TEP provável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">AngioTC diretamente</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Abreviações:</strong> TEP = Tromboembolismo Pulmonar; TVP = Trombose Venosa Profunda; bpm = batimentos por minuto.<br/>
                  <strong>Referência:</strong> Wells PS, et al. Derivation of a Simple Clinical Model to Categorize Patients Probability of Pulmonary Embolism. Thrombosis and Haemostasis 2000;83(3):416-420. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/10760023/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'geneva_revised',
        name: 'Geneva Revisado (TEP)',
        category: 'thorax',
        subcategory: 'Tromboembolismo Pulmonar',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Geneva Score Revisado para Tromboembolismo Pulmonar</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério Clínico</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Idade &gt;65 anos</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">TEP ou TVP prévios</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Cirurgia ou fratura no último mês</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Malignidade ativa</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Dor unilateral em membro inferior</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Hemoptise</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Frequência cardíaca 75-94 bpm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Frequência cardíaca ≥95 bpm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">5</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Dor à palpação de veias profundas de MMII e edema unilateral</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Interpretação do Geneva Revisado</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontuação</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Probabilidade Clínica</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Prevalência TEP</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0-3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Baixa probabilidade</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">8%</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4-10</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Probabilidade intermediária</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">28%</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>≥11</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Alta probabilidade</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">74%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Vantagens:</strong> Não requer julgamento clínico subjetivo (ao contrário do Wells). Critérios objetivos.<br/>
                  <strong>Referência:</strong> Le Gal G, et al. Prediction of Pulmonary Embolism in the Emergency Department: The Revised Geneva Score. Ann Intern Med 2006;144(3):165-171. 
                  <a href="https://www.acpjournals.org/doi/10.7326/0003-4819-144-3-200602070-00004" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Ann Intern Med</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'pesi_score',
        name: 'PESI Score (Índice de Gravidade TEP)',
        category: 'thorax',
        subcategory: 'Tromboembolismo Pulmonar',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">PESI - Pulmonary Embolism Severity Index (Prognóstico)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Variável</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Idade (anos)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Idade em anos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Sexo masculino</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+10</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Câncer</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+30</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Insuficiência cardíaca crônica</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+10</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Doença pulmonar crônica</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+10</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Frequência cardíaca ≥110 bpm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+20</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Pressão arterial sistólica &lt;100 mmHg</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+30</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Frequência respiratória ≥30 rpm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+20</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Temperatura &lt;36°C</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+20</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Alteração do estado mental</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+60</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">SpO₂ &lt;90%</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">+20</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação de Risco - PESI</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Classe</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontuação</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Mortalidade 30d</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>I (Muito baixo)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≤65</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0-1,6%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar alta precoce/ambulatorial</td>
              </tr>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>II (Baixo)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">66-85</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,7-3,5%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar alta precoce/ambulatorial</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>III (Intermediário)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">86-105</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3,2-7,1%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Internação hospitalar</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IV (Alto)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">106-125</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4,0-11,4%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Internação hospitalar + monitorização intensiva</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>V (Muito alto)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥126</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10,0-24,5%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">UTI + considerar terapias avançadas (trombólise, etc.)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> PESI é útil para estratificar risco de morte em 30 dias e decidir local de tratamento (ambulatorial vs hospitalar).<br/>
                  <strong>Referência:</strong> Aujesky D, et al. Derivation and Validation of a Prognostic Model for Pulmonary Embolism. Am J Respir Crit Care Med 2005;172(8):1041-1046. 
                  <a href="https://www.atsjournals.org/doi/10.1164/rccm.200506-862OC" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJRCCM</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'ct_signs_pe',
        name: 'Sinais de TEP na TC',
        category: 'thorax',
        subcategory: 'Tromboembolismo Pulmonar',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Sinais de Tromboembolismo Pulmonar na Angiotomografia</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Sinal</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Sensibilidade</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Falha de enchimento central</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Trombo no lúmen arterial pulmonar, rodeado por contraste (sinal direto, padrão-ouro)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">95-100%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Sinal da "ferradura" ou "trombo flutuante"</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Trombo circundado por contraste em formato de ferradura (alto risco embolização)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Amputação vascular</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Interrupção abrupta do ramo arterial pulmonar (oclusão completa)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Aumento do diâmetro do tronco pulmonar</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Diâmetro &gt;29mm sugere hipertensão pulmonar aguda</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Relação VD/VE &gt;1,0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Dilatação do ventrículo direito (sobrecarga aguda, sinal de gravidade)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Retificação do septo interventricular</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Desvio septal em direção ao VE por sobrecarga do VD</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Refluxo de contraste para VCI/hepáticas</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Disfunção ventricular direita grave (refluxo retrógrado)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Infarto pulmonar</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Consolidação periférica em cunha/triangular com base pleural (Hampton's hump)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">20-30%</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Oligoemia regional (Westermark)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Área de redução da vascularização pulmonar distal ao trombo</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10-15%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Derrame pleural</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Pequeno derrame geralmente unilateral (inespecífico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">30-40%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Sinais de sobrecarga ventricular direita (VD/VE &gt;1, retificação septal, refluxo) indicam TEP de alto risco com pior prognóstico.<br/>
                  <strong>Referência:</strong> Remy-Jardin M, et al. CT Angiography of Pulmonary Embolism. Radiology 2012;263(2):315-340. 
                  <a href="https://pubs.rsna.org/doi/10.1148/radiol.12111625" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">RSNA Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'berlin_ards',
        name: 'Definição de Berlin (SDRA)',
        category: 'thorax',
        subcategory: 'SDRA e Lesão Pulmonar',
        type: 'informative',
        modality: ['Clínico', 'RX', 'TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Definição de Berlin para Síndrome do Desconforto Respiratório Agudo (SDRA)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Definição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tempo</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Início em até 1 semana após insulto clínico conhecido ou piora de sintomas respiratórios</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Imagem (RX ou TC de tórax)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades bilaterais não totalmente explicadas por derrame pleural, colapso lobar/pulmonar ou nódulos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Origem do edema</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Insuficiência respiratória não totalmente explicada por insuficiência cardíaca ou sobrecarga hídrica. Avaliação objetiva necessária (ex: ecocardiograma) se não há fator de risco</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Oxigenação</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ver tabela de gravidade abaixo</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação de Gravidade da SDRA (Berlin)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Gravidade</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">PaO₂/FiO₂</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">PEEP mínima</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Mortalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Leve</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">200-300 mmHg</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥5 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">27%</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Moderada</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">100-200 mmHg</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥5 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">32%</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Grave</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;100 mmHg</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥5 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">45%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Abreviações:</strong> PaO₂/FiO₂ = Relação pressão arterial de oxigênio/fração inspirada de oxigênio; PEEP = Positive End-Expiratory Pressure.<br/>
                  <strong>Nota:</strong> Definição de Berlin substitui classificação anterior de ALI (Acute Lung Injury).<br/>
                  <strong>Referência:</strong> ARDS Definition Task Force. Acute Respiratory Distress Syndrome: The Berlin Definition. JAMA 2012;307(23):2526-2533. 
                  <a href="https://jamanetwork.com/journals/jama/fullarticle/1160659" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">JAMA</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'murray_score',
        name: 'Murray Score (Lesão Pulmonar Aguda)',
        category: 'thorax',
        subcategory: 'SDRA e Lesão Pulmonar',
        type: 'informative',
        modality: ['RX'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Murray Score - Índice de Lesão Pulmonar Aguda</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Componente</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"><strong>1. Infiltrados na Radiografia de Tórax</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">Sem infiltrados alveolares</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">Infiltrados alveolares em 1 quadrante</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">Infiltrados alveolares em 2 quadrantes</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">Infiltrados alveolares em 3 quadrantes</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">Infiltrados alveolares em 4 quadrantes</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"><strong>2. Hipoxemia (PaO₂/FiO₂)</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">≥300</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">225-299</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">175-224</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">100-174</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">&lt;100</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"><strong>3. Complacência Pulmonar (se ventilado)</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">≥80 mL/cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">60-79 mL/cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">40-59 mL/cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">20-39 mL/cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">&lt;20 mL/cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2"><strong>4. PEEP (se ventilado)</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">≤5 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">6-8 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">9-11 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">12-14 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; padding-left: 24px;">≥15 cmH₂O</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Interpretação do Murray Score</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Score Final</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Interpretação</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem lesão pulmonar</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0,1-2,5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesão pulmonar leve a moderada</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;2,5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesão pulmonar aguda grave (SDRA)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Cálculo:</strong> Score final = Soma dos 4 componentes ÷ Número de componentes utilizados (geralmente 4).<br/>
                  <strong>Nota:</strong> Murray Score é histórico; Definição de Berlin (2012) é o padrão atual para SDRA.<br/>
                  <strong>Referência:</strong> Murray JF, et al. An Expanded Definition of the Adult Respiratory Distress Syndrome. Am Rev Respir Dis 1988;138(3):720-723. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/3202424/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'tnm_lung_t_8th',
        name: 'TNM Pulmão 8ª Ed - Descriptor T',
        category: 'thorax',
        subcategory: 'TNM Câncer de Pulmão',
        type: 'informative',
        modality: ['TC', 'PET'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Câncer de Pulmão 8ª Edição IASLC - Tumor Primário (T)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria T</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>TX</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor primário não pode ser avaliado, ou tumor comprovado por citologia de escarro/lavado mas não visualizado</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>T0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem evidência de tumor primário</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>Tis</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Carcinoma in situ (adenocarcinoma in situ [AIS] e carcinoma escamoso in situ)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>T1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumor ≤3 cm em maior dimensão, cercado por pulmão/pleura visceral, sem invasão brônquica proximal ao lobar</strong></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T1mi</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Adenocarcinoma minimamente invasivo (≤3 cm, predominantemente lepídico, invasão ≤5 mm)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T1a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor ≤1 cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T1b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;1 cm mas ≤2 cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T1c</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;2 cm mas ≤3 cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>T2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumor &gt;3 cm mas ≤5 cm OU com envolvimento brônquico ≥2 cm da carina, invasão pleural visceral, atelectasia/pneumonite obstrutiva até hilo</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T2a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;3 cm mas ≤4 cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; padding-left: 24px;"><strong>T2b</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor &gt;4 cm mas ≤5 cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>T3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumor &gt;5 cm mas ≤7 cm OU invasão de parede torácica, nervo frênico, pericárdio parietal OU nódulo(s) no mesmo lobo</strong></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>T4</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tumor &gt;7 cm OU invasão de mediastino, diafragma, coração, grandes vasos, traqueia, nervo laríngeo, esôfago, corpos vertebrais, carina OU nódulo(s) em lobo ipsilateral diferente</strong></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Mudanças principais da 8ª Ed: subdivisão de T1 em T1a/T1b/T1c, subdivisão de T2 em T2a/T2b, reclassificação de tumores &gt;7 cm para T4.<br/>
                  <strong>Referência:</strong> Goldstraw P, et al. The IASLC Lung Cancer Staging Project: Proposals for Revision of the TNM Stage Groupings in the Forthcoming (Eighth) Edition of the TNM Classification for Lung Cancer. JTO 2016;11(1):39-51. 
                  <a href="https://www.jto.org/article/S1556-0864(15)00027-4/fulltext" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">JTO IASLC 8th</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'tnm_lung_n_8th',
        name: 'TNM Pulmão 8ª Ed - Descriptor N',
        category: 'thorax',
        subcategory: 'TNM Câncer de Pulmão',
        type: 'informative',
        modality: ['TC', 'PET'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM Câncer de Pulmão 8ª Edição IASLC - Linfonodos Regionais (N)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria N</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>NX</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Linfonodos regionais não podem ser avaliados</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem metástases em linfonodos regionais</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Metástases em linfonodos peribronquicos e/ou hilares ipsilaterais e intrapulmonares</strong><br/>
                  <span style="font-size: 9pt;">Incluindo envolvimento por extensão direta (Estações 10-14 IASLC)</span>
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Metástases em linfonodos mediastinais ipsilaterais e/ou subcarinais</strong><br/>
                  <span style="font-size: 9pt;">Estações 1, 2, 3, 4, 5, 6, 7, 8, 9 ipsilaterais (IASLC)</span>
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Metástases em linfonodos mediastinais contralaterais, hilares contralaterais, escalenos ou supraclaviculares (ipsi ou contralaterais)</strong><br/>
                  <span style="font-size: 9pt;">Inclui: mediastinais contralaterais (Estações 1-9), hilares contralaterais (Estação 10), escalenos (Estação 1), supraclaviculares (Estação 1)</span>
                </td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Estações Linfonodais IASLC (Resumo por Categoria N)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Estações IASLC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>10</strong> - Hilares<br/>
                  <strong>11</strong> - Interlobares<br/>
                  <strong>12</strong> - Lobares<br/>
                  <strong>13</strong> - Segmentares<br/>
                  <strong>14</strong> - Subsegmentares
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N2<br/>(ipsilaterais)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>1</strong> - Supraclaviculares baixos<br/>
                  <strong>2R/2L</strong> - Paratraqueais superiores<br/>
                  <strong>3a/3p</strong> - Pré-vasculares e retrotraqueais<br/>
                  <strong>4R/4L</strong> - Paratraqueais inferiores<br/>
                  <strong>5</strong> - Subaórticos (janela aortopulmonar)<br/>
                  <strong>6</strong> - Paraaórticos<br/>
                  <strong>7</strong> - Subcarinais<br/>
                  <strong>8</strong> - Paraesofágicos<br/>
                  <strong>9</strong> - Ligamento pulmonar inferior
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>N3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Qualquer estação mediastinal <strong>contralateral</strong> (1-9 contralaterais)<br/>
                  - Hilares <strong>contralaterais</strong> (Estação 10 contralateral)<br/>
                  - <strong>Escalenos</strong> (Estação 1, ipsi ou contra)<br/>
                  - <strong>Supraclaviculares</strong> (Estação 1, ipsi ou contra)
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Classificação N não mudou da 7ª para 8ª Edição. Apenas mapa linfonodal IASLC (2009) foi refinado.<br/>
                  <strong>Referência:</strong> Rusch VW, et al. The IASLC Lung Cancer Staging Project: A Proposal for a New International Lymph Node Map in the Forthcoming Seventh Edition of the TNM Classification for Lung Cancer. JTO 2009;4(5):568-577. 
                  <a href="https://www.jto.org/article/S1556-0864(15)31506-0/fulltext" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">JTO IASLC Map</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'iaslc_lymph_nodes',
        name: 'Estações Linfonodais IASLC',
        category: 'thorax',
        subcategory: 'Linfonodos Mediastinais',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Mapa de Linfonodos Mediastinais IASLC 2009</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Estação</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Nome</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Localização Anatômica</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #e8f4f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" colspan="3"><strong>MEDIASTINAIS SUPERIORES (N2/N3)</strong></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Supraclaviculares baixos</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Acima da clavícula, abaixo da borda superior do manúbrio esternal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2R</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paratraqueal superior direito</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lateral à traqueia, entre borda superior do manúbrio e borda inferior do tronco braquiocefálico</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2L</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paratraqueal superior esquerdo</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lateral à traqueia, entre borda superior do manúbrio e borda superior do arco aórtico</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>3a</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Pré-vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Anterior aos grandes vasos, medial aos nervos frênicos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>3p</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Retrotraqueal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Posterior à traqueia</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4R</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paratraqueal inferior direito</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lateral à traqueia, entre borda inferior do tronco braquiocefálico e borda inferior da veia ázigos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>4L</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paratraqueal inferior esquerdo</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lateral à traqueia, entre borda superior do arco aórtico e borda superior da artéria pulmonar esquerda</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Subaórticos (janela aortopulmonar)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laterais ao ligamento arterioso, inferiores ao arco aórtico</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>6</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paraaórticos (aorta ascendente)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Anteriores e laterais à aorta ascendente e arco aórtico</td>
              </tr>
              <tr style="background-color: #e8f4f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" colspan="3"><strong>MEDIASTINAIS INFERIORES (N2)</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>7</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Subcarinais</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Abaixo da carina traqueal</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>8</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Paraesofágicos</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Adjacentes à parede esofágica, abaixo da carina</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>9</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ligamento pulmonar inferior</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ao longo do ligamento pulmonar inferior</td>
              </tr>
              <tr style="background-color: #e8f4f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" colspan="3"><strong>HILARES E INTRAPULMONARES (N1)</strong></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>10</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hilares</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Próximos aos brônquios principais e vasos hilares</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>11</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Interlobares</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Entre brônquios lobares</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>12</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lobares</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ao longo dos brônquios lobares</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>13</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Segmentares</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ao longo dos brônquios segmentares</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>14</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Subsegmentares</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Ao longo dos brônquios subsegmentares</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Estações 1-9 são mediastinais (N2 se ipsilaterais, N3 se contralaterais). Estações 10-14 são hilares/intrapulmonares (N1).<br/>
                  <strong>Referência:</strong> Rusch VW, et al. The IASLC Lung Cancer Staging Project: A Proposal for a New International Lymph Node Map. JTO 2009;4(5):568-577. 
                  <a href="https://www.jto.org/article/S1556-0864(15)31506-0/fulltext" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">JTO IASLC Map</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'lymph_node_criteria',
        name: 'Critérios de Linfonodo Suspeito',
        category: 'thorax',
        subcategory: 'Linfonodos Mediastinais',
        type: 'informative',
        modality: ['TC', 'PET'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Linfonodo Mediastinal Suspeito na TC e PET-CT</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">TC</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">PET-CT</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Tamanho (eixo curto)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  ≥10 mm: suspeito<br/>
                  <span style="font-size: 9pt; color: #666;">Sensibilidade 60-70%, Especificidade 70-80%</span>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Tamanho isolado não é critério confiável no PET-CT
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Morfologia</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Margens irregulares<br/>
                  - Perda do hilo gorduroso<br/>
                  - Agrupamento/conglomerado<br/>
                  - Realce heterogêneo<br/>
                  - Necrose central
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Morfologia é secundária ao critério metabólico
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>SUVmax (PET-CT)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  N/A
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>SUVmax &gt;2,5</strong>: suspeito para malignidade<br/>
                  <span style="font-size: 9pt; color: #666;">Sensibilidade 85-90%, Especificidade 85-90%</span><br/>
                  <span style="font-size: 9pt; color: #b00;">Atenção: falsos-positivos (inflamação, granulomas, sarcoidose)</span>
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Número de linfonodos comprometidos</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Múltiplas estações envolvidas aumenta probabilidade de malignidade
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Captação em múltiplas estações mediastinais sugere N2/N3
                </td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Localização</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Avaliar se ipsilateral (N2) ou contralateral (N3)
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Ipsilateral (N2) vs contralateral/supraclavicular (N3)
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>Confirmação histológica</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2;">
                  <strong>Recomendada quando altera o estadiamento/conduta:</strong><br/>
                  - Mediastinoscopia<br/>
                  - EBUS (Endobronchial Ultrasound) - biópsia transbrônquica<br/>
                  - EUS (Endoscopic Ultrasound) - biópsia transesofágica<br/>
                  - Biópsia por agulha guiada por TC
                </td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Limitações dos Critérios</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Falsos-Positivos</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Falsos-Negativos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Sarcoidose<br/>
                  - Tuberculose<br/>
                  - Histoplasmose<br/>
                  - Silicose/pneumoconioses<br/>
                  - Linfoma<br/>
                  - Infecções ativas
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Micrometástases em linfonodos &lt;10mm<br/>
                  - Tumores pouco metabólicos (carcinoide, adenocarcinoma in situ)<br/>
                  - Hiperglicemia (reduz SUV)<br/>
                  - Necrose central extensa
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Recomendação:</strong> Combinação de TC (tamanho/morfologia) + PET-CT (SUVmax) + confirmação histológica quando necessário.<br/>
                  <strong>Referência:</strong> Silvestri GA, et al. Methods for Staging Non-small Cell Lung Cancer: Diagnosis and Management of Lung Cancer, 3rd ed. ACCP Guidelines. Chest 2013;143(5):e211S-e250S. 
                  <a href="https://journal.chestnet.org/article/S0012-3692(15)33009-7/fulltext" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACCP Chest</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'light_criteria',
        name: 'Critérios de Light (Derrame Pleural)',
        category: 'thorax',
        subcategory: 'Derrame Pleural',
        type: 'informative',
        modality: ['Lab', 'US'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Critérios de Light - Diferenciação Transudato vs Exsudato</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">
                  <strong>EXSUDATO</strong> se preencher <strong>≥1 dos critérios abaixo:</strong>
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">1. Proteína no líquido pleural / Proteína sérica</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;0,5</strong></td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">2. LDH no líquido pleural / LDH sérica</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;0,6</strong></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">3. LDH no líquido pleural</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>&gt;2/3 do limite superior normal da LDH sérica</strong></td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Interpretação dos Resultados</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tipo</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Causas Comuns</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>TRANSUDATO</strong><br/><span style="font-size: 9pt;">(nenhum critério de Light)</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Insuficiência cardíaca congestiva (mais comum)<br/>
                  - Cirrose hepática<br/>
                  - Síndrome nefrótica<br/>
                  - Hipoalbuminemia<br/>
                  - Embolia pulmonar (20% dos casos)<br/>
                  - Diálise peritoneal
                </td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>EXSUDATO</strong><br/><span style="font-size: 9pt;">(≥1 critério de Light)</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  - Pneumonia bacteriana/parapneumônico<br/>
                  - Neoplasias (pulmão, mama, linfoma, metástases)<br/>
                  - Embolia pulmonar (80% dos casos)<br/>
                  - Tuberculose<br/>
                  - Pós-cirurgia cardíaca (Síndrome de Dressler)<br/>
                  - Doenças autoimunes (LES, AR)<br/>
                  - Pancreatite<br/>
                  - Quilotórax<br/>
                  - Empiema
                </td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Parâmetros Adicionais para Classificação</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Parâmetro</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Transudato</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Exsudato</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Glicose (mg/dL)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Normal (semelhante ao sérico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;60 (empiema, TB, AR, neoplasia)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">pH</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">≥7,30</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;7,30 (empiema, TB, neoplasia avançada)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Leucócitos (células/mm³)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1000</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;1000 (infecção/inflamação)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Aspecto</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Claro, amarelo-citrino</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Turvo, hemorrágico, purulento, quiloso</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Sensibilidade:</strong> 98% para identificação de exsudatos. <strong>Especificidade:</strong> ~80% (pode classificar erroneamente alguns transudatos como exsudatos).<br/>
                  <strong>Nota:</strong> Uso prolongado de diuréticos pode converter transudatos em "pseudoexsudatos" pelos critérios de Light.<br/>
                  <strong>Referência:</strong> Light RW, et al. Pleural Effusions: The Diagnostic Separation of Transudates and Exudates. Ann Intern Med 1972;77(4):507-513. 
                  <a href="https://www.acpjournals.org/doi/10.7326/0003-4819-77-4-507" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Ann Intern Med</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'masaoka_koga',
        name: 'Masaoka-Koga (Timoma)',
        category: 'thorax',
        subcategory: 'Tumores Mediastinais',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação de Masaoka-Koga para Timoma (Estadiamento Cirúrgico)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Estágio</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Sobrevida 5 anos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>I</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Tumor encapsulado</strong><br/>
                  Sem invasão macroscópica ou microscópica da cápsula
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">90-95%</td>
              </tr>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IIA</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invasão microscópica da cápsula</strong><br/>
                  Invasão identificada apenas no exame histopatológico
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">85-90%</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IIB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invasão macroscópica da gordura mediastinal ou pleura mediastinal</strong><br/>
                  Infiltração visível macroscopicamente dos tecidos pericapsulares
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">70-80%</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>III</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Invasão macroscópica de órgãos vizinhos</strong><br/>
                  Pericárdio, grandes vasos, pulmão (sem invasão de pleura parietal, parede torácica ou estruturas cardíacas)
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">50-70%</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IVA</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Disseminação pleural ou pericárdica</strong><br/>
                  Implantes pleurais ou pericárdicos (não continuo com tumor primário)
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">30-50%</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IVB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Metástases linfáticas ou hematogênicas</strong><br/>
                  Disseminação para linfonodos ou órgãos distantes
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10-30%</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Achados por Imagem (TC/RM) Sugestivos de Estadiamento</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Estágio</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados de Imagem</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>I</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Massa mediastinal anterior homogênea, bem delimitada, cápsula íntegra, sem sinais de invasão</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IIA/IIB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Irregularidade capsular, infiltração sutil de gordura mediastinal adjacente, margens mal definidas</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>III</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Invasão de pericárdio (espessamento, derrame), grandes vasos (perda de plano gorduroso, distorção de contorno), pulmão (consolidação adjacente)
                </td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IVA</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nódulos/implantes pleurais ou pericárdicos separados do tumor primário, derrame pleural/pericárdico neoplásico</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>IVB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástases pulmonares, hepáticas, ósseas, cerebrais; linfonodos cervicais, supraclaviculares ou abdominais aumentados</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Masaoka-Koga é o sistema de estadiamento cirúrgico mais utilizado. Correlação radiológica nem sempre é precisa; confirmação cirúrgica é padrão-ouro.<br/>
                  <strong>Associação:</strong> ~30-50% dos timomas associados com miastenia gravis. ~10-15% com aplasia pura de células vermelhas ou hipogamaglobulinemia.<br/>
                  <strong>Referências:</strong> Masaoka A, et al. (1981); Koga K, et al. (1994). 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/7034409/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed Masaoka</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'who_thymic',
        name: 'WHO Tumores Tímicos 2021',
        category: 'thorax',
        subcategory: 'Tumores Mediastinais',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">WHO Classificação de Tumores Tímicos 2021 (5ª Edição)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tipo WHO</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Descrição Histológica</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Comportamento</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>A</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Timoma medular</strong><br/>
                  Células epiteliais fusiformes/ovais, ausência ou raros linfócitos
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Benigno</td>
              </tr>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>AB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Timoma misto</strong><br/>
                  Componentes de tipo A + áreas ricas em linfócitos (tipo B)
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Benigno</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Timoma linfocítico</strong><br/>
                  Predomínio de linfócitos, células epiteliais em pequenos agregados, semelhante a timo normal
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Baixo risco</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Timoma cortical</strong><br/>
                  Células epiteliais poligonais com núcleos vesiculares, linfócitos imaturos abundantes
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Risco intermediário</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Timoma epitelial/atípico</strong><br/>
                  Predomínio de células epiteliais arredondadas/poligonais com atipia leve, poucos linfócitos
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Alto risco</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>C</strong><br/><span style="font-size: 9pt;">(Carcinoma Tímico)</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Carcinoma tímico</strong><br/>
                  Atipia citológica franca, alto índice mitótico, necrose. Subtipos: escamoso (mais comum), basoloide, linfoepitelioma-like, sarcomatoide, mucoepidermoide, adenocarcinoma, outros
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Maligno</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Achados de Imagem Sugestivos (TC/RM)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Tipo</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados Típicos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>A/AB</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesões pequenas (&lt;5 cm), homogêneas, bem delimitadas, sem calcificações, realce homogêneo, encapsuladas</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B1/B2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesões maiores, lobuladas, realce heterogêneo moderado, pode haver septações internas, contornos relativamente lisos</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesões grandes (&gt;7 cm), contornos irregulares, infiltração de gordura mediastinal, pode invadir estruturas adjacentes (pericárdio, grandes vasos)</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>C (Carcinoma)</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  Massa irregular, infiltrativa, necrose central comum, calcificações, realce heterogêneo intenso, invasão de mediastino/pulmão/pleura, metástases pleurais/pulmonares/linfonodais frequentes, derrame pleural/pericárdico
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Tipos A/AB têm melhor prognóstico. B3 e C têm comportamento mais agressivo e frequentemente requerem quimioterapia/radioterapia adjuvante.<br/>
                  <strong>Associação com Miastenia Gravis:</strong> Tipo B2/B3 (50-60%), Tipo A (10-20%), Tipo C (raro).<br/>
                  <strong>Referência:</strong> WHO Classification of Tumours of the Lung, Pleura, Thymus and Heart, 5th Edition. 2021. 
                  <a href="https://publications.iarc.fr/Book-And-Report-Series/Who-Classification-Of-Tumours/Thoracic-Tumours-2021" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">WHO Thoracic 5th Ed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      {
        id: 'brixia_score',
        name: 'Brixia Score (COVID-19 RX)',
        category: 'thorax',
        subcategory: 'COVID-19 Scoring',
        type: 'informative',
        modality: ['RX'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Brixia Score - Avaliação de Gravidade COVID-19 em Radiografia de Tórax</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Zona Pulmonar</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Localização Anatômica</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>A</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>superior</strong> direita (acima do arco anterior da 2ª costela)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;" rowspan="6">
                  <strong>0</strong> - Sem comprometimento<br/>
                  <strong>1</strong> - Opacidades intersticiais<br/>
                  <strong>2</strong> - Opacidades intersticiais + alveolares (&lt;50%)<br/>
                  <strong>3</strong> - Opacidades intersticiais + alveolares (≥50%)
                </td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>B</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>inferior</strong> direita (abaixo do arco anterior da 2ª costela)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>C</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>superior</strong> esquerda (acima do arco anterior da 2ª costela)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>D</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>inferior</strong> esquerda (abaixo do arco anterior da 2ª costela)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>E</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>inferior direita abaixo do diafragma</strong> (recesso costofrênico direito)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>F</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Zona <strong>inferior esquerda abaixo do diafragma</strong> (recesso costofrênico esquerdo)</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Interpretação do Score Total (Soma das 6 zonas: A+B+C+D+E+F)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Score Total</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Classificação de Gravidade</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Correlação Clínica</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Radiografia normal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem comprometimento pulmonar visível</td>
              </tr>
              <tr style="background-color: #d4edda;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>1-5</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Leve</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alterações discretas, geralmente não requer suporte ventilatório</td>
              </tr>
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>6-9</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Moderada</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Pode necessitar oxigenoterapia suplementar</td>
              </tr>
              <tr style="background-color: #ffc107;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>10-12</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Moderada a grave</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Frequentemente requer oxigenoterapia de alto fluxo ou ventilação não invasiva</td>
              </tr>
              <tr style="background-color: #f8d7da;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>13-18</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Grave a crítica</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alto risco de intubação orotraqueal e ventilação mecânica invasiva</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin-top: 10px;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Descrição dos Achados Radiográficos</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontuação</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: left;">Achados na Radiografia</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>0</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem anormalidades visíveis</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>1</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades intersticiais (padrão reticular, reticulonodular, linhas B de Kerley)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>2</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades intersticiais + opacidades alveolares ocupando &lt;50% da zona (vidro fosco, consolidações focais)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>3</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Opacidades intersticiais + opacidades alveolares ocupando ≥50% da zona (consolidações extensas, "white lung")</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Brixia Score correlaciona-se com necessidade de ventilação mecânica e mortalidade em pacientes COVID-19.<br/>
                  <strong>Vantagens:</strong> Método simples, rápido, reprodutível, utiliza radiografia de tórax padrão (PA ou AP).<br/>
                  <strong>Referência:</strong> Borghesi A, Maroldi R. COVID-19 Outbreak in Italy: Experimental Chest X-Ray Scoring System for Quantifying and Monitoring Disease Progression. Radiol Med 2020;125(5):509-513. 
                  <a href="https://link.springer.com/article/10.1007/s11547-020-01200-3" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Radiol Med</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
    ],
  },
  {
    id: 'abdomen',
    name: 'Abdome',
    icon: 'Layers',
    tables: [
      // ============= LI-RADS v2018 =============
      {
        id: 'li_rads_v2018',
        name: 'LI-RADS v2018 (Carcinoma Hepatocelular)',
        category: 'abdomen',
        subcategory: 'Sistemas RADS',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">LI-RADS v2018 - Carcinoma Hepatocelular (TC/RM com Contraste)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios Principais</th>
                <th style="border: 1px solid #333; padding: 8px;">Probabilidade CHC</th>
                <th style="border: 1px solid #333; padding: 8px;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Definitivamente benigno (cisto simples, hemangioma típico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente benigno (hemangioma atípico, nódulo hiperplásico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;10%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento anual ou alta</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Probabilidade intermediária (nódulo &lt;20mm sem APHE ou com washout tardio)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10-50%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento 3-6 meses</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente CHC (&lt;20mm com APHE + washout ou cápsula)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">50-90%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Investigação adicional ou tratamento empírico</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Definitivamente CHC (≥20mm APHE + washout/cápsula, ou ≥10mm com crescimento ≥50%)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;95%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tratamento ou biópsia opcional</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-M</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente maligno não-CHC (rim arterial periférico, difusão restrita marcada)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Variável</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Investigação adicional/biópsia</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">LR-TIV</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Trombose tumoral na veia porta/hepáticas (APHE + washout dentro do trombo)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Alto</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tratamento sistêmico</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>APHE:</strong> Arterial Phase Hyperenhancement (realce arterial). <strong>Washout:</strong> Clareamento relativo em fase venosa/tardia.<br/>
                  <strong>Referência:</strong> ACR. LI-RADS v2018 Core. American College of Radiology, 2018. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR LI-RADS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= CEUS LI-RADS =============
      {
        id: 'ceus_li_rads',
        name: 'CEUS LI-RADS v2017 (Ultrassonografia com Contraste)',
        category: 'abdomen',
        subcategory: 'Sistemas RADS',
        type: 'informative',
        modality: ['US'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">CEUS LI-RADS v2017 - Ultrassonografia com Contraste para CHC</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Probabilidade CHC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">CEUS-LR-5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Realce arterial + washout tardio (&gt;60s) leve-moderado</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;95%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">CEUS-LR-4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Realce arterial + washout tardio intenso</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">50-90%</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">CEUS-LR-3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Realce arterial + sem washout / ou washout precoce</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10-50%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">CEUS-LR-M</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Padrão sugestivo de malignidade não-CHC (realce periférico, washout precoce intenso)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Variável</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Washout Tardio:</strong> &gt;60 segundos. <strong>Washout Precoce:</strong> &lt;60 segundos.<br/>
                  <strong>Referência:</strong> ACR. CEUS LI-RADS v2017 Core. American College of Radiology, 2017. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS/CEUS-LI-RADS-v2017" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR CEUS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= LI-RADS US Vigilância =============
      {
        id: 'li_rads_us_surveillance',
        name: 'LI-RADS US Vigilância v2024',
        category: 'abdomen',
        subcategory: 'Sistemas RADS',
        type: 'informative',
        modality: ['US'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">LI-RADS US Vigilância v2024 - Rastreamento CHC</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Achados US</th>
                <th style="border: 1px solid #333; padding: 8px;">Seguimento</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">US-1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Negativo (sem nódulos visíveis)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Continuar vigilância semestral</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">US-2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nódulo subcentrimérico (&lt;10mm)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">US em 3-6 meses ou continuar vigilância semestral</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">US-3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Nódulo ≥10mm</td>
                <td style="border: 1px solid #ddd; padding: 8px;">TC/RM multifásica com contraste</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Visualização</td>
                <td style="border: 1px solid #ddd; padding: 8px;">A (adequada), B (limitada), C (inadequada)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Considerar RM se visualização C</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Indicação:</strong> Vigilância semestral de pacientes cirróticos ou alto risco CHC.<br/>
                  <strong>Referência:</strong> ACR. LI-RADS US Surveillance v2024. American College of Radiology, 2024. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/LI-RADS/US-Surveillance" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR LI-RADS US</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Child-Pugh =============
      {
        id: 'child_pugh',
        name: 'Child-Pugh Score (Cirrose Hepática)',
        category: 'abdomen',
        subcategory: 'Fígado e Vias Biliares',
        type: 'informative',
        modality: ['Clínico'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Child-Pugh Score - Avaliação de Cirrose Hepática</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Parâmetro</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">1 ponto</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">2 pontos</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">3 pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Bilirrubina (mg/dL)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;2</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2-3</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;3</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Albumina (g/dL)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;3,5</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2,8-3,5</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;2,8</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">INR</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1,7</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1,7-2,2</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;2,2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Ascite</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ausente</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Leve (controlada)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Moderada/Severa</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Encefalopatia</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Ausente</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Grau I-II (leve)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Grau III-IV (severa)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Classificação:</strong> Classe A (5-6 pts): compensada, sobrevida 1 ano 100%. Classe B (7-9 pts): disfunção significativa, sobrevida 1 ano 80%. Classe C (10-15 pts): descompensada, sobrevida 1 ano 45%.<br/>
                  <strong>Referência:</strong> Pugh RN et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg 1973;60(8):646-9. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/4541913/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= MELD Score =============
      {
        id: 'meld_score',
        name: 'MELD Score (Doença Hepática Terminal)',
        category: 'abdomen',
        subcategory: 'Fígado e Vias Biliares',
        type: 'informative',
        modality: ['Lab'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">MELD Score - Model for End-Stage Liver Disease</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Fórmula</th>
                <th style="border: 1px solid #333; padding: 8px;">Parâmetros</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">MELD = 3,78×ln[bilirrubina(mg/dL)] + 11,2×ln[INR] + 9,57×ln[creatinina(mg/dL)] + 6,43</td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                  <strong>Bilirrubina total (mg/dL)</strong><br/>
                  <strong>INR</strong><br/>
                  <strong>Creatinina (mg/dL)</strong>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Interpretação:</strong> 6-9: doença leve. 10-19: doença moderada. 20-29: doença grave. 30-40: doença muito grave.<br/>
                  <strong>Uso:</strong> Priorização de transplante hepático (quanto maior MELD, maior prioridade). Mortalidade em 3 meses: MELD 40 = 71%, MELD 20-29 = 19%, MELD 10-19 = 6%.<br/>
                  <strong>Referência:</strong> Kamath PS et al. A model to predict survival in patients with end-stage liver disease. Hepatology 2001;33(2):464-70. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/11172350/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">PubMed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Modified CTSI =============
      {
        id: 'modified_ctsi',
        name: 'Modified CT Severity Index (Pancreatite)',
        category: 'abdomen',
        subcategory: 'Pâncreas',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Modified CT Severity Index - Pancreatite Aguda</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Parâmetro</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">Inflamação Pancreática</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Pâncreas normal</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Edema pancreático isolado</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Inflamação pancreática + peripancreática</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">Necrose Pancreática</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Sem necrose</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Necrose &lt;30%</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Necrose &gt;30%</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">4</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">Complicações Extrapancreáticas</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Ausentes</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Presentes (derrame pleural, ascite, trombose vascular, alteração GI)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Score Total (0-10):</strong> 0-2 pts = pancreatite leve (mortalidade 0%). 4-6 pts = moderada (mortalidade 6%). 8-10 pts = grave (mortalidade 17%).<br/>
                  <strong>Referência:</strong> Mortele KJ et al. A modified CT severity index for evaluating acute pancreatitis. Radiology 2004;233(3):715-22. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/15564408/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Atlanta 2012 =============
      {
        id: 'atlanta_revision',
        name: 'Classificação Atlanta Revisada 2012 (Pancreatite Aguda)',
        category: 'abdomen',
        subcategory: 'Pâncreas',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação Atlanta Revisada 2012 - Pancreatite Aguda</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Definição</th>
                <th style="border: 1px solid #333; padding: 8px;">Achados TC/RM</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">GRAVIDADE</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Leve</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem falência orgânica ou complicações locais</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Edema intersticial, sem necrose</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Moderada</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Falência orgânica transitória (&lt;48h) e/ou complicação local</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Coleções agudas, pseudocisto</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Grave</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Falência orgânica persistente (&gt;48h)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Necrose, necrose infectada, SIRS</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">COMPLICAÇÕES LOCAIS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">APFC</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Coleção Peripancreática Aguda (&lt;4 sem)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Líquido homogêneo, sem parede definida</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Pseudocisto</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Coleção encapsulada madura (&gt;4 sem)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Líquido homogêneo, parede bem definida</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">ANC</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Coleção Necrótica Aguda (&lt;4 sem)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Conteúdo heterogêneo (líquido + debris)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">WON</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Necrose Organizada Murada (&gt;4 sem)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Conteúdo heterogêneo encapsulado</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>APFC:</strong> Acute Peripancreatic Fluid Collection. <strong>ANC:</strong> Acute Necrotic Collection. <strong>WON:</strong> Walled-Off Necrosis.<br/>
                  <strong>Referência:</strong> Banks PA et al. Classification of acute pancreatitis—2012: revision of the Atlanta classification. Gut 2013;62(1):102-111. 
                  <a href="https://gut.bmj.com/content/62/1/102" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Gut BMJ</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Bosniak v2019 =============
      {
        id: 'bosniak_v2019',
        name: 'Classificação de Bosniak v2019 (Cistos Renais)',
        category: 'abdomen',
        subcategory: 'Rins e Vias Urinárias',
        type: 'informative',
        modality: ['TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Classificação de Bosniak v2019 - Cistos Renais</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Classe</th>
                <th style="border: 1px solid #333; padding: 8px;">Características TC/RM</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Risco Malignidade</th>
                <th style="border: 1px solid #333; padding: 8px;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">I</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cisto simples: parede fina, sem septos/calcificações/realce</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">0%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cisto minimamente complicado: poucos septos finos, calcificações finas, cisto hiperdenso &lt;3cm</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;5%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IIF</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Múltiplos septos finos, calcificações nodulares, cisto hiperdenso ≥3cm, sem realce mensurável</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">5-10%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento TC/RM (6m, 12m, 24m, 36m, 60m)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">III</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Espessamento parietal/septal irregular, realce mensurável de parede/septo</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">50%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cirurgia ou vigilância ativa</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IV</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Componente sólido captante independente de parede/septo</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">85-100%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cirurgia</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Realce mensurável:</strong> ≥10 UH na TC ou ≥15% em RM após contraste. <strong>Cisto hiperdenso:</strong> &gt;70 UH pré-contraste na TC.<br/>
                  <strong>Referência:</strong> Silverman SG et al. Bosniak Classification of Cystic Renal Masses, Version 2019. Radiology 2019;292(2):475-488. 
                  <a href="https://pubs.rsna.org/doi/10.1148/radiol.2019182646" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Radiology</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= PI-RADS v2.1 =============
      {
        id: 'pi_rads_v21',
        name: 'PI-RADS v2.1 (Próstata)',
        category: 'abdomen',
        subcategory: 'Próstata',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">PI-RADS v2.1 - Lesões Prostáticas em RM Multiparamétrica</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Probabilidade Câncer Clinicamente Significativo</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios Principais</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Muito baixa (câncer clinicamente significativo altamente improvável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ZP:</strong> T2 homogêneo. <strong>ZT:</strong> Difusão normal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Baixa (câncer clinicamente significativo improvável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ZP:</strong> T2 heterogêneo linear/cuneiforme. <strong>ZT:</strong> Hipersinal leve/difuso em DWI</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Intermediária (presença de câncer clinicamente significativo é equívoca)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ZP:</strong> Hipossinal T2 focal heterogêneo. <strong>ZT:</strong> Hipersinal focal em DWI, ADC baixo</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alta (câncer clinicamente significativo é provável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ZP:</strong> Hipossinal T2 focal circunscrito ≤1,5cm. <strong>ZT:</strong> Hipersinal marcado DWI + ADC muito baixo</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Muito alta (câncer clinicamente significativo é altamente provável)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>ZP:</strong> Hipossinal T2 focal circunscrito &gt;1,5cm ou invasão extraprostática. <strong>ZT:</strong> Lesão PI-RADS 4 + &gt;1,5cm ou invasão</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>ZP:</strong> Zona Periférica (sequência dominante: DWI). <strong>ZT:</strong> Zona de Transição (sequência dominante: T2). <strong>DWI:</strong> Difusão. <strong>ADC:</strong> Coeficiente de difusão aparente.<br/>
                  <strong>Referência:</strong> ACR/ESUR. PI-RADS v2.1 Prostate Imaging Reporting and Data System, 2019. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/PI-RADS" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR PI-RADS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= O-RADS US =============
      {
        id: 'o_rads_us',
        name: 'O-RADS US (Massas Ovarianas)',
        category: 'abdomen',
        subcategory: 'Ovário e Anexos',
        type: 'informative',
        modality: ['US'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">O-RADS US - Massas Ovarianas e Anexiais (Ultrassonografia)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Descrição</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Risco Malignidade</th>
                <th style="border: 1px solid #333; padding: 8px;">Conduta</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Incompleto - avaliação inadequada ou necessita imagem adicional</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">RM/TC se necessário</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Normal (ovários pré-menopáusicos, folículos, corpo lúteo)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Achado benigno (cisto simples, endometrioma típico, teratoma maduro típico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem seguimento</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Baixo risco (unilocular &lt;10cm sem características suspeitas, endometrioma atípico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1-10%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Seguimento US anual</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Risco intermediário (unilocular com vascularização, multilocular sem componente sólido)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">10-50%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">RM ou cirurgia</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Alto risco (componente sólido, ascite, carcinomatose peritoneal, vascularização central)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;50%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cirurgia oncológica</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Considerar idade, menopausa e marcadores tumorais (CA-125, HE4) na avaliação final.<br/>
                  <strong>Referência:</strong> ACR. O-RADS US Risk Stratification and Management System, 2020. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR O-RADS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= O-RADS MRI =============
      {
        id: 'o_rads_mri',
        name: 'O-RADS MRI (Massas Ovarianas RM)',
        category: 'abdomen',
        subcategory: 'Ovário e Anexos',
        type: 'informative',
        modality: ['RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">O-RADS MRI - Massas Ovarianas e Anexiais (Ressonância Magnética)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios RM</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Risco Malignidade</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Fisiológico (folículo, corpo lúteo hemorrágico)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Benigno (cisto simples, endometrioma típico, teratoma maduro típico, leiomioma pediculado)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&lt;1%</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente benigno (endometrioma atípico, hemorragia organizada, cistadenoma seroso)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1-5%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">4</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Provavelmente maligno (componente sólido &lt;1cm, septos espessos, realce moderado, difusão intermediária)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">5-50%</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">5</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Maligno (componente sólido ≥1cm, realce intenso, difusão restrita marcada, carcinomatose, ascite)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">&gt;50%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> RM superior a US para caracterizar lesões anexiais complexas, diferenciar teratomas, endometriomas e tumores sólidos.<br/>
                  <strong>Referência:</strong> ACR. O-RADS MRI Risk Stratification and Management System, 2020. 
                  <a href="https://www.acr.org/Clinical-Resources/Reporting-and-Data-Systems/O-RADS" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">ACR O-RADS MRI</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= FIGO Endometrial =============
      {
        id: 'figo_endometrial_2023',
        name: 'FIGO Câncer Endometrial 2023',
        category: 'abdomen',
        subcategory: 'Útero',
        type: 'informative',
        modality: ['RM', 'TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">FIGO 2023 - Estadiamento Câncer de Endométrio</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Estágio</th>
                <th style="border: 1px solid #333; padding: 8px;">Extensão do Tumor</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">ESTÁGIO I - Tumor confinado ao útero</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IA</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão miometrial &lt;50%</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IB</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão miometrial ≥50%</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">ESTÁGIO II - Invasão do estroma cervical</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão do estroma cervical, sem extensão além do útero</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">ESTÁGIO III - Extensão local e/ou regional</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IIIA</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão serosa uterina e/ou anexos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IIIB</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Envolvimento vaginal ou paramétrios</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IIIC1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástases linfonodos pélvicos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IIIC2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástases linfonodos para-aórticos (com ou sem pélvicos)</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">ESTÁGIO IV - Extensão à distância</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IVA</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão mucosa vesical e/ou intestinal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">IVB</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástases à distância (incluindo intra-abdominais, linfonodos inguinais)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> RM é superior para avaliação de invasão miometrial e extensão cervical. FIGO 2023 incorporou classificação molecular.<br/>
                  <strong>Referência:</strong> FIGO Committee. FIGO staging for endometrial cancer: 2023. Int J Gynecol Obstet 2023. 
                  <a href="https://obgyn.onlinelibrary.wiley.com/doi/10.1002/ijgo.14923" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">FIGO 2023</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= FIGO Cervical =============
      {
        id: 'figo_cervical_2018',
        name: 'FIGO Câncer Cervical 2018',
        category: 'abdomen',
        subcategory: 'Útero',
        type: 'informative',
        modality: ['RM', 'TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">FIGO 2018 - Estadiamento Câncer de Colo Uterino</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Estágio</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Extensão do Tumor</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IA1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão estromal ≤3mm, extensão horizontal ≤7mm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IA2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão estromal &gt;3mm mas ≤5mm, extensão horizontal ≤7mm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IB1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor confinado ao colo, &lt;2cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IB2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor confinado ao colo, 2-4cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IB3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor confinado ao colo, ≥4cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade além do útero, mas não parede pélvica ou terço inferior vagina</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IIIA</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade terço inferior da vagina</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IIIB</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Extensão à parede pélvica e/ou hidronefrose</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IIIC1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase linfonodos pélvicos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IIIC2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase linfonodos para-aórticos</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IVA</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Invasão mucosa vesical/retal</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IVB</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástases à distância</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Mudança FIGO 2018:</strong> Incorporação do estadiamento linfonodal (IIIC1/IIIC2) baseado em imagem ou patologia.<br/>
                  <strong>Referência:</strong> Bhatla N et al. Revised FIGO staging for carcinoma of the cervix uteri. Int J Gynecol Obstet 2019;145(1):129-135. 
                  <a href="https://obgyn.onlinelibrary.wiley.com/doi/10.1002/ijgo.12749" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">FIGO 2018</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= AAST Liver =============
      {
        id: 'aast_liver_2018',
        name: 'AAST Trauma Hepático 2018',
        category: 'abdomen',
        subcategory: 'Trauma Abdominal',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">AAST 2018 - Escala de Lesão Hepática (Organ Injury Scale)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Grau</th>
                <th style="border: 1px solid #333; padding: 8px;">Tipo de Lesão</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios TC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">I</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular &lt;10% área superfície. Laceração capsular &lt;1cm profundidade</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular 10-50% área ou intraparenquimatoso &lt;10cm. Laceração 1-3cm profundidade, &lt;10cm comprimento</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">III</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular &gt;50% área ou intraparenquimatoso ≥10cm. Laceração &gt;3cm profundidade</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IV</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração envolvendo 25-75% lobo hepático ou 1-3 segmentos de Couinaud. Lesão veia porta ou hepática</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">V</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração &gt;75% lobo hepático. Avulsão veia hepática. Lesão veia cava retro-hepática</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">VI</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Avulsão hepática (desvascularização completa)</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Modificadores:</strong> +Vascular (extravasamento ativo), +Biliar (lesão ducto biliar). Aumentar 1 grau para múltiplas lesões.<br/>
                  <strong>Referência:</strong> AAST. Liver Injury Scale 2018 Update. J Trauma Acute Care Surg 2018;85(6):1075-1076. 
                  <a href="https://journals.lww.com/jtrauma/fulltext/2018/12000/2018_update_to_the_aast_organ_injury_scale.9.aspx" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AAST OIS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= AAST Spleen =============
      {
        id: 'aast_spleen_2018',
        name: 'AAST Trauma Esplênico 2018',
        category: 'abdomen',
        subcategory: 'Trauma Abdominal',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">AAST 2018 - Escala de Lesão Esplênica (Organ Injury Scale)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Grau</th>
                <th style="border: 1px solid #333; padding: 8px;">Tipo de Lesão</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios TC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">I</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular &lt;10% área superfície. Laceração capsular &lt;1cm profundidade</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular 10-50% área ou intraparenquimatoso &lt;5cm. Laceração 1-3cm profundidade sem vasos trabeculares</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">III</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma subcapsular &gt;50% área ou intraparenquimatoso ≥5cm. Laceração &gt;3cm profundidade ou envolvendo vasos trabeculares</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IV</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração envolvendo vasos segmentares/hilares com desvascularização &gt;25% baço</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">V</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Fragmentação esplênica completa. Lesão vascular hilar com desvascularização completa do baço</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Modificadores:</strong> +Vascular (extravasamento ativo ou pseudoaneurisma). Aumentar 1 grau para múltiplas lesões até grau III.<br/>
                  <strong>Referência:</strong> AAST. Spleen Injury Scale 2018 Update. J Trauma Acute Care Surg 2018;85(6):1075-1076. 
                  <a href="https://journals.lww.com/jtrauma/fulltext/2018/12000/2018_update_to_the_aast_organ_injury_scale.9.aspx" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AAST OIS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= AAST Kidney =============
      {
        id: 'aast_kidney_2018',
        name: 'AAST Trauma Renal 2018',
        category: 'abdomen',
        subcategory: 'Trauma Abdominal',
        type: 'informative',
        modality: ['TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">AAST 2018 - Escala de Lesão Renal (Organ Injury Scale)</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Grau</th>
                <th style="border: 1px solid #333; padding: 8px;">Tipo de Lesão</th>
                <th style="border: 1px solid #333; padding: 8px;">Critérios TC</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">I</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Contusão ou hematoma</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Contusão ou hematoma subcapsular não expansivo sem laceração parenquimatosa</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">II</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma ou laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Hematoma perirrenal confinado à fáscia de Gerota. Laceração &lt;1cm profundidade sem extravasamento urinário</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">III</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração &gt;1cm profundidade sem lesão sistema coletor ou extravasamento urinário</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">IV</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração envolvendo sistema coletor com extravasamento urinário. Lesão artéria/veia renal segmentar com hematoma contido</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">V</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Laceração ou lesão vascular</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Fragmentação renal completa. Avulsão do hilo renal com desvascularização. Trombose artéria renal principal</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Modificadores:</strong> +Vascular (extravasamento ativo ou pseudoaneurisma). +Urinário (extravasamento urinário). Aumentar 1 grau para lesões bilaterais até grau III.<br/>
                  <strong>Referência:</strong> AAST. Kidney Injury Scale 2018 Update. J Trauma Acute Care Surg 2018;85(6):1075-1076. 
                  <a href="https://journals.lww.com/jtrauma/fulltext/2018/12000/2018_update_to_the_aast_organ_injury_scale.9.aspx" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AAST OIS</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Alvarado Score =============
      {
        id: 'alvarado_score',
        name: 'Alvarado Score (Apendicite Aguda)',
        category: 'abdomen',
        subcategory: 'Apêndice',
        type: 'informative',
        modality: ['Clínico', 'TC'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Alvarado Score - Diagnóstico de Apendicite Aguda</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Critério</th>
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">SINTOMAS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Migração da dor para fossa ilíaca direita (FID)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Anorexia</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Náuseas/vômitos</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">SINAIS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Dor à palpação em FID</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Dor à descompressão (sinal de Blumberg)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Febre ≥37,3°C</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">LABORATÓRIO</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Leucocitose (&gt;10.000/mm³)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">2</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Desvio à esquerda (neutrofilia &gt;75%)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">1</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Interpretação (Total 10 pontos):</strong><br/>
                  <strong>1-4 pontos:</strong> Apendicite improvável (5-25% probabilidade). Observação ambulatorial.<br/>
                  <strong>5-6 pontos:</strong> Apendicite possível (50% probabilidade). TC abdome ou observação hospitalar.<br/>
                  <strong>7-10 pontos:</strong> Apendicite provável (>90% probabilidade). Cirurgia ou TC urgente.<br/>
                  <strong>Referência:</strong> Alvarado A. A practical score for the early diagnosis of acute appendicitis. Ann Emerg Med 1986;15(5):557-64. 
                  <a href="https://pubmed.ncbi.nlm.nih.gov/3963537/" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">Ann Emerg Med</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= TNM Colorretal =============
      {
        id: 'tnm_colorectal_ajcc8',
        name: 'TNM Colorretal AJCC 8ª Ed',
        category: 'abdomen',
        subcategory: 'Trato Gastrointestinal',
        type: 'informative',
        modality: ['TC', 'RM', 'PET'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">TNM AJCC 8ª Edição - Câncer Colorretal</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px; text-align: center;">Categoria</th>
                <th style="border: 1px solid #333; padding: 8px;">Definição</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">TUMOR PRIMÁRIO (T)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tis</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Carcinoma in situ (intraepitelial ou invasão lâmina própria)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">T1</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade submucosa</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">T2</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade muscular própria</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">T3</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade subserosa ou gordura pericólica/periretal não peritonizada</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">T4a</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade peritônio visceral</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">T4b</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tumor invade diretamente órgãos/estruturas adjacentes</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">LINFONODOS REGIONAIS (N)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem metástase linfonodal regional</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N1a</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em 1 linfonodo regional</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N1b</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em 2-3 linfonodos regionais</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N1c</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Depósitos tumorais (satélites) em subserosa/mesentério sem metástase linfonodal</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N2a</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em 4-6 linfonodos regionais</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">N2b</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em ≥7 linfonodos regionais</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px;">METÁSTASES À DISTÂNCIA (M)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">M0</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Sem metástase à distância</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">M1a</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em 1 órgão (fígado, pulmão, ovário, linfonodo não-regional)</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">M1b</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase em ≥2 órgãos</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">M1c</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Metástase peritoneal com ou sem outros órgãos</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Avaliação ideal requer ≥12 linfonodos examinados na peça cirúrgica.<br/>
                  <strong>Referência:</strong> AJCC. AJCC Cancer Staging Manual, 8th Edition. Springer, 2017. 
                  <a href="https://www.springer.com/gp/book/9783319406176" target="_blank" rel="noopener noreferrer" style="color: #0066cc;">AJCC 8th Ed</a>
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
      // ============= Organ Measurements =============
      {
        id: 'organ_measurements',
        name: 'Medidas Normais de Órgãos Abdominais',
        category: 'abdomen',
        subcategory: 'Medidas e Valores Normais',
        type: 'informative',
        modality: ['US', 'TC', 'RM'],
        htmlContent: `
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; margin: 10px 0;">
            <caption style="font-weight: bold; text-align: left; margin-bottom: 8px; font-size: 11pt;">Medidas Normais de Órgãos Abdominais - Adultos</caption>
            <thead>
              <tr style="background-color: #1e3a5f; color: white; font-weight: 600;">
                <th style="border: 1px solid #333; padding: 8px;">Órgão</th>
                <th style="border: 1px solid #333; padding: 8px;">Medida</th>
                <th style="border: 1px solid #333; padding: 8px;">Valor Normal</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">FÍGADO</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Fígado</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Diâmetro craniocaudal lobo direito (linha hemiclavicular)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤15,5 cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Fígado</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Diâmetro ântero-posterior lobo esquerdo</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤8,0 cm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Veia porta</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤13 mm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Via biliar intra-hepática</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤2 mm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Colédoco</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤6 mm (≤10 mm pós-colecistectomia)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Vesícula biliar</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Comprimento / Espessura parede</td>
                <td style="border: 1px solid #ddd; padding: 8px;">7-10 cm / ≤3 mm</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">BAÇO</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Baço</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Diâmetro longitudinal / Espessura</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤13 cm / ≤5 cm</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">PÂNCREAS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Pâncreas</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Cabeça / Corpo / Cauda (AP)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤3,0 cm / ≤2,5 cm / ≤2,0 cm</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Ducto pancreático (Wirsung)</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤3 mm</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">RINS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Rim</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Comprimento longitudinal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">10-12 cm (diferença &lt;2 cm entre rins)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Córtex renal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Espessura</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≥7 mm</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Sistema pielocalicial</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤10 mm</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">ADRENAIS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Adrenal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Espessura ramos</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤10 mm</td>
              </tr>
              <tr style="background-color: #f0f0f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">VASOS</td>
              </tr>
              <tr style="background-color: #ffffff;">
                <td style="border: 1px solid #ddd; padding: 8px;">Aorta abdominal</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤3,0 cm (aneurisma se &gt;3 cm)</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="border: 1px solid #ddd; padding: 8px;">Veia cava inferior</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Calibre</td>
                <td style="border: 1px solid #ddd; padding: 8px;">≤2,5 cm</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; font-size: 9pt; background-color: #f0f0f0;">
                  <strong>Nota:</strong> Valores de referência variam conforme idade, sexo, biotipo e técnica de medida. Considerar sempre contexto clínico.<br/>
                  <strong>Referências:</strong> ACR Appropriateness Criteria, Radiopaedia, Multiple published references.
                </td>
              </tr>
            </tfoot>
          </table>
        `,
      },
    ],
  },
]

export default RADIOLOGY_TABLES;
