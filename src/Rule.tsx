import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@mui/material";

export interface Match {
  description?: string;
  amount?: number;
}

export interface Change {
  description?: string;
  destination?: string;
}

export interface Rule {
  match: Match;
  change: Change;
}

export const RulesPage = (): React.ReactElement => {
  const [rules, setRules] = useState(localStorage.getItem("RULES") ?? "[]");

  const onChange = (value?: string) => {
    setRules(value ?? "");
    localStorage.setItem("RULES", value ?? "");
  };

  const validate = () => {
    const r = JSON.parse(rules);
    if (!Array.isArray(r)) {
      alert("The rules JSON does not seem to be an array");
      return;
    }
    for (const i in r) {
      const v = r[i];
      if (v["match"] === undefined) {
        alert(`Rule ${JSON.stringify(v)} does not have a "match" field.`);
        return;
      }
    }
    for (const i in r) {
      const v = r[i];
      if (v["change"] === undefined) {
        alert(`Rule ${JSON.stringify(v)} does not have a "change" field.`);
        return;
      }
    }
  };

  const format = () => {
    const r = JSON.parse(rules);
    if (!Array.isArray(r)) {
      alert("The rules JSON does not seem to be an array");
      return;
    }
    setRules(JSON.stringify(r, null, 2));
  };

  return (
    <>
      <Editor
        height="70vh"
        defaultLanguage="json"
        value={rules}
        onChange={onChange}
        theme="dark"
      />
      <Button onClick={validate}>Validate</Button>
      <Button onClick={format}>format</Button>
    </>
  );
};
