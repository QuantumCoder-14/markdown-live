// Run: node tests/test.js
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/\/\/ <<CORE([\s\S]*?)\/\/ CORE>>/);
if (!m) { console.error('CORE block not found'); process.exit(1); }
const api = new Function(m[1] + '; return {mdToHtml,escapeHtml,inline};')();
let fails = 0;
const eq = (n, got, want) => { if (got !== want) {
  fails++; console.log(`FAIL ${n}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`); } };
const has = (n, hay, needle) => { if (!hay.includes(needle)) {
  fails++; console.log(`FAIL ${n}: missing ${JSON.stringify(needle)} in ${JSON.stringify(hay)}`); } };

eq('escape', api.escapeHtml('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
eq('h1', api.mdToHtml('# Title'), '<h1>Title</h1>');
eq('h3', api.mdToHtml('### Deep'), '<h3>Deep</h3>');
eq('paragraph', api.mdToHtml('hello'), '<p>hello</p>');
eq('two paragraphs', api.mdToHtml('a\n\nb'), '<p>a</p>\n<p>b</p>');
has('bold', api.mdToHtml('a **b** c'), '<strong>b</strong>');
has('italic', api.mdToHtml('a *b* c'), '<em>b</em>');
has('inline code', api.mdToHtml('use `x` here'), '<code>x</code>');
has('link', api.mdToHtml('[site](https://a.com)'), '<a href="https://a.com" rel="noopener noreferrer">site</a>');
has('strike', api.mdToHtml('~~gone~~'), '<del>gone</del>');
eq('hr', api.mdToHtml('---'), '<hr>');
has('blockquote', api.mdToHtml('> quoted'), '<blockquote>quoted</blockquote>');
has('ul', api.mdToHtml('- a\n- b'), '<ul>');
eq('ul items', (api.mdToHtml('- a\n- b').match(/<li>/g) || []).length, 2);
has('ol', api.mdToHtml('1. a\n2. b'), '<ol>');
has('fenced code', api.mdToHtml('```\nconst a = 1;\n```'), '<pre><code>const a = 1;</code></pre>');
has('code keeps angle brackets escaped', api.mdToHtml('```\n<div>\n```'), '&lt;div&gt;');
eq('script tag is escaped', api.mdToHtml('<script>alert(1)</script>').includes('<script>'), false);
has('escaped script present', api.mdToHtml('<script>alert(1)</script>'), '&lt;script&gt;');
eq('empty input', api.mdToHtml(''), '');
eq('image alt text not treated as link', api.mdToHtml('no [brackets here').includes('<a '), false);

console.log(fails ? `\n${fails} FAILURE(S)` : 'ALL MARKDOWN TESTS PASSED');
process.exit(fails ? 1 : 0);
