import Image from 'next/image'
import Link from 'next/link'

const Card = ({title, id}) => {
  return (
    <Link href={`/quiz/${id}`} className="block w-full">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105">
        <div className="relative h-44">
          <Image 
            src="/ScienceQuiz.png" 
            alt="Quiz background" 
            className="w-full h-full object-cover"
            width={256}
            height={128}
          />
          {/* <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {questionCount} Qs
          </div> */}
        </div>
        <div className="p-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          {/* <p className="text-gray-400 text-sm mt-1">Difficulty: {difficulty}</p> */}
        </div>
      </div>
    </Link>
  )
}

export default Card