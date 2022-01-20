const path = require('path')
const { spawn } = require('child_process')
/**
   * Run python myscript, pass in `-u` to not buffer console output
   * @return {ChildProcess}
*/
function runScript(sessionId) {
    moperCorePath = path.join(__dirname, "run_moperCore.sh")
    mrcPath = "/usr/local/MATLAB/MATLAB_Runtime/v99"
    return spawn('bash', ["-u", moperCorePath, mrcPath, sessionId]);
}
const subprocess = runScript(21)
// print output of script
subprocess.stdout.on('data', (data) => {
    console.log(`data:${data}`);
});
subprocess.stderr.on('data', (data) => {
    console.log(`error:${data}`);
});
subprocess.stderr.on('close', () => {
    console.log("Closed");
});
