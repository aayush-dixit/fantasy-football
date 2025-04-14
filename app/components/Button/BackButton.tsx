import React from 'react';
import { getPreviousStep, Step } from '../../utils/getPreviousStep';
import { Button } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';

const BackButton: React.FC = () => {
  const pathname = usePathname();
  const paths = pathname.split('/');
  const currStep = paths[paths.length - 1];
  const router = useRouter();

  const onClick = () => {
    switch (currStep) {
      case 'league-roster':
        router.push(`/${paths[1]}/team-select`);
        break;
      default:
        router.push('/');
        break;
    }
  };

  return (
    <Button variant="filled" color="dark" size="xl" onClick={onClick}>
      Back
    </Button>
  );
};

export default BackButton;
