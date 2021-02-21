import { client } from "./base";
import { Q_ALL_USERS, Q_USER, Q_MATCH } from "./queries";
import { M_ADD_FRIEND, M_UPDATE_INTRO } from "./mutations";

export const queries = {
  Q_ALL_USERS,
  Q_USER,
  Q_MATCH,
};

export const mutations = {
  M_ADD_FRIEND,
  M_UPDATE_INTRO,
};

export const apolloClient = client;
