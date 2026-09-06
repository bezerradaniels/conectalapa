import type { AppError } from '@/types'

/**
 * Normalizes Supabase and PostgREST errors into a user-facing Portuguese message,
 * logging the raw technical error to the console.
 */
export function toAppError(error: unknown): AppError {
  if (!error) {
    return {
      message: 'Ocorreu um erro desconhecido.',
      original: error,
    }
  }

  // If already normalized
  if (typeof error === 'object' && error !== null && 'message' in error && 'original' in error) {
    return error as AppError
  }

  console.error('[DataLayer Error]:', error)

  const err = error as { code?: string; message?: string; details?: string }
  const code = err.code

  let message = 'Não foi possível carregar os dados. Tente novamente mais tarde.'

  switch (code) {
    case 'PGRST116':
      message = 'O registro solicitado não foi encontrado.'
      break
    case '42501':
      message = 'Você não possui permissão para acessar este recurso.'
      break
    case '23505':
      message = 'Já existe um registro cadastrado com estes dados.'
      break
    case '23503':
      message = 'O registro referenciado não existe ou foi removido.'
      break
    case 'P0001':
      message = err.message || 'Limite de requisições excedido. Tente novamente em instantes.'
      break
    default:
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        message = 'Falha na conexão com o servidor. Verifique sua conexão com a internet.'
      }
      break
  }

  return {
    message,
    code,
    original: error,
  }
}
