"use client";

import CardSection from "./_components/cardSection.js";
import Header from "./_components/header.jsx";
import Hero from "./_components/hero.jsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function Home() {
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
  return (
    <>
    <Header/>
    <Hero/>
    <CardSection/>
    </>
    
  );
}
