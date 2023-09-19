import { List } from "../models/linked-list";
import { User } from "../models/user";
import config from "../utils/config";

const SECOND = 1000;

function isMatch(user1: User, user2: User): boolean {
  // not implemented yet
  return true;
}

function matchUser(userList: List<User>, user: User): null | [User, User] {
  let curr = userList.head;
  let now_timestamp = Date.now();

  while (curr) {
    let next = curr.next;

    if (
      curr.create_timestamp + config.MATCHMAKING_MAX_WAIT_SECONDS * SECOND <
      now_timestamp
    ) {
      curr.detach();
    } else if (isMatch(curr, user)) {
      curr.detach();
      return [curr, user];
    }

    curr = next;
  }

  userList.append(user);
  return null;
}

export default matchUser;
