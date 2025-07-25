'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Keyboard from '@/components/ui/mathkeyboard/keyboard';
import { Button } from '../button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../textarea';
import { useState } from 'react';
import { Assistant } from '../assistant/assistant';
import { useAppContext } from '@/context';
import { on } from 'events';

interface ExerciseTabProps {
  exercise: any;
  hintArr: any;
  aiChat: any;
  stepsArr: any;
  videoArr: any;
  onExerciseFocus: any;
  onHint: any;
  onSteps: any;
  onVideoGeneration: any;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  hintArr,
  aiChat,
  stepsArr,
  onExerciseFocus,
  onHint,
  onSteps,
  onVideoGeneration,
  videoArr,
}) => {
  const [text, setText] = useState<string>('');
  const [userIsWriting, setUserIsWriting] = useState<boolean>(false);

  const { stepsLoading, videoLoading } = useAppContext();
  return (
    <>
      <Accordion
        className='w-full mt-10'
        type='single'
        onFocus={() => {
          onExerciseFocus(exercise);
          console.log(exercise);
        }}
        collapsible
      >
        <AccordionItem className='w-full' value='item-1'>
          <AccordionTrigger className='w-full text-xl font-semibold'>
            {exercise.exercise_name}
          </AccordionTrigger>
          <AccordionContent className=' p-2'>
            <div className='flex justify-end'>
              <Popover>
                <PopoverTrigger className='bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-md'>
                  Math
                </PopoverTrigger>

                <PopoverContent>
                  <Keyboard onKeyPress={(key) => setText(text + key)} />
                </PopoverContent>
              </Popover>
            </div>
            <div className='grid grid-cols-1 gap-y-4'>
              <div>
                <p className='font-semibold text-lg'>
                  Points: {exercise.points}
                </p>
              </div>
              <div>
                <p className='font-semibold text-lg'>What you need to know:</p>
                {exercise.study_before_solving.map(
                  (topic: any, index: number) => {
                    return (
                      <p key={index}>
                        <span className='font-semibold'>{index + 1}.</span>{' '}
                        {topic.name}: {topic.explanation + topic.example}
                      </p>
                    );
                  }
                )}
              </div>
              <div>
                <p className='font-semibold text-lg'>Question:</p>
                <p>{exercise.question}</p>
              </div>
              {stepsArr.length > 0 &&
                stepsArr.map((el: any, elIndex: number) => {
                  if (el.name == exercise.exercise_name) {
                    return (
                      <div key={elIndex}>
                        <p className='font-semibold text-lg'>Steps:</p>
                        {stepsArr[elIndex].data.map(
                          (step: any, index: number) => {
                            return (
                              <p key={index}>
                                <span className='font-semibold'>
                                  {index + 1}.
                                </span>{' '}
                                {step}
                              </p>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                })}
              <div className='flex gap-x-2 mt-5'>
                {videoLoading ? (
                  <Button disabled>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    This may take a while... Please wait
                  </Button>
                ) : (
                  <Button
                    onClick={onVideoGeneration}
                    className='hover:bg-green-400 bg-green-500 font-semibold'
                  >
                    Generate Video Explanation
                  </Button>
                )}
                {stepsLoading ? (
                  <Button disabled>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    onClick={onSteps}
                    className='hover:bg-green-400 bg-green-500 font-semibold'
                  >
                    Show Steps
                  </Button>
                )}
              </div>
              {videoArr.length > 0 &&
                videoArr.map((video: any, index: number) => {
                  if (video.name == exercise.exercise_name) {
                    return (
                      <div key={index}>
                        <video
                          src={video.data}
                          controls
                          className='rounded-md mt-10'
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  }
                })}
            </div>
            <br />
            <Textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              className='w-full min-h-[30vh] h-full '
              onFocus={() => setUserIsWriting(true)}
              onBlur={() => setUserIsWriting(false)}
            />
            <br />
            <div className='flex flex-col gap-y-2'>
              {hintArr.length > 0 && (
                <p className='font-semibold text-lg'>StudyPal Response:</p>
              )}
              {hintArr.length > 0 &&
                hintArr.map((hint: any, index: number) => {
                  if (hint.name == exercise.exercise_name) {
                    return (
                      <div key={index}>
                        <p>{hint.data}</p>
                      </div>
                    );
                  }
                })}
            </div>
            <br />
            <div className='flex flex-col gap-y-2'>
              {aiChat.length > 0 && (
                <p className='font-semibold text-lg'>StudyPal Chat:</p>
              )}
              {aiChat.length > 0 &&
                aiChat.map((chat: any, index: number) => {
                  if (chat.name == exercise.exercise_name) {
                    return (
                      <div key={index}>
                        <p>
                          <span className='font-semibold'>{index + 1}.</span>{' '}
                          {chat.data}
                        </p>
                      </div>
                    );
                  }
                })}
            </div>

            <br />
            <Assistant isWriting={userIsWriting} onHint={onHint} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ExerciseTab;
