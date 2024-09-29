import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
  <div className="flex flex-col md:flex-row items-center justify-center p-8 bg-gray-900 text-white">
    <div className="md:w-1/2">
      <Image src="/quiz.png" alt="Hero Image"
      width={500}
      height={500}
      />
    </div>
    <div className="md:w-1/2 mt-6 md:mt-0 md:ml-8">
      <h2 className="text-3xl font-bold mb-4">Play Quiz</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel mauris quam. Cras sit amet ligula et justo commodo
        tincidunt.
      </p>
    </div>
  </div>
  )
}

export default Hero