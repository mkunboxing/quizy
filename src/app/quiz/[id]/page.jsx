'use client'
import Header from '@/app/_components/header';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
const QuizDetails = () => {
  const { id } = useParams()

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signup');
    } else {
      // Extract the payload from the JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('User ID:', payload.userId);
    }
  }, []);


  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [length, setLength] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cards/${id}`)
      .then(response => {
        setCardDetails(response.data.title);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching card details:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/question/${id}`)
      .then(response => {
        const questions = response.data; // Get the array of questions
        setLength(questions.length); // Set the length of the questions array
        setLoading(false);
        console.log(questions.length);
      })
      .catch(error => {
        console.error('Error fetching question details:', error);
        setError(error);
        setLoading(false);
      });
  }, []);
  

  return (
    <>
    <Header/>
    <div className="h-screen mx-auto px-4 py-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">{cardDetails}</h1>
      <div className="bg-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
        <p className="text-white mb-4">Answer these simple questions correctly and earn coins</p>
        <p className="text-white mb-4">
          Difficulty Level: <span className="bg-green-500 text-white px-2 py-1 rounded">Easy</span>
        </p>
        <p className="text-white mb-6">{length} Questions</p>
        <Link href={`/timer?id=${id}`} className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center">
          Play
        </Link>
      </div>
    </div>
    </>
  );
};

export default QuizDetails;
