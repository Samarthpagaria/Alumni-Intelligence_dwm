import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      return (
        <div className="p-6 max-w-2xl mx-auto my-8">
          <div className="p-6 bg-neutral-900 border border-red-500/50 rounded-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold">
                RUNTIME RENDERING ERROR DETECTED
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-neutral-400">
              An unexpected error occurred while rendering this section of the analytical cockpit.
            </p>
            {this.state.error?.message ? (
              <pre className="p-3 bg-black/60 border border-neutral-800 font-mono text-xs text-red-400 overflow-x-auto whitespace-pre-wrap rounded">
                {this.state.error.message}
              </pre>
            ) : null}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-3 py-1.5 text-xs font-mono bg-neutral-800 text-neutral-200 border border-neutral-700 rounded hover:bg-neutral-700 cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 text-xs font-mono bg-orange-600 text-white rounded hover:bg-orange-500 cursor-pointer"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
