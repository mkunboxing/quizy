'use client'
import Header from '@/app/_components/header';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const QuizDetails = () => {
  const { id } = useParams()
  const router = useRouter();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [length, setLength] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signup');
    } else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('User ID:', payload.userId);
    }
  }, []);

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
        const questions = response.data;
        setLength(questions.length);
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
      <div className="sticky top-0 z-10">
        <Header/>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e0836] text-white">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Image src="/question.png" alt="Question Mark" width={200} height={200} />
          </div>
          <h1 className="text-3xl font-bold mb-4">{cardDetails}</h1>
          <p className="text-lg mb-4">Answer these simple questions correctly and earn coins</p>
          <p className="mb-4">
            Difficulty Level: <span className="bg-green-500 text-white px-2 py-1 rounded">Easy</span>
          </p>
          <p className="text-xl mb-6">{length} Questions</p>
          <Link href={`/timer?id=${id}`} className="block w-64 mx-auto bg-[#00c2cb] hover:bg-[#00a0a8] text-white font-bold py-3 px-6 rounded-full text-lg">
            Play
          </Link>
        </div>
      </div>
    </>
  );
};

export default QuizDetails;
