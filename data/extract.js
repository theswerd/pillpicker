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


let batch_size = 10;

out = out.slice(0, batch_size * 350);

let train = out.slice(0, batch_size * 315);
let test = out.slice(batch_size * 315, batch_size * 350);


fs.writeFileSync("data/extract-350.json", JSON.stringify(out, null, 2));
fs.writeFileSync("data/extract-350-train.json", JSON.stringify(train, null, 2));
fs.writeFileSync("data/extract-350-test.json", JSON.stringify(test, null, 2));

let train_mapped = {
  class_names: 
   train.map((item) => item.id),
  class_roots: 
    train.map((item) => `training/${item.id}`)
  
};
let test_mapped = {
  class_names: 
   test.map((item) => item.id),
  class_roots: 
    test.map((item) => `training/${item.id}`)
  
};
fs.writeFileSync("data/train.json", JSON.stringify(train_mapped, null, 2));
fs.writeFileSync("data/val.json", JSON.stringify(test_mapped, null, 2));
// fs.writeFileSync("data/extract-350-mapped.json", JSON.stringify(mapped, null, 2));
// {
//   "class_names": [
//       "class_1",
//       "class_2"
//   ],
//   "class_roots": [
//       "path/to/class_1_folder",
//       "path/to/class_2_folder"
//   ]
// }