const Request = require("./../models/Request");
const CustomError = require("./../utils/CustomError");

class RequestService {
  async create(data) {
    const request = new Request(data);
    await request.save();
    return {
      //This token is not necessary here. This is a protected route so just get the user_id from the request (req)
      // token: token,
      uid: request._id,
      name: request.name,
      email: request.email,
    };
  }

  async update(data) {
    const filter = { _id: data.id };
    const update = {...data};
    delete update.id;
    const request = await Request.findOneAndUpdate(filter, update, {
      new: true
    });

    if (!request) throw new CustomError("Item may have been deleted");

    return request;
  }

  async delete(requestId) {
    return Request.findByIdAndRemove(requestId);
  }

  async findById(requestId) {
    return Request.findById(requestId);
  }

  async find(period1, period2) {
    return Request.find({$and: [{isFunded: true}, {date: {$gte: period1, $lte: period2}}]});
  }

  async findAll() {
    return Request.find();
  }
}

module.exports = new RequestService();
