import { gql } from "@apollo/client";
import { getAccount } from "../auth";
import { client } from "./base";

export const M_ADD_FRIEND = gql`
  mutation AddUserFriend($email: String!, $uid: ID!, $friend: String!) {
    addUserFriend(email: $email, uid: $uid, friend: $friend) {
      friends {
        name
        avatar
        email
      }
    }
  }
`;

export const M_UPDATE_INTRO = gql`
  mutation AddUserFriend(
    $email: String!
    $uid: ID!
    $headline: String
    $countryRegion: String
    $homeCountryRegion: String
    $locationCity: String
    $contactInfo: String
    $about: String
    $MBTI: String
  ) {
    updateUserIntro(
      email: $email
      uid: $uid
      intro: {
        headline: $headline
        countryRegion: $countryRegion
        homeCountryRegion: $homeCountryRegion
        locationCity: $locationCity
        contactInfo: $contactInfo
        about: $about
        MBTI: $MBTI
      }
    ) {
      intro {
        headline
        countryRegion
        homeCountryRegion
        locationCity
        contactInfo
        about
        MBTI
      }
    }
  }
`;
