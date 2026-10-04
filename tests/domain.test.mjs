import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Module, { createRequire } from "node:module";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";

// Load the actual typed domain modules without starting a server or browser.
const require = createRequire(import.meta.url);
const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...rest) {
  return originalResolve.call(
    this,
    name.startsWith("@/") ? path.join(project, "src", name.slice(2)) : name,
    ...rest,
  );
};
for (const ext of [".ts", ".tsx"]) {
  Module._extensions[ext] = (mod, filename) => {
    const { outputText } = ts.transpileModule(
      fs.readFileSync(filename, "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
        fileName: filename,
      },
    );
    mod._compile(outputText, filename);
  };
}
const { patients, medicalRecords } = require("../src/data/patients.ts");
const { appointments } = require("../src/data/appointments.ts");
const { dentists } = require("../src/data/dentists.ts");
const { treatments, prescriptions } = require("../src/data/treatments.ts");
const { invoices, payments } = require("../src/data/invoices.ts");
const { ClinicProvider, useClinic } = require("../src/hooks/use-clinic.tsx");
const { renderToString } = require("react-dom/server");
let root, state, dom;
// Test probe that exposes the live clinic context to assertions.
function Probe() {
  // eslint-disable-next-line react-hooks/globals
  state = useClinic();
  return null;
}
before(async () => {
  dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "http://localhost",
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  // next/link prefetching reads `self` (via requestIdleCallback) once it mounts.
  globalThis.self = dom.window;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  root = createRoot(document.getElementById("root"));
  await act(async () =>
    root.render(
      React.createElement(ClinicProvider, null, React.createElement(Probe)),
    ),
  );
});
after(async () => {
  await act(async () => root.unmount());
  dom.window.close();
  Module._resolveFilename = originalResolve;
});

test("all appointments, invoices, and payments reference existing records", () => {
  for (const a of appointments) {
    assert.ok(
      patients.some((p) => p.id === a.patientId),
      a.id,
    );
    assert.ok(
      dentists.some((d) => d.id === a.dentistId),
      a.id,
    );
    assert.ok(
      treatments.some((t) => t.id === a.treatmentId),
      a.id,
    );
    if (a.invoiceId)
      assert.ok(
        invoices.some((i) => i.id === a.invoiceId),
        a.id,
      );
  }
  for (const p of payments) {
    assert.ok(invoices.some((i) => i.id === p.invoiceId));
    assert.ok(patients.some((x) => x.id === p.patientId));
  }
});
test("every sample patient balance reconciles with the sample invoice ledger", () => {
  for (const p of patients) {
    const balance = invoices
      .filter((i) => i.patientId === p.id)
      .reduce(
        (sum, i) =>
          sum +
          i.items.reduce((s, item) => s + item.quantity * item.price, 0) -
          i.insurance -
          i.paid,
        0,
      );
    assert.equal(balance, p.balance, p.name);
  }
});
test("Sarah’s story is consistent across clinical and financial records", () => {
  const sarah = patients.find((p) => p.id === "PT-10428");
  const appointment = appointments.find((a) => a.id === "APT-2042");
  const invoice = invoices.find((i) => i.id === appointment.invoiceId);
  assert.equal(sarah.name, "Sarah Johnson");
  assert.equal(appointment.date, "2026-10-06");
  assert.equal(appointment.time, "10:30");
  assert.equal(appointment.tooth, "#16");
  assert.equal(appointment.dentistId, "DEN-001");
  assert.equal(invoice.items[0].price, sarah.balance);
  assert.ok(
    medicalRecords
      .find((m) => m.patientId === sarah.id)
      .allergies.includes("Penicillin"),
  );
  assert.equal(
    prescriptions.some(
      (p) =>
        p.patientId === sarah.id &&
        /amoxicillin|penicillin/i.test(p.medication),
    ),
    false,
  );
});
test("payment mutation atomically updates invoice, patient, and transaction records", async () => {
  const before = state.payments.length;
  await act(async () => state.recordPayment("INV-2026-1048", 200, "Card"));
  assert.equal(state.patients.find((p) => p.id === "PT-10428").balance, 420);
  assert.equal(
    state.invoices.find((i) => i.id === "INV-2026-1048").status,
    "Partially Paid",
  );
  assert.equal(state.payments.length, before + 1);
  await act(async () => state.recordPayment("INV-2026-1048", 421, "Card"));
  assert.equal(
    state.payments.length,
    before + 1,
    "overpayment must be rejected",
  );
  await act(async () => state.recordPayment("INV-2026-1048", 420, "Cash"));
  assert.equal(state.patients.find((p) => p.id === "PT-10428").balance, 0);
  assert.equal(
    state.invoices.find((i) => i.id === "INV-2026-1048").status,
    "Paid",
  );
});
test("new invoices add patient responsibility and keep their relationship", async () => {
  const invoice = {
    id: "INV-TEST",
    patientId: "PT-10428",
    treatmentId: "TRT-001",
    date: "2026-10-05",
    due: "2026-10-19",
    items: [{ description: "Cleaning", quantity: 1, price: 120 }],
    insurance: 20,
    paid: 0,
    status: "Pending",
  };
  await act(async () => state.addInvoice(invoice));
  assert.equal(
    state.invoices.find((i) => i.id === invoice.id).patientId,
    "PT-10428",
  );
  assert.equal(state.patients.find((p) => p.id === "PT-10428").balance, 100);
});
test("appointment creation and workflow updates preserve connected records", async () => {
  const next = {
    ...appointments[0],
    id: "APT-TEST",
    date: "2026-10-08",
    time: "16:30",
    invoiceId: undefined,
  };
  await act(async () => state.addAppointment(next));
  await act(async () =>
    state.updateAppointment("APT-TEST", { status: "Checked In" }),
  );
  assert.equal(
    state.appointments.find((a) => a.id === "APT-TEST").status,
    "Checked In",
  );
  assert.equal(
    state.appointments.find((a) => a.id === "APT-TEST").patientId,
    "PT-10428",
  );
});
test("messages and tooth chart updates remain in the shared session", async () => {
  await act(async () =>
    state.sendMessage({
      id: "MSG-TEST",
      patientId: "PT-10428",
      body: "Appointment reminder",
      direction: "out",
      channel: "SMS",
      time: "Now",
    }),
  );
  await act(async () =>
    state.setToothCharts((charts) => ({
      ...charts,
      "PT-10428": { ...charts["PT-10428"], 16: "Completed" },
    })),
  );
  assert.equal(state.messages.at(-1).body, "Appointment reminder");
  assert.equal(state.toothCharts["PT-10428"][16], "Completed");
});

const {
  AppRouterContext,
} = require("next/dist/shared/lib/app-router-context.shared-runtime.js");
const {
  PathnameContext,
  SearchParamsContext,
} = require("next/dist/shared/lib/hooks-client-context.shared-runtime.js");
const router = {
  push() {},
  replace() {},
  refresh() {},
  back() {},
  forward() {},
  prefetch() {},
};
function WorkspaceHarness({ children }) {
  return React.createElement(
    AppRouterContext.Provider,
    { value: router },
    React.createElement(
      PathnameContext.Provider,
      { value: "/dashboard" },
      React.createElement(
        SearchParamsContext.Provider,
        { value: new URLSearchParams() },
        React.createElement(ClinicProvider, null, children),
      ),
    ),
  );
}
test("Lite screens and Pro previews render valid server markup", () => {
  const cases = [
    ["dentix/dashboard.tsx", "Dashboard", {}],
    ["patients/patients-list.tsx", "PatientsList", {}],
    [
      "dentix/pro-feature.tsx",
      "ProFeature",
      { path: ["patients", "sarah-johnson"] },
    ],
    ["dentix/pro-feature.tsx", "ProFeature", { path: ["appointments"] }],
  ];
  for (const [module, name, props] of cases) {
    const Component = require(path.join(project, "src/components", module))[
      name
    ];
    const html = renderToString(
      React.createElement(
        WorkspaceHarness,
        null,
        React.createElement(Component, props),
      ),
    );
    assert.match(html, /<h1/, `${name} must render a page heading`);
    assert.doesNotMatch(
      html,
      /undefined|NaN|Lorem ipsum/,
      `${name} must have complete display data`,
    );
  }
});
