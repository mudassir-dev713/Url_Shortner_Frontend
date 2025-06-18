import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Log error to service or console
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
          Something went wrong. Please reload the page.
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
