// ── Navigation ──
document.querySelectorAll('[data-page]').forEach(el =>
  el.addEventListener('click', e => { e.preventDefault(); navigateTo(el.dataset.page); })
);

function navigateTo(t) {
  if (!t) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
  const pg = document.getElementById(t), lk = document.querySelector(`.nav-links a[data-page="${t}"]`);
  if (pg) { pg.classList.remove('active'); void pg.offsetWidth; pg.classList.add('active'); }
  if (lk) lk.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setFilter(btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function like(btn) {
  const n = parseInt(btn.textContent.trim().split(' ')[1]) + 1;
  btn.textContent = `♥ ${n}`; btn.style.color = 'var(--accent)';
}
function subscribe(btn) {
  const inp = btn.previousElementSibling;
  if (!inp.value || !inp.value.includes('@')) { inp.style.borderColor = '#f78166'; return; }
  btn.textContent = '✓ Done'; btn.style.background = 'var(--green)'; btn.style.color = '#000';
  inp.disabled = btn.disabled = true;
}

// ── Challenge modal ──
const data = {
  c1: { num:'Challenge #01', title:'Reverse a String Without Built-ins', level:'Beginner', cls:'b-beg', tags:['Strings','Loops'], sub:142, desc:'Given a string, return it reversed. You cannot use built-in methods like <code>split()</code>, <code>reverse()</code>, or <code>join()</code>. Implement the reversal manually using only loops and basic operators.', rules:['No split(), reverse(), join() or similar built-in methods','Any programming language accepted','Must handle empty strings and single characters','Share your GitHub link with the tag #challenge-01'], ex:`<span class="cm">// Input / Output</span>\n"hello"  →  "olleh"\n""       →  ""\n"a"      →  "a"`, hint:'Think about two pointers — one at the start, one at the end, swapping as they move toward each other.' },
  c2: { num:'Challenge #02', title:'FizzBuzz — But Make It Extensible', level:'Beginner', cls:'b-beg', tags:['OOP','Design Patterns'], sub:210, desc:'Build a FizzBuzz system where rules can be added dynamically at runtime — any number, any word. Architecture matters as much as the output.', rules:['Rules must be injectable at runtime, not hardcoded','Adding a new rule should require zero changes to existing code','Must handle multiple matching rules (e.g. 15 → "FizzBuzz")','Share your GitHub link with the tag #challenge-02'], ex:`fb.addRule(3, "Fizz")\nfb.addRule(5, "Buzz")\nfb.run(1, 15)\n<span class="cm">// 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz</span>`, hint:'Think about the Open/Closed principle — open for extension, closed for modification.' },
  c3: { num:'Challenge #03', title:'Implement a Stack with Min() in O(1)', level:'Intermediate', cls:'b-int', tags:['Data Structures','Stacks'], sub:98, desc:'Design a stack that supports push, pop, and a special min() operation — all in O(1) time.', rules:['push(), pop(), and min() must all run in O(1)','min() must always return the current minimum after each pop','You may use extra space','Share your GitHub link with the tag #challenge-03'], ex:`stack.push(5)  <span class="cm">→ min() = 5</span>\nstack.push(3)  <span class="cm">→ min() = 3</span>\nstack.push(7)  <span class="cm">→ min() = 3</span>\nstack.pop()    <span class="cm">→ min() = 3</span>\nstack.pop()    <span class="cm">→ min() = 5</span>`, hint:'Use a second stack to track minimums. Push to it only when the new value is ≤ current min.' },
  c4: { num:'Challenge #04', title:'Build a Rate Limiter', level:'Intermediate', cls:'b-int', tags:['System Design','Concurrency'], sub:87, desc:'Implement a token bucket rate limiter. It should allow a burst of requests up to a maximum, then throttle until tokens refill.', rules:['Implement the token bucket algorithm (not fixed window)','Must handle burst traffic correctly','Must be thread-safe if your language supports concurrency','Write at least 3 tests','Share your GitHub link with the tag #challenge-04'], ex:`limiter = RateLimiter(max=10, refillRate=1)\nlimiter.allow()  <span class="cm">→ true  (9 tokens left)</span>\nlimiter.allow()  <span class="cm">→ false (0 tokens, wait)</span>\nlimiter.allow()  <span class="cm">→ true  (refilled)</span>`, hint:'Track the last refill timestamp. Calculate how many tokens have been added since then.' },
  c5: { num:'Challenge #05', title:'Build a REST API with Auth from Scratch', level:'Intermediate', cls:'b-int', tags:['API','JWT','Backend'], sub:76, desc:'Build a REST API with registration, login, and at least one protected route. Auth must use JWT without auth libraries.', rules:['POST /register and POST /login required','At least one protected GET endpoint requiring a valid JWT','JWT generated and validated without auth libraries','Passwords must be hashed','Share your GitHub link with the tag #challenge-05'], ex:`POST /register  { email, password }  <span class="cm">→ 201</span>\nPOST /login     { email, password }  <span class="cm">→ { token }</span>\nGET  /me        Bearer {token}       <span class="cm">→ { id, email }</span>`, hint:'JWT = base64(header) + "." + base64(payload) + "." + HMAC_SHA256(header+payload, secret).' },
  c6: { num:'Challenge #06', title:'LRU Cache Implementation', level:'Advanced', cls:'b-adv', tags:['Data Structures','HashMap'], sub:52, desc:'Implement a Least Recently Used cache with get() and put() — both O(1). When full, evict the least recently used item.', rules:['get(key) and put(key, value) must run in O(1)','Evict least recently used when capacity exceeded','get() counts as a "use" and updates recency','Share your GitHub link with the tag #challenge-06'], ex:`cache = LRUCache(capacity=2)\ncache.put(1, "one"); cache.put(2, "two")\ncache.get(1)          <span class="cm">→ "one"</span>\ncache.put(3, "three") <span class="cm">→ evicts key 2</span>`, hint:'Combine a HashMap with a doubly linked list. HashMap for O(1) lookup, linked list for O(1) insert/delete.' },
  c7: { num:'Challenge #07', title:'Design a URL Shortener', level:'Advanced', cls:'b-adv', tags:['System Design','Databases'], sub:41, desc:'Build a working URL shortener. Users submit a long URL and get a short code. Visiting the short URL redirects to the original.', rules:['POST /shorten receives a URL and returns a short code','GET /{code} redirects with 301/302','Short codes must be unique and hard to predict','Handle the same URL shortened twice','Share your GitHub link with the tag #challenge-07'], ex:`POST /shorten  { url: "https://very-long-url.com/path" }\n               <span class="cm">→ { shortUrl: "https://short.ly/xK9p2" }</span>\nGET /xK9p2     <span class="cm">→ 302 redirect</span>`, hint:'Use base62 encoding (a-z, A-Z, 0-9) on an auto-incremented ID. Avoids collision by design.' },
  c8: { num:'Challenge #08', title:'Design a Key-Value Store', level:'Advanced', cls:'b-adv', tags:['Databases','Storage'], sub:34, desc:'Build a persistent key-value store from scratch. Data must survive process restarts with basic ACID guarantees.', rules:['set(key, value) and get(key) required','Data must persist to disk and survive restarts','Implement write-ahead logging (WAL) for durability','No existing databases or KV libraries allowed','Share your GitHub link with the tag #challenge-08'], ex:`store.set("name", "Carlos")\nstore.get("name")   <span class="cm">→ "Carlos"</span>\n<span class="cm">// restart process</span>\nstore.get("name")   <span class="cm">→ "Carlos"  ✓ persisted</span>`, hint:'Start simple: append every write to a log file. On startup, replay the log to rebuild state.' },
};

function openChallenge(id) {
  const c = data[id]; if (!c) return;
  document.getElementById('m-num').textContent = c.num;
  document.getElementById('m-ttl').textContent = c.title;
  document.getElementById('m-meta').innerHTML = `<span class="badge ${c.cls}">${c.level}</span>${c.tags.map(t=>`<span class="chip">${t}</span>`).join('')}<span style="font-family:'DM Mono',monospace;font-size:.67rem;color:var(--dim);margin-left:3px;">${c.sub} submissions</span>`;
  document.getElementById('m-body').innerHTML = `<div class="m-sec"><div class="m-lbl">The Problem</div><p>${c.desc}</p></div><div class="m-sec"><div class="m-lbl">Rules</div><ul class="m-rules">${c.rules.map(r=>`<li>${r}</li>`).join('')}</ul></div><div class="m-sec"><div class="m-lbl">Example</div><div class="m-code">${c.ex}</div></div><div class="m-sec"><div class="m-lbl">Hint</div><p style="color:var(--muted);font-style:italic;">${c.hint}</p></div>`;
  document.getElementById('m-foot').innerHTML = `<a href="https://github.com/carlossucredev" target="_blank">↗ Submit on GitHub</a><a href="#" onclick="navigateTo('community');closeModal()">↗ Community solutions</a>`;
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() { document.getElementById('overlay').classList.remove('open'); document.body.style.overflow = ''; }
function overlayClick(e) { if (e.target === document.getElementById('overlay')) closeModal(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ── Lesson full-page system ──
const lessons = {

  ds1: { track:'Data Structures', num:'01', total:'06', title:'Arrays', subtitle:'More Than Just a List', time:'6 min', next:'ds2', prev:null, content:`
<div class="ls-lead">An array is the most fundamental data structure in programming. You've used it hundreds of times — but do you know <em>why</em> accessing <code>arr[4]</code> is instant regardless of size? The answer is in memory layout.</div>

<h2 class="ls-h2">How memory works</h2>
<p class="ls-p">When you create an array, the computer reserves a <strong>contiguous block of memory</strong> — slots sitting right next to each other. Each slot has the same size (e.g. 4 bytes for an int). To get element at index <code>i</code>, the CPU does one calculation:</p>
<div class="ls-formula">address = base_address + (i × element_size)</div>
<p class="ls-p">One multiplication, one addition. No searching, no walking. That's why array access is always <strong>O(1)</strong>.</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">int[] arr = {10, 20, 30, 40, 50} — elements sit contiguously in memory</div>
  <svg viewBox="0 0 520 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="80" height="44" rx="4" fill="#1c2230" stroke="#30363d"/><rect x="110" y="20" width="80" height="44" rx="4" fill="#1c2230" stroke="#30363d"/><rect x="210" y="20" width="80" height="44" rx="4" fill="#1c2230" stroke="#30363d"/><rect x="310" y="20" width="80" height="44" rx="4" fill="#1c2230" stroke="#e8ff47" stroke-width="2"/><rect x="410" y="20" width="80" height="44" rx="4" fill="#1c2230" stroke="#30363d"/>
    <text x="50" y="47" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="14">10</text><text x="150" y="47" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="14">20</text><text x="250" y="47" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="14">30</text><text x="350" y="47" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="14" font-weight="bold">40</text><text x="450" y="47" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="14">50</text>
    <text x="50" y="78" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="11">[0]</text><text x="150" y="78" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="11">[1]</text><text x="250" y="78" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="11">[2]</text><text x="350" y="78" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="11">[3]</text><text x="450" y="78" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="11">[4]</text>
    <text x="50" y="14" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">0x100</text><text x="150" y="14" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">0x104</text><text x="250" y="14" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">0x108</text><text x="350" y="14" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">0x10C</text><text x="450" y="14" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">0x110</text>
  </svg>
  <p class="ls-diagram-caption">arr[3] → 0x100 + (3×4) = 0x10C → 40 &nbsp;·&nbsp; O(1), always instant</p>
</div>

<h2 class="ls-h2">The tradeoff: insertion in the middle</h2>
<p class="ls-p">The contiguous layout is both the strength and the weakness. Inserting in the middle forces every element after the target to shift right — that's O(n).</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">Insert 99 at index 2 — 3 elements must shift right</div>
  <svg viewBox="0 0 520 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="20" fill="#8b949e" font-family="DM Mono" font-size="10">before:</text>
    <rect x="70" y="6" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="134" y="6" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="198" y="6" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="262" y="6" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="326" y="6" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/>
    <text x="99" y="25" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">10</text><text x="163" y="25" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">20</text><text x="227" y="25" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">30</text><text x="291" y="25" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">40</text><text x="355" y="25" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">50</text>
    <text x="290" y="48" text-anchor="middle" fill="#ff6b35" font-family="DM Mono" font-size="9">← these 3 shift right →</text>
    <text x="10" y="78" fill="#8b949e" font-family="DM Mono" font-size="10">after:</text>
    <rect x="70" y="64" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="134" y="64" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="198" y="64" width="58" height="28" rx="3" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><rect x="262" y="64" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="326" y="64" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/><rect x="390" y="64" width="58" height="28" rx="3" fill="#1c2230" stroke="#30363d"/>
    <text x="99" y="83" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">10</text><text x="163" y="83" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="12">20</text><text x="227" y="83" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="12" font-weight="bold">99</text><text x="291" y="83" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="12">30</text><text x="355" y="83" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="12">40</text><text x="419" y="83" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="12">50</text>
    <text x="227" y="104" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">inserted</text><text x="355" y="104" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">shifted</text>
  </svg>
</div>

<h2 class="ls-h2">Complexity cheatsheet</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Operation</span><span>Time</span><span>Why</span></div><div class="ls-tr"><span>Access by index</span><span class="ls-good">O(1)</span><span>Direct address math</span></div><div class="ls-tr"><span>Search unsorted</span><span class="ls-bad">O(n)</span><span>Must check every element</span></div><div class="ls-tr"><span>Search sorted</span><span class="ls-mid">O(log n)</span><span>Binary search possible</span></div><div class="ls-tr"><span>Insert at end</span><span class="ls-good">O(1)*</span><span>No shifting needed (*amortized)</span></div><div class="ls-tr"><span>Insert in middle</span><span class="ls-bad">O(n)</span><span>Must shift elements right</span></div><div class="ls-tr"><span>Delete from end</span><span class="ls-good">O(1)</span><span>Just decrement size</span></div><div class="ls-tr"><span>Delete from middle</span><span class="ls-bad">O(n)</span><span>Must shift elements left</span></div></div>

<h2 class="ls-h2">In code</h2>
<div class="ls-code"><span class="cm">// Java — ArrayList wraps a dynamic array</span>
List&lt;Integer&gt; arr = <span class="kw">new</span> ArrayList&lt;&gt;();
arr.add(10); arr.add(20); arr.add(30);

<span class="cm">// O(1) — direct address calculation</span>
<span class="kw">int</span> val = arr.get(2);    <span class="cm">// → 30</span>

<span class="cm">// O(1) amortized — adds to end, no shifting</span>
arr.add(40);

<span class="cm">// O(n) — shifts everything after index 1</span>
arr.add(1, 99);          <span class="cm">// → [10, 99, 20, 30, 40]</span></div>

<div class="ls-two-col"><div class="ls-callout ls-callout-yes"><div class="ls-callout-title">✓ Use arrays when</div><ul><li>Fast random access by index is needed</li><li>Data grows at the end, not the middle</li><li>Memory efficiency matters — no pointer overhead</li><li>You want cache-friendly iteration</li></ul></div><div class="ls-callout ls-callout-no"><div class="ls-callout-title">✗ Avoid when</div><ul><li>Frequent inserts or deletes in the middle</li><li>Size changes dramatically and unpredictably</li><li>You need fast search without sorting first</li></ul></div></div>
`},

  ds2: { track:'Data Structures', num:'02', total:'06', title:'Linked Lists', subtitle:'When Arrays Fall Short', time:'7 min', next:'ds3', prev:'ds1', content:`
<div class="ls-lead">Arrays are fast for access but expensive for middle insertions. Linked lists flip this tradeoff completely — insertion anywhere is O(1), but random access costs O(n). Knowing when to swap is the real skill.</div>

<h2 class="ls-h2">The structure</h2>
<p class="ls-p">A linked list is a chain of <strong>nodes</strong>. Each node has two fields: the data value, and a pointer to the next node. Nodes don't need to be contiguous in memory — they're scattered, linked only by those pointers.</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">Singly linked list — each node points to the next, last points to null</div>
  <svg viewBox="0 0 520 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ab" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#58a6ff"/></marker></defs>
    <rect x="10" y="16" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><line x1="54" y1="16" x2="54" y2="56" stroke="#30363d"/>
    <rect x="130" y="16" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><line x1="174" y1="16" x2="174" y2="56" stroke="#30363d"/>
    <rect x="250" y="16" width="72" height="40" rx="4" fill="#1c2230" stroke="#e8ff47" stroke-width="2"/><line x1="294" y1="16" x2="294" y2="56" stroke="#e8ff47"/>
    <rect x="370" y="16" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><line x1="414" y1="16" x2="414" y2="56" stroke="#30363d"/>
    <rect x="462" y="22" width="48" height="28" rx="4" fill="#161b22" stroke="#484f58" stroke-dasharray="4,2"/>
    <text x="32" y="40" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">10</text><text x="63" y="40" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="11">→</text>
    <text x="152" y="40" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">20</text><text x="183" y="40" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="11">→</text>
    <text x="272" y="40" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="13">30</text><text x="303" y="40" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="11">→</text>
    <text x="392" y="40" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">40</text><text x="423" y="40" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="11">→</text>
    <text x="486" y="40" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="10">null</text>
    <text x="30" y="10" fill="#e8ff47" font-family="DM Mono" font-size="9">HEAD</text>
    <path d="M84 36 L128 36" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ab)"/><path d="M204 36 L248 36" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ab)"/><path d="M324 36 L368 36" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ab)"/><path d="M444 36 L460 36" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ab)"/>
  </svg>
</div>

<h2 class="ls-h2">Why insertion is O(1)</h2>
<p class="ls-p">To insert between two nodes, you only rewire two pointers. No shifting, no copying, no resizing. Just: <code>newNode.next = current.next</code>, then <code>current.next = newNode</code>. Two assignments.</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">Inserting 99 between 20 and 30 — only 2 pointer changes</div>
  <svg viewBox="0 0 520 115" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ag" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#e8ff47"/></marker>
      <marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#ff6b35"/></marker>
    </defs>
    <rect x="10" y="26" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><text x="38" y="50" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">10</text>
    <rect x="140" y="26" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><text x="168" y="50" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">20</text>
    <rect x="300" y="70" width="72" height="40" rx="4" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="328" y="94" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="13">99</text><text x="328" y="65" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">new node</text>
    <rect x="420" y="26" width="72" height="40" rx="4" fill="#1c2230" stroke="#30363d"/><text x="448" y="50" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="13">30</text>
    <path d="M84 46 L138 46" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ab)"/>
    <path d="M214 46 L418 46" stroke="#ff6b35" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#ar)"/>
    <text x="316" y="40" text-anchor="middle" fill="#ff6b35" font-family="DM Mono" font-size="8">old link (remove)</text>
    <path d="M214 54 L298 88" stroke="#e8ff47" stroke-width="2" marker-end="url(#ag)"/>
    <path d="M374 88 L418 50" stroke="#e8ff47" stroke-width="2" marker-end="url(#ag)"/>
    <text x="244" y="82" fill="#e8ff47" font-family="DM Mono" font-size="8">① new.next = 30</text>
    <text x="385" y="110" fill="#e8ff47" font-family="DM Mono" font-size="8">② 20.next = new</text>
  </svg>
</div>

<h2 class="ls-h2">Complexity cheatsheet</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Operation</span><span>Time</span><span>Notes</span></div><div class="ls-tr"><span>Access by index</span><span class="ls-bad">O(n)</span><span>Walk from head every time</span></div><div class="ls-tr"><span>Search</span><span class="ls-bad">O(n)</span><span>Check each node</span></div><div class="ls-tr"><span>Insert at head</span><span class="ls-good">O(1)</span><span>Rewire head pointer</span></div><div class="ls-tr"><span>Insert at tail</span><span class="ls-good">O(1)</span><span>If you keep a tail pointer</span></div><div class="ls-tr"><span>Insert after a node</span><span class="ls-good">O(1)</span><span>Once you have the reference</span></div><div class="ls-tr"><span>Delete head</span><span class="ls-good">O(1)</span><span>Move head to head.next</span></div><div class="ls-tr"><span>Delete by value</span><span class="ls-bad">O(n)</span><span>Must find the node first</span></div></div>

<h2 class="ls-h2">In code</h2>
<div class="ls-code"><span class="kw">class</span> Node&lt;T&gt; {
  T value;
  Node&lt;T&gt; next;
  Node(T v) { value = v; next = <span class="kw">null</span>; }
}

<span class="cm">// O(1) insert at front</span>
<span class="kw">void</span> <span class="fn">prepend</span>(T v) {
  Node&lt;T&gt; n = <span class="kw">new</span> Node&lt;&gt;(v);
  n.next = head;
  head = n;
}

<span class="cm">// O(1) insert after a known node</span>
<span class="kw">void</span> <span class="fn">insertAfter</span>(Node&lt;T&gt; curr, T v) {
  Node&lt;T&gt; n = <span class="kw">new</span> Node&lt;&gt;(v);
  n.next = curr.next;  <span class="cm">// ① point new → next</span>
  curr.next = n;       <span class="cm">// ② point curr → new</span>
}</div>
`},

  ds4: { track:'Data Structures', num:'04', total:'06', title:'Hash Maps', subtitle:'O(1) or Bust', time:'8 min', next:'ds5', prev:'ds3', content:`
<div class="ls-lead">Hash maps are the most powerful data structure for everyday programming. Counting frequencies? HashMap. Detecting duplicates in O(n)? HashMap. Caching computed results? HashMap. When you catch yourself writing a nested loop to search, a HashMap is usually the fix.</div>

<h2 class="ls-h2">How it works: the hash function</h2>
<p class="ls-p">A hash map is backed by an array. When you store a key-value pair, a <strong>hash function</strong> converts the key into an integer index. That index is where the value lives.</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">put("carlos", 42) — hash function converts key into array index</div>
  <svg viewBox="0 0 520 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="30" width="90" height="36" rx="4" fill="#1c2230" stroke="#30363d"/><text x="53" y="52" text-anchor="middle" fill="#f0f6fc" font-family="DM Mono" font-size="11">"carlos"</text>
    <rect x="138" y="22" width="106" height="52" rx="6" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="191" y="44" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="10">hash(key)</text><text x="191" y="60" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">% array_size</text>
    <path d="M100 48 L136 48" stroke="#8b949e" stroke-width="1.5"/><text x="118" y="43" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="8">key</text>
    <path d="M246 48 L272 48" stroke="#8b949e" stroke-width="1.5"/><text x="259" y="43" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="8">= 3</text>
    <rect x="274" y="8"  width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d"/><text x="296" y="27" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">[0]</text>
    <rect x="274" y="42" width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d"/><text x="296" y="61" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">[1]</text>
    <rect x="274" y="76" width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d" opacity="0.3"/>
    <rect x="322" y="8"  width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d"/><text x="344" y="27" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">[2]</text>
    <rect x="322" y="42" width="44" height="30" rx="3" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="344" y="61" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="11" font-weight="bold">42</text><text x="344" y="77" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="8">[3] ←</text>
    <rect x="322" y="76" width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d"/>
    <rect x="370" y="8"  width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d" opacity="0.4"/>
    <rect x="370" y="42" width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d" opacity="0.4"/>
    <rect x="370" y="76" width="44" height="30" rx="3" fill="#1c2230" stroke="#30363d" opacity="0.4"/>
  </svg>
</div>

<h2 class="ls-h2">The collision problem</h2>
<p class="ls-p">Two different keys can hash to the same index — a <strong>collision</strong>. The most common fix is <strong>chaining</strong>: each slot holds a linked list of all entries that hash there. With a good hash function, chains stay short and performance stays near O(1).</p>

<div class="ls-diagram">
  <div class="ls-diagram-label">Chaining: "bob" and "carlos" both hash to slot [2] — they form a chain</div>
  <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ag2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#e8ff47"/></marker></defs>
    <rect x="10" y="10" width="70" height="30" rx="3" fill="#1c2230" stroke="#30363d"/><text x="45" y="29" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="9">[0] empty</text>
    <rect x="10" y="46" width="70" height="30" rx="3" fill="#1c2230" stroke="#30363d"/><text x="45" y="65" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="9">[1] →</text>
    <rect x="10" y="82" width="70" height="30" rx="3" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="45" y="101" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">[2] →</text>
    <rect x="100" y="38" width="95" height="46" rx="3" fill="#1c2230" stroke="#30363d"/><text x="147" y="58" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="10">"alice"→7</text><text x="147" y="74" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">next: null</text>
    <path d="M82 61 L98 61" stroke="#30363d" stroke-width="1.5"/>
    <rect x="100" y="74" width="95" height="46" rx="3" fill="#1c2230" stroke="#e8ff47"/>
    <text x="147" y="94" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="10">"bob" → 99</text><text x="147" y="110" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">next →</text>
    <path d="M82 97 L98 97" stroke="#e8ff47" stroke-width="1.5"/>
    <rect x="210" y="74" width="110" height="46" rx="3" fill="#1c2230" stroke="#e8ff47" stroke-dasharray="3,2"/>
    <text x="265" y="94" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">"carlos"→42</text><text x="265" y="110" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">next: null</text>
    <path d="M197 97 L208 97" stroke="#e8ff47" stroke-width="1.5"/>
    <text x="265" y="70" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="8">both hash to [2] — collision!</text>
  </svg>
</div>

<h2 class="ls-h2">Complexity</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Operation</span><span>Average</span><span>Worst (all collide)</span></div><div class="ls-tr"><span>get(key)</span><span class="ls-good">O(1)</span><span class="ls-bad">O(n)</span></div><div class="ls-tr"><span>put(key, val)</span><span class="ls-good">O(1)</span><span class="ls-bad">O(n)</span></div><div class="ls-tr"><span>delete(key)</span><span class="ls-good">O(1)</span><span class="ls-bad">O(n)</span></div><div class="ls-tr"><span>containsKey</span><span class="ls-good">O(1)</span><span class="ls-bad">O(n)</span></div></div>

<h2 class="ls-h2">The classic O(n²) → O(n) refactor</h2>
<div class="ls-code"><span class="cm">// BEFORE — O(n²) nested loop to detect duplicates</span>
<span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; arr.length; i++)
  <span class="kw">for</span> (<span class="kw">int</span> j = i+1; j &lt; arr.length; j++)
    <span class="kw">if</span> (arr[i] == arr[j]) <span class="kw">return true</span>;

<span class="cm">// AFTER — O(n) with a HashSet</span>
Set&lt;Integer&gt; seen = <span class="kw">new</span> HashSet&lt;&gt;();
<span class="kw">for</span> (<span class="kw">int</span> x : arr) {
  <span class="kw">if</span> (seen.contains(x)) <span class="kw">return true</span>; <span class="cm">// O(1) lookup</span>
  seen.add(x);
}

<span class="cm">// Frequency count — O(n)</span>
Map&lt;Character, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();
<span class="kw">for</span> (<span class="kw">char</span> c : s.toCharArray())
  freq.put(c, freq.getOrDefault(c, 0) + 1);
<span class="cm">// "hello" → {h:1, e:1, l:2, o:1}</span></div>

<div class="ls-callout ls-callout-yes"><div class="ls-callout-title">Pattern: when you see a nested loop searching for something — a HashMap probably makes it O(n)</div><ul><li>Two Sum: store complement in map, check on each iteration</li><li>Group Anagrams: map sorted string → list of originals</li><li>Longest substring without repeating: map char → last index seen</li><li>Memoization: map input → computed result to avoid recomputing</li></ul></div>
`},

  al1: { track:'Algorithms', num:'01', total:'06', title:'Big O Notation', subtitle:'Stop Guessing Performance', time:'7 min', next:'al2', prev:null, content:`
<div class="ls-lead">Big O is the language engineers use to describe algorithm performance. Without it, you're guessing. With it, you can look at any loop and immediately know: "this scales fine" or "this will crash at 10,000 inputs." It's not optional knowledge — it's vocabulary.</div>

<h2 class="ls-h2">What it measures</h2>
<p class="ls-p">Big O describes how runtime <strong>grows relative to input size</strong>. It ignores constants and lower-order terms — only the dominant pattern matters. The question: <em>if I double my input, what happens to the time?</em></p>

<div class="ls-diagram">
  <div class="ls-diagram-label">Growth curves — how different complexities scale with input n</div>
  <svg viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 170 L490 170" stroke="#30363d" stroke-width="1.5"/><path d="M40 170 L40 10" stroke="#30363d" stroke-width="1.5"/>
    <text x="496" y="174" fill="#8b949e" font-family="DM Mono" font-size="10">n</text><text x="26" y="14" fill="#8b949e" font-family="DM Mono" font-size="10">t</text>
    <path d="M40 162 L490 162" stroke="#3fb950" stroke-width="2"/>
    <text x="494" y="165" fill="#3fb950" font-family="DM Mono" font-size="9">O(1)</text>
    <path d="M40 162 Q130 138 490 118" stroke="#58a6ff" stroke-width="2" fill="none"/>
    <text x="494" y="121" fill="#58a6ff" font-family="DM Mono" font-size="9">O(log n)</text>
    <path d="M40 162 L490 58" stroke="#e8ff47" stroke-width="2"/>
    <text x="494" y="61" fill="#e8ff47" font-family="DM Mono" font-size="9">O(n)</text>
    <path d="M40 162 Q200 104 490 28" stroke="#f0883e" stroke-width="2" fill="none"/>
    <text x="472" y="23" fill="#f0883e" font-family="DM Mono" font-size="9">O(n log n)</text>
    <path d="M40 165 Q120 148 210 118 Q330 70 390 18" stroke="#ff6b35" stroke-width="2.5" fill="none"/>
    <text x="393" y="16" fill="#ff6b35" font-family="DM Mono" font-size="9">O(n²)</text>
  </svg>
</div>

<h2 class="ls-h2">The big 6 — memorize this table</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Complexity</span><span>Name</span><span>Example</span><span>n=1M → ops</span></div><div class="ls-tr"><span class="ls-good">O(1)</span><span>Constant</span><span>HashMap lookup</span><span class="ls-good">1</span></div><div class="ls-tr"><span class="ls-good">O(log n)</span><span>Logarithmic</span><span>Binary search</span><span class="ls-good">~20</span></div><div class="ls-tr"><span class="ls-mid">O(n)</span><span>Linear</span><span>Single loop</span><span class="ls-mid">1,000,000</span></div><div class="ls-tr"><span class="ls-mid">O(n log n)</span><span>Linearithmic</span><span>Merge sort</span><span class="ls-mid">~20,000,000</span></div><div class="ls-tr"><span class="ls-bad">O(n²)</span><span>Quadratic</span><span>Nested loops</span><span class="ls-bad">1,000,000,000,000</span></div><div class="ls-tr"><span class="ls-bad">O(2ⁿ)</span><span>Exponential</span><span>Brute force subsets</span><span class="ls-bad">∞ (unusable)</span></div></div>

<h2 class="ls-h2">Reading code for Big O</h2>
<div class="ls-code"><span class="cm">// O(1) — no loops, no recursion proportional to input</span>
<span class="kw">int</span> <span class="fn">getFirst</span>(<span class="kw">int</span>[] a) { <span class="kw">return</span> a[0]; }

<span class="cm">// O(n) — one loop over input</span>
<span class="kw">int</span> <span class="fn">sum</span>(<span class="kw">int</span>[] a) {
  <span class="kw">int</span> t = 0;
  <span class="kw">for</span> (<span class="kw">int</span> x : a) t += x; <span class="cm">// n iterations</span>
  <span class="kw">return</span> t;
}

<span class="cm">// O(n²) — nested loops over same input</span>
<span class="kw">boolean</span> <span class="fn">hasDuplicate</span>(<span class="kw">int</span>[] a) {
  <span class="kw">for</span> (<span class="kw">int</span> i = 0; i &lt; a.length; i++)      <span class="cm">// n</span>
    <span class="kw">for</span> (<span class="kw">int</span> j = i+1; j &lt; a.length; j++)   <span class="cm">// n</span>
      <span class="kw">if</span> (a[i] == a[j]) <span class="kw">return true</span>;        <span class="cm">// → O(n²)</span>
  <span class="kw">return false</span>;
}
<span class="cm">// ↑ This can be O(n) with a HashSet!</span>

<span class="cm">// O(log n) — halving the search space each step</span>
<span class="cm">// Every time you see "cut in half", think O(log n)</span></div>

<div class="ls-callout ls-callout-yes"><div class="ls-callout-title">The golden heuristic</div><ul><li>Single loop → O(n)</li><li>Nested loops over same data → O(n²) — look for a HashMap fix</li><li>Halving the problem each step → O(log n)</li><li>Loop that halves → O(n log n)</li><li>Recursive tree with 2 branches and no memoization → O(2ⁿ) — use DP</li></ul></div>
`},

  al2: { track:'Algorithms', num:'02', total:'06', title:'Binary Search', subtitle:'Think in Halves', time:'6 min', next:'al3', prev:'al1', content:`
<div class="ls-lead">Binary search finds any element in a sorted list of 1 billion items in just 30 comparisons. The key insight: every comparison eliminates half the remaining possibilities. That's O(log n) — the most elegant complexity in algorithms.</div>

<h2 class="ls-h2">The only requirement: sorted data</h2>
<p class="ls-p">Binary search only works on <strong>sorted</strong> data. Always. If data isn't sorted, use a HashMap for O(1) lookup, or sort first (O(n log n)) and then search.</p>

<h2 class="ls-h2">The algorithm visualized</h2>
<div class="ls-diagram">
  <div class="ls-diagram-label">Searching for 40 in a sorted array — found in 3 steps</div>
  <svg viewBox="0 0 520 158" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" fill="#8b949e" font-family="DM Mono" font-size="9">Step 1 — check middle (40). Target found!</text>
    <g transform="translate(0,22)">
      <rect x="10" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="32" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">5</text>
      <rect x="58" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="80" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">12</text>
      <rect x="106" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="128" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">20</text>
      <rect x="154" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="176" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">33</text>
      <rect x="202" y="0" width="44" height="26" rx="3" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="224" y="17" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="10" font-weight="bold">40</text>
      <rect x="250" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="272" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">55</text>
      <rect x="298" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="320" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">72</text>
      <rect x="346" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="368" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">89</text>
      <rect x="394" y="0" width="44" height="26" rx="3" fill="#1c2230" stroke="#30363d"/><text x="416" y="17" text-anchor="middle" fill="#8b949e" font-family="DM Mono" font-size="10">91</text>
      <text x="10" y="38" fill="#58a6ff" font-family="DM Mono" font-size="8">L</text><text x="222" y="38" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="8">MID</text><text x="416" y="38" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="8">R</text>
    </g>
    <text x="10" y="80" fill="#3fb950" font-family="DM Mono" font-size="9">✓ Found at index 4 in 1 step! (Best case)</text>
    <line x1="10" y1="90" x2="510" y2="90" stroke="#30363d" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="10" y="106" fill="#8b949e" font-family="DM Mono" font-size="9">Worst case: search for 91 — takes log₂(9) ≈ 4 steps</text>
    <text x="10" y="120" fill="#484f58" font-family="DM Mono" font-size="9">Step 1: mid=40, 91&gt;40 → search right half</text>
    <text x="10" y="133" fill="#484f58" font-family="DM Mono" font-size="9">Step 2: mid=72, 91&gt;72 → search right half</text>
    <text x="10" y="146" fill="#484f58" font-family="DM Mono" font-size="9">Step 3: mid=89, 91&gt;89 → search right half</text>
    <text x="10" y="158" fill="#3fb950" font-family="DM Mono" font-size="9">Step 4: mid=91 ✓ Found — 4 steps for 9 elements</text>
  </svg>
</div>

<h2 class="ls-h2">Why O(log n)?</h2>
<p class="ls-p">Each step cuts the remaining elements in half. Starting with n=1,000,000,000:</p>
<div class="ls-formula">n → n/2 → n/4 → ... → 1 &nbsp;&nbsp; takes log₂(n) steps ≈ 30</div>
<p class="ls-p">This is why database indexes are so powerful — a B-tree index on 1 billion rows finds any record in ~30 comparisons.</p>

<h2 class="ls-h2">The implementation — avoid the overflow bug</h2>
<div class="ls-code"><span class="kw">int</span> <span class="fn">binarySearch</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> target) {
  <span class="kw">int</span> left = 0, right = arr.length - 1;

  <span class="kw">while</span> (left &lt;= right) {
    <span class="cm">// ⚠ Don't use (left+right)/2 — integer overflow!</span>
    <span class="kw">int</span> mid = left + (right - left) / 2;

    <span class="kw">if</span>      (arr[mid] == target) <span class="kw">return</span> mid;
    <span class="kw">else if</span> (arr[mid] &lt;  target) left  = mid + 1;
    <span class="kw">else</span>                         right = mid - 1;
  }

  <span class="kw">return</span> -1; <span class="cm">// not found</span>
}
<span class="cm">// Time: O(log n) | Space: O(1)</span></div>

<div class="ls-callout ls-callout-yes"><div class="ls-callout-title">Binary search appears in more places than you think</div><ul><li>Database B-tree indexes use it on every query</li><li>Finding first/last occurrence of a value in sorted array</li><li>Finding the minimum in a rotated sorted array</li><li><em>Searching on the answer</em>: "find minimum k where condition(k) is true"</li><li>Git bisect: finds the commit that introduced a bug in O(log n) checkouts</li></ul></div>
`},

  sd1: { track:'System Design', num:'01', total:'05', title:'The Framework', subtitle:'How to Approach Any System Design Question', time:'8 min', next:'sd2', prev:null, content:`
<div class="ls-lead">System design interviews are deliberately open-ended. There's no right answer — only tradeoffs. The skill being assessed is whether you think structurally under ambiguity. Here is a framework that works for any system design question, in any interview.</div>

<h2 class="ls-h2">The 6-step framework</h2>
<div class="ls-steps">
  <div class="ls-step"><div class="ls-step-num">01</div><div class="ls-step-body"><strong>Clarify requirements</strong><p>Ask questions before touching a whiteboard. Functional: what does it do? Non-functional: latency, availability, consistency, scale. Most candidates skip this. Don't.</p></div></div>
  <div class="ls-step"><div class="ls-step-num">02</div><div class="ls-step-body"><strong>Estimate scale</strong><p>How many users? Requests/second? Storage/year? Back-of-envelope math: 100M users × 1 req/day ÷ 86,400 = ~1,200 req/sec. Is it read-heavy or write-heavy? These numbers define everything.</p></div></div>
  <div class="ls-step"><div class="ls-step-num">03</div><div class="ls-step-body"><strong>Define the API</strong><p>What endpoints or method signatures does this system expose? Being forced to write down the interface surfaces assumptions before you invest time in architecture.</p></div></div>
  <div class="ls-step"><div class="ls-step-num">04</div><div class="ls-step-body"><strong>High-level design</strong><p>Draw the boxes: clients, load balancers, app servers, databases, caches, queues, CDNs. Connect with arrows. Don't go deep yet — show the skeleton first and confirm direction.</p></div></div>
  <div class="ls-step"><div class="ls-step-num">05</div><div class="ls-step-body"><strong>Deep dive</strong><p>The interviewer picks the most interesting component. DB schema, sharding strategy, consistency model, cache invalidation — go deep wherever the complexity lives.</p></div></div>
  <div class="ls-step"><div class="ls-step-num">06</div><div class="ls-step-body"><strong>Identify bottlenecks</strong><p>What's the single point of failure? Where does it break at 10x load? What's the consistency tradeoff? Show you understand the limits of your own design.</p></div></div>
</div>

<h2 class="ls-h2">Example: URL shortener architecture</h2>
<div class="ls-diagram">
  <div class="ls-diagram-label">bit.ly-style URL shortener — high-level design</div>
  <svg viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ag3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#8b949e"/></marker></defs>
    <rect x="10" y="84" width="68" height="38" rx="4" fill="#1c2230" stroke="#30363d"/><text x="44" y="107" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="10">Client</text>
    <rect x="120" y="84" width="72" height="38" rx="4" fill="#161b22" stroke="#e8ff47" stroke-width="2"/><text x="156" y="100" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">Load</text><text x="156" y="114" text-anchor="middle" fill="#e8ff47" font-family="DM Mono" font-size="9">Balancer</text>
    <rect x="242" y="58" width="76" height="34" rx="4" fill="#1c2230" stroke="#30363d"/><text x="280" y="79" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="9">App Server</text>
    <rect x="242" y="100" width="76" height="34" rx="4" fill="#1c2230" stroke="#30363d"/><text x="280" y="121" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="9">App Server</text>
    <rect x="242" y="142" width="76" height="34" rx="4" fill="#1c2230" stroke="#30363d"/><text x="280" y="163" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="9">App Server</text>
    <rect x="374" y="48" width="82" height="38" rx="4" fill="#161b22" stroke="#58a6ff" stroke-width="2"/><text x="415" y="64" text-anchor="middle" fill="#58a6ff" font-family="DM Mono" font-size="9">Redis</text><text x="415" y="78" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="8">cache reads</text>
    <rect x="374" y="100" width="82" height="38" rx="4" fill="#1c2230" stroke="#30363d"/><text x="415" y="117" text-anchor="middle" fill="#c9d1d9" font-family="DM Mono" font-size="9">PostgreSQL</text><text x="415" y="130" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="8">urls + clicks</text>
    <rect x="374" y="152" width="82" height="38" rx="4" fill="#1c2230" stroke="#484f58" stroke-dasharray="4,2"/><text x="415" y="169" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="9">Analytics</text><text x="415" y="182" text-anchor="middle" fill="#484f58" font-family="DM Mono" font-size="8">Kafka + batch</text>
    <path d="M80 103 L118 103" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M194 97 L240 74" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M194 103 L240 117" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M194 109 L240 159" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M320 74 L372 65" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M320 117 L372 119" stroke="#8b949e" stroke-width="1.5" marker-end="url(#ag3)"/>
    <path d="M320 163 L372 168" stroke="#484f58" stroke-width="1.5" stroke-dasharray="3,2"/>
  </svg>
</div>

<h2 class="ls-h2">Questions that unlock everything</h2>
<div class="ls-code"><span class="cm">// Before drawing anything, always ask:</span>

How many users?         <span class="cm">// 1K vs 100M changes everything</span>
Read-heavy or write?    <span class="cm">// shapes caching and DB choice</span>
Latency target?         <span class="cm">// p99 50ms? 200ms? more?</span>
Strong or eventual consistency? <span class="cm">// shapes replication</span>
What happens on failure? <span class="cm">// HA requirements</span>
Global or single region? <span class="cm">// CDN, multi-region needs</span></div>

<div class="ls-callout ls-callout-yes"><div class="ls-callout-title">The mindset that separates good from great</div><ul><li>Average: jumps to solutions — "I'd use microservices and Kafka"</li><li>Good: asks questions first — "Before I design, what's the expected scale?"</li><li>Great: explicitly names tradeoffs — "This optimizes for reads at the cost of write complexity. Is that the right tradeoff here?"</li></ul></div>
`},

  cc1: { track:'Clean Code', num:'01', total:'04', title:'Naming Things', subtitle:'The Hardest Part of Programming', time:'6 min', next:'cc2', prev:null, content:`
<div class="ls-lead">Code is written once and read dozens of times. The name of a variable is the first thing every reader encounters. A great name eliminates the need for a comment. A bad name makes the entire surrounding code harder to reason about.</div>

<h2 class="ls-h2">The naming rule</h2>
<p class="ls-p">A name should reveal intent. If you have to read the implementation to understand what a variable holds or what a function does, the name has failed. Rename it — don't comment around it.</p>

<div class="ls-code"><span class="cm">// Bad — every name forces decoding</span>
<span class="kw">int</span> d;               <span class="cm">// days? distance? data size?</span>
<span class="kw">boolean</span> flag;        <span class="cm">// flag for what?</span>
List&lt;String&gt; list;   <span class="cm">// list of what?</span>
<span class="fn">calc</span>(x, y);         <span class="cm">// calculate what?</span>

<span class="cm">// Good — code reads like prose</span>
<span class="kw">int</span> elapsedDays;
<span class="kw">boolean</span> isUserActive;
List&lt;String&gt; userEmailAddresses;
<span class="fn">calculateShippingCost</span>(weightKg, distanceKm);</div>

<h2 class="ls-h2">Rules by category</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Category</span><span>Rule</span><span>Example</span></div><div class="ls-tr"><span>Variables</span><span>Noun, describe what it holds</span><span><code>userCount</code>, <code>invoiceTotal</code></span></div><div class="ls-tr"><span>Booleans</span><span>Read as a true/false statement</span><span><code>isActive</code>, <code>hasPermission</code></span></div><div class="ls-tr"><span>Functions</span><span>Verb, describe the action</span><span><code>getUserById()</code>, <code>sendEmail()</code></span></div><div class="ls-tr"><span>Classes</span><span>Noun, describe what it represents</span><span><code>User</code>, <code>PaymentGateway</code></span></div><div class="ls-tr"><span>Constants</span><span>UPPER_SNAKE, very descriptive</span><span><code>MAX_RETRY_ATTEMPTS</code></span></div></div>

<h2 class="ls-h2">A real refactoring</h2>
<div class="ls-code"><span class="cm">// Before — 4 lines of intense mental decoding</span>
<span class="kw">public boolean</span> <span class="fn">chk</span>(User u) {
  <span class="kw">return</span> u.s == 1 && u.p != <span class="kw">null</span> && u.p.exp > <span class="fn">now</span>();
}

<span class="cm">// After — reads like a specification</span>
<span class="kw">public boolean</span> <span class="fn">isEligibleForPremiumFeatures</span>(User user) {
  <span class="kw">boolean</span> isActiveAccount       = user.status == Status.ACTIVE;
  <span class="kw">boolean</span> hasPremiumSubscription = user.subscription != <span class="kw">null</span>;
  <span class="kw">boolean</span> subscriptionIsValid    = user.subscription.expiryDate.isAfter(<span class="fn">now</span>());
  <span class="kw">return</span> isActiveAccount && hasPremiumSubscription && subscriptionIsValid;
}</div>

<div class="ls-callout ls-callout-yes"><div class="ls-callout-title">The comment test</div><ul><li>If you wrote a comment to explain a variable → rename the variable</li><li>If you wrote a comment to say what a function does → rename the function</li><li>If the comment restates the code in English → delete the comment</li><li>Good comments explain WHY. The code should explain WHAT.</li></ul></div>
`},

  cc2: { track:'Clean Code', num:'02', total:'04', title:'Functions', subtitle:'Do One Thing, Do It Well', time:'6 min', next:'cc3', prev:'cc1', content:`
<div class="ls-lead">The most powerful refactoring you can do is extracting a well-named function. It gives a name to a concept, reduces mental overhead, and makes the code testable in isolation. A function that does one thing is trivial to understand, test, and reuse.</div>

<h2 class="ls-h2">The single responsibility rule</h2>
<p class="ls-p">A function should do one thing, do it well, and do it only. If you need the word <em>"and"</em> to describe what it does, it's doing two things. Split it.</p>

<div class="ls-code"><span class="cm">// Bad — does 4 things: validate, hash, save, send email</span>
<span class="kw">void</span> <span class="fn">registerUser</span>(String email, String password) {
  <span class="kw">if</span> (!email.contains(<span class="fn">"@"</span>)) <span class="kw">throw new</span> IllegalArgumentException();
  <span class="kw">if</span> (password.length() &lt; 8) <span class="kw">throw new</span> IllegalArgumentException();
  String hash = BCrypt.<span class="fn">hash</span>(password, 10);
  db.<span class="fn">save</span>(<span class="kw">new</span> User(email, hash));
  emailService.<span class="fn">send</span>(email, <span class="fn">"Welcome!"</span>);
}

<span class="cm">// Good — each function does one thing, composed cleanly</span>
<span class="kw">void</span> <span class="fn">registerUser</span>(String email, String password) {
  <span class="fn">validateRegistrationInput</span>(email, password);
  User user = <span class="fn">createUserWithHashedPassword</span>(email, password);
  userRepository.<span class="fn">save</span>(user);
  emailService.<span class="fn">sendWelcomeEmail</span>(user.email);
}</div>

<h2 class="ls-h2">Argument count guide</h2>
<div class="ls-table"><div class="ls-tr ls-th"><span>Args</span><span>Assessment</span><span>What to do</span></div><div class="ls-tr"><span>0</span><span class="ls-good">Ideal</span><span>Pure function, easiest to test</span></div><div class="ls-tr"><span>1</span><span class="ls-good">Great</span><span>Clear input → output</span></div><div class="ls-tr"><span>2</span><span class="ls-mid">Acceptable</span><span>Document argument order</span></div><div class="ls-tr"><span>3</span><span class="ls-mid">Question it</span><span>Consider grouping into an object</span></div><div class="ls-tr"><span>4+</span><span class="ls-bad">Refactor</span><span>Create a parameter/builder object</span></div></div>

<h2 class="ls-h2">Boolean args: a red flag</h2>
<p class="ls-p">A boolean argument usually means the function does two different things based on a flag. That's two functions pretending to be one.</p>
<div class="ls-code"><span class="cm">// Boolean arg = hidden conditional = two functions</span>
<span class="fn">renderPage</span>(page, <span class="kw">true</span>);    <span class="cm">// what does true mean?</span>

<span class="cm">// Split it into two honest functions</span>
<span class="fn">renderPageForAdmin</span>(page);
<span class="fn">renderPageForUser</span>(page);</div>
`},

};

// ── Open lesson as full page ──
function openLesson(id) {
  const l = lessons[id];
  if (!l) return;

  let lp = document.getElementById('lesson-page');
  if (!lp) {
    lp = document.createElement('div');
    lp.id = 'lesson-page';
    lp.className = 'page';
    document.body.appendChild(lp);
  }

  lp.innerHTML = `<div class="col">
    <div class="lp-topbar">
      <button class="lp-back" onclick="closeLesson()">← Fundamentals</button>
      <span class="lp-track-badge">${l.track}</span>
      <span class="lp-prog">${l.num} / ${l.total}</span>
    </div>
    <div class="lp-hero">
      <p class="lp-eyebrow">${l.track} &nbsp;·&nbsp; Lesson ${l.num}</p>
      <h1 class="lp-title">${l.title}</h1>
      <p class="lp-sub">${l.subtitle}</p>
      <span class="lp-time">${l.time}</span>
    </div>
    <div class="lp-body">${l.content}</div>
    <div class="lp-footer-nav">
      <div>${l.prev ? `<button class="lp-nav-btn" onclick="openLesson('${l.prev}')">← Previous</button>` : ''}</div>
      <div>${l.next ? `<button class="lp-nav-btn lp-nav-next" onclick="openLesson('${l.next}')">Next lesson →</button>` : `<span class="lp-done">✓ Track complete</span>`}</div>
    </div>
    <footer><div class="foot-inner">
      <div class="foot-logo">Dev<span>Core</span></div>
      <div class="foot-by">Built by @carlossucredev</div>
      <div class="foot-lnks"><a href="https://youtube.com" target="_blank">YouTube</a><a href="https://github.com/carlossucredev" target="_blank">GitHub</a></div>
    </div></footer>
  </div>`;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  lp.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeLesson() {
  const lp = document.getElementById('lesson-page');
  if (lp) lp.classList.remove('active');
  document.getElementById('fundamentals').classList.add('active');
  document.querySelectorAll('.nav-links a[data-page]').forEach(a =>
    a.classList.toggle('active', a.dataset.page === 'fundamentals')
  );
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
