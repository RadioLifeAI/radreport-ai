/**
 * SpeechAIComponent - DESABILITADO
 * 
 * Este componente foi desabilitado pois dependia de código removido
 * na refatoração do sistema de ditado (AudioRecordingService, WhisperService, etc).
 * 
 * Se precisar de funcionalidades similares no futuro, reimplementar usando:
 * - useDictation hook para ditado básico
 * - SpeechRecognitionService para reconhecimento de voz
 * - Edge Functions do Supabase para processamento AI
 */

import React from 'react';

interface SpeechAIComponentProps {
  onAICommand: (command: string, parameters: Record<string, string>) => Promise<void>;
  onTranscription?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: any) => void;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const SpeechAIComponent: React.FC<SpeechAIComponentProps> = () => {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        Componente AI de voz desabilitado temporariamente.
        Use o botão de ditado padrão no editor.
      </p>
    </div>
  );
};

export default SpeechAIComponent;
