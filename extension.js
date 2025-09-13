const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

async function moveToChosenFile({ codeToMove, languageId }) {
    // Show file picker (only files in workspace)
    const uri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: 'Move selection here',
        filters: { 'All files': ['*'] }
    });

    if (!uri || uri.length === 0) {
        return; // User canceled
    }

    const targetUri = uri[0];

    // Open the target file
    const doc = await vscode.workspace.openTextDocument(targetUri);
    const editor = await vscode.window.showTextDocument(doc, { preview: false });

    // Insert at cursor position (or at end if no selection)
    const position = editor.selection.active || new vscode.Position(doc.lineCount, 0);

    await editor.edit(editBuilder => {
        editBuilder.insert(position, codeToMove + '\n');
    });

    await doc.save();
}

async function moveToWorkspaceFile({ codeToMove, languageId }) {
    // Get list of all files in workspace
    const files = await vscode.workspace.findFiles('**/*');

    if (files.length === 0) {
        vscode.window.showWarningMessage('No files found in workspace');
        return;
    }

    // Map to quick pick items
    const items = files.map(uri => ({
        label: path.basename(uri.fsPath),
        description: vscode.workspace.asRelativePath(uri),
        uri
    }));

    // Show quick pick in Command Palette
    const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a file to move selection into',
        matchOnDescription: true
    });

    if (!picked) return; // cancelled

    const targetUri = picked.uri;

    // Open file and insert text
    const doc = await vscode.workspace.openTextDocument(targetUri);
    const editor = await vscode.window.showTextDocument(doc, { preview: false });

    // Insert at end of file (or at cursor if you prefer)
    const position = new vscode.Position(doc.lineCount, 0);

    await editor.edit(editBuilder => {
        editBuilder.insert(position, codeToMove + '\n');
    });

    await doc.save();
}

function activate(context) {
    console.log('Extension "move-selection-to-new-file" is now active!');

    async function moveSelectionToFile() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const { selection } = editor;
        const codeToMove = editor.document.getText(selection);

        if (!codeToMove) {
            vscode.window.showInformationMessage('No text selected');
            return;
        }

        // Delete selected text
        await editor.edit(edit => {
            edit.delete(selection);
        });

        // Ask user if they want new file or existing file
        const choice = await vscode.window.showQuickPick(
            ['Choose File From Workspace', 'Choose Existing File', 'New File'],
            { placeHolder: 'Move selection to...' }
        );

        if (choice === 'New File') {
            const doc = await vscode.workspace.openTextDocument({
                language: editor.document.languageId,
                content: codeToMove
            });
            vscode.window.showTextDocument(doc, { preview: false });
        } else if (choice === 'Choose Existing File') {
            await moveToChosenFile({
                codeToMove,
                languageId: editor.document.languageId
            });
        } else if (choice === 'Choose File From Workspace') {
            await moveToWorkspaceFile({
                codeToMove,
                languageId: editor.document.languageId
            });
        }
    }

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'extension.moveSelectionToNewFile',
            moveSelectionToFile
        )
    );
}

function deactivate() {
    vscode.window.showInformationMessage('Goodbye!');
}

module.exports = { activate, deactivate };
