import { supabase } from "@/integrations/supabase/client";

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
}

class WhisperService {
  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Convert blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      // Call Edge Function (to be created)
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          language: 'pt'
        }
      });

      if (error) throw error;

      return {
        text: data.text || '',
        confidence: data.confidence,
        language: data.language || 'pt'
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const whisperService = new WhisperService();
