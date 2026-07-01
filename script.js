(function () {
    'use strict';

    function createBtn(input) {
        const btn = document.createElement('span');
        btn.textContent = ' ⛶';
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '6px';
        btn.style.fontSize = '14px';
        btn.title = '放大编辑';

        btn.onclick = () => openModal(input);

        return btn;
    }

    function openModal(input) {
        const mask = document.createElement('div');
        mask.className = 'regex-mask';

        const box = document.createElement('div');
        box.className = 'regex-box';

        const ta = document.createElement('textarea');
        ta.value = input.value || '';

        const bar = document.createElement('div');
        bar.className = 'regex-bar';

        const save = document.createElement('button');
        save.textContent = '保存';

        const close = document.createElement('button');
        close.textContent = '关闭';

        save.onclick = () => {
            input.value = ta.value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            document.body.removeChild(mask);
        };

        close.onclick = () => {
            document.body.removeChild(mask);
        };

        bar.appendChild(save);
        bar.appendChild(close);

        box.appendChild(ta);
        box.appendChild(bar);
        mask.appendChild(box);
        document.body.appendChild(mask);
    }

    function inject() {
        document.querySelectorAll('label, .form-label, .col-form-label').forEach(label => {
            const text = label.innerText || '';

            if (!/(正则|查找|替换)/.test(text)) return;

            const parent = label.parentElement;
            if (!parent || parent.dataset.regexDone) return;

            const input = parent.querySelector('textarea, input');
            if (!input) return;

            parent.dataset.regexDone = '1';

            label.appendChild(createBtn(input));
        });
    }

    setInterval(inject, 800);
})();
