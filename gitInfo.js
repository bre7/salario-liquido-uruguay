const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const execSyncWrapper = (command) => {
  let stdout = null
  try {
    stdout = execSync(command).toString().trim()
  } catch (error) {
    console.error(error)
  }
  return stdout
}

const main = () => {
  const gitCommitHash = execSyncWrapper("git rev-parse --short=7 HEAD")

  const filePath = path.resolve("__generated__", "git-info.json")
  const fileContents = JSON.stringify({ gitCommitHash }, null)

  fs.writeFileSync(filePath, fileContents)
  console.log(`Wrote the following contents to ${filePath}\n${fileContents}`)
}

main()
