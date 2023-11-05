import  * as devices from '@solid-primitives/devices';
import { createEffect, createSignal, onMount, Show } from 'solid-js';

async function requestMediaAccess(): Promise<MediaStream|undefined> {
    console.info("request media access permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({

        video: true
      });
      console.info("media connected successfully.");
      return stream
    //   setst("currentStream", stream);
  }catch(e){
        console.error("media connection failed.", e);
    
  }
}
export const Camera = () => {
   let video: HTMLVideoElement;
    const [stream, setStream] = createSignal<MediaStream|undefined>(undefined)
        onMount(async()=>{
          const _stream = await requestMediaAccess()
          if (!_stream){
            alert("Please reload and allow camera access.")
          }
          setStream(_stream)
        })

    createEffect(()=>{
        if (stream()?.active){
            video.srcObject = stream() ??null
            video.play()
        }
    })
    return (
        <>
        <Show when={stream()?.active}>
        <video ref={video!} class="w-full h-full absolute z-0 object-cover">
        </video>
        <button class="absolute bottom-8 border-white rounded-full border-[3px] h-12 w-12 translate-x-[50vw] -mx-6 focus:border-blue-200 bg-blue-100/20" onClick={(el)=>{
          
            // (el.target as unknown as HTMLElement).blur()
            // // freeze camera
            // const tracks = stream()?.getTracks();
            // tracks?.forEach(function(track) {
            //   track.stop();
            // });
            // take photo
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);
            const data = canvas.toDataURL('image/jpeg');
            // save photo
            fetch("/search", {
              method: "POST",
              body: JSON.stringify({img: data}),
            })
        }}>

        </button>
        </Show>
        <Show when={stream()?.active != true}>
        <div class="flex justify-center items-center w-full h-full">
        <button class="bg-black text-white p-4 rounded-md" onClick={async()=>{
            const _stream = await requestMediaAccess()
            if (!_stream){
              alert("Please reload and allow camera access.")
            }
            setStream(_stream)
            }
        }>
        Connect Camera
        </button>

            </div>
        </Show>
        </>
    )

}