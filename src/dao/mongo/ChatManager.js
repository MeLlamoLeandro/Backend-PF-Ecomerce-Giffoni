import { messageModel } from "../models/message.model.js";

class MessagesMongo {
  getAll = async () => {
    //return await messageModel.find().lean();
    return await messageModel.find();
  };

  saveMessage = async (message) => {
    return await messageModel.create(message);
  };
}

export default MessagesMongo;
