import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

/**
 * Normaliza e corrige erros morfológicos, de acentuação, pluralização e
 * separação de palavras comuns em laudos radiológicos, usando expressões regulares.
 *
 * @param text O texto de entrada para ser corrigido (geralmente o texto digitado).
 * @returns O texto com as correções morfológicas aplicadas.
 */
export function normalizeMorphology(text: string): string {
  let word = text

  // --- 1. Megalias e Patologias Viscerais (Acentuações e Terminações) ---
  word = word.replace(/\b(hepato|espleno|cardio|tireo) megal(i|ia)/gi, '$1megalia')
  word = word.replace(/\b(coledo coli)tiase/gi, 'coledocolitíase')
  word = word.replace(/\bcolelitiase/gi, 'colelitíase')
  word = word.replace(/\b(nefro|pielonefr)olitiase/gi, '$1litíase')
  word = word.replace(/\bapendicite aguda/gi, 'apendicite aguda')
  word = word.replace(/\bdiverticulite/gi, 'diverticulite')
  word = word.replace(/\bpancreatite/gi, 'pancreatite')
  word = word.replace(/\babscess(o|os)/gi, 'abscessos')
  word = word.replace(/\bhematoma(s)?/gi, 'hematoma')
  word = word.replace(/\bsinosites/gi, 'sinusite')
  word = word.replace(/\b(mioma|leiomioma)(s)? (intramural|subseroso|submucoso)/gi, 'mioma $2')
  word = word.replace(/\b(adenomiose|endometriose) profunda(s)?/gi, '$1 profunda')
  word = word.replace(/\bhidrosalpinge/gi, 'hidrossalpinge')
  word = word.replace(/\bfolicul(o|os) dominant(e|es)/gi, 'folículo dominante')
  word = word.replace(/\besteatose(s)? hepatica(s)?/gi, 'esteatose hepática')

  // --- 2. Termos de Ecogenicidade e Atenuação (Correção de Sufixo e Acentuação) ---
  word = word.replace(/\bhipo eco(ico|genico)?/gi, 'hipoecogênico')
  word = word.replace(/\bhiper eco(ico|genico)?/gi, 'hiperecogênico')
  word = word.replace(/\biso eco(ico|genico)?/gi, 'isoeicogênico')
  word = word.replace(/\bhipo dens(o|os)/gi, 'hipodenso')
  word = word.replace(/\bhiper dens(o|os)/gi, 'hiperdenso')
  word = word.replace(/\biso dens(o|os)/gi, 'isodenso')
  word = word.replace(/\bcalcificacao/gi, 'calcificação') // Correção ortográfica
  word = word.replace(/\bmicrocalcificacao/gi, 'microcalcificação')

  // --- 3. Termos de Sinal RM (Acentuação e Padronização) ---
  word = word.replace(/\bhipo intens(o|os)/gi, 'hipointenso')
  word = word.replace(/\bhiper intens(o|os)/gi, 'hiperintenso')
  word = word.replace(/\biso intens(o|os)/gi, 'isointenso')
  word = word.replace(/\brestriçao a difusao/gi, 'restrição à difusão')
  word = word.replace(/\b(flair|stir|dwi|adc)/gi, (match) => match.toUpperCase())
  word = word.replace(/\bflow void/gi, 'sinal de flow void') // Completa o termo

  // --- 4. Tórax e Pulmão (Acentuação e Pluralização) ---
  word = word.replace(/\bpneumotorax/gi, 'pneumotórax')
  word = word.replace(/\bderrame pleural/gi, 'derrame pleural')
  word = word.replace(/\b(bronqui)ectasia(s)?/gi, '$1ectasia')
  word = word.replace(/\batelectasia(s)?/gi, 'atelectasia')
  word = word.replace(/\bvidro fosco/gi, 'padrão em vidro fosco')
  word = word.replace(/\b(nódulo|nodulo) pulmonar(es)?/gi, 'nódulo pulmonar')
  word = word.replace(/\b(opacidade|opacidades) reticular(es)?/gi, 'opacidade reticular')
  word = word.replace(/\bsinal do broncograma(s)?/gi, 'sinal do broncograma aéreo')

  // --- 5. Coluna e Musculoesquelético (Acentuação e Termos Compostos) ---
  word = word.replace(/\b(hernia|protusao|extrusao) discal/gi, (match, p1) => {
    let term = p1.replace(/hernia/gi, 'hérnia').replace(/protusao/gi, 'protrusão').replace(/extrusao/gi, 'extrusão')
    return term + ' discal'
  })
  word = word.replace(/\b(LCA|LCP) lesionad(o|a)/gi, 'lesão de $1')
  word = word.replace(/\b(tendinite|tenosinovite|bursite)s/gi, '$1')
  word = word.replace(/\b(condromalacia|osteite|osteomielite)/gi, '$1')
  word = word.replace(/\bespondilolistese/gi, 'espondilolistese')
  word = word.replace(/\b(fratura|fraturas) por estresse/gi, 'fratura por estresse')
  word = word.replace(/\bedema osseo/gi, 'edema ósseo')
  word = word.replace(/\bosteofit(o|os)/gi, 'osteófito')
  word = word.replace(/\besclerose subcondral/gi, 'esclerose subcondral')
  word = word.replace(/\b(artrite|sinovite)s/gi, '$1')
  word = word.replace(/\bruptura do(s)? manguito(s)? rotador(es)?/gi, 'ruptura do manguito rotador')

  // --- 6. Vascular (Acentuação e Padronização de Achados) ---
  word = word.replace(/\b(estenose|trombose|oclusao)/gi, (match) => match.replace(/oclusao/gi, 'oclusão'))
  word = word.replace(/\banuerisma(s)? (sacular|fusiforme)/gi, 'aneurisma $2')
  word = word.replace(/\b(dissecçao|trombo|placa)s/gi, '$1')
  word = word.replace(/\btrombose venosa profunda/gi, 'trombose venosa profunda (TVP)')
  word = word.replace(/\bplaca aterosclerotica(s)?/gi, 'placa aterosclerótica')

  // --- 7. SNC (Acentuação e Separação) ---
  word = word.replace(/\b(infarto|infartos) agud(o|os)/gi, 'infarto agudo')
  word = word.replace(/\bhemorragia subaracnoide(a)?/gi, 'hemorragia subaracnoide')
  word = word.replace(/\b(hematoma|hematomas) subdural/gi, 'hematoma subdural')
  word = word.replace(/\bhidrocefalia(s)?/gi, 'hidrocefalia')
  word = word.replace(/\bgliose(s)?/gi, 'gliose')
  word = word.replace(/\bcist(o|os) aracnoide(s)?/gi, 'cisto aracnoide')
  word = word.replace(/\btumor(es)? glial(is|es)?/gi, 'tumor glial')
  word = word.replace(/\barteria(s)? vertebral(is)?/gi, 'artéria vertebral')
  word = word.replace(/\bvertebra(s)?/gi, 'vértebra')

  // --- 8. Termos Descritivos e Quantitativos (Acentuação e Padronização de Gênero/Número) ---
  word = word.replace(/\b(heterogeneo|homogeneo)/gi, (match) => match.replace(/o/gi, 'ô'))
  word = word.replace(/\b(reguar|irreguar)/gi, (match) => match.replace(/guar/gi, 'gular'))
  word = word.replace(/\b(lobulad(o|os)|espiculad(o|os))/gi, '$1')
  word = word.replace(/\b(discret(o|os)|moderado(s)|acentuado(s))/gi, '$1')
  word = word.replace(/\b(volumoso|extenso|difuso)/gi, '$1')
  word = word.replace(/\b(assimetrico|simetrico)/gi, (match) => match.replace(/metrico/gi, 'métrico'))
  word = word.replace(/\b(lesao|lesoes)/gi, 'lesão') // Corrigindo a acentuação e padronizando para singular
  word = word.replace(/\badeno(patia|patias)/gi, 'adenopatia') // Padroniza para singular

  // --- 9. Prefixos/Termos Anatômicos (Correção de Hífen e Acentuação) ---
  word = word.replace(/\bsupra espinhal/gi, 'supraespinhal')
  word = word.replace(/\bsub condral/gi, 'subcondral')
  word = word.replace(/\binter(verteral|vertebrais)/gi, 'intervertebral')
  word = word.replace(/\bperi vascular/gi, 'perivascular')
  word = word.replace(/\b(arteria|veia|vasos)/gi, 'artéria') // Padroniza artéria (acentuado)
  word = word.replace(/\bpatias/gi, 'patologias') // Padronização de erro comum
  word = word.replace(/\b(pelve|pelves)/gi, 'pelve')
  word = word.replace(/\b(torax|toraces)/gi, 'tórax')
  word = word.replace(/\babdomen/gi, 'abdome')

  return word
}

export default function radiologyMorphologyRules() {
  return new Plugin({
    props: {
      transformPastedText(text: string) {
        return normalizeMorphology(text)
      },
      handleTextInput(view: EditorView, from: number, to: number, text: string): boolean {
        const corrected = normalizeMorphology(text)
        if (corrected !== text) {
          view.dispatch(view.state.tr.insertText(corrected, from, to))
          return true
        }
        return false
      }
    }
  })
}
