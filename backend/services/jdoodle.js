import fetch from "node-fetch";

const JDoodle_URL = "https://api.jdoodle.com/v1/execute";

export async function runCode(language, versionIndex, code, stdin = "") {
  const body = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: code,
    language: language,
    versionIndex: versionIndex,
    stdin: stdin,
  };

  const response = await fetch(JDoodle_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}
