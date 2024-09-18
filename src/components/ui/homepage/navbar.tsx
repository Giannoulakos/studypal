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

const Navbar = () => {
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
    </nav>
  );
};

export default Navbar;
