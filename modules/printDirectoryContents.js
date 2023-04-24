import fs from "fs";
import path from "path";

const printDirectoryContents = () => {
    const currentDirectory = process.cwd();
    fs.readdir(currentDirectory, (err, files) => {
        if (err) {
            console.log("Operation failed");
            return;
        }
        const directories = [];
        const otherFiles = [];
        files.forEach((file) => {
            const filePath = path.join(currentDirectory, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                directories.push(file);
            } else {
                otherFiles.push(file);
            }
        });
        directories.sort();
        otherFiles.sort();
        console.log("\n\n\tIndex \tName  \tType");
        let index = 0;
        directories.forEach((dir) => {
            console.log(`\t${index}\t${dir}\t(directory)`);
            index++;
        });
        otherFiles.forEach((file) => {
            console.log(`\t${index}\t${file}\t(file)`);
            index++;
        });
        console.log("\n");
    });
};

export default printDirectoryContents;