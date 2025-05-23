'use client';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import { Session } from 'next-auth';
import { TbLogout2 } from 'react-icons/tb';
import { signOut } from 'next-auth/react';

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" width={40} height={40} alt="Logo" />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light-100'
            )}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/library"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light-100'
            )}
          >
            Search
          </Link>
        </li>
        <li>
          <div>
            <Avatar>
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || 'IN')}
              </AvatarFallback>
            </Avatar>
          </div>
        </li>
        <li>
          <TbLogout2
            size={24}
            className="text-red-600 cursor-pointer"
            onClick={() => signOut()}
          />
        </li>
      </ul>
    </header>
  );
};

export default Header;
