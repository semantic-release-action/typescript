const fs = require("fs");
const path = require("path");

/**
 * Custom semantic-release plugin to print the .npmrc file used during publishing.
 * This plugin receives the context from semantic-release and inspects the npm configuration.
 */

async function publish(pluginConfig, context) {
  const { cwd, logger } = context;

  logger.log(
    "==> Inspecting semantic-release context for .npmrc information <=="
  );
  logger.log(`Working directory: ${cwd}`);

  // Check for .npmrc in the working directory
  const cwdNpmrc = path.join(cwd, ".npmrc");
  if (fs.existsSync(cwdNpmrc)) {
    logger.log(`Found .npmrc at: ${cwdNpmrc}`);
    const content = fs.readFileSync(cwdNpmrc, "utf8");
    logger.log("==> .npmrc contents <==");
    logger.log(content);
  } else {
    logger.log("No .npmrc found in working directory");
  }

  // Also check what npm config is being used by reading npm's actual config
  const { execSync } = require("child_process");
  try {
    logger.log("==> npm config userconfig <==");
    const userconfig = execSync("npm config get userconfig", {
      encoding: "utf8",
      cwd,
    }).trim();
    logger.log(`npm userconfig path: ${userconfig}`);

    if (userconfig && userconfig !== "undefined" && fs.existsSync(userconfig)) {
      const content = fs.readFileSync(userconfig, "utf8");
      logger.log("==> npm userconfig contents <==");
      logger.log(content);
    }
  } catch (error) {
    logger.error(`Error reading npm config: ${error.message}`);
  }
}

module.exports = { publish };
