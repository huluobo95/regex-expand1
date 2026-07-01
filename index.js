(function() {
    // 1. 把样式注入到页面中（模仿酒馆原生弹窗UI）
    const style = document.createElement('style');
    style.textContent = `
        .exp-btn {
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;
            opacity: 0.6;
            font-size: 14px;
            padding: 2px 6px;
            border: 1px solid #888;
            border-radius: 4px;
            background: rgba(0,0,0,0.5);
            color: #ddd;
            z-index: 10;
            transition: opacity 0.2s;
        }
        .exp-btn:hover { opacity: 1; background: #333; color: #fff; }
        .exp-wrap { position: relative; }
        .exp-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.7); z-index: 99999;
            display: flex; justify-content: center; align-items: center;
        }
        .exp-modal {
            width: 90%; max-width: 1000px; height: 90vh;
            background: #1f2126; border: 1px solid #444; border-radius: 8px;
            padding: 15px; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.9);
        }
        .exp-modal textarea {
            flex: 1; width: 100%; height: 100%; box-sizing: border-box;
            background: #15181b; color: #eee; border: 1px solid #333; border-radius: 4px;
            padding: 10px; font-family: monospace; font-size: 15px; resize: none;
        }
        .exp-bottom {
            margin-top: 12px; display: flex; gap: 10px; justify-content: flex-end;
        }
        .exp-bottom button {
            padding: 6px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        .exp-save { background: #4a90e2; color: #fff; }
        .exp-save:hover { background: #5a9ef5; }
        .exp-cancel { background: #555; color: #ddd; }
        .exp-cancel:hover { background: #666; }
        .exp-header { color: #ccc; font-size: 16px; margin-bottom: 10px; display: flex; justify-content: space-between; }
    `;
    document.head.appendChild(style);

    // 2. 监听页面变化，等待编辑器打开
    const findAndInject = () => {
        // 定位目标输入框（寻找“替换为”下面的 textarea）
        const labels = document.querySelectorAll('label, div, span');
        let targetArea = null;
        for (let el of labels) {
            if (el.innerText && el.innerText.trim() === '替换为') {
                let next = el.nextElementSibling;
                while (next) {
                    if (next.tagName === 'TEXTAREA') {
                        targetArea = next;
                        break;
                    }
                    next = next.nextElementSibling;
                }
                if (targetArea) break;
            }
        }

        // 如果找到了，并且还没添加过按钮
        if (targetArea && !targetArea.parentElement.classList.contains('exp-wrap')) {
            // 包装父级，为了能用绝对定位放按钮
            const parent = targetArea.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'exp-wrap';
            parent.replaceChild(wrapper, targetArea);
            wrapper.appendChild(targetArea);

            // 创建“展开编辑”按钮
            const btn = document.createElement('div');
            btn.className = 'exp-btn';
            btn.innerHTML = '📝 展开编辑';
            wrapper.appendChild(btn);

            // 按钮点击事件
            btn.addEventListener('click', () => {
                // 如果已经存在弹窗，先删掉
                const oldOverlay = document.querySelector('.exp-overlay');
                if (oldOverlay) oldOverlay.remove();

                // 创建弹窗外壳
                const overlay = document.createElement('div');
                overlay.className = 'exp-overlay';
                overlay.innerHTML = `
                    <div class="exp-modal">
                        <div class="exp-header">
                            <span>编辑替换内容</span>
                            <span style="cursor:pointer" id="exp-close-top">✕</span>
                        </div>
                        <textarea id="exp-textarea">${targetArea.value}</textarea>
                        <div class="exp-bottom">
                            <button class="exp-cancel" id="exp-cancel">取消</button>
                            <button class="exp-save" id="exp-save">确认保存</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);

                const modalTextarea = document.getElementById('exp-textarea');
                // 自动获取焦点并选中所有文本
                modalTextarea.focus();
                modalTextarea.select();

                // 关闭函数
                const closeModal = (save) => {
                    if (save) {
                        targetArea.value = modalTextarea.value;
                        // 触发 input 事件，让酒馆知道内容已更改
                        targetArea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    overlay.remove();
                };

                // 绑定按钮事件
                document.getElementById('exp-save').addEventListener('click', () => closeModal(true));
                document.getElementById('exp-cancel').addEventListener('click', () => closeModal(false));
                document.getElementById('exp-close-top').addEventListener('click', () => closeModal(false));
                
                // 点击弹窗外空白处取消
                overlay.addEventListener('click', (e) => { 
                    if (e.target === overlay) closeModal(false); 
                });
            });
        }
    };

    // 3. 使用防抖监听器，避免酒馆密集渲染时卡顿
    let timeoutId = null;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(findAndInject, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 初始加载时也跑一遍
    setTimeout(findAndInject, 500);
})();
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
                ok.style = `position:fixed;bottom:40px;right:60px;padding:10px 16px;`;

                ok.onclick = () => {
                    t.value = box.value;
                    t.dispatchEvent(new Event('input', { bubbles: true }));
                    mask.remove();
                };

                const cancel = document.createElement('button');
                cancel.innerText = '取消';
                cancel.style = `position:fixed;bottom:40px;right:140px;padding:10px 16px;`;

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

})();            btn.style.zIndex = 9999;
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
