'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientNavbar() {
  const pathname = usePathname();
  
  // Nascondi la navbar normale sulle route admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Navbar />;
}
