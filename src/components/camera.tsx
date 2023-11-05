import  * as devices from '@solid-primitives/devices';
import { createEffect, createSignal, onMount, Show } from 'solid-js';
import { selected } from '~/stores/selected';

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

   const [correct, setCorrect] = createSignal(undefined as undefined|boolean);
   const [alternative, setAlternative] = createSignal(undefined as undefined|string);
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
              body: JSON.stringify({img: data, id: selected?.id}),
            }).then((res)=>res.json()).then((res)=>{
              if(res.id.score < 0.3){
                setCorrect(true)
              }else{
                setCorrect(false)
                setAlternative(res.highest.item.id)
              }
              console.log(res)

            });
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
        <Show when={correct() == true}>
        <div class="absolute z-50 w-screen h-screen top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-gray-700/50 flex items-center justify-center">
          <div class=" rounded-sm p-4 pb-0 bg-white max-w-[80vw] md:max-w-[40vw] text-center">
            <h1 class="text-lg font-bold">Looks Right to US</h1>
            <p>Based on our analysis, we have a high confidence this is the right pill. In training, our AI showed <b>95.4%</b> accuracy in identifying the correct pills</p>
            <br/>
            <p class="text-gray-500">But don't take our word for it. Please confirm with a medical professional before taking. We do make mistakes; I'm just an AI some college kids trained in a couple of hours instead of sleeping.</p>
            <br/>
            <button class="text-blue-700 border-t border-t-blue-100 w-full py-3 focus:bg-gray-200" onClick={()=>{
              setCorrect(undefined)
              setAlternative(undefined)
            }}>
              OK
            </button>
          </div>
          </div>          </Show>
          <Show when={correct() == false}>
            <div class="absolute z-50 w-screen h-screen top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-gray-700/50 flex items-center justify-center">
          <div class=" rounded-sm p-4 pb-0 bg-white max-w-[80vw] md:max-w-[40vw] text-center">
            <h1 class="text-lg font-bold">Something doesn't look right</h1>
            <p>You should double check with a medical professional to confirm this is the pill you want.</p>
            <br/>
            <p class="text-gray-500">We do make mistakes; I'm just an AI some college kids trained overnight instead of sleeping.</p>
            <br/>

            <p>Our model actually thought this pill was #{globalThis.data.find((v)=>v.id ==alternative())?.name} </p>
            <br/>
            <button class="text-blue-700 border-t border-t-blue-100 w-full py-3 focus:bg-gray-200" onClick={()=>{
              setCorrect(undefined)
              setAlternative(undefined)
            }}>
              OK
            </button>
          </div>
            </div>
            </Show>
        </>
        
    )

}