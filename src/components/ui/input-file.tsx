'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface FileData {
  onData: (file: File) => void;
}

const InputFile: React.FC<FileData> = ({ onData }) => {
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='picture' className='text-xl font-semibold'>
        Select Homework File
      </Label>
      <Input
        id='picture'
        type='file'
        onChange={(e: any) => onData(e.target.files[0])}
        accept='.pdf'
      />
    </div>
  );
};

export { InputFile };
