'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-400">
          Welcome to the Admin Dashboard
        </h1>
        <p className="mt-2 text-base text-slate-600">
          From here, you can manage your university library. Right now, you can
          create a new book entry to make it available to students.
        </p>
      </div>

      <div>
        <Link href="/admin/books/new">
          <Button className="bg-primary-admin text-white hover:bg-opacity-80">
            Create New Book
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
