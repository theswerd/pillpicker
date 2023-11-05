import fs from "node:fs";
const file = fs.readFileSync("pill_dir.txt");
//00002322730|1|PillProjectDisc69/images/CLLLLUPGIX7J8MP1WWQ9WN4-CO0B5NV.CR2|C3PI_Reference|STRATTERA 10MG
import https from "node:https";
const lines = file.toString().split("\n");
const base = lines.map((line) => {
  const split = line.split("|");
  const id = split[0];
  const index = split[1];
  const image = split[2];
  const reference = split[3];
  const name = split[4];

  const obj = {
    id,
    index,
    image,
    reference,
    name,
  };
  return obj;
});

// combine rows with the same id
let out = base.reduce((acc, curr) => {
  const index = acc.findIndex((item) => item.id === curr.id);
  if (index === -1) {
    acc.push({
      id: curr.id,
      index: curr.index,
      images: [],
      name: curr.name,
    });
    if ((curr.image ?? "").endsWith(".JPG")) {
      acc[acc.length - 1].images.push(curr.image);
    }
  } else {
    if ((curr.image ?? "").endsWith(".JPG")) acc[index].images.push(curr.image);
  }
  return acc;
}, []);

out = out.filter((pill) => pill.images.length >= 3).map((pill)=>{
  pill.images = pill.images.slice(0,3)
  return pill
});
const downloadImages = async (item) => {

  fs.mkdirSync(`data/training/${item.id}`, {
    recursive: true,
  });
  const url = "https://data.lhncbc.nlm.nih.gov/public/Pills/";
  const promises = item.images.map(async (image, index) => {
    const img = url + image;
    const blob = await fetch(img, {
    }).then((res) => res.blob());
    const buffer = await blob.arrayBuffer();
     fs.writeFileSync(`data/training/${item.id}/${index}.JPG`, Buffer.from(buffer));
    // console.log(`Image ${index} downloaded for item ${item.id}`);
  });
  await Promise.allSettled(promises);
};
// fs.writeFileSync("filtered.json", JSON.stringify(out, null, 2));
// generate traning data
fs.rmSync("data/training", {
  recursive: true,
});
fs.mkdirSync("data/training", {
  recursive: true,
});


// split out into batches of 50
let batch_size = 10;
let batches = [];
for (let i = 0; i < out.length; i += batch_size) {
  batches.push(out.slice(i, i + batch_size));
}

// download each batch
let index = 0;
for (const batch of batches) {
  index += 1;
  const start_time = new Date().getTime();
  console.log("")
  await Promise.all(batch.map(downloadImages));
  await new Promise((resolve) => setTimeout(resolve, 200));
  const end_time = new Date().getTime();
  console.log(`Batch ${index}/${batches.length} downloaded`);
  console.log(`Time taken: ${(end_time - start_time) / 1000} seconds`);
}
// for (const item of out) {
//   outer_index += 1;
//   console.log(outer_index, item.id, out.length)
//   fs.mkdirSync(`data/training/${item.id}`, {
//     recursive: true,
//   });
//  await downloadImages(item);
 
//   // for (const image of item.images) {
  //   // console.log(index, image)
  //   const url = "https://data.lhncbc.nlm.nih.gov/public/Pills/";
  //   const img = url + image;
  //   // console.log(img);
  //   const blob = await fetch(img).then((res) => {
  //     return res.blob();
  //   });
  //   const buffer = await blob.arrayBuffer();
  //   // create file

  //   //write file
  //   fs.writeFileSync(`data/training/${item.id}/${index}`,Buffer.from(buffer));
  //   index+=1;
  // }
// }
