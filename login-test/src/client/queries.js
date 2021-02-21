import { gql } from "@apollo/client";
import { getAccount } from "../auth";
import { client } from "./base";

export const Q_ALL_USERS = gql`
  query Users {
    users {
      email
      name
      avatar
    }
  }
`;

export const queryAllUsers = (callback) => {
  client
    .query({
      query: gql`
        query Users {
          users {
            email
            name
            avatar
          }
        }
      `,
    })
    .then((result) => {
      console.log(result);
      if (callback) callback(result);
    });
};

export const Q_USER = gql`
  query User ($email: String!, $uid: ID!) {
    user(email: $email, uid: $uid) {
      email
      name
      avatar
      intro {
        headline
        countryRegion
        homeCountryRegion
        locationCity
        contactInfo
        about
      }
      friends {
        email
        name
        avatar
        intro {
          headline
          countryRegion
          homeCountryRegion
          locationCity
        }
      }
    }
  }
`;

export const queryUser = (callback) => {
  const { email, idToken } = getAccount();
  client
    .query({
      query: gql`
        query User {
          user(
            email: "${email}"
            uid: "${idToken}"
          ) {
            email
            name
            avatar
            intro {
              headline
              countryRegion
              homeCountryRegion
              locationCity
              contactInfo
              about
            }
            friends {
              email
              name
              avatar
              intro {
                headline
                countryRegion
                homeCountryRegion
                locationCity
              }
            }
          }
        }
      `,
    })
    .then((result) => {
      console.log(result);
      if (callback) callback(result);
    });
};

export const Q_MATCH = gql`
  query Match($email: String!, $uid: ID!) {
    userMatch(email: $email, uid: $uid) {
      matched {
        email
        name
        avatar
        intro {
          headline
          countryRegion
          homeCountryRegion
          locationCity
          contactInfo
          about
        }
      }
    }
  }
`;

export const queryMatch = (callback) => {
  const { email, idToken } = getAccount();
  client
    .query({
      query: gql`
        query Match {
            userMatch(email: "${email}", uid: "${idToken}") {
                matched {
                    email
                    name
                    avatar
                    intro {
                        headline
                        countryRegion
                        homeCountryRegion
                        locationCity
                        contactInfo
                        about
                    }
                }
            } 
        }
      `,
    })
    .then((result) => {
      console.log(result);
      if (callback) callback(result);
    });
};
