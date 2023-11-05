import { SchemaFieldTypes,  } from "redis";
import { APIEvent, json } from "solid-start";
import json_text from "~/extract-350-features-final.json?raw";
import client from "~/lib/client";
import fs from 'node:fs';
export async function GET(req: APIEvent) {
  const parsed: {
    id: {
      [key: string]: string;
    };
    features: {
      [key: string]: [[number]];
    };
  } = JSON.parse(json_text);


  // usefulized
  const useful = Object.entries(parsed.id).map(([key, value]) => {
    const features = parsed.features[key];
    console.log("VALUE",value)
    const id = value.toString().padStart(11, "0");
    const feature = features[0];
    return {
      id,
      feature,
    };
 
  });
  fs.writeFileSync('useful.json', JSON.stringify(useful), );
  return json("ok")

// client.flushAll()
//   return json(useful);
}
