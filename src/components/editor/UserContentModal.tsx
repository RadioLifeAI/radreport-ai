import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserContent, UserTemplate, UserFrase } from '@/hooks/useUserContent';
import { formatUserTemplateToHTML } from '@/utils/templateFormatter';
import { AlertCircle, Sparkles, FileText, Layers, Eye, EyeOff, X, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'template' | 'frase';
  editItem?: UserTemplate | UserFrase | null;
  duplicateFrom?: any; // Template/Frase do sistema para duplicar
}

const MODALIDADES = [
  { value: 'US', label: 'Ultrassonografia' },
  { value: 'TC', label: 'Tomografia' },
  { value: 'RM', label: 'Ressonância' },
  { value: 'RX', label: 'Radiografia' },
  { value: 'MM', label: 'Mamografia' },
  { value: 'GERAL', label: 'Geral' },
];

const CATEGORIAS = [
  { value: 'normal', label: 'Normal', color: 'bg-green-500/20 text-green-400' },
  { value: 'alterado', label: 'Alterado', color: 'bg-red-500/20 text-red-400' },
];

type EditorMode = 'simples' | 'profissional';

interface SectionState {
  indicacao: boolean;
  tecnica: boolean;
  achados: boolean;
  impressao: boolean;
  adicionais: boolean;
}

export function UserContentModal({ open, onOpenChange, type, editItem, duplicateFrom }: UserContentModalProps) {
  const {
    userTemplates,
    userFrases,
    limits,
    canAddTemplate,
    canAddFrase,
    addTemplate,
    addFrase,
    updateTemplate,
    updateFrase,
    isAddingTemplate,
    isAddingFrase,
  } = useUserContent();

  // Buscar regiões anatômicas
  const { data: regioes = [] } = useQuery({
    queryKey: ['regioes-anatomicas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('regioes_anatomicas')
        .select('codigo, nome')
        .eq('ativa', true)
        .order('nome');
      return data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
  });

  // Modo do editor
  const [mode, setMode] = useState<EditorMode>('simples');
  const [showPreview, setShowPreview] = useState(true);
  
  // Campos básicos
  const [titulo, setTitulo] = useState('');
  const [modalidade, setModalidade] = useState('US');
  const [categoria, setCategoria] = useState<'normal' | 'alterado'>('normal');
  const [regiao, setRegiao] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Modo simples
  const [texto, setTexto] = useState('');
  const [conclusao, setConclusao] = useState('');
  
  // Modo profissional (templates)
  const [indicacaoClinica, setIndicacaoClinica] = useState('');
  const [tecnicaTexto, setTecnicaTexto] = useState('');
  const [achados, setAchados] = useState('');
  const [impressao, setImpressao] = useState('');
  const [adicionais, setAdicionais] = useState('');
  
  // Seções ativas
  const [sections, setSections] = useState<SectionState>({
    indicacao: false,
    tecnica: true,
    achados: true,
    impressao: true,
    adicionais: false,
  });

  const isEditing = !!editItem;
  const isDuplicating = !!duplicateFrom;
  const isTemplate = type === 'template';
  const currentCount = isTemplate ? userTemplates.length : userFrases.length;
  const limit = isTemplate ? limits.templates : limits.frases;
  const canAdd = isTemplate ? canAddTemplate : canAddFrase;
  const isLoading = isTemplate ? isAddingTemplate : isAddingFrase;

  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // Reset form when opening/closing or when editItem changes
  useEffect(() => {
    if (open) {
      if (editItem) {
        // Editando item existente
        setTitulo(editItem.titulo);
        setModalidade(editItem.modalidade_codigo);
        setCategoria((editItem as any).categoria || 'normal');
        setRegiao((editItem as any).regiao_codigo || '');
        setTags((editItem as any).tags || []);
        
        if (isTemplate) {
          const ut = editItem as UserTemplate;
          setMode(ut.modo === 'profissional' ? 'profissional' : 'simples');
          setTexto(ut.texto || '');
          setIndicacaoClinica(ut.indicacao_clinica || '');
          setTecnicaTexto(typeof ut.tecnica === 'object' && ut.tecnica !== null ? (ut.tecnica as any).texto || '' : '');
          setAchados(ut.achados || '');
          setImpressao(ut.impressao || '');
          setAdicionais(ut.adicionais || '');
          setSections({
            indicacao: !!ut.indicacao_clinica,
            tecnica: !!(typeof ut.tecnica === 'object' ? (ut.tecnica as any).texto : ut.tecnica),
            achados: !!ut.achados,
            impressao: !!ut.impressao,
            adicionais: !!ut.adicionais,
          });
        } else {
          const uf = editItem as UserFrase;
          setTexto(uf.texto || '');
          setConclusao(uf.conclusao || '');
        }
      } else if (duplicateFrom) {
        // Duplicando de sistema
        const title = duplicateFrom.titulo || duplicateFrom.titulo || '';
        setTitulo(`${title} (Minha Versão)`);
        setModalidade(duplicateFrom.modalidade_codigo || duplicateFrom.modalidade || 'US');
        setCategoria(duplicateFrom.categoria || 'normal');
        setRegiao(duplicateFrom.regiao_codigo || '');
        setTags(duplicateFrom.tags || []);
        
        if (isTemplate) {
          // Tentar extrair conteúdo estruturado
          const content = duplicateFrom.conteudo_template || duplicateFrom.conteudo || duplicateFrom.texto || '';
          setTexto(content);
          setMode('simples');
          // Reset seções
          setSections({
            indicacao: false,
            tecnica: true,
            achados: true,
            impressao: true,
            adicionais: false,
          });
          setIndicacaoClinica('');
          setTecnicaTexto('');
          setAchados('');
          setImpressao('');
          setAdicionais('');
        } else {
          const content = duplicateFrom.frase || duplicateFrom.texto || '';
          setTexto(content);
          setConclusao(duplicateFrom.conclusao || '');
        }
      } else {
        // Novo item
        resetForm();
      }
    }
  }, [open, editItem, duplicateFrom, isTemplate]);

  const resetForm = () => {
    setTitulo('');
    setTexto('');
    setConclusao('');
    setModalidade('US');
    setCategoria('normal');
    setRegiao('');
    setTags([]);
    setTagInput('');
    setMode('simples');
    setIndicacaoClinica('');
    setTecnicaTexto('');
    setAchados('');
    setImpressao('');
    setAdicionais('');
    setSections({
      indicacao: false,
      tecnica: true,
      achados: true,
      impressao: true,
      adicionais: false,
    });
  };

  // Gerar preview HTML
  const previewHTML = useMemo(() => {
    if (!isTemplate) {
      // Preview simples para frases
      let html = `<div class="preview-content">`;
      html += `<p class="text-sm">${texto || '<span class="text-muted-foreground">(Texto da frase)</span>'}</p>`;
      if (conclusao) {
        html += `<hr class="my-2 border-border/40" />`;
        html += `<p class="text-xs text-muted-foreground">Conclusão: ${conclusao}</p>`;
      }
      html += `</div>`;
      return html;
    }

    if (mode === 'simples') {
      return `<div class="preview-content"><p>${texto || '<span class="text-muted-foreground">(Conteúdo do template)</span>'}</p></div>`;
    }

    // Modo profissional - gerar preview estruturado
    const templateData: Partial<UserTemplate> = {
      titulo,
      modalidade_codigo: modalidade,
      modo: 'profissional',
      indicacao_clinica: sections.indicacao ? indicacaoClinica : undefined,
      tecnica: sections.tecnica ? { texto: tecnicaTexto } : undefined,
      achados: sections.achados ? achados : undefined,
      impressao: sections.impressao ? impressao : undefined,
      adicionais: sections.adicionais ? adicionais : undefined,
    };

    return formatUserTemplateToHTML(templateData as UserTemplate);
  }, [mode, titulo, modalidade, texto, conclusao, indicacaoClinica, tecnicaTexto, achados, impressao, adicionais, sections, isTemplate]);

  const handleSubmit = () => {
    if (!titulo.trim()) return;
    
    if (isTemplate) {
      // Validar campos obrigatórios
      if (mode === 'simples' && !texto.trim()) return;
      if (mode === 'profissional' && !achados.trim() && !impressao.trim()) return;
      
      const templateData = {
        titulo: titulo.trim(),
        modalidade_codigo: modalidade,
        categoria,
        regiao_codigo: regiao || undefined,
        tags: tags.length > 0 ? tags : undefined,
        modo: mode,
        texto: mode === 'simples' ? texto : undefined,
        indicacao_clinica: mode === 'profissional' && sections.indicacao ? indicacaoClinica : undefined,
        tecnica: mode === 'profissional' && sections.tecnica ? { texto: tecnicaTexto } : undefined,
        achados: mode === 'profissional' && sections.achados ? achados : undefined,
        impressao: mode === 'profissional' && sections.impressao ? impressao : undefined,
        adicionais: mode === 'profissional' && sections.adicionais ? adicionais : undefined,
        conteudo_template: mode === 'profissional' ? previewHTML : texto,
      };
      
      if (isEditing && editItem) {
        updateTemplate({ id: editItem.id, ...templateData });
      } else {
        addTemplate(templateData as any);
      }
    } else {
      // Frase
      if (!texto.trim()) return;
      
      const fraseData = {
        titulo: titulo.trim(),
        texto: texto.trim(),
        conclusao: conclusao || undefined,
        modalidade_codigo: modalidade,
        categoria,
        regiao_codigo: regiao || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      
      if (isEditing && editItem) {
        updateFrase({ id: editItem.id, ...fraseData });
      } else {
        addFrase(fraseData as any);
      }
    }

    onOpenChange(false);
  };

  const canSubmit = titulo.trim() && (
    isTemplate 
      ? (mode === 'simples' ? texto.trim() : (achados.trim() || impressao.trim()))
      : texto.trim()
  ) && (isEditing || isDuplicating || canAdd);

  const toggleSection = (section: keyof SectionState) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            {isEditing ? 'Editar' : isDuplicating ? 'Duplicar' : 'Novo'} {isTemplate ? 'Template' : 'Frase'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? (
              'Edite seu conteúdo personalizado.'
            ) : isDuplicating ? (
              'Crie uma cópia personalizada.'
            ) : canAdd ? (
              <span className="flex items-center gap-2">
                Você pode adicionar mais{' '}
                <Badge variant="secondary" className="text-xs">
                  {limit - currentCount}
                </Badge>{' '}
                {isTemplate ? 'templates' : 'frases'}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Limite de {limit} {isTemplate ? 'templates' : 'frases'} atingido. Faça upgrade!
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Formulário */}
          <div className={`flex-1 overflow-hidden ${showPreview && isTemplate ? 'max-w-[55%]' : 'w-full'}`}>
            <ScrollArea className="h-[calc(70vh-120px)]">
              <div className="space-y-4 pr-4">
                {/* Toggle Modo (só para templates) */}
                {isTemplate && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={mode === 'simples' ? 'default' : 'outline'}
                      onClick={() => setMode('simples')}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Simples
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={mode === 'profissional' ? 'default' : 'outline'}
                      onClick={() => setMode('profissional')}
                      className="gap-2"
                    >
                      <Layers className="h-4 w-4" />
                      Profissional
                    </Button>
                    
                    <div className="flex-1" />
                    
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPreview(!showPreview)}
                      className="gap-2"
                    >
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showPreview ? 'Ocultar' : 'Preview'}
                    </Button>
                  </div>
                )}

                {/* Campos básicos */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      placeholder={isTemplate ? 'Ex: Fígado Normal' : 'Ex: Esteatose Hepática'}
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="modalidade">Modalidade</Label>
                      <Select value={modalidade} onValueChange={setModalidade}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES.map((mod) => (
                            <SelectItem key={mod.value} value={mod.value}>
                              {mod.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={categoria} onValueChange={(v) => setCategoria(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className={`px-2 py-0.5 rounded text-xs ${cat.color}`}>
                                {cat.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Região Anatômica e Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="regiao">Região Anatômica</Label>
                    <Select value={regiao} onValueChange={setRegiao}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma</SelectItem>
                        {regioes.map((r: any) => (
                          <SelectItem key={r.codigo} value={r.codigo}>
                            {r.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Adicionar tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={addTag}
                        disabled={!tagInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs gap-1 cursor-pointer hover:bg-destructive/20"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modo Simples */}
                {(mode === 'simples' || !isTemplate) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="texto">Texto *</Label>
                      <Textarea
                        id="texto"
                        placeholder={
                          isTemplate
                            ? 'Digite o conteúdo completo do template...'
                            : 'Digite o texto da frase que será inserido...'
                        }
                        className="min-h-[150px] resize-none"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                      />
                    </div>

                    {!isTemplate && (
                      <div className="space-y-2">
                        <Label htmlFor="conclusao">Conclusão (opcional)</Label>
                        <Textarea
                          id="conclusao"
                          placeholder="Texto para a seção de impressão/conclusão..."
                          className="min-h-[80px] resize-none"
                          value={conclusao}
                          onChange={(e) => setConclusao(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Será inserido automaticamente na seção IMPRESSÃO do laudo.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Modo Profissional (Templates) */}
                {mode === 'profissional' && isTemplate && (
                  <Tabs defaultValue="achados" className="w-full">
                    <TabsList className="grid grid-cols-5 w-full">
                      <TabsTrigger value="indicacao" className="text-xs">
                        <span className={sections.indicacao ? '' : 'opacity-50'}>Indicação</span>
                      </TabsTrigger>
                      <TabsTrigger value="tecnica" className="text-xs">
                        <span className={sections.tecnica ? '' : 'opacity-50'}>Técnica</span>
                      </TabsTrigger>
                      <TabsTrigger value="achados" className="text-xs">
                        <span className={sections.achados ? '' : 'opacity-50'}>Achados</span>
                      </TabsTrigger>
                      <TabsTrigger value="impressao" className="text-xs">
                        <span className={sections.impressao ? '' : 'opacity-50'}>Impressão</span>
                      </TabsTrigger>
                      <TabsTrigger value="adicionais" className="text-xs">
                        <span className={sections.adicionais ? '' : 'opacity-50'}>Adicionais</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="indicacao" className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sec-indicacao"
                          checked={sections.indicacao}
                          onCheckedChange={() => toggleSection('indicacao')}
                        />
                        <Label htmlFor="sec-indicacao" className="text-sm font-medium">
                          Incluir seção INDICAÇÃO CLÍNICA
                        </Label>
                      </div>
                      {sections.indicacao && (
                        <Textarea
                          placeholder="Indicação clínica do exame..."
                          className="min-h-[100px] resize-none"
                          value={indicacaoClinica}
                          onChange={(e) => setIndicacaoClinica(e.target.value)}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="tecnica" className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sec-tecnica"
                          checked={sections.tecnica}
                          onCheckedChange={() => toggleSection('tecnica')}
                        />
                        <Label htmlFor="sec-tecnica" className="text-sm font-medium">
                          Incluir seção TÉCNICA
                        </Label>
                      </div>
                      {sections.tecnica && (
                        <Textarea
                          placeholder="Exame realizado por via transabdominal utilizando transdutor convexo de 3,5 MHz..."
                          className="min-h-[100px] resize-none"
                          value={tecnicaTexto}
                          onChange={(e) => setTecnicaTexto(e.target.value)}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="achados" className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sec-achados"
                          checked={sections.achados}
                          onCheckedChange={() => toggleSection('achados')}
                        />
                        <Label htmlFor="sec-achados" className="text-sm font-medium">
                          Incluir seção ACHADOS
                        </Label>
                      </div>
                      {sections.achados && (
                        <Textarea
                          placeholder="Fígado de dimensões normais, contornos regulares, ecotextura homogênea..."
                          className="min-h-[150px] resize-none"
                          value={achados}
                          onChange={(e) => setAchados(e.target.value)}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="impressao" className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sec-impressao"
                          checked={sections.impressao}
                          onCheckedChange={() => toggleSection('impressao')}
                        />
                        <Label htmlFor="sec-impressao" className="text-sm font-medium">
                          Incluir seção IMPRESSÃO
                        </Label>
                      </div>
                      {sections.impressao && (
                        <Textarea
                          placeholder="Exame dentro dos limites da normalidade."
                          className="min-h-[100px] resize-none"
                          value={impressao}
                          onChange={(e) => setImpressao(e.target.value)}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="adicionais" className="space-y-3 mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="sec-adicionais"
                          checked={sections.adicionais}
                          onCheckedChange={() => toggleSection('adicionais')}
                        />
                        <Label htmlFor="sec-adicionais" className="text-sm font-medium">
                          Incluir seção ADICIONAIS
                        </Label>
                      </div>
                      {sections.adicionais && (
                        <Textarea
                          placeholder="Observações adicionais, notas, recomendações..."
                          className="min-h-[100px] resize-none"
                          value={adicionais}
                          onChange={(e) => setAdicionais(e.target.value)}
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          {showPreview && isTemplate && (
            <div className="w-[45%] border-l border-border/40 pl-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </h4>
                <Badge variant="outline" className="text-xs">
                  {mode === 'simples' ? 'Modo Simples' : 'Profissional'}
                </Badge>
              </div>
              
              <div className="bg-background/50 border border-border/40 rounded-lg p-4 h-[calc(70vh-180px)] overflow-auto">
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHTML }}
                />
              </div>
              
              {/* Indicadores de seções */}
              {mode === 'profissional' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(sections).map(([key, active]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className={`text-xs ${active ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'opacity-50'}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {active ? ' ✓' : ''}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : isDuplicating ? 'Criar Cópia' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
