import React from 'react';
import Button from '@/app/components/Button/NavButton';

const HomePage = () => {
  return (
    <div className="text-center text-xl">
      <h1>Welcome to the Home Page!</h1>
      <Button className='bg-slate-200' route="league-info"> League Info </Button>
    </div>
  );
};

export default HomePage;
