import { Item, List } from "./src/models/linked-list";

class Something extends Item {}

let test: Item = new Something();

let things = new List<Something>();

console.log(Number("asdf") || 100)

enum Complexity {
  Easy = 0,
  Medium = 1,
  Hard = 2,
}

let c: Complexity = Complexity[0];

console.log(c)
