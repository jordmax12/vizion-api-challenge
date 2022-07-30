const sh = require("child_process").execSync;

const author = sh("git config --get user.email").toString().trim();
const commits = sh(`git log --author=${author}`).toString().trim();

if (!commits) {
  console.error(
    "This repo has no commits from the current git user. Did you commit your changes?"
  );
  process.exit(1);
}

const result = sh(`git bundle create take-home-challenge.bundle HEAD main`);
console.log(`Nice work, you created take-home-challenge.bundle.`);
console.log(
  "Please upload it using the link sent to you in the initial email."
);
