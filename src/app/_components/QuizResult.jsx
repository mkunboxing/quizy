'use client'

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2, ChevronRight, Trophy, Coins, CheckCircle, XCircle, Percent, Clock, Minus, Medal } from 'lucide-react';

const QuizResult = ({ quizTitle, results }) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId'); 
  const cardId = searchParams.get('cardId'); 
  return (
    <div className="mx-auto px-4 py-8 bg-gray-900 text-white">
      <div className="flex items-center mb-6 justify-center">
        <h1 className="text-2xl font-bold text-yellow-400">{quizTitle}</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <ResultItem icon={<Coins className="text-yellow-400" />} label="Coin Earned" value={results.coinEarned} />
          <ResultItem icon={<Trophy className="text-yellow-400" />} label="Your Score" value={results.score} />
          <ResultItem icon={<CheckCircle className="text-green-500" />} label="Correct" value={results.correct} />
          <ResultItem icon={<XCircle className="text-red-500" />} label="Incorrect" value={results.incorrect} />
          <ResultItem icon={<Percent className="text-red-500" />} label="Percentage" value={`${results.percentage}%`} />
          <ResultItem icon={<Clock className="text-blue-400" />} label="Time Spent" value={`${results.timeSpent} sec`} />
          <ResultItem icon={<Minus className="text-red-500" />} label="Unattempted" value={results.unattempted} />
          <ResultItem icon={<Clock className="text-blue-400" />} label="Time/Ques" value={`${results.timePerQuestion} sec`} />
          <ResultItem icon={<Medal className="text-yellow-400" />} label="Live Rank" value={results.liveRank} className="col-span-2" />
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