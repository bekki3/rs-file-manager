const printWorkingDirectory = () => {
    const path_to_working_directory = process.cwd();
    console.log(`You are currently in ${path_to_working_directory}`);
};

export default printWorkingDirectory;