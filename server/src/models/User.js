import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { bookSchema } from './Book.js'; // Import the bookSchema for use in the User model

// Import the bookSchema, not the Book model
//import { bookSchema } from './Book.js';
//import type { BookDocument } from './Book.js';

// export interface UserDocument extends Document {
//   id: string;
//   username: string;
//   email: string;
//   password: string;
//   savedBooks: BookDocument[]; // Array of Book subdocuments
//   isCorrectPassword(password: string): Promise<boolean>;
//   bookCount: number;
// }

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Use bookSchema as the schema for the savedBooks array
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Virtual field to get the number of saved books
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model('User', userSchema);

export default User;
