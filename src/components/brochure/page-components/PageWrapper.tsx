import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  isLastPage?: boolean; // New prop
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, style, id, isLastPage }) => {
  return (
    <div id={id} className={cn('page', className, { 'is-last-brochure-page': isLastPage })} style={style}>
      {children}
    </div>
  );
};
