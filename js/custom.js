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
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '#recent-posts > .recent-post-item, #aside-content .card-widget, #pagination, #post #article-container'
    ).forEach(function (el) {
      el.classList.add('fade-up-target');
      io.observe(el);
    });
  }
})();
