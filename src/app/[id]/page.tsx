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

import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import Keyboard from '@/components/ui/mathkeyboard/keyboard';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function StudyPage() {
  const [doc, setDoc] = useState<File | null>(null);

  const [numPagesArr, setNumPagesArr] = useState<number[]>([0]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [text, setText] = useState<string>('');

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    let tmpArr: number[] = [];
    for (let i = 1; i <= numPages; i++) {
      tmpArr.push(i);
    }
    setNumPagesArr(tmpArr);
    setPageNumber(1);
  }

  return (
    <main className='flex h-full min-h-screen'>
      <div className=' min-w-[15vw] min-h-screen basis-1/2 bg-[white] p-10 '>
        <div className='mb-10'>
          <InputFile onData={(file) => setDoc(file)} />
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
      <div className='flex justify-center min-w-[25vw] basis-1/2 p-10 min-h-screen bg-[whitesmoke]'>
        <Textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          className='w-4/5 '
        />
      </div>
      <div className='fixed right-10 top-10'>
        <Popover>
          <PopoverTrigger>
            <Button>Math</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Keyboard onKeyPress={(key) => setText(text + key)} />
          </PopoverContent>
        </Popover>
      </div>
    </main>
  );
}
