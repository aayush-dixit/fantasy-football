import { Loader } from '@mantine/core';

export default function Loading() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Loader color="dark" size={'xl'} />
      <div className="pt-4">Loading...</div>
    </div>
  );
}
