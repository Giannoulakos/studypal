'use client';

import { login, signup } from './actions';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';

export default function Login() {
  const router = useRouter();

  const supabase = createClient();
  const SignUpComponent = ({ text, action }: { text: string; action: any }) => {
    const searchParams = useSearchParams();
    const [isInformed, setIsInformed] = useState(false);

    const handleAction = async () => {
      if (searchParams.has('success')) {
        const success = searchParams.get('success') == 'true';

        if (success == true) {
          //show success message
          const msg = searchParams.get('msg');
          alert(msg ? msg : 'Please check your email for verification');
        } else {
          //show error message
          const msg = searchParams.get('msg');
          alert(msg ? msg : 'Something went wrong');
        }
      }
    };

    useEffect(() => {
      if (!isInformed) {
        handleAction();
        setIsInformed(true);
      }
    }, [searchParams]);

    return (
      <Button
        formAction={action}
        className='hover:bg-green-400 bg-green-500 font-semibold w-full'
      >
        {text}
      </Button>
    );
  };

  const authenticate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      alert(
        "You're logged in with the email: " +
          user.email +
          '\nIf you want to log out, click the logout button'
      );
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <form className='flex justify-center items-center h-screen bg-green-50'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              placeholder='m@example.com'
              name='email'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' required />
          </div>
        </CardContent>
        <CardFooter className='flex justify-between gap-x-10'>
          <Suspense>
            <SignUpComponent text='Sign In' action={login} />
          </Suspense>
          <Suspense>
            <SignUpComponent text='Sign Up' action={signup} />
          </Suspense>
        </CardFooter>
      </Card>
    </form>
  );
}
