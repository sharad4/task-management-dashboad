import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';

const changeFiles = new Set();

const watcher = chokidar.watch('.', {
    ignored: /(^|[/\\])(\..|node_modules)/,
    persistent: true,
});

let debounceTimer;

watcher.on('change', (filePath) => {
    const fileName = path.basename(filePath);
    changeFiles.add(fileName);
    console.log(`📝 File changed: ${fileName}`);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (changeFiles.size === 0) return;
        const fileList = [...changeFiles].join(', ');
        const commitMessage = `Auto-commit: update ${fileList}`;

        console.log(`🚀 Committing changes: ${commitMessage}`);
        exec(`git add . && git commit -m "${commitMessage}"`, (error, stdout) => {
            if (error) {
                console.error(`Commit error: ${error}`);
            } else {
                console.log(`Commit successful: ${stdout}`);
            }
                changeFiles.clear();
        }, 2000);
    })
});