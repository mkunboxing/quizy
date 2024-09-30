'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation'; // useRouter for navigation
import QuizResult from "../_components/QuizResult";
import Confetti from 'react-confetti';

const QuizResultContent = () => {
  const [results, setResults] = useState({
    coinEarned: 0,
    score: 0,
    correct: 0,
    incorrect: 0,
    percentage: 0,
    timeSpent: 0,
    unattempted: 0,
    timePerQuestion: 0,
    liveRank: 0
  });

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const cardId = searchParams.get('cardId');
  const router = useRouter(); // Get the router for navigation

  // Set window size dynamically, and check if it's the client
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  // State to control confetti visibility
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Handle browser back button and navigate to home page
    const handlePopState = () => {
      router.replace('/'); // Redirect to home page on back button press
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  useEffect(() => {
    // Only run the confetti setup and window resize on the client
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);

      // Show confetti for 5 seconds on client side
      setShowConfetti(true);
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => {
        clearTimeout(confettiTimer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (!userId || !cardId) return;

    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/review/${userId}/${cardId}`);

        const apiData = response.data.data;

        const correct = apiData.filter(item => item.correctAnswerId === item.userSelectedOption).length;
        const incorrect = apiData.length - correct;
        const totalTime = apiData.reduce((acc, curr) => acc + curr.takenTime, 0);
        const score = apiData.reduce((acc, curr) => acc + curr.pointsEarned, 0);

        setResults({
          coinEarned: score,
          score: score,
          correct: correct,
          incorrect: incorrect,
          percentage: ((correct / apiData.length) * 100).toFixed(2),
          timeSpent: totalTime,
          unattempted: apiData.length - correct - incorrect,
          timePerQuestion: (totalTime / apiData.length).toFixed(2),
          liveRank: 55
        });
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, [userId, cardId]);

  return (
    <div className="mx-auto md:px-5 md:py-5 bg-gray-900 min-h-screen">
      {/* Conditionally render confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}  // Full window width
          height={windowSize.height} // Full window height
          numberOfPieces={500} // Adjust the amount of confetti
          recycle={false}
        />
      )}
      <QuizResult
        quizTitle='Your Quiz Result'
        results={results}
      />
    </div>
  );
};

const QuizResultPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizResultContent />
    </Suspense>
  );
};

export default QuizResultPage;
