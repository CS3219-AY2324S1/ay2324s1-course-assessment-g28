import { Item } from "./linked-list";

class User extends Item {
  reply_params: { replyTo: string; correlationId: string };
  match_options: { user: string };
  create_timestamp: number;

  constructor(
    reply_params: { replyTo: string; correlationId: string },
    match_options: { user: string }
  ) {
    super();
    this.reply_params = reply_params;
    this.match_options = match_options;
    this.create_timestamp = Date.now();
  }
}

export { User };
