import { gql } from '@apollo/client';

// Mutation to add a book
export const ADD_BOOK = gql`
    mutation AddBook($bookData: BookInput!) {
        addBook(bookData: $bookData) {
            _id
            title
            authors
            description
            image
            link
        }
    }
`;

// Mutation to remove a book
export const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            _id
            title
            authors
            description
            image
            link
        }
    }
`;

// Mutation to login a user
export const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// Mutation to register a user
export const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// export const SEARCH_GOOGLE_BOOKS = gql`
//     query SearchGoogleBooks($query: String!) {
//         searchGoogleBooks(query: $query) {
//             id
//             title
//             authors
//             description
//             image
//             link
//         }
//     }
// `