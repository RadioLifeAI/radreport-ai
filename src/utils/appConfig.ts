/**
 * Configuração de URL da aplicação RadReport
 * 
 * Prioridade:
 * 1. VITE_APP_URL (produção: radreport.com.br)
 * 2. window.location.origin (dev/preview)
 */

/**
 * Retorna a URL base da aplicação com fallback inteligente
 */
export function getAppUrl(): string {
  // Em produção, sempre usar domínio configurado
  const configuredUrl = import.meta.env.VITE_APP_URL;
  if (configuredUrl) {
    return configuredUrl;
  }
  
  // Fallback para desenvolvimento/preview
  return window.location.origin;
}

/**
 * Verifica se estamos em ambiente de produção
 */
export function isProduction(): boolean {
  return import.meta.env.PROD || 
         window.location.hostname === 'radreport.com.br' ||
         window.location.hostname === 'www.radreport.com.br';
}

/**
 * Verifica se estamos em ambiente de desenvolvimento local
 */
export function isLocalDev(): boolean {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}
