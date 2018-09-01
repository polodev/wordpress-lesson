var gulp = require('gulp');
var fs  = require('fs');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var uglifycss = require('gulp-uglifycss');

// only codemirror

var css_files = [
"./static/codemirror/lib/codemirror.css",
"./static/codemirror/theme/monokai.css",
"./static/codemirror/theme/material.css",
"./static/codemirror/theme/solarized.css",
"./static/codemirror/theme/tomorrow-night-bright.css",
"./static/codemirror/addon/hint/show-hint.css",
"./static/codemirror/addon/dialog/dialog.css"
]

var js_files = [
"./static/codemirror/lib/codemirror.js" ,
"./static/codemirror/mode/javascript/javascript.js" ,
"./static/codemirror/mode/clike/clike.js" ,
"./static/codemirror/mode/htmlmixed/htmlmixed.js" ,
"./static/codemirror/mode/xml/xml.js" ,
"./static/codemirror/mode/css/css.js" ,
"./static/codemirror/mode/php/php.js" ,
"./static/codemirror/mode/jsx/jsx.js" ,
"./static/codemirror/mode/sql/sql.js" ,
"./static/codemirror/mode/markdown/markdown.js" ,
"./static/codemirror/keymap/vim.js" ,
"./static/codemirror/addon/hint/anyword-hint.js" ,
"./static/codemirror/addon/hint/show-hint.js" ,
"./static/codemirror/addon/hint/javascript-hint.js" ,
"./static/codemirror/addon/hint/css-hint.js" ,
"./static/codemirror/addon/edit/closebrackets.js" ,
"./static/codemirror/addon/edit/matchbrackets.js" ,
"./static/codemirror/addon/comment/continuecomment.js" ,
"./static/codemirror/addon/comment/comment.js" ,
"./static/codemirror/addon/dialog/dialog.js" ,
"./static/codemirror/addon/search/searchcursor.js" ,
"./static/codemirror/emmet.js"
];
gulp.task('jsc', () => {
  return gulp.src(js_files)
  .pipe(concat('codemirror_master.js'))
  .pipe(gulp.dest('./dist'))
})

gulp.task('cssc', () => {
  return gulp.src(css_files)
    .pipe(concatCss('codemirror_master.css'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('ujs', (cb) => {
  pump([
    gulp.src('./dist/*.js'),
    uglify(),
    gulp.dest('./static/dist/')
    ], cb)
})

gulp.task('ucss', () => {
  return gulp.src('./dist/*.css')
  .pipe(uglifycss())
  .pipe(gulp.dest('./static/dist/'))
})

gulp.task('default', ['jsc', 'cssc', 'ujs', 'ucss'])









/*

var lunr = require('lunr');

gulp.task('lunr', () => {
  const documents = JSON.parse(fs.readFileSync('docs/index.json'));
  var store = {}
  documents.forEach(doc => {
    store[doc.uri] = {
        'title': doc.title
    };
  });
  console.log(store)

  let lunrIndex = lunr(function() {
        this.field("title", {
            boost: 10
        });
        this.field("tags", {
            boost: 3
        });
        this.field("content", {
          boost: 1
        });
        this.ref("uri");

        documents.forEach(function(doc) {
            this.add(doc);
        }, this);
    });
  var object = {
    store: store,
    index: lunrIndex
  }

  fs.writeFileSync('static/js/lunr-index.json', JSON.stringify(object));
});


*/
