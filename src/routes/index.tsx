import { createEffect, Show } from "solid-js";
import { Title } from "solid-start";
import { Camera } from "~/components/camera";
import { ListOverlay } from "~/components/overlay-list";
import { SelectedOverlay } from "~/components/overlay-selected";
import { selected } from "~/stores/selected";
export default function Home() {
  createEffect(()=>{
    console.log(selected)
  })
  return (
    <div class="bg-black w-full h-full top-0 absolute">
      <Camera />
      <Show when={selected?.name== undefined}>
       
        <ListOverlay />
      </Show>
      <Show when={selected?.name != undefined}>
          <SelectedOverlay/>
        </Show>
    </div>
  );
}
