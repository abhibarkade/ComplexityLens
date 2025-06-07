"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const ts_morph_1 = require("ts-morph");
let decorationTypes = [];
let isEnabled = true;
function activate(context) {
    const toggleCommand = vscode.commands.registerCommand('ComplexityLens.toggle', () => {
        isEnabled = !isEnabled;
        updateDecorations();
        vscode.window.showInformationMessage(`ComplexityLens ${isEnabled ? 'enabled' : 'disabled'}`);
    });
    context.subscriptions.push(toggleCommand, vscode.workspace.onDidChangeTextDocument(() => updateDecorations()), vscode.window.onDidChangeActiveTextEditor(() => updateDecorations()));
    updateDecorations();
}
exports.activate = activate;
/**
 * Calculates cyclomatic complexity of the given node (function/method).
 * Complexity starts at 1 and increases for each control flow statement or
 * logical binary expression found within the function.
 */
function calculateComplexity(node) {
    let complexity = 1;
    node.forEachDescendant((descendant) => {
        const kind = descendant.getKind();
        if (kind === ts_morph_1.SyntaxKind.IfStatement ||
            kind === ts_morph_1.SyntaxKind.ForStatement ||
            kind === ts_morph_1.SyntaxKind.ForInStatement ||
            kind === ts_morph_1.SyntaxKind.ForOfStatement ||
            kind === ts_morph_1.SyntaxKind.WhileStatement ||
            kind === ts_morph_1.SyntaxKind.DoStatement ||
            kind === ts_morph_1.SyntaxKind.SwitchStatement ||
            kind === ts_morph_1.SyntaxKind.ConditionalExpression ||
            (kind === ts_morph_1.SyntaxKind.BinaryExpression &&
                ['&&', '||'].includes(descendant.getOperatorToken?.()?.getText?.() ?? ''))) {
            complexity++;
        }
    });
    return complexity;
}
/**
 * Updates editor decorations by displaying the complexity "Risk" level
 * above each function in the currently active editor, using icons and colors
 * based on configurable thresholds.
 */
function updateDecorations() {
    decorationTypes.forEach(dec => dec.dispose());
    decorationTypes = [];
    if (!isEnabled)
        return;
    const editor = vscode.window.activeTextEditor;
    if (!editor || !['typescript', 'javascript'].includes(editor.document.languageId))
        return;
    const project = new ts_morph_1.Project({ useInMemoryFileSystem: false });
    const sourceFile = project.addSourceFileAtPath(editor.document.fileName);
    if (!sourceFile)
        return;
    const decorations = [];
    const warningThreshold = vscode.workspace.getConfiguration('ComplexityLens').get('warningThreshold', 10);
    const errorThreshold = vscode.workspace.getConfiguration('ComplexityLens').get('errorThreshold', 15);
    sourceFile.getFunctions().forEach(func => {
        const complexity = calculateComplexity(func);
        const startPos = editor.document.positionAt(func.getStart());
        const line = startPos.line;
        const decorationLine = line > 0 ? line - 1 : 0;
        const lineEndChar = editor.document.lineAt(decorationLine).range.end.character;
        const range = new vscode.Range(decorationLine, lineEndChar, decorationLine, lineEndChar);
        let icon = '✅';
        let color = 'green';
        if (complexity >= errorThreshold) {
            icon = '❌';
            color = 'red';
        }
        else if (complexity >= warningThreshold) {
            icon = '⚠️';
            color = 'orange';
        }
        const decoration = {
            range,
            renderOptions: {
                after: {
                    contentText: ` ${icon} Risk: ${complexity}`,
                    color,
                    fontStyle: 'italic',
                }
            }
        };
        decorations.push(decoration);
    });
    const decorationType = vscode.window.createTextEditorDecorationType({
        isWholeLine: false
    });
    editor.setDecorations(decorationType, decorations);
    decorationTypes.push(decorationType);
}
function deactivate() {
    decorationTypes.forEach(dec => dec.dispose());
    decorationTypes = [];
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map