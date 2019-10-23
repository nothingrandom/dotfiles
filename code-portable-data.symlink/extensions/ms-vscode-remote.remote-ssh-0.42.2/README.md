# Visual Studio Code Remote - SSH

The **Remote - SSH** extension lets you use any remote machine with a SSH server as your development environment. This can greatly simplify development and troubleshooting in a wide variety of situations. You can:

- Develop on the same operating system you deploy to or use larger, faster, or more specialized hardware than your local machine.
- Quickly swap between different, remote development environments and safely make updates without worrying about impacting your local machine.
- Access an existing development environment from multiple machines or locations.
- Debug an application running somewhere else such as a customer site or in the cloud.

No source code needs to be on your local machine to gain these benefits since the extension runs commands and other extensions directly on the remote machine. You can open any folder on the remote machine and work with it just as you would if the folder were on your own machine.

![Remote SSH](https://microsoft.github.io/vscode-remote-release/images/ssh-readme.gif)

## Installation

1. Install [VS Code - Insiders](https://code.visualstudio.com/insiders) and this extension.

2. **Windows:** Install [an OpenSSH compatible SSH client](https://aka.ms/vscode-remote/ssh/supported-clients) and ensure that the `ssh` command is in your PATH.

    > **Note:** The Remote - SSH extension currently only supports connecting to x86_64 Linux-based SSH servers. Alpine and other non-glibc Linux based distros not yet supported.

## Getting started

**[Check out the quick start in our documentation to get going.](https://aka.ms/vscode-remote/ssh/getting-started)**

Another way to learn what you can do with the extension is to browse the commands it provides, but note that you'll need to set up **key based authentication** for any server you plan to use. If you are new to SSH or are running into trouble, see [here for additional information](https://aka.ms/vscode-remote/ssh/key-based-auth) on setting this up.

Press `F1` to bring up the Command Palette and type in `Remote-SSH` for a full list of commands.

![Command palette](https://microsoft.github.io/vscode-remote-release/images/remote-ssh-command-palette.png)

You can also click on the Remote "Quick Access" status bar item in the lower left corner to get a list of the most common commands.

![Quick actions status bar item](https://microsoft.github.io/vscode-remote-release/images/remote-dev-status-bar.png)

For more information, please see the [extension documentation](https://aka.ms/vscode-remote/ssh).

## Questions, Feedback, Contributing

Have a question or feedback?

- See the [documentation](https://aka.ms/vscode-remote) or the [troubleshooting guide](https://aka.ms/vscode-remote/troubleshooting).
- [Up-vote a feature or request a new one](https://aka.ms/vscode-remote/feature-requests), search [existing issues](https://aka.ms/vscode-remote/issues), or [report a problem](https://aka.ms/vscode-remote/issues/new).
- Contribute to [our documentation](https://github.com/Microsoft/vscode-docs)
- ...and more. See our [CONTRIBUTING](https://aka.ms/vscode-remote/contributing) guide for details.

Or connect with the community...

[![Twitter](https://microsoft.github.io/vscode-remote-release/images/Twitter_Social_Icon_24x24.png)](https://aka.ms/vscode-remote/twitter) [![Stack Overflow](https://microsoft.github.io/vscode-remote-release/images/so-image-24x24.png)](https://stackoverflow.com/questions/tagged/vscode) [![VS Code Dev Community Slack](https://microsoft.github.io/vscode-remote-release/images/Slack_Mark-24x24.png)](https://aka.ms/vscode-dev-community) [![VS CodeGitter](https://microsoft.github.io/vscode-remote-release/images/gitter-icon-24x24.png)](https://gitter.im/Microsoft/vscode)

## Telemetry

Visual Studio Code **Remote - SSH** and related extensions collect telemetry data to help us build a better experience working remotely from VS Code. We only collect data on which commands are executed. We do not collect any information about image names, paths, etc. The extension respects the `telemetry.enableTelemetry` setting which you can learn more about in the [Visual Studio Code FAQ](https://aka.ms/vscode-remote/telemetry).

## License

By downloading and using the Visual Studio **Remote - SSH** extension and its related components, you agree to the product [license terms](https://go.microsoft.com/fwlink/?linkid=2077057) and [privacy statement](https://www.microsoft.com/en-us/privacystatement/EnterpriseDev/default.aspx).
