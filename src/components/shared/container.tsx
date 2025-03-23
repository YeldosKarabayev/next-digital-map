//import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div className={'mx-auto max-w-full mr-1 ml-1 mt-0 p-2'}>{children}</div>;
};
