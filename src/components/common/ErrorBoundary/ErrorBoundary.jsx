import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SprintFlow caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '32px 16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-surface-900, #0F172A)',
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-surface-500, #64748B)',
              maxWidth: 460,
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred while rendering this page.
            {this.state.error?.message ? ` (${this.state.error.message})` : ''}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              size="md"
              icon={<RefreshCw size={15} />}
              onClick={this.handleReset}
            >
              Reload Page
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Home size={15} />}
              onClick={this.handleGoHome}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
