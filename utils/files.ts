'use client'
export const createFilePath = (file: File | string) => {
  if (typeof File !== 'undefined' && file instanceof File) return URL.createObjectURL(file)
  return file as string
}
