#!/usr/bin/env bun
import { $, spawn } from 'bun';

type Workspace = {
    workspaceId: number;
    language: string;
};

let savedWorkspaces: Array<Workspace> = [];
setInitialWorkspaceData();

updateConfigOnLanguageChange();

const availableLanguages = (await $`setxkbmap -query  | grep layout | awk '{print $2}'`.text()).split(',');

const i3Socket = (await Bun.$`sh -c 'ls /run/user/1000/i3/ipc-socket.*'`.text()).trim();
const { stdout } = spawn(['i3-msg', '-m', `--socket=${i3Socket}`, '-t', 'subscribe', '[ "workspace" ]']);

for await (const data of stdout.pipeThrough(new TextDecoderStream())) {
    for (const dataLine of data.split('\n')) {
        if (!dataLine) continue;
        const workspaceData = JSON.parse(dataLine);
        const event = workspaceData.change;
        if (event !== "focus") continue;
        await switchLanguageOnWorkspaceChange(workspaceData.current.num);
    }
}

async function updateConfigOnLanguageChange() {
    const { stdout } = spawn(['xkb-switch', '-W']);

    for await (const data of stdout.pipeThrough(new TextDecoderStream())) {
        const currentLanguage = data.trim();
        const currentWorkspace = await getWorkspace();

        const existing = tryGetSavedWorkspace(currentWorkspace);
        if (!!existing) {
            setSavedWorkspace(currentWorkspace, currentLanguage);
        } else {
            savedWorkspaces.push({ workspaceId: currentWorkspace, language: currentLanguage });
        }
    }
}

async function setInitialWorkspaceData() {
    savedWorkspaces.push({ workspaceId: await getWorkspace(), language: await getLanguage() });
}

async function getWorkspace() {
    const json = await $`i3-msg -t get_workspaces`.json();
    const focused = json.find((w: any) => w.focused);
    return focused.num;
}

function tryGetSavedWorkspace(workspaceId: number) {
    return savedWorkspaces.find((w: Workspace) => w.workspaceId === workspaceId);
}

function setSavedWorkspace(workspaceId: number, language: string) {
    const workspace = tryGetSavedWorkspace(workspaceId);
    if (workspace) {
        workspace.language = language;
    } else {
        savedWorkspaces.push({ workspaceId, language });
    }
}

async function getLanguage() {
    return await $`xkblayout-state print %s`.text();
}

async function setLanguage(language: string) {
    await $`xkblayout-state set ${availableLanguages.indexOf(language)}`;
}

async function switchLanguageOnWorkspaceChange(focusedWorkspaceId: number) {
    let currentLayout = await getLanguage();

    let savedWorkspace = tryGetSavedWorkspace(focusedWorkspaceId);

    if (!tryGetSavedWorkspace(focusedWorkspaceId)) {
        savedWorkspaces.push({ workspaceId: focusedWorkspaceId, language: currentLayout });
        savedWorkspace = tryGetSavedWorkspace(focusedWorkspaceId);
    }

    if (savedWorkspace.language !== currentLayout) {
        await setLanguage(savedWorkspace.language);
    }
}

