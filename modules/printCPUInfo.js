import os from "os";

const printCPUInfo = () => {
    const cpus = os.cpus();
    console.log(`Number of CPUs: ${cpus.length}`);
    cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}:`);
        console.log(`\tModel: ${cpu.model}`);
        console.log(`\tSpeed: ${cpu.speed / 1000} GHz`);
    });
};

export default printCPUInfo;