import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, style, id }) => {
  return (
    <div id={id} className={cn('page', className)} style={style}>
      {children}
    </div>
  );
};
