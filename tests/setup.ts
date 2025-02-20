import { exec } from "child_process";

export function startServer() {
  exec("serverless offline start");
}

export function stopServer() {
  exec("pkill -f 'serverless'");
}
