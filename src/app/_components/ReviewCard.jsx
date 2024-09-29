import React from 'react';
import { X, Clock, Coins, Check, ArrowLeft } from 'lucide-react';

const ReviewCard = ({ question, options, correctAnswer, userAnswer, time, score, questionNumber }) => {
  // Determine the background color based on the score
  const scoreBgColor = score > 0 ? 'bg-green-500' : 'bg-red-500';

  return (
    
    <div className="w-full mx-auto bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg p-2">
      <div className="px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Question {questionNumber}:</h2>
        <div className="flex items-center space-x-2">
          <div className={`rounded-full p-1 ${scoreBgColor}`}>
            {score > 0 ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>
          <div className="bg-gray-700 rounded-full px-2 py-1 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{time}s</span>
          </div>
          <div className={`rounded-full px-2 py-1 flex items-center ${score > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            <Coins className="w-4 h-4 mr-1" />
            <span className="text-sm">{score}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="mb-4">{question}</p>
        <div className="space-y-2">
          {options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isCorrect = option === correctAnswer;
            const isUserAnswer = option === userAnswer;
            let bgColor = 'bg-gray-700';
            let borderColor = 'border-gray-600';
            let dotColor = 'bg-yellow-500';

            if (isCorrect) {
              borderColor = 'border-green-500';
              dotColor = 'bg-green-500';
            } else if (isUserAnswer) {
              borderColor = 'border-red-500';
              dotColor = 'bg-red-500';
            }

            return (
              <div
                key={index}
                className={`p-3 rounded-md ${bgColor} ${borderColor} border flex items-center`}
              >
                <div className={`w-6 h-6 ${dotColor} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-sm font-bold">{letter}</span>
                </div>
                <span>{option}</span>
                {isCorrect && <span className="ml-auto text-green-500 text-sm">Correct Answer</span>}
                {isUserAnswer && !isCorrect && <span className="ml-auto text-red-500 text-sm">Your Answer</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
