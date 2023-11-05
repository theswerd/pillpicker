import { selected, setSelected } from "~/stores/selected";
import { VsClose } from 'solid-icons/vs'
export const SelectedOverlay = ()=>{
    if(selected?.name == undefined){}else{
    return (
        <div class="absolute top-8 items-center flex justify-center w-full">
        <div class="rounded-full bg-white max-w-[80vw] md:max-w-[50vw]  h-14 flex p-1 pr-2  justify-between">
            <img src={"https://data.lhncbc.nlm.nih.gov/public/Pills/" +selected?.images[0]} class="rounded-full aspect-square mr-2 max-w-[3rem]"/>
            <div class="flex flex-col">

                <span class="font-bold truncate">
                {selected?.name}
                </span>
                <span class="text-sm text-gray-600">
                    #{selected?.id}
                </span>
            </div>
            <button class="ml-2" onClick={()=>{
                setSelected("name", undefined)
            }}>
                <VsClose class="text-3xl text-gray-400 hover:text-gray-500"/>
            </button>
        </div>
        </div>
      );
    }
}