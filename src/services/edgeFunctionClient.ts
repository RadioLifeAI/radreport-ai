import { supabase } from '@/integrations/supabase/client'

const SUPABASE_URL = 'https://gxhbdbovixbptrjrcwbr.supabase.co'

/**
 * Custom error classes for Edge Function calls
 */
export class EdgeFunctionError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public functionName: string
  ) {
    super(message)
    this.name = 'EdgeFunctionError'
  }
}

export class AuthenticationError extends EdgeFunctionError {
  constructor(functionName: string) {
    super('Sessão expirada, faça login novamente', 401, functionName)
    this.name = 'AuthenticationError'
  }
}

export class RateLimitError extends EdgeFunctionError {
  constructor(functionName: string) {
    super('Limite de requisições excedido, aguarde alguns instantes', 429, functionName)
    this.name = 'RateLimitError'
  }
}

export class ServerError extends EdgeFunctionError {
  constructor(functionName: string, statusCode: number, message?: string) {
    super(message || 'Erro no servidor, tente novamente', statusCode, functionName)
    this.name = 'ServerError'
  }
}

/**
 * Get authenticated token for Edge Function calls
 */
async function getAuthToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  
  if (!token) {
    throw new AuthenticationError('unknown')
  }
  
  return token
}

/**
 * Invoca Edge Function usando fetch() com token explícito.
 * Para chamadas simples com resposta JSON.
 */
export async function invokeEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const token = await getAuthToken()
  
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
  
  if (!response.ok) {
    const errorText = await response.text()
    
    if (response.status === 401) {
      throw new AuthenticationError(functionName)
    }
    if (response.status === 429) {
      throw new RateLimitError(functionName)
    }
    if (response.status >= 500) {
      throw new ServerError(functionName, response.status, errorText)
    }
    
    throw new EdgeFunctionError(
      `Erro ${response.status}: ${errorText}`,
      response.status,
      functionName
    )
  }
  
  return response.json()
}

/**
 * Invoca Edge Function com suporte a streaming (SSE).
 * Para chamadas que retornam Server-Sent Events (chat).
 */
export async function invokeEdgeFunctionStream(
  functionName: string,
  body: Record<string, unknown>
): Promise<Response> {
  const token = await getAuthToken()
  
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
  
  if (!response.ok) {
    const errorText = await response.text()
    
    if (response.status === 401) {
      throw new AuthenticationError(functionName)
    }
    if (response.status === 429) {
      throw new RateLimitError(functionName)
    }
    if (response.status >= 500) {
      throw new ServerError(functionName, response.status, errorText)
    }
    
    throw new EdgeFunctionError(
      `Erro ${response.status}: ${errorText}`,
      response.status,
      functionName
    )
  }
  
  return response
}
