// live2d_path 参数建议使用绝对路径
const live2d_path = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/';
import initWidget from './custom/index.js';
//const live2d_path = "/live2d-widget/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    } else if (type === 'js') {
      tag = document.createElement('script');
      tag.src = url;
      console.log('tag++++', tag);
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 375) {
  Promise.all([
    loadExternalResource(live2d_path + 'waifu.css', 'css'),
    loadExternalResource(live2d_path + 'live2d.min.js', 'js'),
    // loadExternalResource(live2d_path + 'waifu-tips.js', 'js'),
    // loadExternalResource('src/utils/live2d/custom/index.js', 'js'),
  ]).then(() => {
    // 配置选项的具体用法见 README.md
    initWidget({
      // waifuPath: live2d_path + "waifu-tips.json",
      waifuPath: 'https://qiniuyun.devlink.wiki/tips.json',
      //apiPath: "https://live2d.fghrsh.net/api/",
      cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',
      // tools: ["hitokoto", "asteroids", "switch-model", "switch-texture", "photo", "info", "quit"]
      tools: [],
    });
  });
}
