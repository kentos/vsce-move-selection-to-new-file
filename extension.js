const vscode = require('vscode');

function moveToNewDoc(codeToMove, languageId) {
	vscode.workspace.openTextDocument({language:languageId}).then(doc => {
		vscode.window.showTextDocument(doc, 1, false).then(editor => {
			editor.edit(edit => {
				edit.insert(new vscode.Position(0, 0), codeToMove)
			})
		})
	})
}

function activate(context) {
	console.log('Extension "move-selection-to-new-file" is now active!');

	function moveSelectionToNewFile() {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection
		const codeToMove = editor.document.getText(editor.selection)

		const removeLines = [selection.start.line, selection.end.line]

		if (selection.start.line > 0) {
			const beforeLine = editor.document.lineAt(selection.start.line - 1)
			if (beforeLine.isEmptyOrWhitespace) {
				removeLines.unshift(beforeLine.lineNumber)
			}
		}

		editor.edit(edit => {
			const first = removeLines.shift()
			const last = removeLines.pop()
			Array.from(
				{ length: (last + 1) - first },
				(_v, k) => k + first
			).forEach((lineNumber) => {
				const line = editor.document.lineAt(lineNumber)
				edit.delete(line.rangeIncludingLineBreak)
			})
		})

		moveToNewDoc(codeToMove, editor.document.languageId)
	}

	context.subscriptions.push(vscode.commands.registerCommand('extension.moveSelectionToNewFile', moveSelectionToNewFile));
}

exports.activate = activate;

function deactivate() {
	vscode.window.showInformationMessage('Goodbye!')
}

module.exports = { activate, deactivate }
