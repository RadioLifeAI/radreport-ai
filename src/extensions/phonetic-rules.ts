import { Plugin } from 'prosemirror-state'

export const corrections: Record<string, string> = {
  // --- Termos Fundamentais de Imagem ---
  // Ecografia (Hip/Hiper/Iso)
  hipoecogenico: 'hipoecogênico',
  hipoecoico: 'hipoecóico',
  hipeecogenico: 'hiperecogênico',
  iperecogenico: 'hiperecogênico',
  epocogenico: 'hipoecogênico',
  aneicoico: 'aneico',
  onecoico: 'aneico',
  esoeicogenico: 'isoeicogênico',
  
  // Tomografia (Hip/Hiper/Iso)
  ipodenso: 'hipodenso',
  iperdenso: 'hiperdenso',
  isodenso: 'isodenso',
  'vidro fosco': 'padrão em vidro fosco',
  colmeia: 'padrão em colmeia',

  // Ressonância (Hip/Hiper/Iso)
  iperintenso: 'hiperintenso',
  ipointenso: 'hipointenso',
  isoentenso: 'isointenso',
  flaier: 'FLAIR',
  stire: 'STIR',
  'restricao a difusao': 'restrição à difusão',
  'restrica a difusao': 'restrição à difusão',
  
  // --- Nomes Próprios e Abreviaturas ---
  riados: 'RADS',
  bairads: 'BI-RADS',
  tirads: 'TI-RADS',
  pirads: 'PI-RADS',
  lirads: 'LI-RADS',
  orads: 'O-RADS',
  cadrads: 'CAD-RADS',
  irads: 'LI-RADS', // Assumindo 'IRADS' é um erro comum para LI-RADS
  tiv: 'LI-RADS TIV',
  
  lca: 'lesão de LCA',
  lcp: 'lesão de LCP',
  hnf: 'hiperplasia nodular focal (HNF)',
  tace: 'quimioembolização (TACE)',
  paff: 'punção aspirativa por agulha fina (PAAF)',
  tvp: 'trombose venosa profunda (TVP)',
  mav: 'malformação arteriovenosa (MAV)',

  // --- Patologias e Anatomia Comum ---
  'hidro nefrose': 'hidronefrose',
  colilitiasi: 'colelitíase',
  colilitiase: 'colelitíase',
  coledocolitiase: 'coledocolitíase',
  piolonefrite: 'pielonefrite',
  nefrolytiase: 'nefrolitíase',
  hepatomegali: 'hepatomegalia',
  esteatose: 'esteatose hepática',
  
  meninjite: 'meningite',
  demielinizantes: 'placas desmielinizantes',
  
  mioma: 'mioma intramural', // Assume o tipo mais comum, embora genérico
  osteofitos: 'osteófitos',
  
  // --- Descrições Genéricas ---
  eterogeneo: 'heterogêneo',
  omogeneo: 'homogêneo',
  reguar: 'regular',
  irreguar: 'irregular',
  vasculo: 'vascularização',
  
  // --- Termos Quantitativos ---
  // (termos já presentes no dicionário médico não precisam de correções redundantes)
}

export function applyPhoneticCorrections(t: string) {
  let text = t
  for (const wrong in corrections) {
    const right = corrections[wrong]
    const regex = new RegExp('\\b' + wrong + '\\b', 'gi')
    text = text.replace(regex, right)
  }
  return text
}

export default function radiologyPhoneticRules() {
  return new Plugin({
    props: {
      transformPastedText(text: string) {
        return applyPhoneticCorrections(text)
      },
      handleTextInput(view, from, to, text) {
        const corrected = applyPhoneticCorrections(text)
        if (corrected !== text) {
          view.dispatch(view.state.tr.insertText(corrected, from, to))
          return true
        }
        return false
      }
    }
  })
}
