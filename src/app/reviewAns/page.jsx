'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReviewCard from '../_components/ReviewCard';
import { ArrowLeft } from 'lucide-react';

const ReviewAnsContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const cardId = searchParams.get('cardId');
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/review/${userId}/${cardId}`);
        const result = await response.json();
        
        if (result.success) {
          setReviewData(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    fetchReviewData();
  }, [userId, cardId]);

  return (
    <div className="mx-auto px-10 py-10 bg-gray-900 ">
       <div className="flex items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400">Review your answers</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {reviewData.map((item, index) => (
        <ReviewCard
          key={item._id}
          question={item.question.question}
          options={item.question.options.map(option => option.answer)}
          correctAnswer={item.question.options.find(option => option.answerId === item.correctAnswerId).answer} 
          userAnswer={item.question.options.find(option => option.answerId === item.userSelectedOption)?.answer || 'No answer selected'} 
          time={item.takenTime} 
          score={item.pointsEarned} 
        />
      ))}
      </div>
    </div>
  );
};

const ReviewAns = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewAnsContent />
    </Suspense>
  );
};

export default ReviewAns;
