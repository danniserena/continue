import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;

function getTimestamp(): string {
  return new Date().toISOString();
}

export function getContinueOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("Continue");
  }

  return outputChannel;
}

export function registerContinueOutputChannel(
  context: vscode.ExtensionContext,
): void {
  context.subscriptions.push(getContinueOutputChannel());
}

export function showContinueOutputChannel(): void {
  getContinueOutputChannel().show(true);
}

export function logToContinueOutput(message: string): void {
  getContinueOutputChannel().appendLine(`[${getTimestamp()}] ${message}`);
}

export function logErrorToContinueOutput(
  message: string,
  error: unknown,
): void {
  const errorMessage =
    error instanceof Error ? error.stack || error.message : String(error);
  logToContinueOutput(`${message}: ${errorMessage}`);
}
