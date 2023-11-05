import { JSX } from "solid-js/jsx-runtime";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";

import { HiOutlineMagnifyingGlass } from "solid-icons/hi";
import { selected, setSelected } from "~/stores/selected";
// import {pills} from '../data/pills';
export function ListOverlay(): JSX.Element {
  const fetch_data = (): Promise<
    {
      name: string;
      images: string[];
      id: string;
    }[]
  > => {
    const json = fetch("public/medium.json").then((res) => {
      return res.json();
    });
    return json;
  };
  const [loaded, setLoaded] = createSignal(false);
  const [data, setData] = createSignal<
    {
      name: string;
      images: string[];
      id: string;
    }[]
  >([]);
  const [search, setSearch] = createSignal("");
  onMount(async () => {
    const temp = await fetch_data();
    console.log("TEMP", temp);
    setData(temp);
    setLoaded(true);
  });
  createEffect(()=>{
    globalThis.data = data()
  })
  //data().filter((item)=>{
  //   item.name.toLowerCase().includes(search().toLowerCase()) ||search().trim() == ''
  // }).slice(0,1000)
  const [searchResults, setSearchResults] = createSignal(
    [] as {
      name: string;
      images: string[];
      id: string;
    }[]
  );
  createEffect(() => {
    const results = data().filter((item) =>
      item.name.toLowerCase().includes(search().toLowerCase()) ||
      item.id.startsWith(search())
    );
    setSearchResults(results);
  });
  return (
    <div class="absolute top-0 w-screen h-screen backdrop-blur-sm">
      <div class="absolute bg-white h-full mt-20 rounded-t-[3rem] w-full">
        <h1 class="h-[3rem] text-center flex justify-center items-center text-lg sticky top-0">
          <div class="mt-2 relative w-full mx-[2rem] h-[2.5rem] ">
            <div class="absolute top-[0.65rem] left-2">
              <HiOutlineMagnifyingGlass />
            </div>
            <input
              class="bg-gray-200 w-full rounded-full p-2 h-full hover:outline-none pl-7 pb-3"
              onInput={(e) => {
                setSearch(e.currentTarget.value);
              }}
            />
            <div class="overflow-y-scroll">
              <Show when={!loaded}>Loading...</Show>
              <Show when={loaded() && data().length == 0}>No results</Show>
              <Show when={loaded() && data().length > 0}>
                <div class="w-full text-start mt-2 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <For each={searchResults()}>
                    {(pill) => (
                      <div class="p-2 border-b-[1px] flex items-start hover:bg-gray-100 transition-colors" onClick={()=>{
                        setSelected(pill)
                      }}>
                        <div class="bg-gray-200 mr-2">
                          <img
                            class="aspect-square h-12"
                            src={
                              "https://data.lhncbc.nlm.nih.gov/public/Pills/" +
                              pill.images[0]
                            }
                          />
                        </div>
                        <div class="flex flex-col">
                          <span class="font-bold">{pill.name}</span>
                          <span class="text-gray-400">#{pill.id}</span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </h1>
      </div>
    </div>
  );
}
