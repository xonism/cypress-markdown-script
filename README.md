`generate-markdown-file.js` has functions that parse through all Cypress test files that contain `spec` & extract test names (values after `describe` & `it`).

It is used in the `Generate Markdown File with Test Names` Github Action that automatically pushes the generates `tests.md` file to the main branch.
