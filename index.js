(() => {
    console.log("[regex-enhancer] loaded");

    function addBtn(input, label) {
        if (label.dataset.done) return;
        label.dataset.done = "1";

        const btn = document.createElement("span");
        btn.textContent = " ⛶";
        btn.style.cursor = "pointer";
        btn.style.marginLeft = "6px";

        btn.onclick = () => {
            const old = input.value;

            const mask = document.createElement("div");
            mask.style = `
                position:fixed;inset:0;
                background:rgba(0,0,0,.6);
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
            `;

            const box = document.createElement("div");
            box.style = `
                width:80%;height:70%;
                background:#1e1e2e;
                display:flex;flex-direction:column;
                padding:10px;
            `;

            const ta = document.createElement("textarea");
            ta.style.flex = "1";
            ta.value = old;

            const save = document.createElement("button");
            save.textContent = "保存";

            const close = document.createElement("button");
            close.textContent = "关闭";

            save.onclick = () => {
                input.value = ta.value;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                document.body.removeChild(mask);
            };

            close.onclick = () => document.body.removeChild(mask);

            box.appendChild(ta);
            box.appendChild(save);
            box.appendChild(close);
            mask.appendChild(box);
            document.body.appendChild(mask);
        };

        label.appendChild(btn);
    }

    function scan() {
        const labels = document.querySelectorAll("label, .form-label, .col-form-label");

        labels.forEach(l => {
            const text = l.innerText || "";

            if (!text.includes("正则") && !text.includes("替换")) return;

            const input = l.parentElement?.querySelector("input, textarea");
            if (!input) return;

            addBtn(input, l);
        });
    }

    setInterval(scan, 1000);
})();
