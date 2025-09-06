// language config (frontend side)
const languageConfig = {
  python3: { mode: "python", jdoodleLang: "python3", versionIndex: "3" },
  cpp17: { mode: "text/x-c++src", jdoodleLang: "cpp17", versionIndex: "0" },
  java: { mode: "text/x-java", jdoodleLang: "java", versionIndex: "4" },
  nodejs: { mode: "javascript", jdoodleLang: "nodejs", versionIndex: "3" },
};

// init CodeMirror on the textarea
const editorEl = document.getElementById("editor");
const editor = CodeMirror.fromTextArea(editorEl, {
  lineNumbers: true,
  mode: languageConfig.python3.mode,
  theme: "dracula",
  tabSize: 4,
  indentUnit: 4,
  autofocus: true,
});

// elements
const runBtn = document.getElementById("runBtn");
const outputEl = document.getElementById("output");
const langSelect = document.getElementById("language");
const stdinEl = document.getElementById("stdin");

// change editor mode when language changes
langSelect.addEventListener("change", (e) => {
  const cfg = languageConfig[e.target.value] || languageConfig.python3;
  editor.setOption("mode", cfg.mode);
  // optional: set starter code
  // if (e.target.value === 'python3') editor.setValue("print('Hello')");
});

// run code
runBtn.addEventListener("click", async () => {
  runBtn.disabled = true;
  const oldText = runBtn.textContent;
  runBtn.textContent = "Running…";
  outputEl.textContent = "";

  const langKey = langSelect.value;
  const cfg = languageConfig[langKey];
  const payload = {
    language: cfg.jdoodleLang,
    versionIndex: cfg.versionIndex,
    code: editor.getValue(),
  };
  // include stdin only if present
  const stdin = stdinEl.value.trim();
  if (stdin.length) payload.stdin = stdin;

  try {
    const res = await fetch("/api/compiler/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    // JDoodle-like response: prefer data.output
    if (data?.output) outputEl.textContent = data.output;
    else outputEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    outputEl.textContent = "Error: " + (err.message || err);
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = oldText;
  }
});
