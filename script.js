(function () {
  /* ---------- Tab routing (#about, #work, ...) ---------- */
  var VIEWS = ['about', 'work', 'projects', 'research', 'writing', 'lists'];

  function route() {
    var h = (location.hash || '').slice(1);
    if (VIEWS.indexOf(h) < 0) h = 'about';
    VIEWS.forEach(function (v) {
      document.getElementById('v-' + v).hidden = v !== h;
    });
    document.getElementById('pth').textContent = h;
    var links = document.querySelectorAll('nav a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === '#' + h) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();

  /* ---------- Halftone portrait ---------- */
  var PORTRAIT = 'assets/portrait.jpg';   // <- put your photo here
  var GRID = 4;                            // dot grid size (bigger = coarser dots)

  var c = document.getElementById('cv');
  var x = c.getContext('2d');
  var W = c.width, H = c.height;

  function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

  function dots(lum) {
    x.fillStyle = css('--bg'); x.fillRect(0, 0, W, H);
    x.fillStyle = css('--ink');
    for (var y = 0; y < H; y += GRID) {
      for (var p = 0; p < W; p += GRID) {
        var r = (1 - lum(p + GRID / 2, y + GRID / 2)) * GRID * 0.75;
        if (r > 0.4) { x.beginPath(); x.arc(p + GRID / 2, y + GRID / 2, r, 0, 7); x.fill(); }
      }
    }
  }

  function blank() {
    dots(function (a, b) {
      var dx = (a - W / 2) / (W * .3), dy = (b - H * .4) / (H * .3), e = Math.sqrt(dx * dx + dy * dy);
      var s = (a - W / 2) / (W * .5), t = (b - H * .95) / (H * .28);
      return Math.min(1, Math.max(e < 1 ? .25 + e * .5 : 1, (s * s + t * t) < 1 ? .3 : 1));
    });
  }

  function fromImg(im) {
    var o = document.createElement('canvas'); o.width = W; o.height = H;
    var q = o.getContext('2d');
    var r = Math.max(W / im.width, H / im.height), w = im.width * r, h = im.height * r;
    q.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    var d;
    try { d = q.getImageData(0, 0, W, H).data; }
    catch (e) {   // opened via file:// -> browser blocks pixel access; show plain grayscale instead
      x.filter = 'grayscale(1) contrast(1.4)';
      x.drawImage(o, 0, 0);
      x.filter = 'none';
      return;
    }
    dots(function (a, b) {
      var i = ((b | 0) * W + (a | 0)) * 4;
      return (.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]) / 255;
    });
  }

  blank();

  var img = new Image();
  img.onload = function () { fromImg(img); };
  img.src = PORTRAIT;                       // silently keeps the placeholder if the file is missing

  /* Optional: preview any photo without renaming files */
  var f = document.getElementById('fi');
  document.getElementById('ld').onclick = function () { f.click(); };
  f.onchange = function () {
    var file = f.files[0]; if (!file) return;
    var u = URL.createObjectURL(file), im = new Image();
    im.onload = function () { fromImg(im); URL.revokeObjectURL(u); };
    im.src = u;
  };
})();
