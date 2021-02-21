import { Avatar, Button, Container } from "@material-ui/core";
import React from "react";
import { getAccount } from "../auth";
import { queryAllUsers, queryUser, queryMatch, Q_ALL_USERS , Q_USER, Q_MATCH} from "./queries";
import { M_ADD_FRIEND, M_UPDATE_INTRO } from "./mutations";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

export default function TestPage(props) {
  const onReturn = (data) => {
    document.getElementById("test-output").innerHTML = JSON.stringify(data);
  };
  
  const {email, idToken} = getAccount()
//   const { loading, error, data } = useQuery(Q_ALL_USERS);
//   console.log(data)

//   const { loading, error, data } = useQuery(Q_ALL_USERS, {
//       variables: {email: email, uid: idToken}
//   });
//   console.log(data)
//   console.log(error);

//   const [mAddFriend, {data}] = useMutation(M_ADD_FRIEND)
  const [mUpdataIntro, {data}] = useMutation(M_UPDATE_INTRO)
  console.log(data);
  
  return (
    <div>
      <Container maxWidth="lg" style={{ background: "#98aacf" }}>
        <Button onClick={() => queryAllUsers(onReturn)}>List All Users</Button>
        <Button onClick={() => queryUser(onReturn)}>
          List Cuurent User Info
        </Button>
        <Button onClick={() => queryMatch(onReturn)}>
          List Current User Match
        </Button>
        <Button onClick={() => mUpdataIntro({variables: {email: email, uid: idToken, locationCity: "Toronto"}})}>
          Add Friend
        </Button>
        <div id="test-output"></div>
      </Container>
    </div>
  );
}
