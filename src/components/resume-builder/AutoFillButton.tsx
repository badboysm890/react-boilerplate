import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AutoFillButtonProps {
  onFill: () => Promise<void>;
  section: string;
}

export default function AutoFillButton({ onFill, section }: AutoFillButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setIsDone(false);
    try {
      await onFill();
      setIsDone(true);
      setTimeout(() => setIsDone(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                 text-white rounded-full hover:shadow-lg transition-all duration-200 
                 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                 relative overflow-hidden group"
    >
      {/* Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Loading animation */}
      {isLoading && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-blue-600/80 animate-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
        </div>
      )}
      
      <span className="relative flex items-center">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Filling {section}...
          </>
        ) : isDone ? (
          <>
            <Sparkles className="h-4 w-4 mr-2 animate-bounce" />
            {section} Filled!
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Fill {section}
          </>
        )}
      </span>
    </button>
  );
}