// ==UserScript==
// @name         酒馆正则展开（本地版）
// @match        *://127.0.0.1:*/*
// @match        *://localhost:*/*
// @grant        none
// ==/UserScript==

(function () {

    function add() {

        document.querySelectorAll('textarea').forEach(t => {

            if (t.dataset.done) return;

            const label = t.parentElement?.innerText || '';

            if (!label.includes('替换为')) return;

            t.dataset.done = '1';

            // 包裹
            const wrap = document.createElement('div');
            wrap.style.position = 'relative';

            t.parentNode.insertBefore(wrap, t);
            wrap.appendChild(t);

            // 按钮
            const btn = document.createElement('button');
            btn.innerText = '⛶';

            btn.style.position = 'absolute';
            btn.style.right = '6px';
            btn.style.top = '6px';

            btn.style.zIndex = 9999;
            btn.style.border = 'none';
            btn.style.background = '#444';
            btn.style.color = '#fff';
            btn.style.borderRadius = '6px';
            btn.style.padding = '4px 8px';

            wrap.appendChild(btn);

            // 弹窗
            btn.onclick = () => {

                const mask = document.createElement('div');

                mask.style = `
                    position:fixed;
                    left:0;top:0;
                    width:100%;height:100%;
                    background:rgba(0,0,0,0.85);
                    z-index:999999;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                `;

                const box = document.createElement('textarea');

                box.value = t.value;

                box.style = `
                    width:90%;
                    height:80%;
                    font-size:16px;
                    font-family:monospace;
                    padding:12px;
                `;

                const ok = document.createElement('button');
                ok.innerText = '确认';

                ok.style = `
                    position:fixed;
                    bottom:40px;
                    right:60px;
                    padding:10px 16px;
                `;

                ok.onclick = () => {
                    t.value = box.value;
                    t.dispatchEvent(new Event('input', { bubbles: true }));
                    mask.remove();
                };

                const cancel = document.createElement('button');
                cancel.innerText = '取消';

                cancel.style = `
                    position:fixed;
                    bottom:40px;
                    right:140px;
                    padding:10px 16px;
                `;

                cancel.onclick = () => mask.remove();

                mask.appendChild(box);
                mask.appendChild(ok);
                mask.appendChild(cancel);

                document.body.appendChild(mask);
                box.focus();
            };
        });
    }

    add();

    new MutationObserver(add).observe(document.body, {
        childList: true,
        subtree: true
    });

})();
