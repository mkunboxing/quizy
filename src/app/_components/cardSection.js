'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card';

const CardSection = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cards`);
            setCards(response.data);
            console.log("hit");
          } catch (error) {
            console.error('Error fetching cards:', error);
          }
        };
    
        fetchCards();
      }, []);

  return (
    <div className="mx-auto px-4 py-8 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Computer Science Quizzes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card 
            key={card._id} 
            id={card.cardId}
            title={card.title} 
          />
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-6 mt-6 text-center">Math Quizzes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
          <Card 
            key={card._id} 
            id={card.cardId}
            title={card.title} 
          />
        ))}
      </div>
    </div>
  )
}

export default CardSection