import PageLayout from '@/components/layout/PageLayout';
import { Shield } from 'lucide-react';

export default function Privacidade() {
  return (
    <PageLayout>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text-medical">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                O RadReport ("nós", "nosso") está comprometido em proteger a privacidade e segurança dos dados pessoais 
                de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
                suas informações pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Dados Coletados</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Coletamos as seguintes categorias de dados pessoais:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados de Cadastro:</strong> nome completo, e-mail institucional, senha criptografada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados de Uso:</strong> laudos criados, templates utilizados, interações com IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados Técnicos:</strong> endereço IP, navegador, dispositivo, logs de acesso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados de Áudio:</strong> gravações de voz para transcrição (processadas e não armazenadas permanentemente)</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Finalidade do Tratamento</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Utilizamos seus dados pessoais para:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Fornecer e manter o serviço de elaboração de laudos radiológicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Personalizar sua experiência e melhorar funcionalidades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Processar transcrições de voz e aplicar inteligência artificial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Realizar análises estatísticas e melhorias do sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Comunicar atualizações, novidades e suporte técnico</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Provedores de Serviços:</strong> OpenAI (processamento de IA), Groq (transcrição Whisper), Supabase (infraestrutura)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Autoridades Legais:</strong> quando exigido por lei ou ordem judicial</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Segurança dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas técnicas e organizacionais robustas para proteger seus dados: criptografia de ponta a ponta, 
                autenticação segura via Supabase, backups regulares, monitoramento de acessos e conformidade com padrões internacionais 
                de segurança da informação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Você tem direito a:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Confirmar a existência de tratamento de dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Acessar seus dados pessoais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Corrigir dados incompletos, inexatos ou desatualizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Solicitar a exclusão de dados pessoais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Revogar consentimento a qualquer momento</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, 
                salvo se período maior for exigido ou permitido por lei. Dados de áudio são processados em tempo real e 
                descartados imediatamente após transcrição.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Contato - Encarregado de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com nosso 
                Encarregado de Proteção de Dados (DPO):
              </p>
              <p className="text-foreground mt-3">
                E-mail: <a href="mailto:dpo@radreport.com.br" className="text-primary hover:underline">dpo@radreport.com.br</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas 
                por e-mail ou através de aviso na plataforma.
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
