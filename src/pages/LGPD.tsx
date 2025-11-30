import PageLayout from '@/components/layout/PageLayout';
import { ShieldCheck } from 'lucide-react';

export default function LGPD() {
  return (
    <PageLayout>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text-medical">
              Conformidade com a LGPD
            </h1>
            <p className="text-muted-foreground">
              Lei Geral de Proteção de Dados - Lei nº 13.709/2018
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Compromisso com a LGPD</h2>
              <p className="text-muted-foreground leading-relaxed">
                O RadReport está totalmente comprometido com a conformidade à Lei Geral de Proteção de Dados (LGPD). 
                Implementamos medidas técnicas e organizacionais robustas para garantir a segurança, privacidade e 
                proteção de todos os dados pessoais tratados em nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Base Legal para Tratamento</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Tratamos dados pessoais com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Consentimento:</strong> Para uso de funcionalidades de IA e processamento de voz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Execução de Contrato:</strong> Para prestação dos serviços contratados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Legítimo Interesse:</strong> Para melhoria do serviço e análises estatísticas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Obrigação Legal:</strong> Para cumprimento de obrigações fiscais e regulatórias</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Direitos dos Titulares</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Conforme Art. 18 da LGPD, você possui os seguintes direitos:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">I.</span>
                  <span>Confirmação da existência de tratamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">II.</span>
                  <span>Acesso aos dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">III.</span>
                  <span>Correção de dados incompletos, inexatos ou desatualizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">IV.</span>
                  <span>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">V.</span>
                  <span>Portabilidade dos dados a outro fornecedor de serviço</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">VI.</span>
                  <span>Eliminação dos dados pessoais tratados com consentimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">VII.</span>
                  <span>Informação sobre entidades públicas e privadas com as quais compartilhamos dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">VIII.</span>
                  <span>Informação sobre possibilidade de não fornecer consentimento e consequências</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">IX.</span>
                  <span>Revogação do consentimento</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Medidas de Segurança</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Implementamos medidas técnicas e organizacionais conforme Art. 46 da LGPD:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Criptografia de dados em trânsito (SSL/TLS) e em repouso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Autenticação multifator e controle de acesso baseado em função (RBAC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Backups automáticos e redundância de dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Monitoramento contínuo de segurança e detecção de anomalias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Auditorias regulares de segurança e testes de penetração</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Treinamento contínuo da equipe em proteção de dados</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Utilizamos cookies essenciais e analíticos:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Cookies Essenciais:</strong> Necessários para funcionamento da plataforma (autenticação, sessão)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Cookies Analíticos:</strong> Para análise de uso e melhorias (mediante consentimento)</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos dados pessoais conforme Art. 15 da LGPD:
              </p>
              <ul className="space-y-2 text-muted-foreground mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados de Cadastro:</strong> Enquanto a conta estiver ativa + 5 anos após encerramento (fins fiscais)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Laudos Criados:</strong> Enquanto a conta estiver ativa (usuário controla exclusão)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Dados de Áudio:</strong> Processados em tempo real e descartados imediatamente após transcrição</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Logs de Acesso:</strong> 6 meses para fins de segurança</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Transferência Internacional de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Alguns de nossos provedores de serviços estão localizados fora do Brasil (OpenAI, Groq). 
                Garantimos que a transferência internacional ocorre com cláusulas contratuais padrão e medidas 
                de segurança adequadas, conforme Art. 33 da LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Incidentes de Segurança</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conforme Art. 48 da LGPD, em caso de incidente de segurança que possa acarretar risco ou dano relevante, 
                comunicaremos aos titulares afetados e à Autoridade Nacional de Proteção de Dados (ANPD) em prazo razoável.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Encarregado de Proteção de Dados (DPO)</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conforme Art. 41 da LGPD, nomeamos um Encarregado de Proteção de Dados:
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-3">
                <p className="text-foreground font-semibold mb-1">Encarregado: [Nome do DPO]</p>
                <p className="text-foreground">E-mail: <a href="mailto:dpo@radreport.com.br" className="text-primary hover:underline">dpo@radreport.com.br</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Como Exercer Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para exercer qualquer dos direitos previstos na LGPD:
              </p>
              <ol className="space-y-2 text-muted-foreground mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Envie solicitação para <a href="mailto:dpo@radreport.com.br" className="text-primary hover:underline">dpo@radreport.com.br</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Identifique-se adequadamente e especifique o direito que deseja exercer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Responderemos em até 15 dias úteis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>O atendimento da solicitação é gratuito (salvo casos previstos em lei)</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Atualizações desta Página</h2>
              <p className="text-muted-foreground leading-relaxed">
                Esta página de conformidade com a LGPD pode ser atualizada periodicamente. Recomendamos que você 
                revise regularmente para se manter informado sobre como protegemos seus dados.
              </p>
              <p className="text-muted-foreground mt-3">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
