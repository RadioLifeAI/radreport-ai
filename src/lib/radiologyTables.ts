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
  }
]
