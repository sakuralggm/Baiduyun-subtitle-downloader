// ==UserScript==
// @name         百度网盘智能字幕下载
// @namespace    http://github.com/lihaoze123/Baiduyun-subtitle-downloader
// @version      0.1
// @description  自动将百度网盘生成的智能字幕下载为 srt 文件
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const button = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul > li:nth-child(2) > p");
        if (button) {
            button.click();

            setTimeout(() => {
                const resources = performance.getEntriesByType("resource");

                resources.forEach(resource => {
                    if (resource.name.includes('netdisk-subtitle')) {
                        let url = resource.name
                        console.log('找到匹配的URL:', url);

                        const regex = /fn=(.*)\.mp4/;
                        let fileName = decodeURI(url.match(regex)[1]).replace('+', ' ') + '.srt';
                        console.log(fileName);

                        GM_download(url, fileName);
                    }
                });
            }, 500);
            obs.disconnect();
            return;
        }
    });

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, config);

})();
