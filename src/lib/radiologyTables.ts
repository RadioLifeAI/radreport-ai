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
  }
]
