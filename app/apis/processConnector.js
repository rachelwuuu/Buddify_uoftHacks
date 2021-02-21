const { spawn } = require("child_process");
const { setup } = require("../deploy");

module.exports.testProc = () => {
  console.log("Start test proc");
  const child = spawn("pwd");
  child.stdout.on("data", (data) => {
    console.log(`child stdout:\n${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`child stderr:\n${data}`);
  });
  child.on("exit", function (code, signal) {
    console.log(
      "child process exited with " + `code ${code} and signal ${signal}`
    );
  });
};

module.exports.matchProc = (email, uid, policy) => {
    console.log("Start match")
    const child = spawn(setup.pythonPath, ['./algorithms/app.py', email, uid, policy])

    child.stdout.on("data", (data) => {
        console.log(`child stdout:\n${data}`);
    });

    child.stderr.on("data", (data) => {
        console.error(`child stderr:\n${data}`);
    });
    child.on("exit", function (code, signal) {
        console.log(
        "child process exited with " + `code ${code} and signal ${signal}`
        );
    });
}