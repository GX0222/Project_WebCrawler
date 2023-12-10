// var player;

// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('youtubeIframe', {
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
// }

// function onPlayerReady(event) {
//     // 靜音
//     event.target.mute();
// }

// function onPlayerStateChange(event) {
//     // 如果影片結束，重新播放
//     if (event.data === YT.PlayerState.ENDED) {
//         player.playVideo();
//     }
// }
//==============================================================================
// // 在 window resize 事件觸發時更新變數
// window.addEventListener('resize', function() {
//     var ytIf = document.getElementById('youtubeIframe');

//     var newHeight = (window.innerWidth+200)/16*9; // 計算新的寬度（此例中為視窗寬度的一半）
//     ytIf.style.height = newHeight + 'px'; // 將新的寬度應用到元素
// });

// // 初始化時也執行一次，以設定初始值
// window.dispatchEvent(new Event('resize'));