'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Button } from '../button';
import { createClient } from '../../../../utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const authenticate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <nav className='flex items-center justify-between 5'>
      <div className=' font-semibold text-2xl'>StudyPal</div>

      <NavigationMenu className='text-base'>
        <NavigationMenuList className='flex gap-x-5'>
          <NavigationMenuLink className='cursor-pointer'>
            Product
          </NavigationMenuLink>
          <NavigationMenuLink className='cursor-pointer'>
            Customers
          </NavigationMenuLink>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='text-base'>
              FAQ.
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[35vh] w-full'>
              <NavigationMenuLink>Link safasf</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuLink className='cursor-pointer'>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        {user ? (
          <Button
            onClick={async (e: any) => {
              e.preventDefault();
              const { error } = await supabase.auth.signOut();
              if (error)
                return console.log('Error logging out:', error.message);
              setUser(null);
            }}
            variant={'link'}
            className='text-base'
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => router.push('/login')}
            variant={'link'}
            className='text-base'
          >
            Sign Up
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
