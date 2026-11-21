import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('FreightIQ Uncaught Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fff1f2', border: '2px solid #e11d48', borderRadius: '12px', margin: '24px', color: '#881337', fontFamily: 'monospace' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>⚠️ FreightIQ Interface Render Error</h2>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>{this.state.error?.message || String(this.state.error)}</p>
          <pre style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', border: '1px solid #fecdd3' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '12px', padding: '8px 16px', background: '#be123c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global unhandled error catcher
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 24px; background: #fff1f2; border: 2px solid #e11d48; border-radius: 12px; margin: 24px; color: #881337; font-family: monospace;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">⚠️ JavaScript Runtime Exception</h2>
        <p style="font-size: 14px; margin-bottom: 12px;">${event.message}</p>
        <pre style="background: #ffffff; padding: 12px; border-radius: 8px; font-size: 12px; overflow-x: auto; border: 1px solid #fecdd3;">${event.filename}:${event.lineno}:${event.colno}</pre>
      </div>
    `;
  }
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
