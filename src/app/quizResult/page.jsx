'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'; 
import QuizResult from "../_components/QuizResult";

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

  useEffect(() => {
    if (!userId && !cardId) return;

    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/review/${userId}/${cardId}`);

        const apiData = response.data.data;

        const correct = apiData.filter(item => item.correctAnswerId === item.userSelectedOption).length;
        const incorrect = apiData.length - correct;
        const totalTime = apiData.reduce((acc, curr) => acc + curr.takenTime, 0);
        const score = apiData.reduce((acc, curr) => acc + curr.pointsEarned, 0);

        // Setting the fetched data
        setResults({
          coinEarned: score, // Assuming score is the coins earned
          score: score,
          correct: correct,
          incorrect: incorrect,
          percentage: ((correct / apiData.length) * 100).toFixed(2),
          timeSpent: totalTime,
          unattempted: apiData.length - correct - incorrect,
          timePerQuestion: (totalTime / apiData.length).toFixed(2),
          liveRank: 55 // hardcoded fallback
        });
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, [userId, cardId]);


  return (
    <div className="mx-auto md:px-5 md:py-5 bg-gray-900 h-screen">
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
