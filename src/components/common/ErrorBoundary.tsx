import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleHardReload = () => {
    try {
      localStorage.removeItem('satyabani_user');
      localStorage.removeItem('satyabani_theme');
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }


      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/80 rounded-2xl flex items-center justify-center mx-auto text-rose-800 dark:text-rose-400 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif text-slate-950 dark:text-white">
                সাময়িক ত্রুটি ঘটেছে
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                অ্যাপ্লিকেশনের এই অংশটি লোড করার সময় একটি প্রযুক্তিগত সমস্যা হয়েছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন অথবা প্রচ্ছদে ফিরে যান।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/';
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-sm transition shadow-sm"
              >
                <Home className="w-4 h-4" />
                <span>প্রচ্ছদে ফিরে যান</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleHardReload}
                className="text-xs text-rose-700 dark:text-rose-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ক্যাশ মেমরি পরিষ্কার করে রিসেট করুন</span>
              </button>
            </div>

            {this.state.error && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
                <button
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1 font-mono"
                >
                  <span>প্রযুক্তিগত বিস্তারিত (Debug Info)</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-950 rounded-lg text-[11px] font-mono text-rose-800 dark:text-rose-300 overflow-x-auto max-h-40 border border-slate-200 dark:border-slate-800">
                    <p className="font-bold">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="mt-1 text-slate-600 dark:text-slate-400 text-[10px] whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
