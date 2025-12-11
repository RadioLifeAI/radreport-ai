/**
 * Voice Command Engine - Main Class
 * Motor principal de comandos de voz para RadReport
 */

import type { Editor } from '@tiptap/react';
import type {
  VoiceCommand,
  CommandMatchResult,
  CommandExecutionResult,
  VoiceEngineConfig,
  VoiceEngineState,
  VoiceEngineCallbacks,
  IVoiceCommandEngine,
} from './types';
import { DEFAULT_ENGINE_CONFIG } from './types';
import { FuzzyMatcher } from './fuzzyMatcher';
import { buildCommandsFromData, getSystemCommands, loadCacheStats, type CommandStats } from './commandLoader';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class VoiceCommandEngine implements IVoiceCommandEngine {
  private editor: Editor | null = null;
  private commands: VoiceCommand[] = [];
  private config: VoiceEngineConfig;
  private state: VoiceEngineState;
  private callbacks: VoiceEngineCallbacks = {};
  private fuzzyMatcher: FuzzyMatcher;
  private reloadTimer: ReturnType<typeof setInterval> | null = null;
  private stats: CommandStats = { system: 0, frases: 0, templates: 0, total: 0 };
  
  // ✨ FASE 5: Contexto atual (modalidade + região do template)
  private currentModalidade: string | null = null;
  private currentRegiao: string | null = null;

  constructor(config: Partial<VoiceEngineConfig> = {}) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.fuzzyMatcher = new FuzzyMatcher(this.config.fuzzyThreshold);
    this.fuzzyMatcher.setDebug(this.config.debug);
    
    this.state = {
      isReady: false,
      isActive: false,
      totalCommands: 0,
      lastMatch: null,
      lastExecution: null,
      loadedAt: null,
    };

    // Carregar comandos do sistema imediatamente (sempre disponíveis)
    this.commands = getSystemCommands();
    this.fuzzyMatcher.updateCommands(this.commands);
    this.stats.system = this.commands.length;
    this.stats.total = this.commands.length;
    
    // Tentar carregar stats do cache para exibição rápida
    const cachedStats = loadCacheStats();
    if (cachedStats) {
      this.stats = cachedStats;
      this.log(`Stats do cache: ${cachedStats.total} comandos (Sistema: ${cachedStats.system}, Frases: ${cachedStats.frases}, Templates: ${cachedStats.templates})`);
    }

    this.log('Engine inicializado');
  }

  // ==================== ✨ FASE 5: Contexto ====================

  /**
   * Definir contexto atual (modalidade + região do template ativo)
   * Usado para priorizar frases do mesmo contexto
   */
  setCurrentContext(modalidade: string | null, regiao: string | null): void {
    this.currentModalidade = modalidade;
    this.currentRegiao = regiao;
    this.log(`📍 Contexto atualizado: mod=${modalidade}, reg=${regiao}`);
  }

  /**
   * Obter contexto atual
   */
  getCurrentContext(): { modalidade: string | null; regiao: string | null } {
    return {
      modalidade: this.currentModalidade,
      regiao: this.currentRegiao,
    };
  }

  // ==================== Controle ====================

  start(): void {
    if (this.state.isActive) {
      this.log('Engine já está ativo');
      return;
    }

    this.state.isActive = true;
    this.log('Engine ativado');

    // Iniciar auto-reload se configurado
    if (this.config.autoReload && this.config.reloadInterval > 0) {
      this.reloadTimer = setInterval(() => {
        this.reloadCommands();
      }, this.config.reloadInterval);
    }
  }

  stop(): void {
    if (!this.state.isActive) {
      return;
    }

    this.state.isActive = false;
    
    if (this.reloadTimer) {
      clearInterval(this.reloadTimer);
      this.reloadTimer = null;
    }

    this.log('Engine desativado');
  }

  // ==================== Configuração ====================

  attachToTipTap(editor: Editor): void {
    this.editor = editor;
    this.log('Editor TipTap vinculado');
  }

  detachFromTipTap(): void {
    this.editor = null;
    this.log('Editor TipTap desvinculado');
  }

  setDebug(enabled: boolean): void {
    this.config.debug = enabled;
    this.fuzzyMatcher.setDebug(enabled);
    this.log(`Debug ${enabled ? 'ativado' : 'desativado'}`);
  }

  setConfig(config: Partial<VoiceEngineConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.fuzzyThreshold !== undefined) {
      this.fuzzyMatcher.setThreshold(config.fuzzyThreshold);
    }
    if (config.debug !== undefined) {
      this.fuzzyMatcher.setDebug(config.debug);
    }
  }

  // ==================== Comandos ====================

  /**
   * Recarregar comandos (deprecado - use buildFromExistingData)
   */
  async reloadCommands(): Promise<void> {
    console.warn('[VoiceEngine] reloadCommands() deprecado. Use buildFromExistingData() com dados dos hooks.');
    // Mantém apenas comandos do sistema
    this.commands = getSystemCommands();
    this.fuzzyMatcher.updateCommands(this.commands);
    this.state.totalCommands = this.commands.length;
    this.state.isReady = true;
    this.state.loadedAt = new Date();
  }

  /**
   * @deprecated Use buildFromExistingData()
   */
  async loadSupabaseCommands(): Promise<void> {
    console.warn('[VoiceEngine] loadSupabaseCommands() deprecado. Use buildFromExistingData().');
    await this.reloadCommands();
  }

  /**
   * Construir comandos a partir de dados já carregados (RECOMENDADO)
   * Usa dados dos hooks useTemplates/useFrasesModelo - zero queries adicionais
   */
  buildFromExistingData(templates: any[], frases: any[]): void {
    const { commands, stats } = buildCommandsFromData(templates, frases);
    
    this.commands = commands;
    this.stats = stats;
    this.fuzzyMatcher.updateCommands(commands);
    
    this.state.totalCommands = commands.length;
    this.state.isReady = true;
    this.state.loadedAt = new Date();

    this.log(`Comandos construídos: ${stats.total} (Sistema: ${stats.system}, Frases: ${stats.frases}, Templates: ${stats.templates})`);
  }

  /**
   * Obter estatísticas de comandos
   */
  getStats(): CommandStats {
    return { ...this.stats };
  }

  addCommand(command: VoiceCommand): void {
    // Verificar se já existe
    const existingIndex = this.commands.findIndex(c => c.id === command.id);
    if (existingIndex >= 0) {
      this.commands[existingIndex] = command;
    } else {
      this.commands.push(command);
    }
    
    // Re-ordenar e atualizar matcher
    this.commands.sort((a, b) => b.priority - a.priority);
    this.fuzzyMatcher.updateCommands(this.commands);
    this.state.totalCommands = this.commands.length;
  }

  removeCommand(id: string): void {
    this.commands = this.commands.filter(c => c.id !== id);
    this.fuzzyMatcher.updateCommands(this.commands);
    this.state.totalCommands = this.commands.length;
  }

  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  // ==================== Execução ====================

  // ==================== Execução ====================

  async processTranscript(transcript: string): Promise<CommandMatchResult | null> {
    if (!transcript.trim()) {
      return null;
    }

    this.log(`🎤 Processando: "${transcript}"`);

    // ✨ FASE 5: Buscar match COM contexto (modalidade + região)
    const match = this.fuzzyMatcher.findBestMatch(transcript, {
      modalidade: this.currentModalidade,
      regiao: this.currentRegiao,
      combinedBoost: 0.6,      // 60% boost quando ambos combinam
      modalidadeBoost: 0.3,    // 30% boost apenas modalidade
      regiaoBoost: 0.15,       // 15% boost apenas região
    });

    if (!match) {
      this.log(`❌ Nenhum comando encontrado`);
      this.callbacks.onCommandReject?.(transcript, null);
      return null;
    }

    // Verificar se score é aceitável
    if (match.score > this.config.minMatchScore && !match.isExact) {
      this.log(`❌ Score muito alto: ${match.score.toFixed(3)} > ${this.config.minMatchScore}`);
      this.callbacks.onCommandReject?.(transcript, match);
      return null;
    }

    this.state.lastMatch = match;
    this.callbacks.onCommandMatch?.(match);

    this.log(`✅ Match: "${match.command.name}" (score: ${match.score.toFixed(3)}, exact: ${match.isExact})`);

    // Executar automaticamente
    await this.executeCommand(match.command);

    return match;
  }

  async executeCommand(command: VoiceCommand): Promise<CommandExecutionResult> {
    const result: CommandExecutionResult = {
      success: false,
      command,
    };

    if (!this.editor) {
      result.message = 'Editor não vinculado';
      console.warn('[VoiceEngine]', result.message);
      return result;
    }

    try {
      switch (command.actionType) {
        case 'insert_content':
          // FASE 1: Se é frase, delegar para UI via callback
          if (command.id.startsWith('frase_') && this.callbacks.onFraseDetected) {
            const fraseId = command.id.replace('frase_', '');
            this.callbacks.onFraseDetected(fraseId);
            result.success = true;
            result.message = 'Frase detectada, delegando para UI';
            this.log(`🎯 Delegando frase para UI: ${fraseId}`);
            break;
          }
          // Fallback: inserir diretamente (pontuação, texto simples)
          if (typeof command.payload === 'string') {
            this.insertContent(command.payload);
            result.insertedContent = command.payload;
          }
          result.success = true;
          break;

        case 'apply_template':
          // FASE 1: Delegar para UI via callback (permite processar variáveis)
          if (this.callbacks.onTemplateDetected) {
            const templateId = command.id.replace('template_', '');
            this.callbacks.onTemplateDetected(templateId);
            result.success = true;
            result.message = 'Template detectado, delegando para UI';
            this.log(`🎯 Delegando template para UI: ${templateId}`);
            break;
          }
          // Fallback: aplicar diretamente (sem processamento de variáveis)
          this.applyTemplate(command.payload as string);
          result.insertedContent = '[Template aplicado]';
          result.success = true;
          break;

        case 'punctuation':
          this.insertPunctuation(command.payload as string);
          result.insertedContent = command.payload as string;
          result.success = true;
          break;

        case 'structural':
          this.executeStructuralCommand(command.payload as string);
          result.success = true;
          break;

        case 'format':
          this.executeFormatCommand(command.payload as string);
          result.success = true;
          break;

        case 'navigate':
          this.executeNavigationCommand(command.payload as string);
          result.success = true;
          break;

        case 'system':
          result.success = this.executeSystemCommand(command.payload as string);
          break;

        default:
          result.message = `Tipo de ação desconhecido: ${command.actionType}`;
      }

      if (result.success) {
        this.log(`⚡ Executado: ${command.name}`);
      }
    } catch (error) {
      result.message = `Erro ao executar: ${(error as Error).message}`;
      console.error('[VoiceEngine]', result.message, error);
    }

    this.state.lastExecution = result;
    this.callbacks.onCommandExecute?.(result);
    
    return result;
  }

  // ==================== Ações Específicas ====================

  private insertContent(content: string): void {
    if (!this.editor) return;
    
    // Adicionar espaço antes se necessário
    const { from } = this.editor.state.selection;
    const textBefore = this.editor.state.doc.textBetween(Math.max(0, from - 1), from);
    const needsSpace = textBefore && !/[\s\n(]/.test(textBefore);
    
    this.editor.chain().focus().insertContent(needsSpace ? ` ${content}` : content).run();
  }

  private applyTemplate(html: string): void {
    if (!this.editor) return;
    this.editor.chain().focus().setContent(html).run();
  }

  private insertPunctuation(punct: string): void {
    if (!this.editor) return;
    this.editor.chain().focus().insertContent(punct).run();
  }

  private executeStructuralCommand(payload: string): void {
    if (!this.editor) return;

    switch (payload) {
      case 'newline':
        this.editor.chain().focus().setHardBreak().run();
        break;
      case 'paragraph':
        this.editor.chain().focus().splitBlock().run();
        break;
      case 'tab':
        this.editor.chain().focus().insertContent('    ').run();
        break;
    }
  }

  private executeFormatCommand(payload: string): void {
    if (!this.editor) return;

    switch (payload) {
      case 'bold':
        this.editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        this.editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        this.editor.chain().focus().toggleUnderline().run();
        break;
      case 'uppercase':
        this.transformSelectedText(text => text.toUpperCase());
        break;
      case 'lowercase':
        this.transformSelectedText(text => text.toLowerCase());
        break;
    }
  }

  private executeNavigationCommand(payload: string): void {
    if (!this.editor) return;

    switch (payload) {
      case 'start':
        this.editor.chain().focus().setTextSelection(0).run();
        break;
      case 'end':
        this.editor.chain().focus().setTextSelection(this.editor.state.doc.content.size).run();
        break;
      case 'next_field':
        this.goToNextField();
        break;
      case 'prev_field':
        this.goToPrevField();
        break;
      case 'section_impressao':
        this.goToSection('IMPRESSÃO');
        break;
      case 'section_tecnica':
        this.goToSection('TÉCNICA');
        break;
      case 'section_relatorio':
        this.goToSection('RELATÓRIO');
        break;
    }
  }

  private executeSystemCommand(payload: string): boolean {
    if (!this.editor) return false;

    switch (payload) {
      case 'clear_editor':
        this.editor.chain().focus().clearContent().run();
        return true;

      case 'new_report':
        this.editor.chain().focus().setContent('<p></p>').run();
        return true;

      case 'delete_word':
        this.deleteLastWord();
        return true;

      case 'delete_line':
        this.deleteCurrentLine();
        return true;

      case 'undo':
        this.editor.chain().focus().undo().run();
        return true;

      case 'redo':
        this.editor.chain().focus().redo().run();
        return true;

      case 'select_all':
        this.editor.chain().focus().selectAll().run();
        return true;

      case 'insert_date':
        const dateStr = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        this.insertContent(dateStr);
        return true;

      case 'insert_time':
        const timeStr = format(new Date(), 'HH:mm', { locale: ptBR });
        this.insertContent(timeStr);
        return true;

      case 'help':
        this.showHelp();
        return true;

      case 'stop_dictation':
        // Este comando é tratado externamente pelo useDictation
        return true;

      default:
        this.log(`Comando do sistema não implementado: ${payload}`);
        return false;
    }
  }

  // ==================== Utilitários ====================

  private transformSelectedText(transform: (text: string) => string): void {
    if (!this.editor) return;
    
    const { from, to, empty } = this.editor.state.selection;
    if (empty) return;
    
    const text = this.editor.state.doc.textBetween(from, to);
    const transformed = transform(text);
    
    this.editor.chain().focus().insertContentAt({ from, to }, transformed).run();
  }

  private deleteLastWord(): void {
    if (!this.editor) return;
    
    const { from } = this.editor.state.selection;
    const textBefore = this.editor.state.doc.textBetween(0, from);
    const match = textBefore.match(/\S+\s*$/);
    
    if (match) {
      const deleteFrom = from - match[0].length;
      this.editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
    }
  }

  private deleteCurrentLine(): void {
    if (!this.editor) return;
    
    const { $from } = this.editor.state.selection;
    const start = $from.start();
    const end = $from.end();
    
    this.editor.chain().focus().deleteRange({ from: start, to: end }).run();
  }

  private goToNextField(): void {
    if (!this.editor) return;
    
    const doc = this.editor.state.doc;
    const { from } = this.editor.state.selection;
    
    // Buscar próximo placeholder [...]
    const text = doc.textBetween(from, doc.content.size);
    const match = text.match(/\[([^\]]+)\]/);
    
    if (match && match.index !== undefined) {
      const pos = from + match.index;
      this.editor.chain().focus().setTextSelection({ from: pos, to: pos + match[0].length }).run();
    }
  }

  private goToPrevField(): void {
    if (!this.editor) return;
    
    const doc = this.editor.state.doc;
    const { from } = this.editor.state.selection;
    
    // Buscar placeholder anterior [...]
    const text = doc.textBetween(0, from);
    const matches = [...text.matchAll(/\[([^\]]+)\]/g)];
    
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      if (lastMatch.index !== undefined) {
        this.editor.chain().focus().setTextSelection({ 
          from: lastMatch.index, 
          to: lastMatch.index + lastMatch[0].length 
        }).run();
      }
    }
  }

  private goToSection(sectionName: string): void {
    if (!this.editor) return;
    
    const doc = this.editor.state.doc;
    const text = doc.textContent;
    
    // Buscar seção por nome
    const regex = new RegExp(`(^|\\n)\\s*${sectionName}[:\\s]`, 'i');
    const match = text.match(regex);
    
    if (match && match.index !== undefined) {
      // Posicionar no final da linha do título da seção
      const afterTitle = match.index + match[0].length;
      this.editor.chain().focus().setTextSelection(afterTitle).run();
    }
  }

  /**
   * FASE 4: Inserir conclusão automaticamente na seção IMPRESSÃO
   */
  private insertConclusionToImpressao(conclusao: string): void {
    if (!this.editor) return;
    
    const doc = this.editor.state.doc;
    const text = doc.textContent;
    
    // Buscar seção IMPRESSÃO ou CONCLUSÃO
    const patterns = [
      /\n\s*(IMPRESSÃO|Impressão)[:\s]*/i,
      /\n\s*(CONCLUSÃO|Conclusão)[:\s]*/i,
    ];
    
    let insertPos = -1;
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        // Encontrar fim da seção (próximo título ou fim do documento)
        const afterTitle = match.index + match[0].length;
        const restOfDoc = text.slice(afterTitle);
        const nextSection = restOfDoc.match(/\n\s*[A-Z]{2,}[:\s]/);
        
        if (nextSection && nextSection.index !== undefined) {
          insertPos = afterTitle + nextSection.index;
        } else {
          // Inserir no fim do documento
          insertPos = doc.content.size - 1;
        }
        break;
      }
    }
    
    if (insertPos > 0) {
      // Inserir conclusão com quebra de linha
      const formattedConclusion = `\n- ${conclusao}`;
      this.editor.chain()
        .focus()
        .insertContentAt(insertPos, formattedConclusion)
        .run();
      
      this.log(`📝 Conclusão inserida na IMPRESSÃO: "${conclusao.substring(0, 50)}..."`);
    } else {
      this.log(`⚠️ Seção IMPRESSÃO não encontrada, conclusão não inserida`);
    }
  }

  private showHelp(): void {
    // Agrupar comandos por categoria
    const byCategory = new Map<string, VoiceCommand[]>();
    
    for (const cmd of this.commands) {
      const cat = cmd.category;
      if (!byCategory.has(cat)) {
        byCategory.set(cat, []);
      }
      byCategory.get(cat)!.push(cmd);
    }

    console.log('='.repeat(60));
    console.log('📢 COMANDOS DE VOZ DISPONÍVEIS');
    console.log('='.repeat(60));
    
    for (const [category, commands] of byCategory) {
      console.log(`\n▶ ${category.toUpperCase()} (${commands.length})`);
      commands.slice(0, 10).forEach(cmd => {
        console.log(`  • "${cmd.name}" → ${cmd.actionType}`);
      });
      if (commands.length > 10) {
        console.log(`  ... e mais ${commands.length - 10} comandos`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`Total: ${this.commands.length} comandos disponíveis`);
  }

  // ==================== Estado ====================

  getState(): VoiceEngineState {
    return { ...this.state };
  }

  getConfig(): VoiceEngineConfig {
    return { ...this.config };
  }

  setCallbacks(callbacks: VoiceEngineCallbacks): void {
    this.callbacks = callbacks;
  }

  // ==================== Debug ====================

  private log(message: string): void {
    if (this.config.debug) {
      console.log(`[VoiceEngine] ${message}`);
    }
  }
}
