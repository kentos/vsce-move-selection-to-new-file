# Building vsix file

1. Clone reposotory
2. npm install
3. npm install -g @vscode/vsce
4. npm install -g corepack
5. vsce package

# Move selection to new file

The refactorers best friend!<br>
Select your code,<br>
Cmd+P,<br>
'Move selection to new file',<br>
💥

## Features

This extension takes the text in selection and moves it to a new file. This comes in handy when for instance refactoring large files and you want to move code fast.
It basically removes the lines you've selected and moves it.

## Release Notes

We try to keep release notes.

### 1.0.0

Initial release of Move selection to new file.

### 1.0.1
**New**:<br>
[New document inherits same languageId](https://github.com/kentos/vsce-move-selection-to-new-file/pull/2) - big up to [esviza](https://github.com/esviza) 🥳

**Chores**:<br>
Making `moveToNewDoc` more extentable and making input and object instead of positional params.

---


**Enjoy!**
