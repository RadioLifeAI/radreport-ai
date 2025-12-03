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
  "dum", "duma", "duns", "dumas",
  
  // === PREPOSIÇÕES COMPOSTAS E LOCUÇÕES PREPOSITIVAS ===
  "ao lado de", "em volta de", "junto a", "próximo a",
  "além de", "através de", "por meio de", "em meio a",
  "em torno de", "ao redor de", "diante de", "perante a",
  "em face de", "face a", "frente a", "em frente a",
  "atrás de", "abaixo de", "acima de", "dentro de",
  "fora de", "perto de", "longe de", "à frente de",
  "ao longo de", "em cima de", "embaixo de", "por cima de",
  "por baixo de", "à direita de", "à esquerda de",
  "em relação a", "com relação a", "quanto a", "no que tange a",
  "no tocante a", "concernente a", "referente a", "relativo a",
  "devido a", "graças a", "em virtude de", "por causa de",
  "em razão de", "por conta de", "a despeito de", "apesar de",
  "a par de", "ao invés de", "em vez de", "a fim de",
  "com vistas a", "tendo em vista", "a respeito de",
  
  // === CONJUNÇÕES COMPOSTAS E LOCUÇÕES CONJUNTIVAS ===
  "bem como", "assim como", "não só", "como também",
  "tanto quanto", "tal qual", "da mesma forma que",
  "do mesmo modo que", "à medida que", "à proporção que",
  "na medida em que", "ao passo que", "enquanto que",
  "visto que", "já que", "uma vez que", "dado que",
  "posto que", "haja vista", "tendo em conta",
  "de modo que", "de forma que", "de maneira que",
  "de sorte que", "a não ser que", "a menos que",
  "desde que", "contanto que", "mesmo que", "ainda que",
  "por mais que", "por menos que", "se bem que",
  "sem que", "antes que", "depois que", "logo que",
  "assim que", "sempre que", "todas as vezes que",
  "cada vez que", "à proporção que", "por isso",
  "por conseguinte", "por consequência", "por essa razão",
  "por esse motivo", "sendo assim", "dessa forma",
  "desse modo", "dessa maneira", "nesse caso",
  "em todo caso", "de qualquer forma", "de qualquer modo",
  
  // === LOCUÇÕES ADVERBIAIS ===
  "de fato", "com efeito", "na verdade", "em verdade",
  "de certo", "por certo", "sem dúvida", "de resto",
  "de modo geral", "em geral", "via de regra",
  "em regra", "de ordinário", "por via de regra",
  "a saber", "isto é", "ou seja", "quer dizer",
  "vale dizer", "por exemplo", "a título de",
  "em especial", "em particular", "sobretudo",
  "acima de tudo", "antes de mais nada", "primeiramente",
  "em primeiro lugar", "em segundo lugar", "por fim",
  "por último", "finalmente", "em suma", "em resumo",
  "em síntese", "em conclusão", "enfim", "afinal",
  "por outro lado", "de outro lado", "por sua vez",
  "ao contrário", "pelo contrário", "em contrapartida",
  "no entanto", "não obstante", "ainda assim",
  "mesmo assim", "de qualquer maneira", "seja como for"
])
