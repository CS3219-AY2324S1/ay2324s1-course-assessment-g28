import { List, Item } from "linked-list";

class User extends Item {
  reply_params: JSON;
  match_options: JSON;

  constructor(reply_params: JSON, match_options: JSON) {
    super();
    this.reply_params = reply_params;
    this.match_options = match_options;
  }
}

export { User };
