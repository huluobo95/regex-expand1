// 使用酒馆的 jQuery 确保DOM操作安全
(function () {
    // 注入全屏编辑器的样式
    const style = `
        .st-regex-expand-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            cursor: pointer;
            padding: 2px;
            border-radius: 4px;
            color: var(--gold) !important;
            transition: opacity 0.2s;
            font-size: 14px;
            vertical-align: middle;
        }
        .st-regex-expand-btn:hover {
            opacity: 0.8;
            background: rgba(255,255,255,0.1);
        }
        .st-regex-fullscreen-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .st-regex-fullscreen-container {
            width: 90%;
            height: 85%;
            background: var(--mainColor, #131926);
            border: 1px solid var(--borderColor, #2a354d);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            box-sizing: border-box;
        }
        .st-regex-fullscreen-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            color: #fff;
            font-weight: bold;
        }
        .st-regex-fullscreen-textarea {
            flex: 1;
            width: 100%;
            background: #00000033;
            color: #fff;
            font-family: monospace;
            font-size: 16px;
            padding: 10px;
            border: 1px solid var(--borderColor, #2a354d);
            border-radius: 4px;
            resize: none;
            box-sizing: border-box;
        }
        .st-regex-fullscreen-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        .st-regex-btn {
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
            border: none;
        }
        .st-regex-btn-save { background: var(--blue, #4a90e2); color: white; }
        .st-regex-btn-cancel { background: #555; color: white; }
    `;
    $('head').append(`<style>${style}</style>`);

    // 打开全屏编辑器窗口
    function openFullscreenEditor(title, $originalInput) {
        const $overlay = $('<div class="st-regex-fullscreen-overlay"></div>');
        const $container = $('<div class="st-regex-fullscreen-container"></div>');
        const $header = $(`<div class="st-regex-fullscreen-header"><span>编辑: ${title}</span></div>`);
        const $textarea = $('<textarea class="st-regex-fullscreen-textarea"></textarea>').val($originalInput.val());
        const $footer = $('<div class="st-regex-fullscreen-footer"></div>');
        
        const $cancelBtn = $('<button class="st-regex-btn st-regex-btn-cancel">取消</button>').on('click', () => $overlay.remove());
        const $saveBtn = $('<button class="st-regex-btn st-regex-btn-save">完成</button>').on('click', () => {
            $originalInput.val($textarea.val());
            // 触发酒馆 input 事件更新底层内存
            $originalInput.trigger('input');
            $overlay.remove();
        });

        $footer.append($cancelBtn, $saveBtn);
        $container.append($header, $textarea, $footer);
        $overlay.append($container);
        $('body').append($overlay);
        $textarea.focus();
    }

    // 扫描并在标题后注入按钮
    function injectButtons() {
        // 酒馆正则编辑器弹窗可能在任何时候被打开，所以用选择器精确定位里面的文本标签
        $('#regex_editor_popup div, #regex_editor_popup label, #regex_editor_popup span').each(function () {
            const $label = $(this);
            
            // 避免重复注入
            if ($label.find('.st-regex-expand-btn').length > 0) return;

            const text = $label.clone().children().remove().end().text().trim();

            // 1. 定位“查找正则表达式”
            if (text === '查找正则表达式') {
                const $input = $label.next().find('input, textarea').add('#regex_search').first();
                if ($input.length) {
                    createBtn($label, '查找正则表达式', $input);
                }
            }

            // 2. 定位“替换为”
            if (text === '替换为') {
                const $textarea = $label.next().find('textarea, input').add('#regex_replace').first();
                if ($textarea.length) {
                    createBtn($label, '替换为', $textarea);
                }
            }
        });
    }

    function createBtn($target, title, $input) {
        const $btn = $('<span class="st-regex-expand-btn" title="放大编辑"> ⛶ </span>');
        $btn.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openFullscreenEditor(title, $input);
        });
        $target.append($btn);
    }

    // 初始化：当酒馆扩展系统加载完毕后，定时监听弹窗
    function init() {
        setInterval(injectButtons, 1000);
        console.log('[Regex Box Expander] 插件加载成功');
    }

    // 挂载到酒馆的模块生命周期
    jQuery(init);
})();
