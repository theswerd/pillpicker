import { APIEvent, json } from "solid-start";
import client from "~/lib/client";



export async function POST(req:APIEvent) {
const rJson = await req.request.json();
  const feature = await fetch("http://0.0.0.0:6969", {
    method: "POST",
    body: JSON.stringify({
      img: rJson.img
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  })
  const features = await feature.json()

 const res= await  fetch("http://127.0.0.1:8000", {
    method: "POST",
    body: JSON.stringify({
      "feature": features,
      "id":rJson.id
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  })
 const jdata = await res.json()
 console.log("RESPONDING", jdata)
  return json(jdata)
}
