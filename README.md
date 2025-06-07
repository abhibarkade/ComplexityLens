ComplexityLens
A simple, plain, and lightweight VS Code plugin to check code complexity in TypeScript and JavaScript files. No fancy stuff—just a straightforward tool to help you identify complex functions and manage code quality.
Overview
ComplexityLens calculates the cyclomatic complexity of functions in your TypeScript and JavaScript code and displays the "Risk" level directly in the editor. It uses simple icons and colors to indicate whether a function's complexity is within acceptable limits, warrants a warning, or indicates an error based on configurable thresholds.

Lightweight: Minimal dependencies and no unnecessary features.
Simple: Displays complexity with basic icons (✅, ⚠️, ❌) and color-coded text.
Focused: Works only with TypeScript and JavaScript files, targeting function complexity.

Installation

Open VS Code.
Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS).
Search for ComplexityLens.
Click Install.
Reload VS Code if prompted.

Alternatively, you can install it manually:

Download the .vsix file from the VS Code Marketplace or the releases section of this repository.
In VS Code, go to the Extensions view, click the ... menu, and select Install from VSIX.
Select the downloaded .vsix file and install.

Usage
Once activated, ComplexityLens automatically analyzes your TypeScript and JavaScript files and displays the complexity of each function in the editor. The complexity is shown above each function with an icon and a risk score:

✅ (Green): Complexity is below the warning threshold (low risk).
⚠️ (Orange): Complexity is between the warning and error thresholds (moderate risk).
❌ (Red): Complexity exceeds the error threshold (high risk).

Toggling the Plugin
You can enable or disable ComplexityLens using the command palette:

Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
Type ComplexityLens: Toggle and select it.
A message will confirm whether the plugin is enabled or disabled.

Configuration
ComplexityLens allows you to customize the thresholds for warnings and errors via VS Code settings. To configure:

Go to File > Preferences > Settings (or Ctrl+, / Cmd+,).
Search for ComplexityLens.
Adjust the following settings:


ComplexityLens.warningThreshold (default: 10): The complexity value at which a function is considered a moderate risk (⚠️, orange).
ComplexityLens.errorThreshold (default: 15): The complexity value at which a function is considered a high risk (❌, red).

Example
If a function has a complexity of 12:

If warningThreshold is 10 and errorThreshold is 15, it will show ⚠️ in orange.
If you change warningThreshold to 5 and errorThreshold to 10, it will show ❌ in red.

How Complexity is Calculated
ComplexityLens uses cyclomatic complexity, which starts at 1 for each function and increments by 1 for each of the following:

Control flow statements (if, for, while, do, switch, etc.).
Conditional expressions (ternary operators).
Logical binary expressions (&&, ||).

This metric helps you identify functions that might be too complex and need refactoring.
Supported Languages

TypeScript
JavaScript

Dependencies
ComplexityLens relies on the following:

vscode: The VS Code API for editor integration.
ts-morph: A TypeScript compiler API wrapper for parsing and analyzing code.

No other external dependencies are used, keeping the plugin lightweight.
Limitations

Only works with TypeScript and JavaScript files.
Does not support other languages (e.g., Python, Java).
Complexity is calculated for functions only, not for other constructs like classes or modules.

Contributing
Contributions are welcome! To contribute:

Fork this repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request.

Please ensure your changes align with the plugin's goal of remaining simple and lightweight.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Issues
If you encounter any bugs or have feature requests (keeping in mind the plugin's simple nature), please open an issue on the GitHub repository.
Acknowledgments
Built with simplicity in mind for developers who want a no-frills tool to monitor code complexity in VS Code.