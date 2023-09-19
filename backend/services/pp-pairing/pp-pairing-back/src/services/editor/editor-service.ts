interface EditorService {
  // async postPair should contact the editor service to obtain a websocket url
  // to forward back to the user
  postPair: (user1: string, user2: string) => Promise<string>;
}

export default EditorService;
