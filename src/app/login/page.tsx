'use client';

import { login, signup } from './actions';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

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

    return <Button formAction={action}>{text}</Button>;
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
    <main
      className='flex justify-center items-center'
      style={{ height: '100vh' }}
    >
      <div className='rounded shadow-md w-[90%] h-1/3 md:w-1/2 flex items-center p-4'>
        <form className='mx-10 w-full'>
          <Input type='email' name='email' placeholder='Enter your email' />
          <br />
          <Input
            type='password'
            name='password'
            placeholder='Enter your password'
          />
          <br />

          <div className='flex justify-between items-center w-44'>
            <Suspense>
              <SignUpComponent text='Sign In' action={login} />
            </Suspense>
            <Suspense>
              <SignUpComponent text='Sign Up' action={signup} />
            </Suspense>
          </div>
          <div className='mt-3 mb-3'>
            <a href='/support/forgot-password'>
              <u className=' text-blue-500'>Forgot Password?</u>
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
