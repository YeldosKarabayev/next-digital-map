import React from 'react';

interface Props {
  className?: string;
}

export const MapBlock: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div className={'mx-auto max-w-full max-h-[72%] rounded-md bg-white p-1 mt-[-7px]'}>{children}</div>;
};