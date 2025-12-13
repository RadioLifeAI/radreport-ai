import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUserContent, UserTemplate, UserFrase } from '@/hooks/useUserContent';
import { AlertCircle, Sparkles } from 'lucide-react';

interface UserContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'template' | 'frase';
  editItem?: UserTemplate | UserFrase | null;
}

const MODALIDADES = [
  { value: 'US', label: 'Ultrassonografia' },
  { value: 'TC', label: 'Tomografia' },
  { value: 'RM', label: 'Ressonância' },
  { value: 'RX', label: 'Radiografia' },
  { value: 'MM', label: 'Mamografia' },
  { value: 'GERAL', label: 'Geral' },
];

export function UserContentModal({ open, onOpenChange, type, editItem }: UserContentModalProps) {
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

  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [conclusao, setConclusao] = useState('');
  const [modalidade, setModalidade] = useState('US');

  const isEditing = !!editItem;
  const isTemplate = type === 'template';
  const currentCount = isTemplate ? userTemplates.length : userFrases.length;
  const limit = isTemplate ? limits.templates : limits.frases;
  const canAdd = isTemplate ? canAddTemplate : canAddFrase;
  const isLoading = isTemplate ? isAddingTemplate : isAddingFrase;

  // Reset form when opening/closing or when editItem changes
  useEffect(() => {
    if (open && editItem) {
      setTitulo(editItem.titulo);
      setTexto(editItem.texto);
      setModalidade(editItem.modalidade_codigo);
      if ('conclusao' in editItem && editItem.conclusao) {
        setConclusao(editItem.conclusao);
      } else {
        setConclusao('');
      }
    } else if (open && !editItem) {
      setTitulo('');
      setTexto('');
      setConclusao('');
      setModalidade('US');
    }
  }, [open, editItem]);

  const handleSubmit = () => {
    if (!titulo.trim() || !texto.trim()) {
      return;
    }

    if (isEditing && editItem) {
      if (isTemplate) {
        updateTemplate({ id: editItem.id, titulo, texto, modalidade_codigo: modalidade });
      } else {
        updateFrase({ id: editItem.id, titulo, texto, conclusao: conclusao || undefined, modalidade_codigo: modalidade });
      }
    } else {
      if (isTemplate) {
        addTemplate({ titulo, texto, modalidade_codigo: modalidade });
      } else {
        addFrase({ titulo, texto, conclusao: conclusao || undefined, modalidade_codigo: modalidade });
      }
    }

    onOpenChange(false);
  };

  const canSubmit = titulo.trim() && texto.trim() && (isEditing || canAdd);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            {isEditing ? 'Editar' : 'Novo'} {isTemplate ? 'Template' : 'Frase'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? (
              'Edite seu conteúdo personalizado.'
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

        <div className="space-y-4 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder={isTemplate ? 'Ex: Fígado Normal' : 'Ex: Esteatose Hepática'}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Modalidade */}
          <div className="space-y-2">
            <Label htmlFor="modalidade">Modalidade *</Label>
            <Select value={modalidade} onValueChange={setModalidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a modalidade" />
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

          {/* Texto Principal */}
          <div className="space-y-2">
            <Label htmlFor="texto">Texto *</Label>
            <Textarea
              id="texto"
              placeholder={
                isTemplate
                  ? 'Digite o conteúdo completo do template...'
                  : 'Digite o texto da frase que será inserido...'
              }
              className="min-h-[120px] resize-none"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>

          {/* Conclusão (só para frases) */}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
