-- Melhorar textos de lesões típicas benignas com descrições profissionais completas
UPDATE rads_text_options SET texto = 'Formação cística com padrão de ecos internos rendilhado/reticular fino, característico de conteúdo hemorrágico em organização, apresentando parede fina regular e ausência de vascularização interna ao estudo Doppler colorido, compatível com cisto hemorrágico ovariano. Este tipo de lesão tipicamente resolve espontaneamente em 6-8 semanas.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'hemorragico';

UPDATE rads_text_options SET texto = 'Formação cística com componente ecogênico apresentando sombra acústica posterior, associado a linhas/pontos ecogênicos internos (artefato em "cauda de cometa") e/ou nódulo mural de Rokitansky, características patognomônicas de teratoma cístico maduro (cisto dermoide). Pode haver interface gordura-líquido visível.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'dermoide';

UPDATE rads_text_options SET texto = 'Formação cística com conteúdo homogêneo de ecos de baixa amplitude uniformemente distribuídos, conferindo aspecto característico em "vidro fosco" (ground glass appearance), com parede fina regular e ausência de vascularização interna, compatível com endometrioma. Podem haver focos ecogênicos murais correspondentes a hemossiderina.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'endometrioma';

UPDATE rads_text_options SET texto = 'Formação cística simples, anecóica, de parede fina imperceptível, localizada em topografia extraovariana no ligamento largo, entre ovário e tuba uterina, com ovário ipsilateral identificado separadamente de aspecto preservado, compatível com cisto paraovariano/paratubal.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'cisto_paratubal';

UPDATE rads_text_options SET texto = 'Coleção líquida de formato irregular, moldando-se às estruturas pélvicas adjacentes e podendo envolver parcialmente o ovário, com paredes finas e sem componente sólido, em contexto de história cirúrgica ou inflamatória pélvica prévia, compatível com cisto de inclusão peritoneal.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'cisto_peritoneal';

UPDATE rads_text_options SET texto = 'Estrutura tubular alongada e tortuosa, de conteúdo anecóico, apresentando projeções murais correspondentes a pregas mucosas incompletas (sinal da roda dentada), claramente separada do ovário ipsilateral, compatível com hidrossalpinge. A presença de líquido tubário sugere obstrução tubária distal.'
WHERE sistema_codigo = 'ORADS_US' AND categoria = 'lesao_tipica' AND valor = 'hidrossalpinge';