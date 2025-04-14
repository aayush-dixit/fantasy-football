import React from 'react';
import { Button } from '@mantine/core';

interface FetchButtonProps {
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled: boolean;
}

const FetchButton: React.FC<FetchButtonProps> = ({
  className,
  onClick,
  children,
  disabled,
}) => {
  return (
    <Button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </Button>
  );
};

export default FetchButton;
