/* ============================================
   圈圈的小站 - 交互增强
   1. 顶部阅读进度条
   2. 横幅文字视差渐隐
   3. 内容滚动渐入
   ============================================ */
(function () {
  'use strict';

  /* 1. 顶部阅读进度条 */
  var bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.appendChild(bar);

  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0%';
  }

  /* 2. 横幅文字视差渐隐（滚动时标题缓缓上移淡出） */
  var header = document.getElementById('page-header');
  var info = document.getElementById('site-info');

  /* 2b. 流星：注入到横幅内，依靠 CSS 动画循环划过 */
  if (header && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ['meteor-1', 'meteor-2', 'meteor-3'].forEach(function (cls) {
      var m = document.createElement('span');
      m.className = 'meteor ' + cls;
      header.appendChild(m);
    });
  }

  function updateParallax() {
    if (!header || !info) return;
    var y = window.scrollY || 0;
    var h = header.offsetHeight || 1;
    if (y <= h) {
      info.style.transform = 'translateY(' + (y * 0.32) + 'px)';
      info.style.opacity = String(Math.max(0, 1 - y / (h * 0.85)));
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateProgress();
      updateParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateProgress();
  updateParallax();

  /* 3. 内容滚动渐入 */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('fade-up-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });

    var reveal = function (el) {
      el.classList.add('fade-up-target');
      io.observe(el);
    };

    /* 首页卡片 / 侧栏 / 分页：整块渐入 */
    document.querySelectorAll(
      '#recent-posts > .recent-post-item, #aside-content .card-widget, #pagination'
    ).forEach(reveal);

    /* 文章页：只给段落级小块加渐入。
       注意：绝不能把 #article-container 整个套进去——长文高度上万像素，
       可见比例永远达不到阈值，整篇文章会停在 opacity:0 变成一片空白。 */
    document.querySelectorAll(
      '#article-container > h2, #article-container > h3, #article-container > h4, ' +
      '#article-container > p, #article-container > blockquote, #article-container > pre, ' +
      '#article-container > ul, #article-container > ol'
    ).forEach(reveal);

    /* 兜底：2 秒后仍未触发的元素直接显示，宁可不动也不能看不见 */
    setTimeout(function () {
      document.querySelectorAll('.fade-up-target:not(.fade-up-in)').forEach(function (el) {
        el.classList.add('fade-up-in');
      });
    }, 2000);
  }
})();
