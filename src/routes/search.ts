import { APIEvent, json } from "solid-start";
import client from "~/lib/client";



export async function POST(req:APIEvent) {

  const feature = await fetch("http://0.0.0.0:6969", {
    method: "POST",
    body: JSON.stringify({
      img: (await req.request.json()).img
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  })
  const features = await feature.json()

 const res= await  fetch("http://127.0.0.1:8000", {
    method: "POST",
    body: JSON.stringify({
      "feature": features
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  })
 const jdata = await res.json()
 console.log("OUT", jdata.item.id, jdata.score)
  return json(jdata)
}
