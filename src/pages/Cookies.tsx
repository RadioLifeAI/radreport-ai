import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { CookiePreferencesModal } from '@/components/CookiePreferencesModal';
import { Button } from '@/components/ui/button';
import { Cookie, Shield, BarChart3, Settings, Megaphone } from 'lucide-react';

export default function Cookies() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Cookie className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">Política de Cookies</h1>
            <p className="text-muted-foreground">
              Última atualização: 30 de novembro de 2025
            </p>
            <Button onClick={() => setShowModal(true)}>
              Gerenciar Preferências de Cookies
            </Button>
          </div>

          {/* Introdução */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">O que são cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo 
              (computador, tablet ou celular) quando você visita um site. Eles são amplamente 
              utilizados para fazer com que os sites funcionem de forma mais eficiente, além 
              de fornecer informações aos proprietários do site.
            </p>
          </section>

          {/* Como usamos cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Como o RadReport utiliza cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies para melhorar sua experiência de navegação, personalizar 
              conteúdo, analisar nosso tráfego e para fins de segurança. Você tem controle 
              total sobre quais tipos de cookies deseja aceitar.
            </p>
          </section>

          {/* Tipos de Cookies */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Tipos de cookies que utilizamos</h2>

            {/* Essenciais */}
            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Cookies Essenciais</h3>
              </div>
              <p className="text-muted-foreground">
                Estes cookies são estritamente necessários para o funcionamento do site e 
                não podem ser desativados em nossos sistemas.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Finalidade:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Autenticação de usuários</li>
                  <li>Segurança e prevenção de fraudes</li>
                  <li>Manutenção de sessão do editor</li>
                  <li>Preferências de idioma</li>
                </ul>
                <p className="font-medium mt-3">Base Legal:</p>
                <p className="text-muted-foreground">LGPD Art. 7º, X - Legítimo interesse</p>
              </div>
            </div>

            {/* Analíticos */}
            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Cookies Analíticos</h3>
              </div>
              <p className="text-muted-foreground">
                Coletam informações sobre como os visitantes usam nosso site de forma anônima.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Finalidade:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Análise de uso e comportamento</li>
                  <li>Identificação de páginas mais visitadas</li>
                  <li>Tempo médio de permanência</li>
                  <li>Origem do tráfego</li>
                </ul>
                <p className="font-medium mt-3">Base Legal:</p>
                <p className="text-muted-foreground">LGPD Art. 7º, IX - Consentimento</p>
              </div>
            </div>

            {/* Funcionais */}
            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Cookies Funcionais</h3>
              </div>
              <p className="text-muted-foreground">
                Permitem que o site se lembre de escolhas que você faz para proporcionar 
                funcionalidades aprimoradas.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Finalidade:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Lembrar templates favoritos</li>
                  <li>Preferências do editor (tema, fonte)</li>
                  <li>Histórico de templates utilizados</li>
                  <li>Configurações de layout</li>
                </ul>
                <p className="font-medium mt-3">Base Legal:</p>
                <p className="text-muted-foreground">LGPD Art. 7º, IX - Consentimento</p>
              </div>
            </div>

            {/* Marketing */}
            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <div className="flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Cookies de Marketing</h3>
              </div>
              <p className="text-muted-foreground">
                Utilizados para rastrear visitantes em websites e exibir anúncios relevantes.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Finalidade:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Remarketing e retargeting</li>
                  <li>Anúncios personalizados</li>
                  <li>Rastreamento de conversões</li>
                  <li>Métricas de campanhas</li>
                </ul>
                <p className="font-medium mt-3">Base Legal:</p>
                <p className="text-muted-foreground">LGPD Art. 7º, IX - Consentimento</p>
              </div>
            </div>
          </section>

          {/* Tabela de Cookies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Cookies específicos utilizados</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold">Duração</th>
                    <th className="text-left py-3 px-4 font-semibold">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-sm">sb-access-token</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">Sessão</td>
                    <td className="py-3 px-4">Token de autenticação Supabase</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-sm">sb-refresh-token</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">30 dias</td>
                    <td className="py-3 px-4">Renovação de sessão</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-sm">radreport_cookie_consent</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">1 ano</td>
                    <td className="py-3 px-4">Armazena preferências de cookies</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-sm">theme</td>
                    <td className="py-3 px-4">Funcional</td>
                    <td className="py-3 px-4">1 ano</td>
                    <td className="py-3 px-4">Preferência de tema (claro/escuro)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Como gerenciar */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Como gerenciar seus cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Você pode controlar e/ou excluir cookies como desejar. Você pode excluir todos 
              os cookies que já estão no seu computador e pode configurar a maioria dos 
              navegadores para impedir que eles sejam colocados.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Opções de gerenciamento:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <button 
                    onClick={() => setShowModal(true)} 
                    className="text-primary hover:underline"
                  >
                    Gerenciar preferências no RadReport
                  </button>
                </li>
                <li>Configurações do seu navegador (Chrome, Firefox, Safari, Edge)</li>
                <li>Ferramentas de privacidade de terceiros</li>
              </ul>
            </div>
          </section>

          {/* Conformidade LGPD */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Conformidade com a LGPD</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política de cookies está em conformidade com a Lei Geral de Proteção de 
              Dados Pessoais (LGPD - Lei nº 13.709/2018). Você tem o direito de:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Confirmar a existência de tratamento de dados pessoais</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>
          </section>

          {/* Contato */}
          <section className="p-6 rounded-lg bg-card border border-border space-y-3">
            <h2 className="text-2xl font-semibold">Dúvidas sobre cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Se você tiver dúvidas sobre nossa política de cookies ou sobre como utilizamos 
              seus dados, entre em contato conosco:
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <p className="mb-2"><strong>DPO:</strong> Dr. Nailson Costa (CRM-BA 28286)</p>
              <p className="mb-2"><strong>E-mail:</strong> contato@radreport.com.br</p>
              <p className="mb-2"><strong>WhatsApp:</strong> +55 77 98864-0691</p>
              <p className="text-sm text-muted-foreground mt-3 mb-4">Prazo de resposta: até 15 dias úteis</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Gerenciar Preferências
              </button>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-8">
            <Button onClick={() => setShowModal(true)} size="lg">
              Gerenciar Preferências de Cookies
            </Button>
          </div>
        </div>
      </div>

      <CookiePreferencesModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </PageLayout>
  );
}
