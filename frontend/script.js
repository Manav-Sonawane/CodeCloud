// Language configuration mapping to backend
const languageConfig = {
  python3: {
    mode: "python",
    jdoodleLang: "python3",
    versionIndex: "3",
    extension: ".py",
    template: 'print("Hello, World!")',
  },
  cpp17: {
    mode: "text/x-c++src",
    jdoodleLang: "cpp17",
    versionIndex: "0",
    extension: ".cpp",
    template:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  },
  java: {
    mode: "text/x-java",
    jdoodleLang: "java",
    versionIndex: "4",
    extension: ".java",
    template:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  nodejs: {
    mode: "javascript",
    jdoodleLang: "nodejs",
    versionIndex: "3",
    extension: ".js",
    template: 'console.log("Hello, World!");',
  },
};

// Global state
let isSignedIn = false;
let currentLanguage = "python3";
let activeTab = "main.py";
let files = [
  {
    id: 1,
    name: "main.py",
    content: languageConfig.python3.template,
    language: "python3",
  },
];

// Global variables for CodeMirror
let codeMirrorEditor = null;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  renderFiles();
  renderTabs();
  setupCodeEditor();
  loadActiveFile();
});

function setupCodeEditor() {
  const editorTextarea = document.getElementById("code-editor");

  // Initialize CodeMirror
  codeMirrorEditor = CodeMirror.fromTextArea(editorTextarea, {
    mode: languageConfig.python3.mode,
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    smartIndent: true,
    lineWrapping: false,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  });

  // Set editor size
  codeMirrorEditor.setSize("100%", "100%");

  // Update cursor position
  codeMirrorEditor.on("cursorActivity", updateCursorPosition);
  codeMirrorEditor.on("change", function () {
    updateCurrentFileContent();
    updateCursorPosition();
  });

  // Focus on editor
  codeMirrorEditor.focus();

  // Handle window resize
  window.addEventListener("resize", function () {
    if (codeMirrorEditor) {
      setTimeout(() => {
        codeMirrorEditor.refresh();
      }, 100);
    }
  });

  function updateCursorPosition() {
    if (codeMirrorEditor) {
      const cursor = codeMirrorEditor.getCursor();
      const statusRight = document.getElementById("status-right");
      if (statusRight) {
        statusRight.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
      }
    }
  }

  function updateCurrentFileContent() {
    if (codeMirrorEditor && activeTab) {
      const currentFile = files.find((file) => file.name === activeTab);
      if (currentFile) {
        currentFile.content = codeMirrorEditor.getValue();
      }
    }
  }
}

function renderFiles() {
  const filesList = document.getElementById("files-list");
  filesList.innerHTML = "";

  files.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.className = `file-item ${file.name === activeTab ? "active" : ""}`;
    fileItem.innerHTML = `
      <div class="file-info">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>${file.name}</span>
      </div>
      ${
        files.length > 1
          ? `
        <div class="close-file" onclick="closeFile('${file.name}', event)">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      `
          : ""
      }
    `;

    fileItem.addEventListener("click", () => switchToFile(file.name));
    filesList.appendChild(fileItem);
  });
}

function renderTabs() {
  const tabsContainer = document.getElementById("tabs-container");
  tabsContainer.innerHTML = "";

  files.forEach((file) => {
    const tab = document.createElement("div");
    tab.className = `tab ${file.name === activeTab ? "active" : ""}`;
    tab.innerHTML = `
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <span>${file.name}</span>
      ${
        files.length > 1
          ? `
        <div class="tab-close" onclick="closeFile('${file.name}', event)">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      `
          : ""
      }
    `;

    tab.addEventListener("click", () => switchToFile(file.name));
    tabsContainer.appendChild(tab);
  });
}

function loadActiveFile() {
  const editorTitle = document.getElementById("editor-title");
  const file = files.find((f) => f.name === activeTab);

  if (file && codeMirrorEditor) {
    // Set content
    codeMirrorEditor.setValue(file.content);
    editorTitle.textContent = file.name;

    // Set appropriate mode based on file language
    const cfg = languageConfig[file.language];
    if (cfg) {
      codeMirrorEditor.setOption("mode", cfg.mode);
    }

    // Focus and refresh
    codeMirrorEditor.focus();
    codeMirrorEditor.refresh();
  }
}

function switchToFile(fileName) {
  activeTab = fileName;
  renderFiles();
  renderTabs();
  loadActiveFile();
}

function closeFile(fileName, event) {
  event.stopPropagation();
  if (files.length > 1) {
    files = files.filter((f) => f.name !== fileName);
    if (activeTab === fileName) {
      activeTab = files[0].name;
    }
    renderFiles();
    renderTabs();
    loadActiveFile();
  }
}

function addNewFile() {
  const fileId = files.length + 1;
  const cfg = languageConfig[currentLanguage];
  const newFile = {
    id: fileId,
    name: `main${fileId}${cfg.extension}`,
    content: cfg.template,
    language: currentLanguage,
  };

  files.push(newFile);
  activeTab = newFile.name;
  renderFiles();
  renderTabs();
  loadActiveFile();
}

function toggleLanguageDropdown() {
  const dropdown = document.getElementById("language-dropdown");
  dropdown.classList.toggle("show");

  // Close dropdown when clicking outside
  document.addEventListener("click", function closeDropdown(e) {
    if (!e.target.closest(".language-selector")) {
      dropdown.classList.remove("show");
      document.removeEventListener("click", closeDropdown);
    }
  });
}

function selectLanguage(lang, name) {
  currentLanguage = lang;
  document.getElementById("current-language").textContent = name;
  document.getElementById("language-dropdown").classList.remove("show");

  // Update CodeMirror mode if editor is initialized
  if (codeMirrorEditor) {
    const cfg = languageConfig[lang];
    if (cfg) {
      codeMirrorEditor.setOption("mode", cfg.mode);
    }

    // Update current file's language
    const currentFile = files.find((file) => file.name === activeTab);
    if (currentFile) {
      currentFile.language = lang;
    }
  }
}

function showSignInModal() {
  document.getElementById("signin-modal").classList.add("show");
}

function hideSignInModal() {
  document.getElementById("signin-modal").classList.remove("show");
}

// --- AUTH INTEGRATION ---
async function handleSignIn(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;
  const status =
    form.querySelector(".auth-status") || document.createElement("div");
  status.className = "auth-status";
  status.style.color = "red";
  status.style.marginTop = "0.5rem";
  form.appendChild(status);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      isSignedIn = true;
      updateAuthUI();
      hideSignInModal();
    } else {
      status.textContent = data.error || "Login failed";
    }
  } catch (err) {
    status.textContent = "Network error";
  }
}

async function handleSignUp(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;
  const status =
    form.querySelector(".auth-status") || document.createElement("div");
  status.className = "auth-status";
  status.style.color = "red";
  status.style.marginTop = "0.5rem";
  form.appendChild(status);

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      status.style.color = "green";
      status.textContent = "Registration successful! Please sign in.";
      setTimeout(() => {
        switchToSignIn();
        status.textContent = "";
      }, 1200);
    } else {
      status.textContent = data.error || "Registration failed";
    }
  } catch (err) {
    status.textContent = "Network error";
  }
}

function updateAuthUI() {
  const signinBtn = document.getElementById("signin-btn");
  const userMenu = document.getElementById("user-menu");
  if (isSignedIn) {
    if (signinBtn) signinBtn.style.display = "none";
    // Optionally show user info or a logout button
    if (userMenu && !document.getElementById("logout-btn")) {
      const logoutBtn = document.createElement("button");
      logoutBtn.className = "btn";
      logoutBtn.id = "logout-btn";
      logoutBtn.textContent = "Log Out";
      logoutBtn.onclick = handleLogout;
      userMenu.appendChild(logoutBtn);
    }
  } else {
    if (signinBtn) signinBtn.style.display = "";
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.remove();
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  isSignedIn = false;
  updateAuthUI();
}

// On page load, check for token
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    isSignedIn = true;
    updateAuthUI();
  }
});

async function runCode() {
  const runBtn = document.getElementById("run-btn");
  const output = document.getElementById("output");
  const statusLeft = document.getElementById("status-left");
  const stdinEl = document.getElementById("stdin");

  runBtn.disabled = true;
  statusLeft.textContent = "Running...";

  const loadingSpinner = document.createElement("div");
  loadingSpinner.className = "loading-spinner";
  const originalContent = runBtn.innerHTML;
  runBtn.innerHTML = "";
  runBtn.appendChild(loadingSpinner);

  const cfg = languageConfig[currentLanguage];
  const code = codeMirrorEditor ? codeMirrorEditor.getValue() : "";
  const stdin = stdinEl.value.trim();

  const payload = {
    language: cfg.jdoodleLang,
    versionIndex: cfg.versionIndex,
    code: code,
  };

  // Include stdin only if present
  if (stdin.length) {
    payload.stdin = stdin;
  }

  try {
    const res = await fetch("/api/compiler/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    // Display output
    if (data?.output) {
      output.textContent = data.output;
    } else if (data?.error) {
      output.textContent = `Error: ${data.error}`;
    } else {
      output.textContent = JSON.stringify(data, null, 2);
    }

    statusLeft.textContent = "Ready";
  } catch (err) {
    output.textContent = "Error: " + (err.message || err);
    statusLeft.textContent = "Error";
  } finally {
    runBtn.innerHTML = originalContent;
    runBtn.disabled = false;
  }
}

// Download current file with proper formatting
function downloadCurrentFile() {
  const currentFile = files.find((file) => file.name === activeTab);
  if (!currentFile) {
    alert("No file selected to download");
    return;
  }

  // Get the current content from CodeMirror editor
  let content = codeMirrorEditor
    ? codeMirrorEditor.getValue()
    : currentFile.content;

  // Format the content with proper indentation
  const formattedContent = formatCode(content, currentFile.language);

  // Create download link
  const blob = new Blob([formattedContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  // Create temporary anchor element
  const tempAnchor = document.createElement("a");
  tempAnchor.href = url;

  // Set filename based on current file
  const cfg = languageConfig[currentFile.language];
  const extension = cfg?.extension || ".txt";
  const filename = currentFile.name.includes(".")
    ? currentFile.name
    : `${currentFile.name}${extension}`;
  tempAnchor.download = filename;

  // Trigger download
  document.body.appendChild(tempAnchor);
  tempAnchor.click();
  document.body.removeChild(tempAnchor);

  // Clean up
  window.URL.revokeObjectURL(url);

  // Update status
  const statusLeft = document.getElementById("status-left");
  statusLeft.textContent = `Downloaded: ${filename}`;
  setTimeout(() => {
    statusLeft.textContent = "Ready";
  }, 2000);
}

// Format code with proper indentation
function formatCode(code, language) {
  if (!code.trim()) return code;

  let lines = code.split("\n");
  let indentLevel = 0;
  const indentSize = language === "python3" ? 4 : 2; // Python uses 4 spaces, others use 2
  let formattedLines = [];

  for (let line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      formattedLines.push("");
      continue;
    }

    // Decrease indent for closing brackets/braces
    if (trimmedLine.match(/^[\}\]\)]/)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    const indent = " ".repeat(indentLevel * indentSize);
    formattedLines.push(indent + trimmedLine);

    // Increase indent for opening brackets/braces
    if (trimmedLine.match(/[\{\[\(]$/)) {
      indentLevel++;
    }

    // Special cases for different languages
    if (language === "python3") {
      if (trimmedLine.endsWith(":")) {
        indentLevel++;
      }
    } else if (language === "java" || language === "cpp17") {
      if (trimmedLine.includes("{") && !trimmedLine.includes("}")) {
        indentLevel++;
      }
    }
  }

  return formattedLines.join("\n");
}

function switchToSignUp() {
  hideSignInModal();
  showSignUpModal();
}

function switchToSignIn() {
  hideSignUpModal();
  showSignInModal();
}

function showSignUpModal() {
  document.getElementById("signup-modal").classList.add("show");
}
function hideSignUpModal() {
  document.getElementById("signup-modal").classList.remove("show");
}
function showSignInModal() {
  document.getElementById("signin-modal").classList.add("show");
}
function hideSignInModal() {
  document.getElementById("signin-modal").classList.remove("show");
}
