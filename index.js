// 按照酒馆标准规范：这里可以直接引入酒馆的核心保存模块
import { saveSettingsDebounced } from "../../../script.js";

const extensionName = "regex-expand";

// 全屏编辑器弹窗逻辑
function openFullscreenEditor(title, $originalInput) {
    const $overlay = $('<div class="st-regex-fullscreen-overlay"></div>');
    const $container = $('<div class="st-regex-fullscreen-container"></div>');
    const $textarea = $('<textarea class="st-regex-fullscreen-textarea"></textarea>').val($originalInput.val());
    const $footer = $('<div class="st-regex-fullscreen-footer"></div>');
    
    const $cancelBtn = $('<button class="st-regex-btn st-regex-btn-cancel">取消</button>').on('click', () => $overlay.remove());
    const $saveBtn = $('<button class="st-regex-btn st-regex-btn-save">完成</button>').on('click', () => {
        $originalInput.val($textarea.val()).trigger('input').trigger('change');
        // 调用酒馆自带的防抖保存，确保数据存进手机本地
        if (typeof saveSettingsDebounced === 'function') {
            saveSettingsDebounced();
        }
        $overlay.remove();
    });

    $footer.append($cancelBtn, $saveBtn);
    $container.append($(`<div style="color:#fff;margin-bottom:8px;font-weight:bold;">编辑: ${title}</div>`), $textarea, $footer);
    $overlay.append($container);
    $('body').append($overlay);
    $textarea.focus();
}

// 扫描并注入按钮
function injectButtons() {
    const $popup = $('#regex_editor_popup');
    if (!$popup.length || $popup.is(':hidden')) return;

    $popup.find('div, label, span').each(function () {
        const $label = $(this);
        if ($label.find('.st-regex-expand-btn').length > 0) return;
        
        const text = $label.clone().children().remove().end().text().trim();

        if (text === '查找正则表达式') {
            const $input = $('#regex_search');
            if ($input.length) {
                const $btn = $('<span class="st-regex-expand-btn">⛶ 放大</span>');
                $btn.on('click', (e) => { e.preventDefault(); e.stopPropagation(); openFullscreenEditor('查找正则表达式', $input); });
                $label.append($btn);
            }
        }
        if (text === '替换为') {
            const $textarea = $('#regex_replace');
            if ($textarea.length) {
                const $btn = $('<span class="st-regex-expand-btn">⛶ 放大</span>');
                $btn.on('click', (e) => { e.preventDefault(); e.stopPropagation(); openFullscreenEditor('替换为', $textarea); });
                $label.append($btn);
            }
        }
    });
}

// 酒馆系统加载该插件时会自动调用这个初始化函数
jQuery(function () {
    // 注入我们精美的主题兼容样式
    const style = `
        .st-regex-expand-btn {
            display: inline-flex !important; align-items: center; justify-content: center;
            margin-left: 10px !important; padding: 2px 6px !important;
            border-radius: 4px !important; color: var(--gold) !important;
            background: rgba(255,255,255,0.08) !important; font-size: 12px !important;
            cursor: pointer !important; border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .st-regex-expand-btn:hover { background: rgba(255,255,255,0.2) !important; }
        .st-regex-fullscreen-overlay {
            position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85) !important; z-index: 999999 !important;
            display: flex !important; flex-direction: column !important; padding: 20px !important; box-sizing: border-box !important;
        }
        .st-regex-fullscreen-container { width: 100%; height: 100%; display: flex !important; flex-direction: column !important; }
        .st-regex-fullscreen-textarea {
            flex: 1 !important; width: 100% !important; background: var(--mainColor, #111) !important; color: #fff !important;
            font-family: monospace !important; font-size: 16px !important; padding: 12px !important;
            border: 1px solid var(--borderColor, #444) !important; border-radius: 6px !important; resize: none !important;
        }
        .st-regex-fullscreen-footer { display: flex !important; justify-content: flex-end !important; gap: 10px !important; margin-top: 10px !important; }
        .st-regex-btn { padding: 8px 22px !important; border-radius: 4px !important; border: none !important; font-weight: bold !important; cursor: pointer !important; }
        .st-regex-btn-save { background: #4a90e2 !important; color: white !important; }
        .st-regex-btn-cancel { background: #555 !important; color: white !important; }
    `;
    $('head').append(`<style>${style}</style>`);
    
    // 启动定时轮询监听酒馆弹窗
    setInterval(injectButtons, 500);
    console.log(`[${extensionName}] 遵循酒馆标准规范，成功挂载后端！`);
});
    function openFullscreenEditor(title, $originalInput) {
        const $overlay = $('<div class="st-regex-fullscreen-overlay"></div>');
        const $container = $('<div class="st-regex-fullscreen-container"></div>');
        const $textarea = $('<textarea class="st-regex-fullscreen-textarea"></textarea>').val($originalInput.val());
        const $footer = $('<div class="st-regex-fullscreen-footer"></div>');

        const $cancelBtn = $('<button class="st-regex-btn st-regex-btn-cancel">取消</button>').on('click', () => $overlay.remove());
        const $saveBtn = $('<button class="st-regex-btn st-regex-btn-save">完成</button>').on('click', () => {
            $originalInput.val($textarea.val()).trigger('input').trigger('change');
            $overlay.remove();
        });

        $footer.append($cancelBtn, $saveBtn);
        $container.append($(`<div style="color:#fff;margin-bottom:5px;">编辑: ${title}</div>`), $textarea, $footer);
        $overlay.append($container);
        $('body').append($overlay);
        $textarea.focus();
    }

    function injectButtons() {
        $('#regex_editor_popup div, #regex_editor_popup label').each(function () {
            const $label = $(this);
            if ($label.find('.st-regex-expand-btn').length > 0) return;
            const text = $label.clone().children().remove().end().text().trim();

            if (text === '查找正则表达式') {
                const $input = $('#regex_search');
                if ($input.length) $label.append($('<span class="st-regex-expand-btn">⛶ 放大</span>').on('click', () => openFullscreenEditor('查找正则表达式', $input)));
            }
            if (text === '替换为') {
                const $textarea = $('#regex_replace');
                if ($textarea.length) $label.append($('<span class="st-regex-expand-btn">⛶ 放大</span>').on('click', () => openFullscreenEditor('替换为', $textarea)));
            }
        });
    }

    setInterval(injectButtons, 500);
})();
