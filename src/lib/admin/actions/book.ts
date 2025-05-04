'use server';

import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { BookParams } from '@/types';

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.error('Error creating book:', error);
    return {
      success: false,
      message: 'Failed to create book',
    };
  }
};
