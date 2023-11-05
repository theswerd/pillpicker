import { createClient } from "redis";

const client = await createClient({
  url: "redis://default:password@localhost:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default client;