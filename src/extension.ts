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

  const configCommand = vscode.commands.registerCommand('ComplexityLens.configure', () => {
    createConfigurationWebview(context);
  });

  context.subscriptions.push(
    toggleCommand,
    configCommand,
    vscode.workspace.onDidChangeTextDocument(() => updateDecorations()),
    vscode.window.onDidChangeActiveTextEditor(() => updateDecorations()),
    vscode.workspace.onDidChangeConfiguration(() => updateDecorations())
  );

  updateDecorations();
}

function createConfigurationWebview(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'complexityLensConfig',
    'Configure ComplexityLens',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const config = vscode.workspace.getConfiguration('ComplexityLens');
  const warningThreshold = config.get('warningThreshold', 10);
  const errorThreshold = config.get('errorThreshold', 15);
  const lowComplexityColor = config.get('lowComplexityColor', 'green');
  const lowComplexityIcon = config.get('lowComplexityIcon', '✅');
  const lowComplexityMessage = config.get('lowComplexityMessage', 'Risk');
  const warningComplexityColor = config.get('warningComplexityColor', 'orange');
  const warningComplexityIcon = config.get('warningComplexityIcon', '⚠️');
  const warningComplexityMessage = config.get('warningComplexityMessage', 'Risk');
  const errorComplexityColor = config.get('errorComplexityColor', 'red');
  const errorComplexityIcon = config.get('errorComplexityIcon', '❌');
  const errorComplexityMessage = config.get('errorComplexityMessage', 'Risk');

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Configure ComplexityLens</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        label { display: block; margin: 10px 0 5px; }
        input { width: 100%; padding: 8px; margin-bottom: 10px; }
        button { padding: 10px 20px; background-color: #007acc; color: white; border: none; cursor: pointer; margin-right: 10px; }
        button:hover { background-color: #005f99; }
        .reset-button { background-color: #dc3545; }
        .reset-button:hover { background-color: #b02a37; }
        .error { color: red; display: none; }
        .section { margin-bottom: 20px; }
        h3 { margin-top: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>ComplexityLens Configuration</h2>
        <div class="section">
          <h3>Threshold Settings</h3>
          <label for="warningThreshold">Warning Threshold</label>
          <input type="number" id="warningThreshold" value="${warningThreshold}" min="1">
          <label for="errorThreshold">Error Threshold</label>
          <input type="number" id="errorThreshold" value="${errorThreshold}" min="1">
          <div id="thresholdError" class="error">Error threshold must be greater than warning threshold.</div>
        </div>
        <div class="section">
          <h3>Message Settings</h3>
          <label for="lowMessage">Low Complexity Message</label>
          <input type="text" id="lowMessage" value="${lowComplexityMessage}" placeholder="e.g., Risk">
          <label for="warningMessage">Warning Complexity Message</label>
          <input type="text" id="warningMessage" value="${warningComplexityMessage}" placeholder="e.g., Risk">
          <label for="errorMessage">Error Complexity Message</label>
          <input type="text" id="errorMessage" value="${errorComplexityMessage}" placeholder="e.g., Risk">
        </div>
        <div class="section">
          <h3>Color and Icon Settings</h3>
          <label for="lowColor">Low Complexity Color</label>
          <input type="text" id="lowColor" value="${lowComplexityColor}" placeholder="e.g., green, #00FF00">
          <label for="lowIcon">Low Complexity Icon</label>
          <input type="text" id="lowIcon" value="${lowComplexityIcon}" placeholder="e.g., ✅">
          <label for="warningColor">Warning Complexity Color</label>
          <input type="text" id="warningColor" value="${warningComplexityColor}" placeholder="e.g., orange, #FFA500">
          <label for="warningIcon">Warning Complexity Icon</label>
          <input type="text" id="warningIcon" value="${warningComplexityIcon}" placeholder="e.g., ⚠️">
          <label for="errorColor">Error Complexity Color</label>
          <input type="text" id="errorColor" value="${errorComplexityColor}" placeholder="e.g., red, #FF0000">
          <label for="errorIcon">Error Complexity Icon</label>
          <input type="text" id="errorIcon" value="${errorComplexityIcon}" placeholder="e.g., ❌">
          <div id="colorError" class="error">All color fields must be valid CSS colors.</div>
        </div>
        <button onclick="saveSettings()">Save</button>
        <button class="reset-button" onclick="resetSettings()">Reset to Default</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        function isValidColor(color) {
          const s = new Option().style;
          s.color = color;
          return s.color !== '';
        }
        function saveSettings() {
          const warningThreshold = parseInt(document.getElementById('warningThreshold').value);
          const errorThreshold = parseInt(document.getElementById('errorThreshold').value);
          const lowColor = document.getElementById('lowColor').value;
          const lowIcon = document.getElementById('lowIcon').value;
          const lowMessage = document.getElementById('lowMessage').value;
          const warningColor = document.getElementById('warningColor').value;
          const warningIcon = document.getElementById('warningIcon').value;
          const warningMessage = document.getElementById('warningMessage').value;
          const errorColor = document.getElementById('errorColor').value;
          const errorIcon = document.getElementById('errorIcon').value;
          const errorMessage = document.getElementById('errorMessage').value;
          
          const thresholdError = document.getElementById('thresholdError');
          const colorError = document.getElementById('colorError');
          
          if (errorThreshold <= warningThreshold) {
            thresholdError.style.display = 'block';
            return;
          }
          thresholdError.style.display = 'none';
          
          if (!isValidColor(lowColor) || !isValidColor(warningColor) || !isValidColor(errorColor)) {
            colorError.style.display = 'block';
            return;
          }
          colorError.style.display = 'none';
          
          vscode.postMessage({
            command: 'saveSettings',
            warningThreshold,
            errorThreshold,
            lowComplexityColor: lowColor,
            lowComplexityIcon: lowIcon,
            lowComplexityMessage: lowMessage,
            warningComplexityColor: warningColor,
            warningComplexityIcon: warningIcon,
            warningComplexityMessage: warningMessage,
            errorComplexityColor: errorColor,
            errorComplexityIcon: errorIcon,
            errorComplexityMessage: errorMessage
          });
        }
        function resetSettings() {
          vscode.postMessage({
            command: 'resetSettings'
          });
        }
      </script>
    </body>
    </html>
  `;

  panel.webview.onDidReceiveMessage(
    async (message) => {
      const config = vscode.workspace.getConfiguration('ComplexityLens');
      if (message.command === 'saveSettings') {
        await config.update('warningThreshold', message.warningThreshold, vscode.ConfigurationTarget.Global);
        await config.update('errorThreshold', message.errorThreshold, vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityColor', message.lowComplexityColor, vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityIcon', message.lowComplexityIcon, vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityMessage', message.lowComplexityMessage, vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityColor', message.warningComplexityColor, vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityIcon', message.warningComplexityIcon, vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityMessage', message.warningComplexityMessage, vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityColor', message.errorComplexityColor, vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityIcon', message.errorComplexityIcon, vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityMessage', message.errorComplexityMessage, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('ComplexityLens settings updated successfully!');
        updateDecorations();
        panel.dispose();
      } else if (message.command === 'resetSettings') {
        await config.update('warningThreshold', 10, vscode.ConfigurationTarget.Global);
        await config.update('errorThreshold', 15, vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityColor', 'green', vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityIcon', '✅', vscode.ConfigurationTarget.Global);
        await config.update('lowComplexityMessage', 'Risk', vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityColor', 'orange', vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityIcon', '⚠️', vscode.ConfigurationTarget.Global);
        await config.update('warningComplexityMessage', 'Risk', vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityColor', 'red', vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityIcon', '❌', vscode.ConfigurationTarget.Global);
        await config.update('errorComplexityMessage', 'Risk', vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('ComplexityLens settings reset to default!');
        updateDecorations();
        panel.dispose();
      }
    },
    undefined,
    context.subscriptions
  );
}

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
  const config = vscode.workspace.getConfiguration('ComplexityLens');
  const warningThreshold = config.get('warningThreshold', 10);
  const errorThreshold = config.get('errorThreshold', 15);
  const lowComplexityColor = config.get('lowComplexityColor', 'green');
  const lowComplexityIcon = config.get('lowComplexityIcon', '✅');
  const lowComplexityMessage = config.get('lowComplexityMessage', 'Risk');
  const warningComplexityColor = config.get('warningComplexityColor', 'orange');
  const warningComplexityIcon = config.get('warningComplexityIcon', '⚠️');
  const warningComplexityMessage = config.get('warningComplexityMessage', 'Risk');
  const errorComplexityColor = config.get('errorComplexityColor', 'red');
  const errorComplexityIcon = config.get('errorComplexityIcon', '❌');
  const errorComplexityMessage = config.get('errorComplexityMessage', 'Risk');

  sourceFile.getFunctions().forEach(func => {
    const complexity = calculateComplexity(func);

    const startPos = editor.document.positionAt(func.getStart());
    const line = startPos.line;
    const decorationLine = line > 0 ? line - 1 : 0;
    const lineEndChar = editor.document.lineAt(decorationLine).range.end.character;
    const range = new vscode.Range(decorationLine, lineEndChar, decorationLine, lineEndChar);

    let color = lowComplexityColor;
    let icon = lowComplexityIcon;
    let message = lowComplexityMessage;

    if (complexity >= errorThreshold) {
      color = errorComplexityColor;
      icon = errorComplexityIcon;
      message = errorComplexityMessage;
    } else if (complexity >= warningThreshold) {
      color = warningComplexityColor;
      icon = warningComplexityIcon;
      message = warningComplexityMessage;
    }

    const decoration = {
      range,
      renderOptions: {
        after: {
          contentText: ` ${icon} ${message} ${complexity}`,
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