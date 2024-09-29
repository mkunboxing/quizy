'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // Importing the useSearchParams hook
import { ArrowLeft } from 'lucide-react';

const LeaderboardItem = ({ rank, name, score }) => (
  <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg mb-2 h-full">
    <span className="text-yellow-400  font-bold text-xs md:text-xl">{rank}</span>
    <div className="flex items-center">
      <Image src="/userImage.png" alt={name} className="w-8 h-8 rounded-full mr-2 md:w-12 md:h-12" width={40} height={40} />
      <span className="text-white text-sm md:text-xl capitalize">{name}</span>
    </div>
    <div className="flex items-center">
    <span className="text-yellow-400 mr-2 text-xs md:text-xl">Points</span>
      <div className="bg-yellow-400 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
      <span className="text-gray-800 text-xs md:text-xl">{score}</span>
      </div>
    </div>
  </div>
);

const TopThree = ({ users }) => (
  <div className="flex justify-around items-end mb-6">
    {users.map((user, index) => {
      let initialPosition, size, mt, positionClass;
      switch (index) {
        case 0: // First place (center)
          initialPosition = { opacity: 0, y: -200 };
          size = 'w-16 h-16';
          mt = 'mt-0';
          positionClass = 'order-2';
          break;
        case 1: // Second place (left)
          initialPosition = { opacity: 0, x: -100 };
          size = 'w-16 h-16';
          mt = 'mb-4';
          positionClass = 'order-1';
          break;
        case 2: // Third place (right)
          initialPosition = { opacity: 0, x: 100 };
          size = 'w-16 h-16';
          mt = 'mb-4';
          positionClass = 'order-3';
          break;
      }

      return (
        <motion.div
          key={user.userId}
          className={`flex flex-col items-center ${mt} ${positionClass}`}
          initial={initialPosition}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className={`relative ${size} rounded-full bg-yellow-400 mb-2`}>
            <Image src="/userImage.png" alt={user.userName} className="w-full h-full rounded-full" width={24} height={24} />
            {index === 0 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="text-yellow-400 text-4xl">👑</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-teal-800 rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-white font-bold">{index + 1}</span>
            </div>
          </div>
          <span className="text-white text-xs font-bold md:text-xl capitalize">{user.userName}</span>
          <span className="text-yellow-400 text-xs md:text-xl">{user.totalPoints}</span>
        </motion.div>
      );
    })}   
  </div>
);
const LeaderboardContent = () => {
  const searchParams = useSearchParams();
  const cardId = searchParams.get('cardId');
  const [topThree, setTopThree] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/points/${cardId}`);
        const data = await response.json();

        const apiData = data.data || [];
        const dummyData = [
          
        ];

        const combinedData = [...apiData, ...dummyData];
        combinedData.sort((a, b) => b.totalPoints - a.totalPoints);

        setTopThree(combinedData.slice(0, 3));
        setOtherUsers(combinedData.slice(3));
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    if (cardId) {
      fetchLeaderboardData();
    }
  }, [cardId]);

  return (
    <>
      <TopThree users={topThree} />
      <div>
        {otherUsers.map((user, index) => (
          <LeaderboardItem key={user.userId} rank={index + 4} name={user.userName} score={user.totalPoints} />
        ))}
      </div>
    </>
  );
};

const Leaderboard = () => {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };
  return (
    <div className="mx-auto min-h-screen bg-gray-900 p-8">
      <div className="flex items-center justify-center mb-6">
        <div onClick={handleBackClick} className="absolute left-10 cursor-pointer">
          <ArrowLeft className="text-yellow-400" />
        </div>
        <h1 className="text-yellow-400 text-xl md:text-2xl font-bold">Leaderboard</h1>
      </div>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LeaderboardContent />
      </Suspense>
    </div>
  );
};

export default Leaderboard;
