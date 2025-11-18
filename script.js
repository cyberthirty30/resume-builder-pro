
let editor;

// Monaco loader
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: localStorage.getItem("latexResume") || defaultTex(),
        language: "latex",
        theme: "vs-light",
        fontSize: 14,
        automaticLayout: true
    });

    // Autosave
    editor.onDidChangeModelContent(() => {
        localStorage.setItem("latexResume", editor.getValue());
    });
});

// Default LaTeX
function defaultTex() {
return `
\\documentclass[11pt,a4paper]{moderncv}
\\moderncvstyle{casual}
\\moderncvcolor{blue}
\\usepackage[scale=0.78]{geometry}
\\name{Lucky}{Ngabu}
\\title{Producer & Software Engineer}

\\begin{document}
\\makecvtitle

\\section{Summary}
Creative music producer and software developer.

\\end{document}
`;
}

// Dark mode toggle
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
    monaco.editor.setTheme(
        document.body.classList.contains("dark") ? "vs-dark" : "vs-light"
    );
};

// Compile LaTeX
function compileLaTeX() {
    const code = editor.getValue();
    const url = "https://latexonline.cc/compile";

    fetch(url, {
        method: "POST",
        body: JSON.stringify({ code, format: "pdf" }),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.blob())
    .then(blob => {
        const pdfURL = URL.createObjectURL(blob);
        document.getElementById("pdfViewer").src = pdfURL;
        window.generatedPDF = blob;
    })
    .catch(err => alert("Compilation error: " + err));
}

// Download functions
function downloadTex() {
    const blob = new Blob([editor.getValue()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "resume.tex" });
    a.click();
}

function downloadMarkdown() {
    const md = "```latex\n" + editor.getValue() + "\n```";
    const blob = new Blob([md], { type: "text/markdown" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "resume.md" });
    a.click();
}

function downloadPDF() {
    if (!window.generatedPDF) return alert("Compile first!");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(window.generatedPDF), download: "resume.pdf" });
    a.click();
}
