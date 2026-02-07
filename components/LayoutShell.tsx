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
        flex flex-col w-full
        lg:items-center lg:justify-center items-start pt-20
        min-h-[100dvh]
        bg-black
        safe-area-top safe-area-bottom
        ${className}
      `.trim()}
    >
      {header && <header className="flex-shrink-0">{header}</header>}
      <main className="flex-1 flex flex-col w-full items-start lg:items-center">{children}</main>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
};

export default LayoutShell;
