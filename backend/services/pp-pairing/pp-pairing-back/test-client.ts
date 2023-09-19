import { Item, List } from "./src/models/linked-list";

class Something extends Item {}

let test: Item = new Something();

let things = new List<Something>();
