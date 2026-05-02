"use client";
import React, { createContext, useContext, ReactNode } from 'react';

export interface CategoryContextValue {
  categoryId: string;
  brandName: string;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(undefined);

/**
 * Server-rendered layout passes only serializable scalars (categoryId, brandName).
 * Client components derive anything else via categoryRegistry[categoryId].
 */
export function CategoryProvider({
  children,
  categoryId,
  brandName,
}: {
  children: ReactNode;
  categoryId: string;
  brandName: string;
}) {
  return (
    <CategoryContext.Provider value={{ categoryId, brandName }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext(): CategoryContextValue {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategoryContext must be used within CategoryProvider');
  return ctx;
}
