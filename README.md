# ComplexityLens

A simple, plain, and lightweight VS Code plugin to check code complexity in TypeScript and JavaScript files. No fancy stuff—just a straightforward tool to help you identify complex functions and manage code quality.

---

## 🎬 Demo Video

[![Watch the demo](https://img.youtube.com/vi/qu0ZiNHgI_s/hqdefault.jpg)](https://www.youtube.com/watch?v=qu0ZiNHgI_s)

---

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