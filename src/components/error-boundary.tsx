import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Vanta 컴포넌트를 위한 에러 바운더리
 * React 16+ 호환성을 보장하며, Vanta 효과 관련 오류를 안전하게 처리합니다.
 * React 19에서 테스트되고 최적화되었습니다.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 정보를 상태에 저장
    this.setState({
      error,
      errorInfo
    });

    // 콘솔에 상세한 에러 정보 출력
    console.error('Vanta Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // 선택적 에러 콜백 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // React Debug Current Frame 관련 에러인지 확인
    if (error.message.includes('ReactDebugCurrentFrame') || error.message.includes('React')) {
      console.warn('React lifecycle error detected. This might be related to library loading timing.');
    }
  }

  componentWillUnmount(): void {
    // 컴포넌트 언마운트 시 타이머 정리
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = (): void => {
    // 에러 상태 초기화
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleRetryWithDelay = (): void => {
    // 약간의 지연 후 재시도 (라이브러리 로딩 시간 확보)
    this.retryTimeoutId = window.setTimeout(() => {
      this.handleRetry();
    }, 1000);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 사용자 정의 폴백 UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#495057'
        }
      },
        React.createElement('div', {
          style: {
            fontSize: '48px',
            marginBottom: '16px',
            color: '#dc3545'
          }
        }, '⚠️'),
        React.createElement('h3', {
          style: {
            margin: '0 0 12px 0',
            fontSize: '18px',
            color: '#dc3545'
          }
        }, 'Vanta Effect Error'),
        React.createElement('p', {
          style: {
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#6c757d',
            maxWidth: '400px',
            lineHeight: '1.4'
          }
        }, 'Something went wrong while loading the Vanta effect. This might be due to library loading issues.'),
        
        // 개발 모드에서만 에러 세부사항 표시 (개발 환경 체크)
        typeof window !== 'undefined' && window.location.hostname === 'localhost' && this.state.error && 
        React.createElement('details', {
          style: {
            marginBottom: '16px',
            maxWidth: '500px'
          }
        },
          React.createElement('summary', {
            style: {
              fontSize: '12px',
              color: '#6c757d',
              cursor: 'pointer',
              marginBottom: '8px'
            }
          }, 'Error Details (Development Only)'),
          React.createElement('pre', {
            style: {
              fontSize: '10px',
              color: '#495057',
              backgroundColor: '#f8f9fa',
              padding: '8px',
              borderRadius: '4px',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '100px'
            }
          }, this.state.error.message)
        ),

        React.createElement('div', {
          style: {
            display: 'flex',
            gap: '12px'
          }
        },
          React.createElement('button', {
            onClick: this.handleRetry,
            style: {
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Try Again'),
          React.createElement('button', {
            onClick: this.handleRetryWithDelay,
            style: {
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Retry with Delay')
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
