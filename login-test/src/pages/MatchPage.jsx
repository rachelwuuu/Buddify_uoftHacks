import {
  Avatar,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  CardActions,
  Paper,
  Slider,
  Button,
  CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import { Container } from "@material-ui/core";
import { queries } from "../client";
import { getAccount } from "../auth";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faGlobeAmericas,
} from "@fortawesome/free-solid-svg-icons";
import zIndex from "@material-ui/core/styles/zIndex";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: "#FFF9E7",
    margin: "0",
    paddingTop: "16vh",
    background:
      "url(https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
  },
  container: {
    position: "fixed",
    height: "42vh",
    width: "80%",
    alignSelf: "center",
    marginLeft: "10%",
    padding: "30px",
    borderRadius: "12px",
    background:
      "url(https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
  },
}));

function ProfileCard(props) {
  const classes = useStyles();
  const [state, setState] = useState('about')
  return (
    <Card
      style={{
        height: "40vh",
        background: "#E1FEEEcc",
        borderRadius: "12px",
        overflow: "initial",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        maxWidth: "380px",
      }}
    >
      <Grid
        container
        direction="column"
        justify="space-around"
        alignItems="center"
        style={{ height: "36vh", color: "#1A4E6E" }}
      >
        <Grid item xs={4} style={{ maxWidth: "90%" }}>
          <Avatar
            alt={props.name}
            style={{
              width: "120px",
              height: "120px",
              border: "#1A4E6E 4px solid",
              borderRadius: "100px",
              marginTop: "-50px",
            }}
            src={props.photoURL}
          >
              <CircularProgress color="secondary" />
          </Avatar>
        </Grid>
        <Grid item xs={2} style={{ maxWidth: "90%", width: "100%" }}>
          <div
            style={{
              textAlign: "center",
              color: "grey",
              fontSize: "28px",
            }}
          >
            {props.name}
          </div>
          <div style={{ textAlign: "center" }}>
            {props.intro && props.intro.headline}
          </div>
          <hr style={{ width: "80%" }} />
        </Grid>
        <Grid
          item
          xs={5}
          style={{ maxWidth: "80%", overflow: "hidden", fontSize: "12px" }}
        >
          <div style={{ maxHeight: "80%", overflow: "hidden" }}>
            {state == 'about' && props.intro && <div>{props.intro.about}</div>}
            {state == 'connect' && props.intro && <div>Phone: {props.intro.contactInfo}<br/>Email: {props.email} </div>}
            {state == 'location' && props.intro && <div>Current Location: {props.intro.locationCity || 'Unknown'}<br/>Home Country/Region: {props.intro.homeCountryRegion || 'Unknown'}</div>}
          </div>
          <div>{props.intro && <a>Show More</a>}</div>
        </Grid>
      </Grid>
      {props.intro && (
        <CardActions style={{ justifyContent: "center", color: "#F79140" }}>
          <FontAwesomeIcon icon={faUser} onClick={()=>setState('connect')}/>
          <FontAwesomeIcon icon={faHome} onClick={()=>setState('about')}/>
          <FontAwesomeIcon icon={faGlobeAmericas} onClick={()=>setState('location')} />
        </CardActions>
      )}
    </Card>
  );
}

export default function MatchPage() {
  const classes = useStyles();

  const { email, idToken, name, photoURL } = getAccount();
  const userData = useQuery(queries.Q_USER, {
    variables: { email: email, uid: idToken },
  }).data;
  console.log(userData);

  const match_Q = useQuery(queries.Q_MATCH, {
    variables: { email: email, uid: idToken },
  })
  const matchData = match_Q.data;
  const matchRefetch = match_Q.refetch;

  console.log(matchData);

  const userInro = userData && userData.user && userData.user.intro;

  const matchName =
    matchData &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched[0].name;
  const matchPhotoUrl =
    matchData &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched[0].avatar;
  const matchEmail =
    matchData &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched[0].email;
  const matchIntro =
    matchData &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched &&
    matchData.userMatch.matched[0].intro;
  

  return (
    <div
      className={classes.root}
      style={{
        zIndex: "-2",
      }}
    >
      <div
        className={classes.container}
        style={{
          position: "fixed",
          filter: "blur(32px)",
          WebkitFilter: "blur(32px)",
        }}
      />
      <Paper
        className={classes.container}
        style={{
          background: "#fff1",
          borderRadius: "none",
          zIndex: "2",
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={4}
          style={{ zIndex: "100" }}
        >
          <Grid item xs={4} style={{ zIndex: "100" }}>
            <ProfileCard
              name={name}
              email={email}
              intro={userInro}
              photoURL={photoURL}
            />
          </Grid>

          <Grid item xs={4} style={{ zIndex: "100", color: "white" }}>
            <Typography
              id="discrete-slider-small-steps"
              gutterBottom
              justifyContent="center"
              justif="center"
              style={{ color: "white", textAlign: "center" }}
            >
              Searching Weight
            </Typography>
            <br></br>

            <Grid container>
              <Grid item xs={2}>
                Same Region
              </Grid>
              <Grid item xs />
              <Grid item xs={2}>
                Different Regions
              </Grid>
            </Grid>
            <Slider
              defaultValue={2}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              marks
              min={-100}
              max={100}
              valueLabelDisplay="auto"
            />
            <br/>
            <Slider
              defaultValue={2}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              marks
              min={-100}
              max={100}
              valueLabelDisplay="auto"
            />
            <Grid container>
              <Grid item xs={2}>
                Common interests
              </Grid>
              <Grid item xs />
              <Grid item xs={2}>
                Common Personality
              </Grid>
            </Grid>
            <br></br>
            <div>
              <Button style={{ margin: "0 auto", color: "white", width: "80%", marginLeft: "10%" , background: "#00000033"}} onClick={() => {
                  
                  matchRefetch({variables: { email: email, uid: idToken }})}}>
                Match
              </Button>
            </div>
          </Grid>

          <Grid item xs={4} style={{ zIndex: "100" }}>
            <ProfileCard
              name={matchName}
              email={matchEmail}
              intro={matchIntro}
              photoURL={matchPhotoUrl}
              style={{ zIndex: "100" }}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
