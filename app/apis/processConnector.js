const { spawn } = require("child_process");
const { promises } = require("dns");
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

module.exports.matchProc = async (email, uid, policy) => {
    console.log("Start match")
    const child = spawn(setup.pythonPath, ['./algorithms/app.py', email, uid, ...(policy.split(' '))])
    let output = ''

    for await (const data of child.stdout) {
      // console.log(`child stdout:\n${data}`);
      if (data.includes('matched uid')) output = data
    }

    for await (const data of child.stderr) {
      console.log(`child stderr:\n${data}`);
    }
    
    const exitCode = await new Promise( (resolve, reject) => {
      child.on('close', resolve);
    });
    
    return output;
}