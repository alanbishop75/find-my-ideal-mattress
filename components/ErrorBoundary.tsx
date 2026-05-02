import React from "react";

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  // componentDidCatch() {
  //   // Log error to monitoring service if needed
  // }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 24 }}>
        <h2>Something went wrong.</h2>
        <p>Please refresh the page or try again later.</p>
      </div>;
    }
    return this.props.children;
  }
}
