const { admin, db } = require("./firestoreDb");
const _ = require("lodash");
const { testProc, matchProc } = require("./processConnector");

const users = db.collection("users");

module.exports.accountVerify = async (email, uid) => {
  console.log(`Verify account for ${email}`);
  const snapshot = await users.get();
  let pass = false;
  // idToken comes from the client app
  try {
    await 
    admin
      .auth()
      .verifyIdToken(uid)
      .then((decodedToken) => {
        const actural_uid = decodedToken.uid;

        snapshot.forEach((doc) => {
          if (doc.id == email && doc.data().uid == actural_uid) {
            pass = uid;
            return pass
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
    if (!email || uid == false) return [];
  }
  console.log(`Fetch accountInfo for ${email}`);

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
  console.log(`Update account intro for ${email}`);
  const oldIntro = await (await users.doc(email).get()).data().intro;
  intro = _.merge({}, oldIntro, intro)
  const doc = await users.doc(email).set({ intro }, { merge: true });
  console.log(`updated Intro`);
  console.log(intro);
  matchProc(email, uid, '-O analyze'); // ignore the result
  return this.accountInfo(email, uid);
};

module.exports.accountAddFriend = async (email, uid, friendEmail) => {
  uid = await this.accountVerify(email, uid);
  if (!email || !uid) return [];
  console.log(`Add account friend ${friendEmail} for ${email}`);
  const doc = (await users.doc(email).get()).data();
  const oldFriends = doc.friends || [];
  const friends = _.uniqBy([...oldFriends, friendEmail], (v) => v);

  await users.doc(email).set({ friends }, { merge: true });

  return this.accountInfo(email, uid);
};

module.exports.accountMatch = async (email, uid, policy) => {
  uid = await this.accountVerify(email, uid);
  if (!email || !uid) return [];
  console.log(`Match account for ${email}`);
  // console.log("Run test proc");
  await matchProc(email, uid, `-P ${policy || JSON.stringify({ policy: "None" })} -O match`)
  doc = await users.doc(email).get();

  let accounts = [];

  const data = doc.data();
  for (const email of data.matched) {
    // console.log(email);
    const account = await this.accountInfo(email, "", false)
    accounts.push(account);
    // console.log(accounts)
  }
  if (accounts.length > 0)
    return {'matched': accounts};
  else
    return {'matched': []}
};

var uuid = require('uuid');
const randomAccount = (n=10) => {
  var {names, abouts, countrieRegions, cities} = require('./fake')
  for (let i = 0; i < n; i++) {
    let name = names[i]
    let email = name.replace(' ', '.') + Math.floor(Math.random() * 3000 + 1) + '@gmail.com'
    let country = countrieRegions[Math.floor(Math.random() * (countrieRegions.length))].name
    let sameCountry = Math.random() < 0.75
    let sameCity = Math.random() < 0.6
    let account = {
      avatar: `https://i.pravatar.cc/150?img=${i}`,
      email,
      name,
      uid: uuid.v4(),
      intro: {
        about: abouts[i % abouts.length],
        contactInfo: '+1 ' + Math.floor(Math.random() * 800 + 111) + "-" + Math.floor(Math.random() * 800 + 111) + "-" + Math.floor(Math.random() * 8000 + 1131),
        countryRegion: country,
        homeCountryRegion: sameCountry ? country : countrieRegions[Math.floor(Math.random() * (countrieRegions.length))].name,
        locationCity: sameCity ? " Toronto" : cities[Math.floor(Math.random() * cities.length)][0],
        headline: ['1st year', '2nd year', '3rd year', '4th year', 'intern'][Math.floor(Math.random() * 5)] + ' ' + ['ECE', 'CS', 'SE', 'CE', 'Bio', 'Physics', 'Math', 'Economics', 'IT', 'Management', 'Accounting'][Math.floor(Math.random() * 11)] + ' Student'
      }
    }
    console.log(account);
    const doc = users.doc(email).set(account, { merge: true });
  }
}