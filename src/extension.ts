import * as vscode from 'vscode';
import { Project, Node, SyntaxKind } from 'ts-morph';

let decorationTypes: vscode.TextEditorDecorationType[] = [];
let isEnabled = true;

export function activate(context: vscode.ExtensionContext) {
  const toggleCommand = vscode.commands.registerCommand('ComplexityLens.toggle', () => {
    isEnabled = !isEnabled;
    updateDecorations();
    vscode.window.showInformationMessage(`ComplexityLens ${isEnabled ? 'enabled' : 'disabled'}`);
  });

  context.subscriptions.push(
    toggleCommand,
    vscode.workspace.onDidChangeTextDocument(() => updateDecorations()),
    vscode.window.onDidChangeActiveTextEditor(() => updateDecorations())
  );

  updateDecorations();
}

/**
 * Calculates cyclomatic complexity of the given node (function/method).
 * Complexity starts at 1 and increases for each control flow statement or
 * logical binary expression found within the function.
 */
function calculateComplexity(node: Node): number {
  let complexity = 1;

  node.forEachDescendant((descendant: Node) => {
    const kind = descendant.getKind();

    if (
      kind === SyntaxKind.IfStatement ||
      kind === SyntaxKind.ForStatement ||
      kind === SyntaxKind.ForInStatement ||
      kind === SyntaxKind.ForOfStatement ||
      kind === SyntaxKind.WhileStatement ||
      kind === SyntaxKind.DoStatement ||
      kind === SyntaxKind.SwitchStatement ||
      kind === SyntaxKind.ConditionalExpression ||
      (
        kind === SyntaxKind.BinaryExpression &&
        ['&&', '||'].includes((descendant as any).getOperatorToken?.()?.getText?.() ?? '')
      )
    ) {
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

  if (!isEnabled) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor || !['typescript', 'javascript'].includes(editor.document.languageId)) return;

  const project = new Project({ useInMemoryFileSystem: false });
  const sourceFile = project.addSourceFileAtPath(editor.document.fileName);
  if (!sourceFile) return;

  const decorations: vscode.DecorationOptions[] = [];
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
    } else if (complexity >= warningThreshold) {
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

export function deactivate() {
  decorationTypes.forEach(dec => dec.dispose());
  decorationTypes = [];
}
