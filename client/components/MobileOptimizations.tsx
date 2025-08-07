import { useEffect, useState } from 'react';

// Hook to detect mobile device and screen size
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      setIsMobile(width < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, screenSize };
}

// Mobile-responsive container component
interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className={`
      w-full 
      px-4 sm:px-6 lg:px-8 
      mx-auto 
      max-w-7xl
      ${className}
    `}>
      {children}
    </div>
  );
}

// Mobile-responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 }, 
  gap = '4',
  className = '' 
}: ResponsiveGridProps) {
  const gridCols = [
    cols.xs && `grid-cols-${cols.xs}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridCols} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-responsive text sizing
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

export function ResponsiveText({ children, size = 'base', className = '' }: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-sm sm:text-base md:text-lg',
    lg: 'text-base sm:text-lg md:text-xl',
    xl: 'text-lg sm:text-xl md:text-2xl',
    '2xl': 'text-xl sm:text-2xl md:text-3xl',
    '3xl': 'text-2xl sm:text-3xl md:text-4xl',
    '4xl': 'text-3xl sm:text-4xl md:text-5xl',
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

// Mobile-optimized button component
interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export function MobileButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false 
}: MobileButtonProps) {
  const variantClasses = {
    primary: 'bg-forex-600 hover:bg-forex-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border border-forex-600 text-forex-600 hover:bg-forex-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base sm:px-6 sm:py-3',
    lg: 'px-6 py-3 text-lg sm:px-8 sm:py-4',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg
        font-medium
        transition-colors
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        touch-manipulation
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Mobile-optimized sidebar component
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-white shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:w-64
        flex flex-col
      `}>
        {children}
      </div>
    </>
  );
}

// Responsive spacing utility
export function ResponsiveSpacing({ size = 'md', children }: { size?: 'sm' | 'md' | 'lg', children: React.ReactNode }) {
  const spacingClasses = {
    sm: 'space-y-4 sm:space-y-6',
    md: 'space-y-6 sm:space-y-8',
    lg: 'space-y-8 sm:space-y-12',
  };

  return (
    <div className={spacingClasses[size]}>
      {children}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileCard({ children, className = '', padding = 'md' }: MobileCardProps) {
  const paddingClasses = {
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div className={`
      bg-white 
      rounded-lg 
      shadow-lg 
      border 
      border-gray-200
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Touch-friendly link component
interface TouchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function TouchLink({ href, children, className = '', external = false }: TouchLinkProps) {
  const props = external ? {
    href,
    target: '_blank',
    rel: 'noopener noreferrer'
  } : { href };

  const Component = external ? 'a' : 'a';

  return (
    <Component
      {...props}
      className={`
        block
        py-3
        px-4
        rounded-lg
        transition-colors
        duration-200
        hover:bg-gray-50
        active:bg-gray-100
        touch-manipulation
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

// Mobile-optimized form input
interface MobileInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function MobileInput({ 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  className = ''
}: MobileInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full
          px-4
          py-3
          text-base
          border
          border-gray-300
          rounded-lg
          focus:ring-2
          focus:ring-forex-500
          focus:border-transparent
          transition-colors
          duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        required={required}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Mobile optimization CSS injection
export function injectMobileStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Touch-friendly improvements */
    @media (max-width: 768px) {
      /* Ensure minimum touch target size */
      button, a, input, select, textarea {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Improve text readability on mobile */
      body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      
      /* Better tap highlighting */
      * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      }
      
      /* Prevent zoom on input focus */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="tel"],
      select,
      textarea {
        font-size: 16px !important;
      }
      
      /* Smooth scrolling on mobile */
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Better form field spacing on mobile */
      .space-y-4 > * + * {
        margin-top: 1.5rem;
      }
      
      /* Responsive table improvements */
      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Card improvements for mobile */
      .mobile-card {
        margin: 0.5rem;
        border-radius: 0.75rem;
      }
      
      /* Navigation improvements */
      .mobile-nav {
        padding-bottom: env(safe-area-inset-bottom);
      }
    }
    
    /* Tablet optimizations */
    @media (min-width: 768px) and (max-width: 1024px) {
      .tablet-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .tablet-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    /* Large screen optimizations */
    @media (min-width: 1024px) {
      .desktop-cols-4 {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .desktop-cols-5 {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  `;
  
  if (!document.head.querySelector('[data-mobile-styles]')) {
    style.setAttribute('data-mobile-styles', 'true');
    document.head.appendChild(style);
  }
}

// Auto-inject mobile styles when component is imported
if (typeof window !== 'undefined') {
  injectMobileStyles();
}
