import mongoose from "mongoose";
import { Password } from "../utils/password";

// an interface that describe the attributes we need to create
// a new user document
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes fields that a user document will have
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// an interface that extends the mongoose.Model and
// describes the methods on the userModel
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email could not be empty"],
    unique: [true, "email must be unique"],
  },
  password: {
    type: String,
    required: [true, "password could not be empty"],
  },
});

userSchema.statics.build = function (attrs: UserAttrs) {
  return new User(attrs);
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.password;
  delete obj.__v;

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const passwordHash = await Password.toHash(this.get("password"));
    this.set("password", passwordHash);
  }

  next();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
