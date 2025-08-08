import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePDFStore = create(persist((set) => ({
  pdfFiles: [],
  addPDFFile: (file) => set((state) => ({ pdfFiles: [...state.pdfFiles,file]})),
  deletePDFFile: (name) => set((state) => ({ pdfFiles: state.pdfFiles.filter((e,i) => e.name !== name)})),
  deleteAllFiles: () => set(() => ({pdfFiles: []}))
}),{
  name: 'food-storage', // name of the item in the storage (must be unique)
  storage: createJSONStorage(() => sessionStorage)
}))

export const useDataStore = create((set) => ({
  data: [],
  addData: (file) => set((state) => ({ data: [...state.data,file]})),
}))
