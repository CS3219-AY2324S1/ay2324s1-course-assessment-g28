import { List } from "../models/linked-list";
import { User } from "../models/user-list";

function isMatch(user1: User, user2: User): boolean {
  // not implemented yet
  return true;
}

function matchUser(userList: List<User>, user: User): null | [User, User] {
  let curr = userList.head;

  while (curr) {
    if (isMatch(curr, user)) {
      curr.detach();
      return [curr, user];
    }
  }

  userList.append(user);
  return null;
}

export default matchUser;
