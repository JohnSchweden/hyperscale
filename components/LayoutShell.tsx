import React from 'react';

export interface LayoutShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * LayoutShell - Responsive layout wrapper for consistent positioning across all game stages
 * 
 * Desktop (>=1024px): Centers content vertically and horizontally
 * Mobile (<1024px): Anchors content to top with padding for app-like feel
 * 
 * Uses min-h-[100dvh] for mobile viewport stability (handles browser chrome)
 */
export const LayoutShell: React.FC<LayoutShellProps> = ({
  children,
  header,
  footer,
  className = '',
}) => {
  return (
    <div
      className={`
        relative flex flex-col w-full
        lg:items-center lg:justify-center items-start pt-16 lg:pt-0
        min-h-[100dvh]
        bg-black
        safe-area-top safe-area-bottom
        overflow-y-auto
        ${className}
      `.trim()}
    >
      {header && <header className="flex-shrink-0">{header}</header>}
      <main className="flex flex-col w-full items-start lg:items-center">{children}</main>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
};

export default LayoutShell;
