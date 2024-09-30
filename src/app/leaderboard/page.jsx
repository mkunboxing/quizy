'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // Importing the useSearchParams hook
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Confetti from 'react-confetti';

const LeaderboardItem = ({ rank, name, score, isCurrentUser }) => (
  <div className={`flex items-center justify-between bg-gray-800 p-2 rounded-lg mb-2 h-full ${isCurrentUser ? 'bg-green-500' : ''}`}>
    <span className="text-yellow-400 font-bold text-xs md:text-xl">{rank}</span>
    <div className="flex items-center">
      <Image src="/userImage.png" alt={name} className="w-8 h-8 rounded-full mr-2 md:w-12 md:h-12" width={40} height={40} />
      <span className={`text-sm md:text-xl capitalize ${isCurrentUser ? 'text-black' : 'text-white'}`}>{name}</span>
    </div>
    <div className="flex items-center">
      <span className="text-yellow-400 mr-2 text-xs md:text-xl">Points</span>
      <div className="bg-yellow-400 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
        <span className={`text-xs md:text-xl ${isCurrentUser ? 'text-gray-900' : 'text-gray-800'}`}>{score}</span>
      </div>
    </div>
  </div>
);

const TopThree = ({ users, currentUser }) => (
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
          className={`flex flex-col items-center ${mt} ${positionClass} ${currentUser && currentUser.userId === user.userId ? 'bg-yellow-500 p-2 rounded-lg' : ''}`}
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
          <span className={`text-xs font-bold md:text-xl capitalize ${currentUser && currentUser.userId === user.userId ? 'text-black' : 'text-white'}`}>{user.userName}</span>
          <span className={`text-xs md:text-xl ${currentUser && currentUser.userId === user.userId ? 'text-black' : 'text-yellow-400'}`}>{user.totalPoints}</span>
        </motion.div>
      );
    })}
  </div>
);

const LeaderboardContent = () => {
  const searchParams = useSearchParams();
  const cardId = searchParams.get('cardId'); // Extract the cardId
  const userId = searchParams.get('userId'); // Extract the userId

  const [topThree, setTopThree] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // To store the current user data
  const [token, setToken] = useState(null); // To store token after component mounts
  const [isMoreVisible, setIsMoreVisible] = useState(false); // Track if more users are visible

  useEffect(() => {
    // Set token after the component mounts to ensure it's only accessed client-side
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch leaderboard data
        const leaderboardResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/points/${cardId}`);
        const leaderboardData = await leaderboardResponse.json();
        const apiData = leaderboardData.data || [];

        // Fetch current user data
        if (userId && token) {
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ans/user-points/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const userData = await userResponse.json();
          setCurrentUser(userData.data);
        }

        const combinedData = [...apiData];
        combinedData.sort((a, b) => b.totalPoints - a.totalPoints);

        setTopThree(combinedData.slice(0, 3));
        setOtherUsers(combinedData.slice(3));

        // Initialize visible users (first 4 from other users)
        setVisibleUsers(combinedData.slice(3, 7));

        // If current user isn't in the top three, ensure they appear first in the "other users" list
        if (userId && !combinedData.slice(0, 3).find(user => user.userId === userId)) {
          const currentUserData = combinedData.find(user => user.userId === userId);
          if (currentUserData) {
            setVisibleUsers(prev => [currentUserData, ...prev]);
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    if (cardId && token) {
      fetchLeaderboardData();
    }
  }, [cardId, userId, token]);

  const handleLoadMore = () => {
    setIsMoreVisible(true);
    setVisibleUsers(otherUsers);
  };

  return (
    <>
      <TopThree users={topThree} currentUser={currentUser} />
      <div>
        {visibleUsers.map((user, index) => (
          <LeaderboardItem
            key={user.userId}
            rank={index + 4} // Adjust rank appropriately
            name={user.userName}
            score={user.totalPoints}
            isCurrentUser={currentUser && currentUser.userId === user.userId}
          />
        ))}
        {!isMoreVisible && otherUsers.length > visibleUsers.length && (
          <button
            onClick={handleLoadMore}
            className="mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center w-full"
          >
            Load More
            {/* <ChevronRight className="ml-2" /> */}
          </button>
        )}
      </div>
    </>
  );
};

const Leaderboard = () => {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="mx-auto min-h-screen bg-gray-900 p-8">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={500} recycle={false} />}
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
