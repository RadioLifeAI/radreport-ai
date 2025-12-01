import { supabase } from '@/integrations/supabase/client'

const SUPABASE_URL = 'https://gxhbdbovixbptrjrcwbr.supabase.co'

/**
 * Invoca Edge Function usando fetch() com token explícito.
 * Padrão usado no chat que funciona corretamente.
 */
export async function invokeEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  // Obter sessão e token
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  
  if (!token) {
    throw new Error('Usuário não autenticado')
  }
  
  // Chamada fetch explícita com Authorization header
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }
  )
  
  // Error handling específico por status code
  if (!response.ok) {
    const errorText = await response.text()
    
    if (response.status === 401) {
      throw new Error('Sessão expirada, faça login novamente')
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido, aguarde alguns instantes')
    }
    if (response.status === 500) {
      throw new Error('Erro no servidor, tente novamente')
    }
    
    throw new Error(`Erro ${response.status}: ${errorText}`)
  }
  
  return response.json()
}
