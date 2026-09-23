'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      router.replace(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      router.replace('/products');
    }
  }, [router, searchParams]);

  return null;
}
