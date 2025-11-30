import PageLayout from '@/components/layout/PageLayout';
import { FileText } from 'lucide-react';

export default function Termos() {
  return (
    <PageLayout>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text-medical">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground">
              Última atualização: 30 de novembro de 2025
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar a plataforma RadReport, operado pela <strong>RadAi Labs LTDA</strong> (CNPJ: 63.762.346/0001-47), você concorda em cumprir e estar vinculado aos presentes 
                Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nosso serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O RadReport é uma plataforma SaaS (Software as a Service) que oferece ferramentas de elaboração de 
                laudos radiológicos com recursos de inteligência artificial, incluindo: editor médico profissional, 
                templates de laudos, ditado por voz, tabelas de referência RADS, e assistentes de IA para sugestões 
                e geração de conclusões.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Cadastro e Conta</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Você deve fornecer informações precisas e completas durante o cadastro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>É necessário e-mail institucional médico para criar conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Você é responsável por manter a confidencialidade de sua senha</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Contas são pessoais e intransferíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Você concorda em usar o RadReport apenas para fins legítimos e profissionais. É proibido:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Usar o serviço para qualquer finalidade ilegal ou não autorizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Tentar acessar áreas não autorizadas do sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Realizar engenharia reversa, descompilar ou desmontar o software</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Compartilhar credenciais de acesso com terceiros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Utilizar o serviço de forma que possa danificar, sobrecarregar ou prejudicar o sistema</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Planos e Pagamento</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Oferecemos plano gratuito e planos pagos (Básico, Profissional, Premium)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Planos pagos são cobrados mensalmente de forma recorrente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Tokens e créditos Whisper não utilizados não são cumulativos entre meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Você pode cancelar a assinatura a qualquer momento sem multa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Não oferecemos reembolsos por cancelamentos durante o período de cobrança</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo o conteúdo, funcionalidades e recursos da plataforma RadReport (incluindo mas não limitado a 
                software, texto, imagens, logos, ícones, templates) são propriedade exclusiva do RadReport e protegidos 
                por leis de direitos autorais e propriedade intelectual. Os laudos criados por você permanecem de sua 
                propriedade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Responsabilidade Médica</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">IMPORTANTE:</strong> O RadReport é uma ferramenta de auxílio à elaboração 
                de laudos radiológicos. A responsabilidade médica e diagnóstica final é sempre do profissional médico radiologista. 
                As sugestões de IA são assistivas e não substituem o julgamento clínico profissional. O usuário deve revisar e 
                validar todo conteúdo gerado antes de finalizar laudos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O RadReport não se responsabiliza por: erros médicos decorrentes de uso inadequado da plataforma, 
                perda de dados devido a falhas técnicas (embora realizemos backups regulares), interrupções de serviço 
                por manutenção ou casos de força maior, ou danos indiretos, incidentais ou consequenciais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Rescisão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por violação destes Termos de Uso 
                ou por qualquer outro motivo que consideremos apropriado. Você pode encerrar sua conta a qualquer momento 
                através das configurações da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Alterações nos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Notificaremos sobre mudanças 
                significativas por e-mail ou através de aviso na plataforma. O uso continuado após alterações constitui 
                aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Lei Aplicável e Foro</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será 
                resolvida no foro da comarca de Guanambi, Estado da Bahia, com exclusão de qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">12. Contato</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para questões sobre estes Termos de Uso, entre em contato:
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-foreground mb-2"><strong>E-mail:</strong> <a href="mailto:contato@radreport.com.br" className="text-primary hover:underline">contato@radreport.com.br</a></p>
                <p className="text-foreground mb-2"><strong>WhatsApp:</strong> +55 77 98864-0691</p>
                <p className="text-sm text-muted-foreground mt-3">Prazo de resposta: até 15 dias úteis</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
