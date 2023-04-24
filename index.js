import readline from "readline";
import path from "path";
import os from "os";
import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";

import printWorkingDirectory from "./modules/printWorkingDirectory.js";
import printDirectoryContents from "./modules/printDirectoryContents.js";
import printCPUArchitecture from "./modules/printCPUArchitecture.js";
import getHomeDirectory from "./modules/getHomeDirectory.js";
import getSystemUsername from "./modules/getSystemUsername.js";
import printCPUInfo from "./modules/printCPUInfo.js";
import printEOL from "./modules/printEOL.js";

const args = process.argv;
const username = args.slice(2)[0].split("=")[1];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`Welcome to the File Manager, ${username}!`);

process.on("SIGINT", () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

process.stdin.on("keypress", function(chunk, key) {
    if (key && key.name === "c" && key.ctrl) {
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      process.exit();
    }
  });

printWorkingDirectory();

const goUpper = () => {
    const cwd = process.cwd();
    const parentDir = path.dirname(cwd);
    const homedir = os.homedir();
    if (parentDir !== cwd && homedir !== cwd) {
        process.chdir(parentDir);
    }
};

const goToDirectory = (path_to_directory) => {
    try {
        process.chdir(path_to_directory);
    } catch (err) {
        console.log("Operation failed");
    }
};



const readFileContent = (path_to_file) => {
    const readStream = fs.createReadStream(path_to_file);
    readStream.on("error", (err) => {
        console.log("Operation failed");
    });
    readStream.pipe(process.stdout);
    console.log("\n");
};

const createEmptyFile = (new_file_name) => {
    const currentDirectory = process.cwd();
    const filePath = path.join(currentDirectory, new_file_name);
    fs.writeFile(filePath, "", (err) => {
        if (err) {
            console.log("Operation failed");
            return;
        }
        console.log(`\nFile ${new_file_name} created successfully\n`);
    });
};

const renameFile = (path_to_file, new_filename) => {
    const currentDirectory = process.cwd();
    const newFilePath = path.join(currentDirectory, new_filename);
    fs.rename(path_to_file, newFilePath, (err) => {
        if (err) {
            console.log("Operation failed");
            return;
        }
        console.log(`File ${path_to_file} renamed to ${new_filename}`);
    });
};

const copyFile = (path_to_file, path_to_new_directory) => {
    const fileName = path.basename(path_to_file);
    const newFilePath = path.join(path_to_new_directory, fileName);
    const readStream = fs.createReadStream(path_to_file);
    const writeStream = fs.createWriteStream(newFilePath);
    readStream.on("error", (err) => {
        console.log("Operation failed: ", err);
    });
    writeStream.on("error", (err) => {
        console.log("Operation failed", err);
    });
    readStream.pipe(writeStream);
};

const moveFile = (filePath, newDirectoryPath) => {
    const fileName = path.basename(filePath);
    const newFilePath = path.join(newDirectoryPath, fileName);
    fs.rename(filePath, newFilePath, (err) => {
        if (err) {
            console.log("Operation failed");
            return;
        }
        console.log(`File ${filePath} moved to ${newFilePath}`);
    });
};

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("Operation failed");
            return;
        }
        console.log(`File ${filePath} deleted`);
    });
};

const printFileHash = (filePath) => {
    const hash = crypto.createHash("sha256");
    const readStream = fs.createReadStream(filePath);
    readStream.on("error", (err) => {
        console.log("Operation failed");
    });
    readStream.on("data", (chunk) => {
        hash.update(chunk);
    });
    readStream.on("end", () => {
        const fileHash = hash.digest("hex");
        console.log(`File hash: ${fileHash}`);
    });
};

const compressFile = (filePath, destinationPath) => {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(destinationPath);
    const brotli = zlib.createBrotliCompress();
    readStream.on("error", (err) => {
        console.log("Operation failed");
    });
    writeStream.on("error", (err) => {
        console.log("Operation failed");
    });
    readStream.pipe(brotli).pipe(writeStream);
};

const decompressFile = (filePath, destinationPath) => {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(destinationPath);
    const brotli = zlib.createBrotliDecompress();
    readStream.on("error", (err) => {
        console.log("Operation failed");
    });
    writeStream.on("error", (err) => {
        console.log("Operation failed");
    });
    readStream.pipe(brotli).pipe(writeStream);
};

rl.on("line", (input) => {
    if (input === ".exit") {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        rl.close();
    } else if (input === "up") {
        goUpper();
    } else if (input.startsWith("cd ")) {
        const path_to_directory = input.slice(3);
        goToDirectory(path_to_directory);
    } else if (input === "ls") {
        printDirectoryContents();
    } else if (input.startsWith("cat ")) {
        const path_to_file = input.slice(4);
        readFileContent(path_to_file);
    } else if (input.startsWith("add ")) {
        const new_file_name = input.slice(4);
        createEmptyFile(new_file_name);
    } else if (input.startsWith("rn ")) {
        const [path_to_file, new_filename] = input.split(" ").slice(1);
        renameFile(path_to_file, new_filename);
    } else if (input.startsWith("cp ")) {
        const [path_to_file, path_to_new_directory] = input.split(" ").slice(1);
        copyFile(path_to_file, path_to_new_directory);
    } else if (input.startsWith("mv ")) {
        const [path_to_file, path_to_new_directory] = input.split(" ").slice(1);
        moveFile(path_to_file, path_to_new_directory);
    } else if (input.startsWith("rm ")) {
        const path_to_file = input.slice(3);
        deleteFile(path_to_file);
    } else if (input.startsWith("os ")) {
        const command = input.slice(5);
        if (command === "EOL") {
            printEOL();
        } else if (command === "cpus") {
            printCPUInfo();
        } else if (command === "homedir") {
            getHomeDirectory();
        } else if (command === "username") {
            getSystemUsername();
        } else if (command === "architecture") {
            printCPUArchitecture();
        } else {
            console.log("Wrong input!");
        }
    } else if (input.startsWith("hash ")) {
        const path_to_file = input.slice(5);
        printFileHash(path_to_file);
    } else if (input.startsWith("compress ")) {
        const [path_to_file, path_to_destination] = input.split(" ").slice(1);
        compressFile(path_to_file, path_to_destination);
    } else if (input.startsWith("decompress ")) {
        const [path_to_file, path_to_destination] = input.split(" ").slice(1);
        decompressFile(path_to_file, path_to_destination);
    } else {
        console.log("Invalid input");
    }
    printWorkingDirectory();
});


