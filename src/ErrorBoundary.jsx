import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // This intercepts the 'S' crash and stops it from killing the whole website
    console.error("🚨 3D Engine Crash Intercepted:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // If the 3D engine dies, show a safe, static dark background instead of a blank screen
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#02040a] to-[#010205] flex items-center justify-center pointer-events-none z-0">
          <span className="text-gray-800 font-space text-xs tracking-[0.3em] uppercase opacity-50">
            [ Physics Engine Offline - Terminal Active ]
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}