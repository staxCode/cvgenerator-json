<h1 align="center">
  cvgenerator-json
</h1>

<h4 align="center">
Terminal app developed in node.js to create your cv's by configuring a file in .json format. 😊
</h4>

## Install

```
$ npm install cvgenerator-json
```

## Info

```
$ cvn --help

Usage
  $ cvn [<options>  ...]

  Options
  --create, -c      Create  cv in  *.docx format  in defined path.
  --lang, -l        Change  the language  of  the document  to  be  generated.
  --generate, -g    Generate a template (.json file)  for adding  information about the CV.

Example
  $ cvn -c path/file/data-cv.json path/download/my-cv.docx
  $ cvn -c path/file/data-cv.json path/download/my-cv.docx  -l  es
  $ cvn -g path/file/template-data-cv.json
    
Note
  * By default the path of created files is the current user path.
  * The languages available for the docx  are English-en (Default)  and Spanish-es

```

