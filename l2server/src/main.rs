use floating_distance::*;
use rayon::prelude::*;
use rocket::{serde::json::Json, State};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;

#[macro_use]
extern crate rocket;

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct Feature {
    feature: Vec<f32>,
    id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Out {
    highest: Scored<Pill>,
    id: Option<Scored<Pill>>,
}

#[post("/", data = "<feature>")]
fn index(state: &State<Vec<Pill>>, feature: Json<Feature>) -> Json<Out> {
    let mut scored: Vec<Scored<Pill>> = state
        .inner()
        .par_iter()
        .map(|pill| {
            let score = Metric::Euclidean.measure::<f32>(&pill.feature, &feature.feature);
            println!("#{:?} score: {:?}", pill.id, score);
            Scored::<Pill> {
                score,
                item: pill.clone(),
            }
        })
        .collect();
    scored.par_sort_by(|a, b| a.score.partial_cmp(&b.score).unwrap());
    println!(
        "Highest scoring {} | {}",
        scored.last().unwrap().item.id,
        scored.last().unwrap().score
    );
    Json(Out {
        highest: scored[0].clone(),
        id: scored.iter().find(|pill| Some(pill.item.id.clone()) == feature.id).map(|v| v.clone()),
    })
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Pill {
    id: String,
    feature: Vec<f32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Scored<T> {
    score: f32,
    item: T,
}

#[launch]
fn rocket() -> _ {
    // read src/useful.json
    let mut file = File::open("src/useful.json").expect("Unable to open file");
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect("Unable to read file");
    let pills = serde_json::from_str::<Vec<Pill>>(&contents).expect("Unable to parse json");

    rocket::build().manage(pills).mount("/", routes![index])
}
