const util = require("util");
const fsSync = require("fs");
const fs = {
  writeFile: util.promisify(fsSync.writeFile),
  mkdir: util.promisify(fsSync.mkdir),
  readFile: util.promisify(fsSync.readFile),
  copyFile: util.promisify(fsSync.copyFile),
  readdir: util.promisify(fsSync.readdir),
};
const path = require("path");

/**
 * @param {string} srcDirectory
 * @param {string} destDir
 */
module.exports = async function copyDir(srcDirectory, destDir) {
  const items = await fs.readdir(srcDirectory);
  items.forEach(function (childItemName) {
    copyDirHelp(
      path.join(srcDirectory, childItemName),
      path.join(destDir, childItemName)
    );
  });
};

/**
 * @param {string} src
 * @param {string} dest
 */
async function copyDirHelp(src, dest) {
  var exists = fsSync.existsSync(src);
  var stats = exists && fsSync.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    await fs.mkdir(dest);
    const items = await fs.readdir(src);
    items.forEach(function (childItemName) {
      copyDirHelp(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFile(src, dest);
  }
}