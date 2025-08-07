import { TrendingUp, Zap } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ 
  className = "", 
  showText = true, 
  variant = 'default',
  size = 'md'
}: LogoProps) {
  const sizes = {
    sm: {
      container: "h-8",
      icon: "h-6 w-6",
      text: "text-lg",
      spacing: "space-x-2"
    },
    md: {
      container: "h-10",
      icon: "h-8 w-8",
      text: "text-xl",
      spacing: "space-x-2"
    },
    lg: {
      container: "h-12",
      icon: "h-10 w-10",
      text: "text-2xl",
      spacing: "space-x-3"
    },
    xl: {
      container: "h-16",
      icon: "h-12 w-12",
      text: "text-3xl",
      spacing: "space-x-3"
    }
  };

  const variants = {
    default: {
      gradient: "from-forex-600 via-blue-500 to-gold-500",
      textPrimary: "text-gray-900",
      textSecondary: "text-forex-600"
    },
    white: {
      gradient: "from-white via-gray-100 to-white",
      textPrimary: "text-white",
      textSecondary: "text-gray-200"
    },
    dark: {
      gradient: "from-gray-800 via-gray-700 to-gray-900",
      textPrimary: "text-white",
      textSecondary: "text-gray-300"
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className={`flex items-center ${currentSize.spacing} ${currentSize.container} ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${currentSize.icon} flex-shrink-0`}>
        {/* Background Circle */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentVariant.gradient} shadow-lg`} />
        
        {/* Main Chart Icon */}
        <div className="relative h-full w-full flex items-center justify-center">
          <TrendingUp 
            className={`${currentSize.icon === 'h-6 w-6' ? 'h-4 w-4' : currentSize.icon === 'h-8 w-8' ? 'h-5 w-5' : currentSize.icon === 'h-10 w-10' ? 'h-6 w-6' : 'h-8 w-8'} text-white drop-shadow-sm`}
          />
        </div>
        
        {/* Signal Indicator */}
        <div className={`absolute -top-1 -right-1 ${currentSize.icon === 'h-6 w-6' ? 'h-3 w-3' : currentSize.icon === 'h-8 w-8' ? 'h-4 w-4' : 'h-5 w-5'} bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md`}>
          <Zap className={`${currentSize.icon === 'h-6 w-6' ? 'h-1.5 w-1.5' : currentSize.icon === 'h-8 w-8' ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-white`} />
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-bold ${currentSize.text} ${currentVariant.textPrimary} tracking-tight`}>
            <span className="bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
              FREE FOREX
            </span>
          </div>
          <div className={`font-semibold ${currentSize.text === 'text-lg' ? 'text-sm' : currentSize.text === 'text-xl' ? 'text-base' : currentSize.text === 'text-2xl' ? 'text-lg' : 'text-xl'} ${currentVariant.textSecondary} -mt-1`}>
            SIGNALS PROVIDER
          </div>
        </div>
      )}
    </div>
  );
}

// Favicon/Icon only version
export function LogoIcon({ 
  className = "", 
  size = 'md',
  variant = 'default' 
}: Pick<LogoProps, 'className' | 'size' | 'variant'>) {
  return (
    <Logo 
      className={className} 
      showText={false} 
      size={size} 
      variant={variant}
    />
  );
}

// Text only version
export function LogoText({ 
  className = "", 
  size = 'md',
  variant = 'default' 
}: Pick<LogoProps, 'className' | 'size' | 'variant'>) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const variants = {
    default: {
      textPrimary: "text-gray-900",
      textSecondary: "text-forex-600"
    },
    white: {
      textPrimary: "text-white",
      textSecondary: "text-gray-200"
    },
    dark: {
      textPrimary: "text-white",
      textSecondary: "text-gray-300"
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className={`flex flex-col leading-tight ${className}`}>
      <div className={`font-bold ${currentSize} ${currentVariant.textPrimary} tracking-tight`}>
        <span className="bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
          FREE FOREX
        </span>
      </div>
      <div className={`font-semibold ${currentSize === 'text-lg' ? 'text-sm' : currentSize === 'text-xl' ? 'text-base' : currentSize === 'text-2xl' ? 'text-lg' : 'text-xl'} ${currentVariant.textSecondary} -mt-1`}>
        SIGNALS PROVIDER
      </div>
    </div>
  );
}

// Horizontal version for headers/navigation
export function LogoHorizontal({ 
  className = "", 
  size = 'md',
  variant = 'default' 
}: Pick<LogoProps, 'className' | 'size' | 'variant'>) {
  const sizes = {
    sm: {
      icon: "h-6 w-6",
      text: "text-base",
      spacing: "space-x-2"
    },
    md: {
      icon: "h-8 w-8", 
      text: "text-lg",
      spacing: "space-x-3"
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-xl", 
      spacing: "space-x-3"
    },
    xl: {
      icon: "h-12 w-12",
      text: "text-2xl",
      spacing: "space-x-4"
    }
  };

  const variants = {
    default: {
      gradient: "from-forex-600 via-blue-500 to-gold-500",
      textPrimary: "text-gray-900"
    },
    white: {
      gradient: "from-white via-gray-100 to-white", 
      textPrimary: "text-white"
    },
    dark: {
      gradient: "from-gray-800 via-gray-700 to-gray-900",
      textPrimary: "text-white"
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className={`flex items-center ${currentSize.spacing} ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${currentSize.icon} flex-shrink-0`}>
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentVariant.gradient} shadow-lg`} />
        <div className="relative h-full w-full flex items-center justify-center">
          <TrendingUp 
            className={`${currentSize.icon === 'h-6 w-6' ? 'h-4 w-4' : currentSize.icon === 'h-8 w-8' ? 'h-5 w-5' : currentSize.icon === 'h-10 w-10' ? 'h-6 w-6' : 'h-8 w-8'} text-white drop-shadow-sm`}
          />
        </div>
        <div className={`absolute -top-1 -right-1 ${currentSize.icon === 'h-6 w-6' ? 'h-3 w-3' : currentSize.icon === 'h-8 w-8' ? 'h-4 w-4' : 'h-5 w-5'} bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md`}>
          <Zap className={`${currentSize.icon === 'h-6 w-6' ? 'h-1.5 w-1.5' : currentSize.icon === 'h-8 w-8' ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-white`} />
        </div>
      </div>

      {/* Horizontal Text */}
      <div className={`font-bold ${currentSize.text} ${currentVariant.textPrimary} tracking-tight`}>
        <span className="bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
          FREE FOREX SIGNALS PROVIDER
        </span>
      </div>
    </div>
  );
}
