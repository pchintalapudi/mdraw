let localStorageAllowed = true;
let loadTime = Date.now();
const FILE_MANIFEST = "mdraw-file-manifest";
const compiledManifest = new Set<string>();
try {
    localStorage.setItem("tester", "");
    localStorage.removeItem("tester");
    if (localStorage.getItem(FILE_MANIFEST) === null) {
        localStorage.setItem(FILE_MANIFEST, Date.now().toString());
    }
    readManifest();
    window.addEventListener("beforeunload", writeManifest);
} catch {
    localStorageAllowed = false;
}

function readManifest() {
    localStorage.getItem(FILE_MANIFEST)!.split(" ").slice(1).forEach(s => s && compiledManifest.add(s));
    loadTime = Number(localStorage.getItem(FILE_MANIFEST)![0]);
}

function writeManifest() {
    if (Number(localStorage.getItem(FILE_MANIFEST)![0]) === loadTime) {
        localStorage.setItem(FILE_MANIFEST, `${Date.now()} ${Array.from(compiledManifest).join(" ")}`);
    } else {
        const presentSet = new Set(localStorage.getItem(FILE_MANIFEST)!.slice(1));
        compiledManifest.forEach(s => presentSet.add(s));
        localStorage.setItem(FILE_MANIFEST,
            `${Date.now()} ${Array.from(presentSet).filter(s => localStorage.getItem(s) !== null).join(" ")}`);
    }
    compiledManifest.clear();
    readManifest();
}

function saveFile(name: string, data: string, override = false) {
    if (!localStorageAllowed) {
        return "LocalStorage not allowed";
    } else if (compiledManifest.has(name) && !override) {
        return "Name already exists";
    } else {
        const isize = compiledManifest.size;
        compiledManifest.add(name);
        localStorage.setItem(`files/${name}`, data);
        if (isize !== compiledManifest.size) {
            setTimeout(writeManifest, 0);
        }
    }
}

function getFiles() {
    if (!localStorageAllowed) {
        return "LocalStorage not allowed";
    } else {
        return Array.from(compiledManifest);
    }
}

function loadFile(name: string) {
    if (!compiledManifest.has(name)) {
        return "File not found";
    } else {
        return localStorage.getItem(`files/${name}`)!;
    }
}

function deleteFile(name: string) {
    localStorage.remove(name);
    compiledManifest.delete(name);
    setTimeout(writeManifest, 0);
}

export { saveFile, getFiles, loadFile, deleteFile };
