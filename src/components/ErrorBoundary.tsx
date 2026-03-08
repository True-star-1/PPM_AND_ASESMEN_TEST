import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isTranslateError = this.state.error?.message?.includes('insertBefore') || 
                               this.state.error?.message?.includes('removeChild') ||
                               this.state.error?.stack?.includes('extension');

      return (
        <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-stone-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
              Ups! Terjadi Kendala
            </h2>
            
            {isTranslateError ? (
              <div className="space-y-4">
                <p className="text-stone-600 text-sm leading-relaxed">
                  Sepertinya fitur <strong>Google Translate</strong> sedang aktif dan mengganggu sistem aplikasi.
                </p>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 text-left">
                  <p className="font-bold mb-1">Cara Memperbaiki:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Matikan Google Translate untuk situs ini.</li>
                    <li>Klik tombol "Muat Ulang" di bawah.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Terjadi kesalahan teknis yang tidak terduga. Silakan coba muat ulang halaman.
              </p>
            )}

            <button
              onClick={this.handleReload}
              className="mt-8 w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all"
            >
              <RefreshCw size={18} />
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
