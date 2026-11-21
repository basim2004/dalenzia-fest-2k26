import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DALENZIA Unhandled Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-2 border-[#A91F35]/20 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-[#A91F35] font-black text-2xl">
              !
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
                DALENZIA FEST 2K26 • RECOVERY CONSOLE
              </span>
              <h2 className="text-xl font-serif font-black text-stone-900">
                Application Rendering Encountered An Issue
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                A client-side state issue was prevented from crashing the portal. You can refresh the view or reset local cache to restore standard operation.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-left font-mono text-[11px] text-rose-700 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl bg-[#A91F35] hover:bg-[#851627] text-white font-bold text-xs transition-all shadow-md"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetStorage}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition-all shadow-md"
              >
                Clear Cache & Refresh
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-4 text-xs font-semibold text-stone-500">
              <a href="#admin" onClick={() => { window.location.hash = '#admin'; window.location.reload(); }} className="hover:text-[#A91F35]">
                Admin Dashboard
              </a>
              <span>•</span>
              <a href="#judge" onClick={() => { window.location.hash = '#judge'; window.location.reload(); }} className="hover:text-[#A91F35]">
                Judge Portal
              </a>
              <span>•</span>
              <a href="#home" onClick={() => { window.location.hash = '#home'; window.location.reload(); }} className="hover:text-[#A91F35]">
                Public Website
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
