// src/components/LoadingKeycaps.tsx

interface LoadingKeycapsProps {
  text?: string;
}

function LoadingKeycaps({ text = '로딩 중' }: LoadingKeycapsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="keycap-loading mb-3">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
        {text}...
      </p>
    </div>
  );
}

export default LoadingKeycaps;
