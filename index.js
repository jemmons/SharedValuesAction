const core = require('@actions/core');
const exec = require('@actions/exec');


async function run() {
  try {
    const ref = core.getInput('githubRef', { required: true });
    const repo = core.getInput('githubRepository', { required: true });
    const ccDir = 'CodeClimateBin';     

    core.startGroup('Set Constants');
    core.setOutput('ccVersion', '0.7.0');
    core.setOutput('ccDirecgtory', ccDir);
    core.setOutput('ccPath', ccDir + '/cc-test-reporter');
    core.setOutput('resultPath', 'Output.xcresult');
    core.setOutput('buildCachePath', 'BuildCache');  
    core.endGroup();


    core.startGroup('Parse Swift Version');
    let swiftVersionString = '';
    await exec.exec('swift', ['--version'], {
      listeners: {
        stdout: (data) => {
          swiftVersionString += data.toString();
        }
      }
    });
    const ver = swiftVersionString.match(/\d+\.\d+(?:\.\d+)?/g)[0];
    core.setOutput('swiftVersion', ver);
    core.endGroup();

    
    core.startGroup('Parse Branch');
    const branch = /refs\/heads\/(.+)$/.exec(ref)[1];
    core.setOutput('branch', branch);
    core.endGroup();


    core.startGroup('Parse Project');
    const project = /[^\/]+\/(.+)$/.exec(repo)[1];
    core.setOutput('project', project);
    core.endGroup();
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
