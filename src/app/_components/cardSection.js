'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CardSection = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cards`);
            setCards(response.data);
          } catch (error) {
            console.error('Error fetching cards:', error);
          }
        };
    
        fetchCards();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="mx-auto px-12 py-8 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Computer Science Quizzes</h2>
            <Slider {...settings}>
                {cards.map((card) => (
                    <div key={card._id} className="px-2">
                        <Card 
                            id={card.cardId}
                            title={card.title} 
                        />
                    </div>
                ))}
            </Slider>
            
            <h2 className="text-2xl font-bold mb-6 mt-12 text-center">Programming Quizzes</h2>
            <Slider {...settings}>
                {cards.map((card) => (
                    <div key={card._id} className="px-2">
                        <Card 
                            id={card.cardId}
                            title={card.title} 
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default CardSection