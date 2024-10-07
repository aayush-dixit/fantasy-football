'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  route?: string;
  children?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ route, children, className }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`./${route}`);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
