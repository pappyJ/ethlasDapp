'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from 'formik';
import { ReactNode } from 'react';

interface Props {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  props?: any;
  icon?: ReactNode | any;
  labelColor?: string;
  rows?: number;
  cols?: number;
  onChange?: (event: any) => void;
}

export default function InputField({
  label,
  name,
  placeholder,
  ...props
}: Props) {
  return (
    <div className='grid w-full items-center gap-1.5'>
      <Label htmlFor={name}>{label}</Label>
      <Input type='text' id={name} placeholder={placeholder} {...props} />
      <ErrorMessage component='p' name={name} className='error' />
    </div>
  );
}
