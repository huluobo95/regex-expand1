(function () {
    const style = `
        .st-regex-expand-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--gold) !important;
            background: rgba(255,255,255,0.1);
            font-size: 13px;
            vertical-align: middle;
        }
        .st-regex-fullscreen-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); z-index: 99999;
            display: flex; flex-direction: column; padding: 15px; box-sizing: border-box;
        }
        .st-regex-fullscreen-container {
            width: 100%; height: 100%; display: flex; flex-direction: column;
        }
        .st-regex-fullscreen-textarea {
            flex: 1; width: 100%; background: #111; color: #fff;
            font-family: monospace; font-size: 16px; padding: 10px;
            border: 1px solid #444; border-radius: 4px; resize: none;
        }
        .st-regex-fullscreen-footer {
            display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;
        }
        .st-regex-btn { padding: 8px 20px; border-radius: 4px; border: none; font-weight: bold; }
        .st-regex-btn-save { background: #4a90e2; color: white; }
        .st-regex-btn-cancel { background: #555; color: white; }
    `;
    $('head').append(`<style>${style}</style>`);

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
