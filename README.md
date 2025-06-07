# ComplexityLens

A simple, plain, and lightweight VS Code plugin to check code complexity in TypeScript and JavaScript files. No fancy stuff—just a straightforward tool to help you identify complex functions and manage code quality.

## Overview

ComplexityLens calculates the **cyclomatic complexity** of functions in your TypeScript and JavaScript code and displays the "Risk" level directly in the editor. It uses simple icons and colors to indicate whether a function's complexity is within acceptable limits, warrants a warning, or indicates an error based on configurable thresholds.

- **Lightweight**: Minimal dependencies and no unnecessary features.
- **Simple**: Displays complexity with basic icons (✅, ⚠️, ❌) and color-coded text.
- **Focused**: Works only with TypeScript and JavaScript files, targeting function complexity.

## Installation

1. Open VS Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for **ComplexityLens**.
4. Click **Install**.
5. Reload VS Code if prompted.

### Manual Installation

Alternatively, you can install it manually:

1. Download the `.vsix` file from the [VS Code Marketplace](https://marketplace.visualstudio.com/) or the [releases section](https://github.com/your-repo/complexitylens/releases) of this repository.
2. In VS Code, go to the **Extensions** view, click the `...` menu, and select **Install from VSIX**.
3. Select the downloaded `.vsix` file and install.

## Usage

Once activated, ComplexityLens automatically analyzes your TypeScript and JavaScript files and displays the complexity of each function in the editor. The complexity is shown above each function with an icon and a risk score:

- ✅ **(Green)**: Complexity is below the warning threshold (low risk).
- ⚠️ **(Orange)**: Complexity is between the warning and error thresholds (moderate risk).
- ❌ **(Red)**: Complexity exceeds the error threshold (high risk).

### Toggling the Plugin

You can enable or disable ComplexityLens using the command palette:

1. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type `ComplexityLens: Toggle` and select it.
3. A message will confirm whether the plugin is enabled or disabled.

## Configuration

ComplexityLens allows you to customize the thresholds for warnings and errors via VS Code settings. To configure:

1. Go to **File > Preferences > Settings** (or `Ctrl+,` / `Cmd+,`).
2. Search for `ComplexityLens`.
3. Adjust the following settings:

- `ComplexityLens.warningThreshold` (default: `10`): The complexity value at which a function is considered a moderate risk (⚠️, orange).
- `ComplexityLens.errorThreshold` (default: `15`): The complexity value at which a function is considered a high risk (❌, red).

### Example

If a function has a complexity of `12`:

- If `warningThreshold` is `10` and `errorThreshold` is `15`, it will show ⚠️ in orange.
- If you change `warningThreshold` to `5` and `errorThreshold` to `10`, it will show ❌ in red.

## How Complexity is Calculated

ComplexityLens uses **cyclomatic complexity**, which starts at `1` for each function and increments by `1` for each of the following:

- Control flow statements (`if`, `for`, `while`, `do`, `switch`, etc.).
- Conditional expressions (ternary operators).
- Logical binary expressions (`&&`, `||`).

This metric helps you identify functions that might be too complex and need refactoring.

## Supported Languages

- TypeScript
- JavaScript

## Dependencies

ComplexityLens relies on the following:

- `vscode`: The VS Code API for editor integration.
- `ts-morph`: A TypeScript compiler API wrapper for parsing and analyzing code.

No other external dependencies are used, keeping the plugin lightweight.

## Limitations

- Only works with TypeScript and JavaScript files.
- Does not support other languages (e.g., Python, Java).
- Complexity is calculated for functions only, not for other constructs like classes or modules.

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your changes align with the plugin's goal of remaining simple and lightweight.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Issues