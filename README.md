# ua-plagiarism-checker
Plagiarism checker for the UA language

To start a program, firstly install Python packages from the `requirements.txt` and run `wsgi.py`.

To make changes to the application frontend, install NPM packages from the `frontend/package.json` and run `npm start`.

To build frontend, run `npm run build`. New frontend build will be output into the `build` folder.

Move these files to the `static` folder and run `wsgi.py`.

**Attention!** Application frontend uses the API that is run by `wsgi.py`. When working on the frontend, run the `wsgi.py`.