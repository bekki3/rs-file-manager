import os from "os";

const printEOL = () => {
    const eol = os.EOL;
    console.log(`End-Of-Line: ${eol}`);
};

export default printEOL;