import os from "os";

const getSystemUsername = () => {
    const systemUsername = os.userInfo().username;
    console.log("System username: ", systemUsername);
};

export default getSystemUsername;