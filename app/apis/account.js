const { admin, db } = require("./firestoreDb");
const _ = require("lodash");
const { testProc, matchProc } = require("./processConnector");

const users = db.collection("users");

module.exports.accountVerify = async (email, uid) => {
  const snapshot = await users.get();
  let pass = false;
  // idToken comes from the client app
  try {
    admin
      .auth()
      .verifyIdToken(uid)
      .then((decodedToken) => {
        const actural_uid = decodedToken.uid;

        console.log(email, "=>", uid);
        snapshot.forEach((doc) => {
          if (doc.id == email && doc.data().uid == actural_uid) {
            pass = uid;
          }
        });
      })
      .catch((error) => {
        // Handle error
      });
  } catch (e) {}
  if (!pass) {
    snapshot.forEach((doc) => {
      if (doc.id == email && doc.data().uid == uid) {
        pass = uid;
      }
    });
    console.log(`Please use idToken instead of uid`);
  }
  return pass;
};

module.exports.accountInfo = async (email, uid, verify = true) => {
  if (email && verify) {
    uid = await this.accountVerify(email, uid);
    if (!email || !uid) return [];
  }

  const snapshot = await users.get();
  let accounts = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    // console.log(doc.id, '=>', data);
    accounts.push({
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      intro: data.intro,
      friendList: data.friends,
    });
  });

  let results = accounts;
  if (email) {
    results = _.find(accounts, { email });
  }

  if (results && results.length > 0) {
    results.forEach((v, i) => {
      let friendEmails = v.friendList;
      if (friendEmails)
        v.friends = _.filter(accounts, (account) =>
          friendEmails.includes(account.email)
        );
    });
  } else if (results) {
    let friendEmails = results.friendList;
    if (friendEmails)
      results.friends = _.filter(accounts, (account) =>
        friendEmails.includes(account.email)
      );
  }
  return results;
};

module.exports.accountUpdate = async (email, uid, intro) => {
  uid = await this.accountVerify(email, uid);
  if (!email || !uid) return [];
  const doc = await users.doc(email).set({ intro }, { merge: true });
  matchProc(email, uid, `-O analyze`); // ignore the result
  return this.accountInfo(email, uid);
};

module.exports.accountAddFriend = async (email, uid, friendEmail) => {
  uid = await this.accountVerify(email, uid);
  if (!email || !uid) return [];
  const doc = (await users.doc(email).get()).data();
  const oldFriends = doc.friends || [];
  const friends = _.uniqBy([...oldFriends, friendEmail], (v) => v);

  console.log(doc.friends);
  console.log(`oldFriends: ${oldFriends}`);
  console.log(`friends: ${friends}`);

  await users.doc(email).set({ friends }, { merge: true });

  return this.accountInfo(email, uid);
};

module.exports.accountMatch = async (email, uid, policy) => {
  uid = await this.accountVerify(email, uid);
  if (!email || !uid) return [];
  // TODO testing
  console.log("Run test proc");
  // await matchProc(email, uid, `-P ${policy || JSON.stringify({ policy: "None" })} -O match`)
  doc = await users.doc(email).get();

  let accounts = [];

  const data = doc.data();
  for (const email of data.matched) {
    console.log(email);
    const account = await this.accountInfo(email, "", false)
    accounts.push(account);
    console.log(accounts)
  }
  return {'matched': accounts};
};
