/**
 * Stopwords em português - palavras estruturais que NUNCA são erros ortográficos
 * Conjunto finito (~150 palavras) cobrindo artigos, preposições, conjunções, pronomes e verbos auxiliares
 * Estas palavras são ignoradas pelo spellchecker pois fazem parte da estrutura da língua portuguesa
 */

export const stopwords = new Set([
  // === ARTIGOS ===
  "o", "a", "os", "as", "um", "uma", "uns", "umas",
  
  // === PREPOSIÇÕES E CONTRAÇÕES ===
  "de", "do", "da", "dos", "das",
  "em", "no", "na", "nos", "nas",
  "por", "pelo", "pela", "pelos", "pelas",
  "ao", "aos", "à", "às",
  "com", "sem", "para", "pra",
  "até", "desde", "entre", "sobre", "sob",
  "após", "antes", "durante", "mediante",
  "perante", "segundo", "conforme",
  
  // === CONJUNÇÕES ===
  "e", "ou", "mas", "porém", "contudo", "todavia",
  "que", "se", "como", "quando", "enquanto",
  "porque", "pois", "logo", "portanto",
  "embora", "apesar", "caso", "senão",
  
  // === PRONOMES PESSOAIS E DEMONSTRATIVOS ===
  "eu", "tu", "ele", "ela", "nós", "vós", "eles", "elas",
  "me", "te", "se", "lhe", "nos", "vos", "lhes",
  "meu", "minha", "meus", "minhas",
  "teu", "tua", "teus", "tuas",
  "seu", "sua", "seus", "suas",
  "nosso", "nossa", "nossos", "nossas",
  "este", "esta", "estes", "estas", "isto",
  "esse", "essa", "esses", "essas", "isso",
  "aquele", "aquela", "aqueles", "aquelas", "aquilo",
  
  // === PRONOMES RELATIVOS E INDEFINIDOS ===
  "qual", "quais", "quem", "cujo", "cuja", "cujos", "cujas",
  "onde", "aonde", "donde",
  "algum", "alguma", "alguns", "algumas",
  "nenhum", "nenhuma", "nenhuns", "nenhumas",
  "todo", "toda", "todos", "todas",
  "outro", "outra", "outros", "outras",
  "mesmo", "mesma", "mesmos", "mesmas",
  "próprio", "própria", "próprios", "próprias",
  "tal", "tais", "tanto", "tanta", "tantos", "tantas",
  "quanto", "quanta", "quantos", "quantas",
  "cada", "vários", "várias", "demais",
  
  // === VERBOS AUXILIARES E COMUNS ===
  "ser", "é", "são", "era", "eram", "foi", "foram", "será", "serão",
  "estar", "está", "estão", "estava", "estavam", "esteve", "estiveram",
  "ter", "tem", "têm", "tinha", "tinham", "teve", "tiveram", "terá", "terão",
  "haver", "há", "havia", "houve", "haverá",
  "ir", "vai", "vão", "ia", "iam", "irá", "irão",
  "vir", "vem", "vêm", "veio", "vieram", "virá", "virão",
  "poder", "pode", "podem", "podia", "podiam", "pôde", "puderam", "poderá", "poderão",
  "dever", "deve", "devem", "devia", "deviam",
  "fazer", "faz", "fazem", "fazia", "faziam", "fez", "fizeram",
  "dar", "dá", "dão", "dava", "davam", "deu", "deram",
  "existir", "existe", "existem", "existia", "existiam",
  
  // === ADVÉRBIOS COMUNS ===
  "não", "sim", "bem", "mal",
  "mais", "menos", "muito", "pouco",
  "já", "ainda", "sempre", "nunca", "jamais",
  "também", "tampouco", "apenas", "só", "somente",
  "aqui", "ali", "lá", "cá", "aí",
  "dentro", "fora", "perto", "longe",
  "agora", "hoje", "ontem", "amanhã",
  "assim", "então", "logo", "depois",
  
  // === PALAVRAS INTERROGATIVAS ===
  "quê", "porquê",
  
  // === OUTRAS PALAVRAS ESTRUTURAIS ===
  "sendo", "tendo", "havendo", "podendo",
  "sido", "estado", "feito", "dado",
  "num", "numa", "nuns", "numas",
  "dum", "duma", "duns", "dumas"
])
