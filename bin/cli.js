#! /usr/bin/env node

console.log("jo horse is running!");

const { exec } = require("child_process");
const path = require("path");

const getCurrentBranch = () => {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    return exec(
      "git rev-parse --abbrev-ref HEAD",
      { cwd },
      (error, stdout, stderr) => {
        if (error) {
          if (error.message.includes("not a git repository")) {
            message = "the directory " + cwd + " is not a git repo";
            return reject(new Error(message));
          }

          return exec(
            "git status",
            { cwd },
            (error, stdout, stderr) => {
              if (error) {
                return reject(error);
              }

              const onBranchLine = stdout.split("\n")[0];
              const branchMatch =
                onBranchLine.match(/^On branch (.+)$/);

              if (!branchMatch) {
                return reject(
                  new Error("could not find branch from git status"),
                );
              }
              return resolve(branchMatch[1]);
            },
          );
        }

        if (stderr) {
          return reject(new Error(stderr));
        }

        return resolve(stdout.trim());
      },
    );
  });
};

const checkForRemoteOrigin = () => {
  return new Promise((resolve, reject) => {
    exec("git remote", (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(new Error(stderr));
      }
      const remotes = stdout.trim().split("\n");
      resolve(remotes.includes("origin"));
    });
  });
};

const gitAddCommitPushAll = async (branch) => {
  const hasOrigin = await checkForRemoteOrigin();
  const commands = [
    "git add -A",
    "git commit --allow-empty-message --message ''",
  ];
  if (hasOrigin) {
    commands.push(`git push origin ${branch}`);
  } else {
    console.log("🙂‍↔️ not pushing because");
    console.log("   there is no remote named 'origin'");
  }
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    return exec(commands.join(" && "), { cwd }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);

      return resolve();
    });
  });
};

const gitAddCommitPushTracked = async (branch) => {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    const commands = [
      "git add -u",
      "git commit --allow-empty-message --message ''",
      `git push origin ${branch}`,
    ].join(" && ");
    return exec(commands, { cwd }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);

      return resolve();
    });
  });
};

const getTrackedFiles = () => {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();

    return exec("git ls-files", { cwd }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      if (stderr) {
        return reject(new Error(stderr));
      }

      const files = stdout.trim().split("\n").filter(Boolean);
      return resolve(files);
    });
  });
};

const printEvent = (event, path) => {
  const time = new Date().toLocaleTimeString();
  const relPath = path.replace(process.cwd() + "/", "");
  console.log("[" + time + "] " + event + ": " + relPath);
};

const watchAllFiles = (branch) => {
  const chokidar = require("chokidar");
  const watcher = chokidar.watch("**/*", {
    persistent: true,
    ignoreInitial: true,
    ignored: ["**/node_modules/**", "**/.git/**"],
    usePolling: false,
  });
  console.log("🐎 watching for changes");
  watcher
    .on("change", async (path) => {
      printEvent("changed", path);
      try {
        console.log("🎠 tracking changes");
        await gitAddCommitPushAll(branch);
        console.log("🦄 changes tracked successfully!");
      } catch (error) {
        console.error("❌ error tracking changes:", error.message);
      }
    })
    .on("unlink", async (path) => {
      printEvent("deleted", path);
      try {
        console.log("🎠 tracking deletions");
        await gitAddCommitPushAll(branch);
        console.log("🦄 deletions tracked successfully!");
      } catch (error) {
        console.error("❌ error tracking deletions:", error.message);
      }
    })
    .on("add", async (path) => {
      printEvent("added", path);
      try {
        console.log("🎠 tracking additions");
        await gitAddCommitPushAll(branch);
        console.log("🦄 additions tracked successfully!");
      } catch (error) {
        console.error("❌ error tracking additions:", error.message);
      }
    });

  process.on("SIGINT", () => {
    console.log("\n🐴 stopping file watch...");
    watcher.close().then(() => process.exit(0));
  });
};

const watchTrackedFiles = (branch, files) => {
  const chokidar = require("chokidar");
  const watcher = chokidar.watch(files, {
    persistent: true,
    ignoreInitial: true,
    usePolling: false,
  });
  console.log("🐎 watching for changes");

  watcher
    .on("change", async (path) => {
      printEvent("changed", path);
      try {
        console.log("🎠 tracking changes");
        await gitAddCommitPushTracked(branch);
        console.log("🦄 changes tracked successfully!");
      } catch (error) {
        console.error("❌ error tracking changes:", error.message);
      }
    })
    .on("unlink", (path) => printEvent("deleted", path))
    .on("add", (path) => printEvent("added", path));

  process.on("SIGINT", () => {
    console.log("\n🐴 stopping file watch...");
    watcher.close().then(() => process.exit(0));
  });
};

async function main() {
  try {
    const branch = await getCurrentBranch();
    console.log("🏇 current branch: " + branch);
    const files = await getTrackedFiles();
    console.log("files:");
    console.log(JSON.stringify(files, null, 2));
    try {
      require.resolve("chokidar");
    } catch (e) {
      console.log("Installing required dependencies...");
      exec("npm install chokidar", { cwd: __dirname }, (error) => {
        if (error) {
          console.error("Error installing dependencies:", error);
          process.exit(1);
        }
      });
    }
    watchAllFiles(branch);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
