'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Trophy, CheckCircle, XCircle, Percent, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
  
const QuizResult = ({ quizTitle, results }) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); 
  const cardId = searchParams.get('cardId'); 

  useEffect(() => {
    const addPointsToUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/add-points`, {
          userId: userId,
          pointsToAdd: results.score
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          console.log('Points added successfully:', response.data.data);
        } else {
          console.error('Failed to add points:', response.data.message);
        }
      } catch (error) {
        console.error('Error adding points:', error);
      }
    };

    if (userId && results.score) {
      addPointsToUser();
    }
  }, [userId, results.score]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="mx-auto px-4 py-8 bg-gray-900 text-white">
      <div className="flex items-center mb-6 justify-center relative">
        <Link href="/" className="absolute left-0">
          <ArrowLeft className="text-yellow-400 cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-bold text-yellow-400">{quizTitle}</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <ResultItem icon={<Trophy className="text-yellow-400" />} label="Your Score" value={results.score} className='col-span-2' />
          <ResultItem icon={<CheckCircle className="text-green-500" />} label="Correct" value={results.correct} />
          <ResultItem icon={<XCircle className="text-red-500" />} label="Incorrect" value={results.incorrect} />
          <ResultItem icon={<Percent className="text-red-500" />} label="Percentage" value={`${results.percentage}%`} className='col-span-2' />
          <ResultItem icon={<Clock className="text-blue-400" />} label="Time Spent" value={`${results.timeSpent} sec`} />
          <ResultItem icon={<Clock className="text-blue-400" />} label="Time/Ques" value={`${results.timePerQuestion} sec`} />
        </div>
      </div>
      <Link 
        href={`/reviewAns?userId=${userId}&cardId=${cardId}`} 
        className="bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center mb-4"
      >
        Review Questions
        <ChevronRight className="ml-2" />
      </Link>
      
      <Link 
        href={`/leaderboard?userId=${userId}&cardId=${cardId}`} 
        className="block bg-blue-600 text-white py-3 px-4 rounded-lg text-center"
      >
        Leaderboard
        <ChevronRight className="inline ml-2" />
      </Link>
    </div>
  );
};

const ResultItem = ({ icon, label, value, className = "" }) => (
  <div className={`bg-gray-700 rounded-lg p-3 flex items-center ${className}`}>
    {icon}
    <div className="ml-3">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default QuizResult;
