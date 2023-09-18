import { Item } from "linked-list";

class User extends Item {
  reply_params: { replyTo: string; correlationId: string };
  match_options: { user: string };

  constructor(
    reply_params: { replyTo: string; correlationId: string },
    match_options: { user: string }
  ) {
    super();
    this.reply_params = reply_params;
    this.match_options = match_options;
  }
}

export { User };
