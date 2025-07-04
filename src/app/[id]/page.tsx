'use client';

import { InputFile } from '@/components/ui/input-file';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import ExerciseTab from '@/components/ui/exercises-tab/exercise-tab';

import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import { createClient } from '../../../utils/supabase/client';
import { useAppContext } from '@/context';
import dummyData from '@/dummy-data/pdf-example.json';
import { Button } from '@/components/ui/button';

// Error comes from pdfjs. When you find time fix it.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function StudyPage() {
  const [doc, setDoc] = useState<File | null>(null);

  const [numPagesArr, setNumPagesArr] = useState<number[]>([0]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [progress, setProgress] = useState<number | null>(null);
  const [progressText, setProgressText] = useState<string>('Loading...');
  const {
    userPrompt,
    setSendLoading,
    setHintLoading,
    setStepsLoading,
    setVideoLoading,
  } = useAppContext();

  const [exerciseData, setExerciseData] = useState<any>(null);
  const [lastFocusedExercise, setLastFocusedExercise] = useState<any>(null);
  // Type for all the openai response arrays
  type ArrObj = {
    data: string[];
    name: string;
  };
  const [hint, setHint] = useState<ArrObj[]>([]);
  const [aiChat, setAiChat] = useState<ArrObj[]>([]);
  const [stepsArr, setStepsArr] = useState<ArrObj[]>([]);
  const [videoArr, setVideoArr] = useState<ArrObj[]>([]);

  const supabase = createClient();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    let tmpArr: number[] = [];
    for (let i = 1; i <= numPages; i++) {
      tmpArr.push(i);
    }
    setNumPagesArr(tmpArr);
    setPageNumber(1);
  }

  const handlePDF = async (content: string) => {
    setProgressText('AI is thinking, this may take a while...');
    setProgress(50);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (doc === null || !user) return;
    try {
      if (content) {
        const res = await fetch('/api/text-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request: 'initial',
            message: content,
          }),
        });
        setProgressText('Tiding things up...');
        setProgress(60);
        const data = await res.json();
        const jsonData = JSON.parse(data.content);
        console.log('OpenAi response', jsonData);
        if (exerciseData === null) {
          setExerciseData(jsonData.exercises);
        } else {
          let finalData = exerciseData;
          finalData.push(...jsonData.exercises);
          setExerciseData(finalData);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error handling PDF');
    }
    setProgress(100);
    setProgress(null);
  };

  const getPageContent = async (pageNumber: number) => {
    if (doc) {
      setProgressText('Extracting text from PDF...');
      setProgress(20);
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const page = await pdf.getPage(pageNumber);
        const textContentObj = await page.getTextContent();
        const pageText = textContentObj.items
          .map((item) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        const textContent = pageText + '\n\n';
        console.log(textContent);
        setProgress(40);
        await handlePDF(textContent);
      };

      fileReader.readAsArrayBuffer(doc);
    }
  };

  const handleHint = async () => {
    setHintLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;
    console.log('entered handlehint');
    try {
      if (lastFocusedExercise) {
        const res = await fetch('/api/text-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request: 'hint',
            message: lastFocusedExercise.question,
          }),
        });
        const data = await res.json();
        console.log('OpenAi response', data);
        setHint((prevHint: ArrObj[]) => [
          ...prevHint,
          { data, name: lastFocusedExercise.exercise_name },
        ]);
      }
    } catch (error) {
      console.error(error);
      alert('Error handling hint');
    }
    setHintLoading(false);
  };

  const handleUserPrompt = async (userPrompt: string) => {
    setSendLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(
      userPrompt +
        '\n\n' +
        'refering to this exercise: ' +
        lastFocusedExercise.question
    );
    if (!user || !userPrompt) return;
    try {
      if (lastFocusedExercise) {
        const res = await fetch('/api/text-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request: 'user_prompt',
            message:
              userPrompt +
              '\n\n' +
              'refering to this exercise: ' +
              lastFocusedExercise.question,
          }),
        });
        const data = await res.json();
        console.log('OpenAi response', data);
        setAiChat((prevAiChat: ArrObj[]) => [
          ...prevAiChat,
          { data, name: lastFocusedExercise.exercise_name },
        ]);
      }
    } catch (error) {
      console.error(error);
      alert('Error handling user prompt');
    }
    setSendLoading(false);
  };

  const handleSteps = async () => {
    setStepsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(
      user +
        '\n\n' +
        'refering to this exercise: ' +
        lastFocusedExercise.question
    );
    if (!user || !lastFocusedExercise) return;
    try {
      if (lastFocusedExercise) {
        const res = await fetch('/api/text-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request: 'steps',
            message: lastFocusedExercise.question,
          }),
        });
        const data = await res.json();
        console.log('OpenAi response', data);
        const jsonData = JSON.parse(data);
        setStepsArr((prevStepsArr: any[]) => [
          ...prevStepsArr,
          { data: jsonData.steps, name: lastFocusedExercise.exercise_name },
        ]);
      }
    } catch (error) {
      console.error(error);
      alert('Error handling user prompt');
    }
    setStepsLoading(false);
  };

  const handleVideoGeneration = async () => {
    setVideoLoading(true);
    const res = await fetch('/api/video-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastFocusedExercise,
      }),
    });
    const data = await res.json();
    console.log('shotstack response', data);
    if (data) {
      setVideoArr((prevVideoArr: any[]) => [
        ...prevVideoArr,
        { data: data.data, name: data.name },
      ]);
    }
    setVideoLoading(false);
  };

  useEffect(() => {
    getPageContent(1);
    console.log(exerciseData);
  }, [doc]);

  useEffect(() => {
    if (userPrompt === '' || !lastFocusedExercise) return;
    handleUserPrompt(userPrompt);
  }, [userPrompt]);
  useEffect(() => {
    // console.log(dummyData.exercises);
    setExerciseData(dummyData.exercises);
  }, []);

  return (
    <main className='flex h-full min-h-screen'>
      <div className=' min-w-[15vw] min-h-screen basis-1/2 bg-[white] p-10 '>
        <div className='mb-10'>
          <InputFile
            onData={async (file) => {
              setDoc(file);
              console.log(file);
            }}
          />
          {pageNumber > 0 && (
            <Button
              className='hover:bg-green-400 bg-green-500 font-semibold'
              onClick={() => getPageContent(pageNumber)}
            >
              Get Page {pageNumber}
            </Button>
          )}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className='cursor-pointer'
                onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}
              />
            </PaginationItem>
            {numPagesArr.map((num) => {
              if (num - pageNumber <= 3 && num - pageNumber >= -3) {
                return (
                  <PaginationItem key={num}>
                    <PaginationLink
                      onClick={() => setPageNumber(num)}
                      isActive={num === pageNumber}
                      className={
                        'cursor-pointer rounded-md border-2 border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      }
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            })}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className='cursor-pointer'
                onClick={() =>
                  pageNumber < numPagesArr.length &&
                  setPageNumber(pageNumber + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {doc && (
          <div className='mt-10 h-screen flex justify-center'>
            <Document file={doc} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center  min-w-[25vw] basis-1/2 p-10  bg-[whitesmoke]'>
        {exerciseData && progress === null
          ? exerciseData.map((exercise: any, index: number) => {
              return (
                <ExerciseTab
                  exercise={exercise}
                  hintArr={hint}
                  aiChat={aiChat}
                  stepsArr={stepsArr}
                  onSteps={handleSteps}
                  onExerciseFocus={setLastFocusedExercise}
                  onHint={handleHint}
                  key={index}
                  onVideoGeneration={handleVideoGeneration}
                  videoArr={videoArr}
                />
              );
            })
          : progress !== null && (
              <div className='flex flex-col justify-center w-full items-center h-[90vh]'>
                <Progress className='h-[2vh]' value={progress} />
                <div className='mt-10 font-semibold text-2xl'>
                  {progressText}
                </div>
              </div>
            )}
      </div>
    </main>
  );
}
