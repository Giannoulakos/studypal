import Navbar from '@/components/ui/homepage/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CircleUserRound } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Card from '@/components/ui/review-card/card';

export default function Home() {
  return (
    <main>
      <div className='flex justify-center bg-green-50 h-[70vh]'>
        <div className=' w-[75%] mt-5'>
          <Navbar />
          <div className='flex justify-between items-center h-[60vh]  '>
            <div>
              <h1 className='text-4xl font-semibold'>
                <p className='leading-snug'>
                  Your Personal <br /> 24/7 Study Assistant
                </p>
              </h1>
              <div className='mt-5'>
                <p>Learn by solving with our AI-powered platform.</p>
                <p>Get the help you need, when you need it.</p>
              </div>

              <div className='mt-14'>
                <p className='mb-2'>Be the first to try it out!</p>
                <form className='flex gap-x-2'>
                  <Input required placeholder='Your Email' type='email' />
                  <Button className='text-white font-semibold bg-gradient-to-t from-green-500 to-green-400 '>
                    Enter The Waitlist
                  </Button>
                </form>
              </div>
            </div>
            <div className='min-w-[45vh] w-[40%]'>
              <div className='rounded-md bg-white p-2 flex flex-col justify-between min-h-[20vh]'>
                <p>
                  <span className='font-semibold'>Exercise 6: </span> How many
                  six-digit integers whose first digit is not 0 do not include
                  the digit 0 or the digit 5?
                </p>
                <Textarea
                  readOnly
                  className='mt-5 '
                  value={`The possible choices for the first digit are: 1, 2, 3, 4.`}
                />
                <div className='mt-5'>
                  <div className='font-semibold text-lg'>
                    StudyPal's Response:
                  </div>
                  <p>
                    Your range for the first digit is too limited. Remember, the
                    first digit can be any digit from 1 to 9, excluding 5, so
                    there are more than just 4 choices.
                  </p>
                </div>
              </div>
              <div className=' flex items-center gap-x-2 mt-5'>
                <div className='rounded-md flex items-center gap-2 bg-white p-2 w-1/2'>
                  <Button variant='outline' size='icon'>
                    <CircleUserRound color='green' />
                  </Button>
                  <Button className='ml-2 hover:bg-green-400 bg-green-500 font-semibold'>
                    Send
                  </Button>
                </div>
                <div className='rounded-md flex items-center bg-white p-2 w-full'>
                  <Input
                    readOnly
                    placeholder='Your Question'
                    value={'Is this correct?'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <div className='w-[75%] flex justify-center gap-x-10 mt-10'>
          <Card name='John Doe' review='Great service' rating={4} />
          <Card name='Jane Doe' review='Good service' rating={3} />
          <Card name='Bob Doe' review='Decent service' rating={3} />
          <Card name='Alice Doe' review='Fantastic service' rating={5} />
          <Card name='Charlie Doe' review='Good service' rating={3} />
        </div>
      </div>
    </main>
  );
}
