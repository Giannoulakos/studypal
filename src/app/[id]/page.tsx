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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ExerciseTab from '@/components/ui/exercises-tab/exercise-tab';

import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import Keyboard from '@/components/ui/mathkeyboard/keyboard';
import { createClient } from '../../../utils/supabase/client';
import { useAppContext } from '@/context';
import dummyData from '@/dummy-data/pdf-example.json';

// Error comes from pdfjs. When you find time fix it.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function StudyPage() {
  const [doc, setDoc] = useState<File | null>(null);

  const [numPagesArr, setNumPagesArr] = useState<number[]>([0]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [text, setText] = useState<string>('');
  const { userPrompt, setSendLoading, setHintLoading } = useAppContext();

  const [exerciseData, setExerciseData] = useState<any>(null);
  const [lastFocusedExercise, setLastFocusedExercise] = useState<any>(null);
  const [hint, setHint] = useState<any>([]);
  const [aiChat, setAiChat] = useState<any[]>([]);

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
        const data = await res.json();
        const finalData = JSON.parse(data.content);
        console.log('OpenAi response', finalData);
        setExerciseData(finalData.exercises);
      }
    } catch (error) {
      console.error(error);
      alert('Error handling PDF');
    }
  };

  const getPageContent = async (pageNumber: number) => {
    if (doc) {
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
        setHint((prevHint: any) => [
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
        setAiChat((prevAiChat: string[]) => [
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

  useEffect(() => {
    getPageContent(1);
    console.log(exerciseData);
  }, [doc]);
  useEffect(() => {
    if (userPrompt === '' || !lastFocusedExercise) return;
    handleUserPrompt(userPrompt);
  }, [userPrompt]);
  useEffect(() => {
    //console.log(dummyData.exercises);
    //setExerciseData(dummyData.exercises);
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
        {exerciseData &&
          exerciseData.map((exercise: any, index: number) => {
            return (
              <ExerciseTab
                exercise={exercise}
                hintArr={hint}
                aiChat={aiChat}
                onExerciseFocus={setLastFocusedExercise}
                onHint={handleHint}
                key={index}
              />
            );
          })}
      </div>
      <div className='fixed right-10 top-10'>
        <Popover>
          <PopoverTrigger className='bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-md'>
            Math
          </PopoverTrigger>

          <PopoverContent>
            <Keyboard onKeyPress={(key) => setText(text + key)} />
          </PopoverContent>
        </Popover>
      </div>
    </main>
  );
}
