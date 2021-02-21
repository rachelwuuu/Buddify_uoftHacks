//import React from "react";
import React, { Component } from "react";
import { Button, LinearProgress, makeStyles, TextField } from "@material-ui/core";
import {
  signinWithGoogle,
} from "./FirebaseLogin";
import GoogleButton from "react-google-button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { accountInfo } from "./FirebaseLogin";
import { getAccount } from ".";

const useStyles = makeStyles((theme) => ({
  welcomeBtn: {
    borderRadius: "42px",
    padding: "0",
    paddingTop: "4px",
    paddingLeft: "40px",
    paddingRight: "40px",
    background: "#fdf2c5",
    color: "#ffad35",
    fontFamily: "DailyHours",
    fontSize: "24px",
    "&:hover": {
      backgroundColor: "#f2d86b",
      color: "#FFF",
      border: "1px solid black",
    },
  },
}))

export function LoginDialog(props) {
  const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [userName, setUserName] = React.useState(false)
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    let callback = (loginState, user) => {
      setUserName(user.name)  
      if (loginState && getAccount().logged && "onSuccess" in props) {
        props.onSuccess(user);
        console.log("Login successfully");
      } else if (!loginState && "onFail" in props) {
        props.onFail(user);
        console.log("Login failed");
      }
    };
  
    return (
      <div>
        <Button
          variant="contained"
          className={classes.welcomeBtn}
          labelStyle={{ fontSize: "63px" }}
          size="large"
          variant="text"
          onClick={handleClickOpen}
        >
          {userName? userName : 'LOGIN'}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <GoogleButton
              onClick={() => {
                signinWithGoogle(callback);
                handleClose();
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
