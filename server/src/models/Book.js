import { Schema, model } from 'mongoose';

// export interface BookDocument extends Document {
//   bookId: string;
//   title: string;
//   authors: string[];
//   description: string;
//   image: string;
//   link: string;
// }

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bookSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

// Export the schema for use as a subdocument
export { bookSchema };

// Create and export the Book model
const Book = model('Book', bookSchema);
export default Book;
