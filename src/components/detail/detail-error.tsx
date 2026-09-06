import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface DetailErrorProps {
  message?: string
  onRetry?: () => void
}

export function DetailError({ message, onRetry }: DetailErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50/70 p-6 sm:p-8 text-center text-red-700 flex flex-col items-center justify-center max-w-md mx-auto my-12"
    >
      <AlertCircle className="w-8 h-8 text-red-500 mb-3" aria-hidden="true" />
      <h1 className="text-base font-bold text-red-800">Falha ao carregar</h1>
      <p className="mt-1 text-sm text-red-600">
        {message || 'Ocorreu um erro ao consultar os dados. Por favor, tente novamente.'}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4 border-red-300 hover:bg-red-100 text-red-700"
          leadingIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
        >
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
