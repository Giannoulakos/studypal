'use client';

import { InputFile } from '@/components/ui/input-file';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import Keyboard from '@/components/ui/mathkeyboard/keyboard';
import { createClient } from '../../../utils/supabase/client';
import { Assistant } from '@/components/ui/assistant/assistant';
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
  const [userIsWriting, setUserIsWriting] = useState<boolean>(false);

  const [exerciseData, setExerciseData] = useState<any>(null);
  const [lastFocusedExercise, setLastFocusedExercise] = useState<string | null>(
    null
  );
  const [hint, setHint] = useState<string[]>([]);

  const supabase = createClient();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    let tmpArr: number[] = [];
    for (let i = 1; i <= numPages; i++) {
      tmpArr.push(i);
    }
    setNumPagesArr(tmpArr);
    setPageNumber(1);
  }

  const handleFileUpload = async (content: string) => {
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
        console.log('OpenAi response', data);
        setExerciseData(data.exercises);
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
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
        await handleFileUpload(textContent);
      };

      fileReader.readAsArrayBuffer(doc);
    }
  };

  const handleHint = async () => {
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
            message: lastFocusedExercise,
          }),
        });
        const data = await res.json();
        console.log('OpenAi response', data);
        setHint((prevHint) => [...prevHint, data]);
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  useEffect(() => {
    // getPageContent(1);
    console.log(exerciseData);
  }, [doc]);
  useEffect(() => {
    console.log(dummyData.exercises);
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
              <Accordion
                key={index}
                className='w-full mt-10'
                type='single'
                onFocus={() => {
                  setLastFocusedExercise(exercise.question);
                  console.log(lastFocusedExercise);
                }}
                collapsible
              >
                <AccordionItem className='w-full' value='item-1'>
                  <AccordionTrigger className='w-full text-xl font-semibold'>
                    {exercise.exercise_name}
                  </AccordionTrigger>
                  <AccordionContent className=' p-2'>
                    <div className='grid grid-cols-1 gap-y-4'>
                      <div>
                        <p className='font-semibold text-lg'>
                          Points: {exercise.points}
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-lg'>
                          What you need to know:
                        </p>
                        <p>{exercise.study_before_solving}</p>
                      </div>
                      <div>
                        <p className='font-semibold text-lg'>Question:</p>
                        <p>{exercise.question}</p>
                      </div>
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
                    {hint.length > 0 && (
                      <>
                        <div>
                          <p className='font-semibold text-lg'>
                            StudyPal Response:
                          </p>
                          <p>{hint}</p>
                        </div>
                        <br />
                      </>
                    )}
                    <Assistant isWriting={userIsWriting} onHint={handleHint} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
