import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
  <div className="flex flex-col md:flex-row items-center justify-center p-8 bg-gray-900 text-white">
    <div className="md:w-1/2">
      <Image src="/quiz.png" alt="Hero Image"
      width={300}
      height={300}
      />
    </div>
    <div className="md:w-1/2 mt-6 md:mt-0 md:ml-8">
      <h2 className="text-3xl font-bold mb-4 text-center">Play Quiz</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
      Welcome to Quizy, where knowledge meets fun! Unleash your intellect with our captivating quizzes spanning various topics. Challenge yourself, compete with friends, and embark on a journey of discovery. Engage in brain-teasing trivia that entertains and educates.
      </p>
    </div>
  </div>
  )
}

export default Hero