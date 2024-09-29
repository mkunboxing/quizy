'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Timer = () => {
  const [seconds, setSeconds] = useState(3);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  console.log(id);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(`/questions?id=${id}`); // Redirect to questions page with id
    }
  }, [seconds, router, id]);

  return (
    <div className="h-screen mx-auto px-4 py-8 text-center bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-6">Get Ready!</h1>
      <p className="text-2xl">The quiz will start in...</p>
      <div className="text-6xl font-bold mt-4">{seconds}</div>
    </div>
  );
};

export default Timer;
