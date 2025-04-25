#!/usr/bin/env node
const semver = require('semver');
const fs = require('fs');

const arguments = process.argv;
let incrementSize = 'patch';

if (arguments.length > 2) {
  const inc = arguments[2];
  if (inc === 'patch' || inc === 'minor' || inc === 'major') {
    incrementSize = inc;
  }
}

console.log('\nChecking affected projects...\n');

const exec = require('node:child_process').exec;

let childProcess = exec(
  'nx show projects --affected --exclude "api-mock-*,lib-*,tool-*" --json',
  (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  },
);

childProcess.stdout.on('data', function (data) {
  const affectedProjects = JSON.parse(data);
  if (affectedProjects.length === 0) {
    console.log('✅ No affected projects found\n\n');
    return;
  } else {
    console.log(
      `🚀 Updating ${affectedProjects.length} affected projects...\n`,
    );
  }
  affectedProjects.forEach((project) => {
    const projectFile = require(`../apps/${project}/project.json`);
    const file = `git show main:apps/${project}/project.json`;

    let childGitProcess = exec(file, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });

    childGitProcess.stdout.on('data', function (data) {
      const projectFileFromMain = JSON.parse(data);
      const tagsFromMain =
        projectFileFromMain.targets.container.options.metadata.tags;
      const tagsFromFile = projectFile.targets.container.options.metadata.tags;
      const vtag = tagsFromMain[tagsFromMain.length - 1];
      const vtagVal = vtag.split(',')[1];
      const vtagVersion = vtagVal.split('=')[1];

      const newVersion = semver.inc(semver.valid(vtagVersion), incrementSize);
      tagsFromFile[tagsFromFile.length - 1] = vtag.replace(
        vtagVersion,
        newVersion,
      );

      try {
        fs.writeFileSync(
          `apps/${project}/project.json`,
          JSON.stringify(projectFile, null, 2),
        );

        console.log(
          `✅ Updated: ${vtagVersion} to ${newVersion} - Project: ${project}`,
        );
        exec(`nx format:write apps/${project}/project.json`);
      } catch (err) {
        console.error(err);
      }
    });
  });
});
