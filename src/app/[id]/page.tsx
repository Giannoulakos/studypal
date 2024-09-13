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
            message: content,
          }),
        });
        const data = await res.json();
        console.log('OpenAi response', data);
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

  useEffect(() => {
    getPageContent(1);
  }, [doc]);

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
                        'rounded-md border-2 border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
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
      <div className='flex justify-center min-w-[25vw] basis-1/2 p-10  bg-[whitesmoke]'>
        <Accordion className='w-full mt-10' type='single' collapsible>
          <AccordionItem className='w-full' value='item-1'>
            <AccordionTrigger className='w-full text-xl font-semibold'>
              Exercise 1
            </AccordionTrigger>
            <AccordionContent className=' p-2'>
              <Textarea
                onChange={(e) => setText(e.target.value)}
                value={text}
                className='w-full min-h-[30vh] h-full '
              />
              <br />
              <Assistant />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
