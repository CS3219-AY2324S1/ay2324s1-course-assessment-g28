import { v4 as uuidv4 } from "uuid";
import EditorService from "./editor-service";

class MockEditor implements EditorService {
  async postPair(_user1: string, _user2: string): Promise<string> {
    return `ws://localhost:${8080}/${uuidv4()}`;
  }
}

export default MockEditor;
