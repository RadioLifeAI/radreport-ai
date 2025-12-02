import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAICredits } from '@/hooks/useAICredits';
import { useWhisperCredits } from '@/hooks/useWhisperCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { Sparkles, Mic, TrendingUp, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserCreditsCard = () => {
  const navigate = useNavigate();
  const { balance: aiBalance, monthlyLimit, planType } = useAICredits();
  const { balance: whisperBalance } = useWhisperCredits();
  const { isSubscribed } = useSubscription();

  const aiPercentage = (aiBalance / monthlyLimit) * 100;

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      free: 'Gratuito',
      basic: 'Básico',
      professional: 'Profissional',
      premium: 'Premium',
    };
    return labels[plan] || plan;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Créditos & Plano
          </h3>
          <Badge variant="outline" className="text-xs">
            {getPlanLabel(planType)}
          </Badge>
        </div>

        {/* AI Tokens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-sm text-muted-foreground">Tokens IA</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {aiBalance} / {monthlyLimit}
            </span>
          </div>
          
          <Progress value={aiPercentage} className="h-2" />
          
          <p className="text-xs text-muted-foreground">
            Tokens usados para Conclusão IA, Sugestões e Classificação RADS
          </p>
        </div>

        {/* Whisper Credits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-indigo-400" />
              <span className="text-sm text-muted-foreground">Créditos Whisper</span>
            </div>
            <Badge 
              variant="outline"
              className={`${
                whisperBalance > 10 ? 'border-green-500/40 text-green-400' :
                whisperBalance > 5 ? 'border-yellow-500/40 text-yellow-400' :
                'border-red-500/40 text-red-400'
              }`}
            >
              {whisperBalance} créditos
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            1 crédito = 1 minuto de áudio para transcrição premium
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
          onClick={() => navigate('/assinaturas')}
        >
          {isSubscribed ? (
            <>
              <Crown size={16} className="mr-2" />
              Ver Planos
            </>
          ) : (
            <>
              <TrendingUp size={16} className="mr-2" />
              Upgrade de Plano
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
