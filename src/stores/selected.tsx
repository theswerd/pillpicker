import { createStore, SetStoreFunction } from "solid-js/store";

export const [selected, setSelected] = createStore(undefined as  {
    name: string;
    images: string[];
    id: string;
  }|undefined) as [
    {
        name: string;
        images: string[];
        id: string;
      }|undefined, SetStoreFunction<object>]