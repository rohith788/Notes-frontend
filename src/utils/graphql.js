import gql from "graphql-tag";

export const FETCH_NOTES_QUERY = gql`
  {
    getNotes {
      id
      title
      body
      createdAt
      username
    }
  }
`;
