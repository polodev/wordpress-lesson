# iterating categories taxonomy for sidebar

~~~go-html-template
  <ul>
    {{ range $key, $value := .Site.Taxonomies.categories }}
      <li><a href="{{ $.Site.BaseURL  }}categories/{{ $key | urlize  }}">{{ $key | humanize }}</a> ({{ len $value }})</li>
    {{ end }}
  </ul>
~~~

# showing categories for inside a post with `,` delimiter

~~~go-html-template
{{ range $i, $category := .Params.categories }}
  {{if $i}},{{end}}
  <a href="{{$.Site.BaseURL}}categories/{{. | urlize }}">
    {{ $category }}
  </a>
{{ end }}

// we should check before add categories
{{ if .Params.categories }}
{{ end}}
~~~

# showing tags for inside a post with `,` delimiter
~~~html
{{ range $i, $e := .Params.tags }}{{ if $i }}, {{ end }}{{ $e }}{{ end }}
~~~

# showing previous and next post

~~~go-html-template
<div class="text-center py-3">
  {{ if .PrevInSection }}
    <a class="btn btn-info" href="{{.PrevInSection.Permalink}}">Next Post</a>
  {{ end }}
  {{ if .NextInSection }}
    <a class="btn btn-info" href="{{.NextInSection.Permalink}}">Previous Post</a>
  {{ end }}
</div>
~~~

# making pagination
setting of paginate number in config.toml file
~~~go-html-template
Paginate=2
~~~

lopping `.Paginator.Pages` is list.html file .

~~~go-html-template
{{ range .Paginator.Pages }}
{{ end }}
{{ partial "pagination" . }}
~~~

making a partial pagination.html and paste content following
~~~go-html-template
<!-- Code starts here -->
{{ $pag := $.Paginator }}
{{ if gt $pag.TotalPages 1 }}
{{ $.Scratch.Set "dot_rendered" false }}
<nav>
    <ul class="pagination">
        <!-- Don't show on 1st and 2nd page -->
        {{ if and (ne $pag.PageNumber 1) (ne $pag.PageNumber 2) }}
        <li class="page-item"><a href="{{ $pag.First.URL }}" rel="first" class="page-link">« First</a></li>
        {{ end }}

        {{ if $pag.HasPrev  }}
        <li class="page-item"><a href="{{ $pag.Prev.URL }}" rel="prev" class="page-link">‹ Prev</a></li>
        {{ end }}

        {{ range $pag.Pagers }}
            {{ if eq . $pag }} <!-- Current Page -->
            <li class="page-item active"><a href="{{ .URL }}" class="page-link">{{ .PageNumber }}</a></li>
            {{ else if and (ge .PageNumber (sub $pag.PageNumber 2)) (le .PageNumber (add $pag.PageNumber 2)) }}
            {{ $.Scratch.Set "dot_rendered" false }} <!-- Render prev 2 page and next 2 pages -->
            <li class="page-item"><a href="{{ .URL }}" class="page-link">{{ .PageNumber }}</a></li>
            {{ else if eq ($.Scratch.Get "dot_rendered") false }} <!-- render skip pages -->
            {{ $.Scratch.Set "dot_rendered" true }}
            <li class="page-item disabled"><a class="page-link">...</a></li>
            {{ end }}
        {{ end }}

        {{ if $pag.HasNext }}
        <li class="page-item"><a href="{{ $pag.Next.URL }}" rel="next" class="page-link">Next ›</a></li>
        {{ end }}

        <!-- Don't show on last and 2nd last page -->
        {{ if and (ne $pag.PageNumber $pag.TotalPages) ((ne $pag.PageNumber (sub $pag.TotalPages 1))) }}
        <li class="page-item"><a href="{{ $pag.Last.URL }}" rel="last" class="page-link">Last »</a></li>
        {{ end }}
    </ul>
</nav>
{{ end }}
<!-- Code ends here -->
~~~

# publishDir
we can make docs folder a website in github. So instead of public folder we can publish build in to docs folder by adding following setting in config.toml file
~~~bash
publishDir='docs'
~~~

# how I added lunr search in my website

1. set json output in config.toml file
~~~js
[outputs]
home = [ "HTML", "RSS", "JSON"]
~~~

2. Added 'layout/index.json' file for json output structure. baseURL inside `config.toml` file matters.

~~~js
[{{ range $index, $page := .Site.Pages }}
{{- if ne $page.Type "json" -}}
{{- if and $index (gt $index 0) -}},{{- end }}
{
  "uri": "{{ $page.Permalink }}",
  "title": "{{ htmlEscape $page.Title}}",
  "tags": [{{ range $tindex, $tag := $page.Params.tags }}{{ if $tindex }}, {{ end }}"{{ $tag| htmlEscape }}"{{ end }}],
  "description": "{{ htmlEscape .Description}}",
  "content": {{$page.Plain | jsonify}}
}
{{- end -}}
{{- end -}}]
~~~

we should use `.Site.RegularPages` instead of `.Site.Pages`.

~~~html
[{{ range $index, $page := .Site.RegularPages }}
{{- if ne $page.Type "json" -}}
{{- if and $index (gt $index 0) -}},{{- end }}
{
  "uri": "{{ $page.Permalink }}",
  "title": "{{ htmlEscape $page.Title}}",
  "tags": [{{ range $tindex, $tag := $page.Params.tags }}{{ if $tindex }}, {{ end }}"{{ $tag| htmlEscape }}"{{ end }}]
}
{{- end -}}
{{- end -}}]

~~~

3. Using `Hugo` command build the the site and generated json file. Which will be available root of the public directory `public/index.json`
4. make a gulp file for making lunr index and store file
I have to install `lunr` , 'gulp' as dependency using npm
~~~bash
npm init -y
npm i --save gulp lunr
~~~

make `gulpfile.json`  in my root and wrote following code

~~~js
var gulp = require('gulp');
var fs  = require('fs');

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
            boost: 1
        });
        this.field("content");
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
~~~

to generate 'static/js/lunr-index.json' file we need do following command `gulp lunr`
once we generate lunr index we can fetch json file using `fetch` api and listen to `keyup` event for search

~~~js
$(document).ready(function () {
    'use strict';
    // Set up search
    var index, store;
    $.getJSON('/learning/js/lunr-index.json', function (response) {
        // Create index
        index = lunr.Index.load(response.index);
        // Create store
        store = response.store;
        // Handle search
        $('input#search').on('keyup', function () {
            // Get query
            var query = $(this).val();
            // Search for it
            var result = index.search(`${query}*`);
            console.log('result', result);
            // Output it
            var resultdiv = $('#search_result');
            if (result.length === 0 || query == '' ) {
                // Hide results
                resultdiv.hide();
            } else {
                // Show results
                resultdiv.empty();
                for (var item in result) {
                    var ref = result[item].ref;
                    var searchitem = '<li><a href="' + ref + '">' + store[ref].title + '</a></li>';
                    resultdiv.append(searchitem);
                }
                resultdiv.show();
            }
        });
    });
});

~~~

# how to use disqus in hugo
Go to disqus website and add a site to disqus admin. It will generate website short name and some code.
first add disqus website short name in config.toml file
~~~js
disqusShortname = "dev-learning"
~~~

make a partials for keeping generated code. in my case I kept file name `layouts/partials/comments.html`. Paste generate code there.
~~~html
<div id="disqus_thread"></div>
<script>
/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://dev-learning.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

~~~

Added to your `layouts/_default/single.html` or any other desired layout.

~~~html
{{ partial "comments" . }}
~~~

# reading time in goHugo

~~~html
{{.ReadingTime }} minutes
// for seconds output
{{ mul .ReadingTime 60 }} seconds
~~~

# adding date in hugo

~~~html
{{ .PublishDate.Format "January 2, 2006" }}.
~~~

# how to add menus in hugo and add active links

write menu list in config.toml file
~~~toml
[menu]
  [[menu.main]]
    identifier = "home"
    name = "this is home page"
    title = "Home"
    url = "/"
    weight = 1
  [[menu.main]]
    identifier = "about"
    name = "this is about page"
    title = "About"
    url = "/about/"
    weight = 2
~~~

now we can iterate menu in our `layouts/partials/menu.html` file
advanced menu could be found in (with submenu)
[here](https://github.com/Xzya/hugo-bootstrap/blob/master/layouts/partials/header.html)
~~~html
{{ $url := .URL | relURL }}
{{range $.Site.Menus.main}}
<li class='nav-item {{ if eq $url (.URL | relURL) }}active{{end}}'>
  <a class="nav-link" href='{{.URL}}'>{{.Title}}</a>
</li>
{{ end }}
~~~


# how to iterate specific taxonomy

~~~html
{{ $paginator := .Paginate (where .Site.Pages ".Params.type" "tutorial") }}
{{ range $paginator.Pages }}
// or following.  but state above is effective
{{ $paginator := .Paginate (where .Pages "Type" "posts") }}
{{ range $paginator.Pages }}
{{end}}
~~~

# adding mathjax in gohugo
first load mathjax js and setting.
~~~html
<script type="text/x-mathjax-config" src="{{"js/math_setting.js" | relURL}}"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
~~~

~~~js
//js/math_setting.js
MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    displayMath: [['$$','$$'], ['\[','\]']],
    processEscapes: true,
    processEnvironments: true,
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
    TeX: { equationNumbers: { autoNumber: "AMS" },
         extensions: ["AMSmath.js", "AMSsymbols.js"] }
  }
});

MathJax.Hub.Queue(function() {
  // Fix <code> tags after MathJax finishes running. This is a
  // hack to overcome a shortcoming of Markdown. Discussion at
  // https://github.com/mojombo/jekyll/issues/199
  var all = MathJax.Hub.getAllJax(), i;
  for(i = 0; i < all.length; i += 1) {
      all[i].SourceElement().parentNode.className += ' has-jax';
  }
});
~~~

changing font size. I prefer bigger font for math part
~~~css
.math {font-size: 20px}
~~~

If you want to use `mmark` markdown engine your file extension should be `.mmark` or add frontmatter `markup="mmark"`. block code should be written inside `div` tag and inline code written inside `p` tag. and latex code should be surrounded by `$$`(double dollar).
~~~html
<p> When $$a \ne 0$$, there are two solutions to $$ ax^2 + bx + c = 0 $$ and they are
</p>
<div> $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$ </div>
~~~

If you don't use `mmark`, latex code  will be following. instead of `$`, we have to use `\(`.

~~~html
<p> When \(a \ne 0\), there are two solutions to \( ax^2 + bx + c = 0 \) and they are
</p>
<div> $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$ </div>
~~~


## how to use katex

Katex is a math library developed by Khan academy. However its rendering time is very fast compare to MathJax. So I switched to katex form MathJax.

first added html to your baseof file

~~~html
<!-- KaTeX -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js" integrity="sha384-dq1/gEHSxPZQ7DdrM82ID4YVol9BYyU7GbWlIwnwyPzotpoc57wDw/guX8EaYGPx" crossorigin="anonymous"></script>
~~~

initiate katex
~~~js
renderMathInElement(document.body);
~~~







# how to use katex in gohugo
Using katex in go hugo pretty simpler

