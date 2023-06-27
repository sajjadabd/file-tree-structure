const express = require('express')
const app = express()
const port = 3000

let fs = require('fs'); 
let path = require('path');

const {glob , Glob} = require('glob');

app.use('/main', express.static('main'))

app.use('/public', express.static('public'))

app.set('view engine', 'ejs');

let root = path.join(__dirname , 'main');

let template = ``;

let allFiles = [];
let subFolderfiles = [];

let counter = 0;

let result = [];

let fetchFiles = async () => {
  result = [];
  template = ``;

  result = await glob('./**/*.pdf', (err, files) => {
      if (err) {
          console.log(err);
      } else {
          // a list of paths to javaScript files in the current working directory
          console.log(files);
      }
  });

  result.sort();

  template += `<ul>`;
  for(let i=0;i<result.length;i++) {
    template += `<li>${result[i]}</li>`;
  }
  template += `</ul>`;

  console.log(result);

  //convertResultToObject();
}

let printDirectories = (thePath , index) => {
    let files = fs.readdirSync( thePath , { withFileTypes: true });

    for(let i=0;i<files.length;i++) {

        template += `<ul>`;
        if( files[i].isDirectory() ) {
            console.log(files[i].name);
            template += `<li>${files[i].name}</li>`;
            //console.log(`this is directory`);
            printDirectories( path.join( root , files[i].name ) , counter );
            allFiles[i] = { directory : files[i].name , files : [] };
            counter++;
        } else {
            console.log( '|--- ' + files[i].name);
            let correctPath = path.join(thePath , files[i].name);
            let relativePath = path.relative(process.cwd(), correctPath);
            let firstCharacter = correctPath.slice(0,1);
            //console.log(correctPath);
            template += `<a href="./${relativePath}" onclick="window.location.href='file:///${correctPath}'" target="__blank"><li>${files[i].name}</li></a>`
            console.log(`counter : ${counter}`);
            subFolderfiles.push(relativePath);
        }
        template += `</ul>`;
    }
}





app.get('/', async (req, res) => {
    await fetchFiles();
    //res.send(template);
    res.render(
      'index' ,
      { data : JSON.stringify(result) }
    );
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})