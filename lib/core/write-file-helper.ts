import { writeFile as nodeWriteFile } from "fs";
import { promisify } from "util";

export default {
  writeFile: promisify(nodeWriteFile)
};
