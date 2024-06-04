'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center">
        <Link href="/">
          <Image 
            src="https://assets-global.website-files.com/616420dbe602629eea6b0824/64646f7e69b0d805c01afb00_Group%205701.svg" 
            alt="Logo" 
            width={82} 
            height={160} 
            className="mr-2" 
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/challenges" className={pathname === '/challenges' ? 'text-purple-600 font-medium' : 'text-gray-600'}>
          Challenges
        </Link>
        <Link href="/lessons" className={pathname === '/lessons' ? 'text-purple-600 font-medium' : 'text-gray-600'}>
          Lessons
        </Link>
      </div>
    </div>
  );
}
