import { APIEvent, json } from "solid-start";
import client from "~/lib/client";



export function GET(req:APIEvent) {
  client.set("foo", "bar");
  return json({ message: "Hello World" });
}
