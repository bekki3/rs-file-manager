import os from "os";

const printCPUArchitecture = () => {
    const architecture = os.arch();
    console.log(`CPU architecture: ${architecture}`);
};

export default printCPUArchitecture;