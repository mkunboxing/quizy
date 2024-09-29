'use client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const QuestionsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [cardName, setCardName] = useState(null);

  // Score tracking
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(questions.length);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    } else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    }
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cards/${id}`)
      .then(response => {
        setCardId(response.data._id);
        setCardName(response.data.title);
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0 && !showAnswer) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0) {
        setShowAnswer(true);
        if (!selectedAnswerId) {
          handleAnswerClick("no answer"); 
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showAnswer]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/question/${id}`);
        const data = response.data;
        setQuestions(data);
        setUnansweredCount(data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (id) {
      fetchQuestions();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = async (answerId) => {
    setSelectedAnswerId(answerId);
    setShowAnswer(true);

    const timeTaken = 60 - timeLeft;
    setTimeLeft(0);

    const isCorrect = answerId === currentQuestion.correctAnswerId;
    const pointsEarned = isCorrect ? 4 : 0;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/save-answer`, {
        userId,
        cardId,
        questionId: currentQuestion._id, 
        userSelectedOption: answerId,
        takenTime: timeTaken,
      });

      console.log('Answer submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setPoints(prev => prev + 4);
    } else {
      setWrongAnswersCount(prev => prev + 1);
    }

    setUnansweredCount(prev => prev - 1);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswerId) {
      await handleAnswerClick("no answer");
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswerId(null);
      setShowAnswer(false);
      setTimeLeft(60);
    }
  };

  const handleSubmit = () => {
    router.push(`/quizResult?userId=${userId}&cardId=${cardId}`);
  };

  const getButtonClass = (option) => {
    if (showAnswer) {
      if (option.answerId === currentQuestion.correctAnswerId) {
        return 'bg-green-500 text-white';
      } else if (option.answerId === selectedAnswerId) {
        return 'bg-red-500 text-white';
      } else {
        return 'bg-white text-gray-800';
      }
    } else {
      return 'bg-white text-gray-800';
    }
  };

  return (
    <div className="h-screen w-full mx-auto px-4 md:py-8 py-4 bg-gray-900">
      <h1 className='text-yellow-500 text-center text-2xl font-bold mb-4'>{cardName} Quiz</h1>
      <div className='bg-gray-800 rounded-lg p-4 md:p-8 text-white mb-14'>
        <div className="text-center md:mb-8 mb-1">
          <h2 className="md:text-2xl mb-2">Time Remaining :</h2>
          <div className="inline-block relative">
            <svg className="md:w-32 md:h-32 w-14 h-14" viewBox="0 0 100 100">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-pink-500"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * timeLeft) / 60}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-bold">
              {timeLeft}
            </span>
          </div>
        </div>

        <p className="text-center md:text-xl text-xs md:mb-6 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>

        <h2 className="md:text-xl text-sm md:mb-8 mb-3 text-center">{currentQuestion.question}</h2>

        <div className="md:space-y-4 space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.answerId}
              className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-full text-left ${getButtonClass(option)}`}
              onClick={() => handleAnswerClick(option.answerId)}
              disabled={showAnswer}
            >
              <span className="font-bold mr-2">{option.answerId.replace('option', '')}.</span> {option.answer}
            </button>
          ))}
        </div>
      </div>

      {showAnswer && currentQuestionIndex < questions.length - 1 && (
        <div className="py-4 font-[Montserrat] flex fixed bottom-0 left-0 items-center bg-gray-800 justify-center w-full z-20">
          <div className="w-1/2 flex justify-center items-center">
            <button
              className="w-full py-3 px-4 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          </div>
        </div>
      )}

      {showAnswer && currentQuestionIndex === questions.length - 1 && (
        <button
          className="w-full mt-8 py-3 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

const Questions = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionsContent />
    </Suspense>
  );
};

export default Questions;
