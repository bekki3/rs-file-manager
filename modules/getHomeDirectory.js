import os from "os";

const getHomeDirectory = () => {
    const homedir = os.homedir();
    console.log(`Home directory: ${homedir}`);
};

export default getHomeDirectory;