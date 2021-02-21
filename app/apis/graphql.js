const { makeExecutableSchema } = require("graphql-tools");
const { accountInfo, accountVerify, accountUpdate, accountAddFriend, accountMatch } = require("./account");

// Adding Type Definitions
const typeDefinition = `
   type Query  {
      user(email: String!, uid: ID!): User
      users: [User]
      userVerify(email: String, uid: String): String
      userMatch(email: String!, uid: ID!, policy: String): Match
   }

   type Mutation {
      updateUserIntro(email: String!, uid: ID!, intro: IntroInput!): User
      addUserFriend(email: String!, uid: ID!, friend: String): User
   }

   type User {
      email: String
      name: String
      avatar: String
      intro: Intro
      friends: [User]
   }

   type Match {
     matched: [User]
   }

   type Intro {
      headline: String
      countryRegion: String
      homeCountryRegion: String
      locationCity: String
      contactInfo: String
      about: String
      MBTI: String
      interests: [String]
      experiences: [String]
   }

   input IntroInput {
    headline: String
    countryRegion: String
    homeCountryRegion: String
    locationCity: String
    contactInfo: String
    about: String
    MBTI: String
    interests: [String]
    experiences: [String]
 }
`;

// Adding resolver
const resolverObject = {
  Query: {
    user: async (parent, args) => await accountInfo(args.email, args.uid),
    users: async (parent, args) => await accountInfo(),
    userVerify: async (parent, args) =>
      await accountVerify(args.email, args.uid),
    userMatch: async (parent, args) => await accountMatch(args.email, args.uid, args.policy),
  },
  Mutation: {
    updateUserIntro: async (parent, { email, uid, intro }) =>
      await accountUpdate(email, uid, intro),
    addUserFriend: async (parent, { email, uid, friend }) =>
      await accountAddFriend(email, uid, friend),
  },
};

const schema = makeExecutableSchema({
  typeDefs: typeDefinition,
  resolvers: resolverObject,
});

module.exports.schema = schema;
