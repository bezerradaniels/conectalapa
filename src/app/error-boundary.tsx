import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            Algo deu errado
          </h1>
          <p className="text-text-secondary max-w-sm">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="font-medium text-accent-text underline"
          >
            Voltar para o início
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
