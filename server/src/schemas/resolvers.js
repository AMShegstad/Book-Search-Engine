import Book from '../models/Book.js';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';

export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                return await User.findById(context.user._id);
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        books: async () => {
            try {
                return await Book.find({});
            } catch (err) {
                throw new Error('Failed to fetch books');
            }
        },
        users: async () => {
            try {
                return await User.find({});
            } catch (err) {
                throw new Error('Failed to fetch users');
            }
        },
        user: async (_, { id }) => {
            try {
                return await User.findById(id);
            } catch (err) {
                throw new Error('Failed to fetch user');
            }
        },
        book: async (_, { bookId }) => {
            try {
                return await Book.findOne({ bookId });
            } catch (err) {
                throw new Error('Failed to fetch book');
            }
        }
    },
    Mutation: {
        login: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                
                if (!user) {
                    throw new AuthenticationError("Can't find this user");
                }
                
                const correctPw = await user.isCorrectPassword(password);
                
                if (!correctPw) {
                    throw new AuthenticationError('Wrong password!');
                }
                
                const token = signToken(user);
                return { token, user };
            } catch (err) {
                throw new Error(err.message);
            }
        },
        addUser: async (_, { username, email, password }) => {
            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user };
            } catch (err) {
                throw new Error('Failed to create user');
            }
        },
        saveBook: async (_, { input }, context) => {
            if (context.user) {
                try {
                    return await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $addToSet: { savedBooks: input } },
                        { new: true, runValidators: true }
                    );
                } catch (err) {
                    throw new Error('Failed to save book');
                }
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                try {
                    return await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId } } },
                        { new: true }
                    );
                } catch (err) {
                    throw new Error('Failed to remove book');
                }
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addBook: async (_, { input }) => {
            try {
                const newBook = new Book(input);
                return await newBook.save();
            } catch (err) {
                throw new Error('Failed to add book');
            }
        },
        deleteBook: async (_, { id }) => {
            try {
                return await Book.findByIdAndDelete(id);
            } catch (err) {
                throw new Error('Failed to delete book');
            }
        },
        updateUser: async (_, { id, input }) => {
            try {
                return await User.findByIdAndUpdate(id, input, { new: true });
            } catch (err) {
                throw new Error('Failed to update user');
            }
        },
    },
};