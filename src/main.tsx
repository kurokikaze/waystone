import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { ErrorDumpService } from './services/ErrorDumpService';

window.addEventListener('error', event => {
  void ErrorDumpService.dumpActionFailure({ type: 'application/error' }, null, event.error ?? event.message,
    { filename: event.filename, line: event.lineno, column: event.colno });
});
window.addEventListener('unhandledrejection', event => {
  void ErrorDumpService.dumpActionFailure({ type: 'application/unhandled-rejection' }, null, event.reason);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
