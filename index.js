//TOKENS

const express = require("express");
var CryptoJS = require("crypto-js");
const path = require("path");
const request = require("request");
var bodyParser = require("body-parser");
var queue = require("express-queue");
var cors = require("cors");

const { base64encode, base64decode } = require("nodejs-base64");

var firebase = require("firebase-admin");

var serviceAccount = require(__dirname + "/private/cre.json");

var serviceAccountd = require(__dirname + "/private/admin.json");
var serviceAccountsd = require(__dirname + "/private/super.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL:
    "https://english-re-edu-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

var admin = firebase.initializeApp(
  {
    credential: firebase.credential.cert(serviceAccountd),
    databaseURL:
      "https://english-re-learning-default-rtdb.asia-southeast1.firebasedatabase.app/",
  },
  "secondary"
);

var sad = firebase.initializeApp(
  {
    credential: firebase.credential.cert(serviceAccountsd),
    databaseURL:
      "https://english-re-auth-default-rtdb.asia-southeast1.firebasedatabase.app/",
  },
  "tertiary"
);

const { json } = require("express");
const { verify } = require("crypto");
const { Console } = require("console");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const BOT_TOKEN = "5977867332:AAFz8bGw2pTuGZlgwYMaFA2UKAO451dL6pY";
const CHAT_ID = -1001682384010; // <YOUR_CHAT_ID>

const tmMsg = (text) => {
  const options = {
    method: "POST",
    url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, parse_mode: "HTML", text }),
  };
  request(options, function (error, response) {
    if (!error)
      //throw new Error(error);
      console.log(response.body);
    else console.log(error);
  });
};
var port = process.env.PORT || 5000;
app.set("view engine", "ejs");
app.get("/", (req, res) => res.send("started"));

app.post("/approve", function (req, res) {
  const retalk = (email, pass, data) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          //   tmMsg(email + " requested pending slips")
          console.log(data);
          var array = data.split("``");
          uid = array[0];
          cid = array[1];
          mid = array[2];
          sid = array[3];
          fee = array[4];
          tname = array[5];
          url = array[6];
          cname = array[7];
          year = array[8];
          namec = array[9];

          console.log(uid, cid, mid);
          firebase
            .database()
            .ref("slips/" + uid + "/" + cid + "/" + mid)
            .set({})
            .then((m) => {
              admin
                .database()
                .ref("pay/" + cid + "/" + sid + "/" + mid)
                .update({
                  pay: "ok",
                  cid: cid,
                  sid: sid,
                  mid: mid,
                  uid: uid,
                  tname: tname,
                  cname: cname,
                  ts: (Date.now() / 1000) | 0,
                  fee: fee,
                  year: year,
                  md: "slips",
                  stname: namec,
                })
                .then((m) => {
                  firebase
                    .database()
                    .ref("enroll/" + uid + "/" + cid + "/" + mid + "/")
                    .update({
                      pay: "ok",
                      cid: cid,
                      sid: sid,
                      mid: mid,
                      uid: uid,
                      tname: tname,
                      cname: cname,
                      ts: (Date.now() / 1000) | 0,
                      fee: fee,
                      year: year,
                      md: "slips",
                      stname: namec,
                    })
                    .then((m) => {
                      tmMsg(
                        "<b>🟢 New Payment Slip has been approved </b> \n<b>Student ID</b> : " +
                          "RE" +
                          sid +
                          "\n<b>Amount</b> : " +
                          fee +
                          "\n<b>Student Name</b> : " +
                          namec +
                          "\n<b>Class ID</b> : " +
                          cid +
                          "\n<b>Month</b> : " +
                          mid +
                          "\n<b>Class Name</b> : " +
                          cname +
                          "\n<b>Firebase ID</b> : " +
                          uid +
                          "\n<b>Teacher</b> : " +
                          tname +
                          "\n<b>Year</b> : " +
                          year +
                          "\n<b>URL</b> : " +
                          url
                      );

                      res.send("done");
                    });
                });
            });
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(
      JSON.parse(aa)["email"],
      JSON.parse(aa)["pass"],
      JSON.parse(aa)["load"]
    );
  }
});

app.post("/reject", function (req, res) {
  const retalk = (email, pass, data) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          //   tmMsg(email + " requested pending slips")
          console.log(data);
          var array = data.split("``");
          uid = array[0];
          cid = array[1];
          mid = array[2];
          sid = array[3];
          fee = array[4];
          tname = array[5];
          url = array[6];
          cname = array[7];
          year = array[8];
          namec = array[9];

          console.log(uid, cid, mid);
          firebase
            .database()
            .ref("slips/" + uid + "/" + cid + "/" + mid)
            .update({ url: "reject" })
            .then((m) => {
              res.send("done");
              tmMsg(
                "<b>🔴 Payment Slip has been rejected </b> \n<b>Student ID</b> : " +
                  "RE" +
                  sid +
                  "\n<b>Amount</b> : " +
                  fee +
                  "\n<b>Student Name</b> : " +
                  namec +
                  "\n<b>Class ID</b> : " +
                  cid +
                  "\n<b>Month</b> : " +
                  mid +
                  "\n<b>Class Name</b> : " +
                  cname +
                  "\n<b>Firebase ID</b> : " +
                  uid +
                  "\n<b>Teacher</b> : " +
                  tname +
                  "\n<b>Year</b> : " +
                  year +
                  "\n<b>URL</b> : " +
                  url
              );
            });
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(
      JSON.parse(aa)["email"],
      JSON.parse(aa)["pass"],
      JSON.parse(aa)["load"]
    );
  }
});
app.post("/byname", function (req, res) {
  const retalk = (email, pass) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          //   tmMsg(email + " requested pending slips")
          function thens(dt) {
            res.send(JSON.stringify(dt));
          }
          var path = "classes";
          // Create References
          const dbRefObject = firebase.database().ref().child(path);

          // Sync object changes
          dbRefObject.once("value", (snap) => thens(snap.val()));
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
  }
});
app.post("/clearcc", function (req, res) {
  const retalk = (email, pass) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          tmMsg(
            "<b>❌ Successfully Deleted all Copuens</b>\n" +
              "<b>Admin: </b>" +
              email
          );
          admin
            .database()
            .ref("cpen/")
            .set({})
            .then((cx) => {
              res.sendStatus(200);
            });
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
  }
});
app.post("/ccpen", function (req, res) {
  const retalk = (email, pass, ccpen) => {
    xc = JSON.parse(ccpen);
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          cpenid = Math.floor(100000 + Math.random() * 900000);
          tmMsg(
            "<b>✅ New Coupen has been created.<b>\n" +
              "<b>Admin: </b>" +
              email +
              "\n<b>Coupen ID: </b>" +
              cpenid +
              "\n<b>Coupen Amount: </b>" +
              xc["price"] +
              "\n<b>Coupen Description: </b>" +
              xc["text"] +
              "\n<b>Class ID : </b>" +
              xc["cid"] +
              "\n<b>Is valid for Wallet? : </b>" +
              xc["wt"] +
              "\n<b>Valid From : </b>" +
              xc["start"] +
              "\n<b>Valid Till: </b>" +
              xc["end"]
          );
          admin
            .database()
            .ref("cpen/" + cpenid)
            .update(xc)
            .then((cx) => {
              console.log("ID is " + cpenid);
              res.status(203);

              res.send(cpenid.toString());
            });
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(
      JSON.parse(aa)["email"],
      JSON.parse(aa)["pass"],
      JSON.parse(aa)["ccpen"]
    );
  }
});

app.post("/slips", function (req, res) {
  const retalk = (email, pass) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          //   tmMsg(email + " requested pending slips")
          function thens(dt) {
            res.send(JSON.stringify(dt));
          }
          var path = "slips";
          // Create References
          const dbRefObject = firebase.database().ref().child(path);

          // Sync object changes
          dbRefObject.once("value", (snap) => thens(snap.val()));
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
  }
});
app.post("/classes", function (req, res) {
  const retalk = (email, pass) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          function thens(dt) {
            res.send(JSON.stringify(dt));
          }
          var path = "classes";
          // Create References
          const dbRefObject = firebase.database().ref().child(path);

          // Sync object changes
          dbRefObject.once("value", (snap) => thens(snap.val()));
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }

    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
  }
});
app.post("/auth", function (req, res) {
  const retalk = (email, pass) => {
    function verify(dt) {
      if (dt != null) {
        if (dt == pass) {
          tmMsg(email + " now accessed the Payments Portal");
          res.status(200);
          res.send(pass);
        } else {
          res.status(301);
          res.send("Incorrect Password");
        }
      } else {
        res.status(404);
        res.send("No Such User");
      }
    }
    var path = "allows/" + email.split(".").join("&");
    //var path = "allows/"+email.replaceAll(".","&")
    console.log(path);
    // Create References
    const dbRefObject = sad.database().ref().child(path);

    // Sync object changes
    dbRefObject.once("value", (snap) => verify(snap.val()));
  };

  authid = "R6VzrAkdsXDAaEOT^Tob19O5@$9@V#$Ic&u!QCGR4LO$3&ktCV";
  authid2 = "fuck";
  console.log("receiving data ...");
  console.log("body is ", req.body);
  console.log("body is ", req.body.auth);
  if (req.body.auth != undefined) {
    temp = req.body.auth;
    console.log(
      CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8)
    );
    aa = CryptoJS.AES.decrypt(temp, authid2).toString(CryptoJS.enc.Utf8);
    console.log(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
    retalk(JSON.parse(aa)["email"], JSON.parse(aa)["pass"]);
  }
});

app.post("/getuserid", (req, res) => {
  const email = req.body.email;
  console.log('Request: Get User ID for ' + email)
  firebase
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      console.log(userRecord)
      console.log(userRecord.uid)
      res.status(200).send(userRecord.uid);
    })
    .catch((error) => {
      console.log(error.message)
      res.status(400).send(error.message);
    });
});

app.post("/banstudent", (req, res) => {
  const email = req.body.email;
  console.log('Request: Ban Student ' + email)
  if (!email) {
    res.status(400).send("Email is missing from request body");
    return;
  }

  firebase
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      return firebase.auth().updateUser(userRecord.uid, {
        disabled: true,
      });
    })
    .then(() => {
      console.log(`${email} has been disabled`);
      res.status(200).send(`User account with email ${email} has been disabled`);
      tmMsg(`🔒 User account with email ${email} has been disabled`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to disable user account");
    });
});

app.post("/unbanstudent", (req, res) => {
  const email = req.body.email;
  console.log('Request: Unban Student ' + email)
  if (!email) {
    res.status(400).send("Email is missing from request body");
    return;
  }

  firebase
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      return firebase.auth().updateUser(userRecord.uid, {
        disabled: false,
      });
    })
    .then(() => {
      console.log(`${email} has been enabled`);
      res.status(200).send(`User account with email ${email} has been enabled`);
      tmMsg(`🔓 User account with email ${email} has been enabled`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to enable user account");
    });
});

app.post("/changepassword", async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;

  console.log("Request: Change Password for " + email + " as " + newPassword)

  try {
    // fetch user by email
    const userRecord = await firebase.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // update user password
    await firebase.auth().updateUser(uid, {
      password: newPassword
    });

    console.log("Password changed successfully for " + email + " (" + newPassword + ")" );
    tmMsg("<b>🔑 Password changed successfully</b> \n Email: " + email + "\n New Password: " + newPassword);
    res.status(200).send("Password changed successfully for " + email + " (" + newPassword + ")");
  } catch (error) {

    console.error(error);
    res.status(500).send("Error changing password");
  }
});

// start the server
app.listen(port);
console.log("Server started! At http://localhost:" + port);
