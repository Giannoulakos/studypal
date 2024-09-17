'use client';

import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CardProps {
  name: string;
  review: string;
  rating: number;
}

const Card = ({ name, review, rating }: CardProps) => {
  const [starArray, setStarArray] = useState<number[]>([]);
  useEffect(() => {
    let ratingArray: number[] = [];
    for (let i = 0; i < rating; i++) {
      ratingArray.push(i);
    }
    setStarArray(ratingArray);
  }, []);
  return (
    <div className='rounded-md p-4 bg-white shadow-md h-[15vh] w-[25vh]'>
      <span className='font-semibold text-lg'>{name}</span>
      <p className='mt-4'>{review}</p>
      {rating > 0 && (
        <div className='flex gap-x-2 mt-3'>
          {starArray.map((star, index) => (
            <Star key={index} color='#FFD700' fill='#FFD700' />
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
