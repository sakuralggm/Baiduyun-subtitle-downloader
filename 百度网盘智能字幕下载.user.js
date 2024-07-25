// ==UserScript==
// @name         百度网盘智能字幕下载
// @namespace    http://github.com/lihaoze123/Baiduyun-subtitle-downloader
// @version      0.2
// @description  自动将百度网盘生成的智能字幕下载为 srt 文件，并添加下载按钮
// @match        *://pan.baidu.com/*
// @grant        GM_download
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/501784/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501784/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        const controlBar = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div");
        if (controlBar) {
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载字幕';
            downloadButton.style.cssText = 'margin-left: 10px; padding: 5px 10px; background-color: #4285f4; color: white; border: none; border-radius: 3px; cursor: pointer;';
            downloadButton.addEventListener('click', downloadSubtitle);
            controlBar.appendChild(downloadButton);
            return true;
        }
        return false;
    }

    function downloadSubtitle() {
        const button = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul > li:nth-child(2) > p");
        if (button) {
            button.click();

            setTimeout(() => {
                const resources = performance.getEntriesByType("resource");

                resources.forEach(resource => {
                    if (resource.name.includes('netdisk-subtitle')) {
                        let url = resource.name;
                        console.log('找到匹配的URL:', url);

                        const regex = /fn=(.*)\.mp4/;
                        let fileName = decodeURI(url.match(regex)[1]).replace('+', ' ') + '.srt';
                        console.log(fileName);

                        GM_download(url, fileName);
                    }
                });
            }, 500);
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (addDownloadButton()) {
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
