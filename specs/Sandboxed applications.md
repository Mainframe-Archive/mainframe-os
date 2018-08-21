# Sandboxed applications

Mainframe applications are composed of two elements: a [manifest](Application%20manifest.md) and a contents package.\
The manifest contains metadata necessary to identify and install an app, such as its `id`, `author` information, `version`, `permissions` and `contentsURI`.\
The `contentsURI` present in the manifest can be used to retrieve the contents package from Swarm if the user decides to install or update the app.
The contents package contains all the assets (HTML, CSS, JS, images, fonts...) necessary to run the app in the Mainframe sandbox.

The [Mainframe SDK](Application%20SDK.md) can be used by applications to interact with the platform APIs.

## More details

- [Application manifest](Application%20manifest.md)
- [Application SDK](Application%20SDK.md)
