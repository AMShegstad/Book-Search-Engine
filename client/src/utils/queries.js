import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

export const GET_BOOKS = gql`
    query books {
        books {
            bookId
            authors
            description
            title
            image
            link
        }
    }
`;