// @flow
import { shutdownKernel } from "../kernel/shutdown";

import { remote } from "electron";

import { app } from "@nteract/core/reducers";

import {
  makeAppRecord,
  makeLocalKernelRecord,
  makeDesktopHostRecord,
  AppRecord
} from "@nteract/types/core/records";

import type {
  NewKernelAction,
  SetGithubTokenAction,
  SetExecutionStateAction,
  ExitAction,
  StartSavingAction,
  InterruptKernelAction,
  KillKernelAction,
  DoneSavingAction,
  DoneSavingConfigAction
} from "@nteract/core/actionTypes";

function cleanupKernel(state: AppRecord): AppRecord {
  shutdownKernel(state.kernel);
  return state;
}

function launchKernel(state: AppRecord, action: NewKernelAction) {
  const kernel = makeLocalKernelRecord(action.kernel);
  if (!kernel) {
    return state.set("kernel", kernel);
  }
  return cleanupKernel(state).set("kernel", kernel);
}

function exit(state: AppRecord) {
  return cleanupKernel(state);
}

function interruptKernel(state: AppRecord) {
  // TODO: This should be an epic instead
  if (state.kernel.type === "zeromq") {
    state.kernel.spawn.kill("SIGINT");
  } else {
    console.log("cant interrupt non-zeromq kernels currently");
  }
  return state;
}

function setGithubToken(state: AppRecord, action: SetGithubTokenAction) {
  const { githubToken } = action;
  return state.set("githubToken", githubToken);
}

type AppAction =
  | NewKernelAction
  | SetGithubTokenAction
  | SetExecutionStateAction
  | ExitAction
  | StartSavingAction
  | InterruptKernelAction
  | KillKernelAction
  | DoneSavingAction;

export default function handleApp(
  state: AppRecord = makeAppRecord({
    host: makeDesktopHostRecord(),
    version: remote.app.getVersion()
  }),
  action: AppAction
) {
  switch (action.type) {
    // This action is _also_ handled in @nteract/core's app
    // however, the desktop one still has some kernel cleanup logic
    // that needs to be refactored into an epic
    case "LAUNCH_KERNEL_SUCCESSFUL":
      return launchKernel(state, action);
    case "EXIT":
      return exit(state);
    case "KILL_KERNEL":
      return cleanupKernel(state);
    case "INTERRUPT_KERNEL":
      return interruptKernel(state);
    case "SET_GITHUB_TOKEN":
      return setGithubToken(state, action);
    default:
      // We defer to core for the rest as we move more into @nteract/core
      return app(state, action);
  }
}
