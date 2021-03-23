/********
 * MAIN *
 ********/
 (async () => {
    const $titleWrapper = document.getElementById("title-wrapper");
    const $nav = document.getElementsByTagName("nav")[0];
    const $articleMD = document.getElementById("article-md");
    const $aside = document.getElementsByTagName("aside")[0];
    const $asideH3 = document.getElementById("aside-h3");
    const $year = document.getElementsByClassName("year")[0];

    let result;
    
    // footer year
    $year.innerText = new Date().getFullYear();

    // create nav
    const res = await fetch("/components/navlist.json", {
        Method: "GET",
        Accept: "application/json"
    });
    const data = await res.json();
    $nav.append(createNavList(data.navList));

    // aside scroll
    $asideH3.addEventListener("click", () => scroll(0, 0));

    $nav.addEventListener("click", async (e) => {
        const $target = e.target;

        // fold nav
        if($target.classList.contains("trigger-open")) {
            const parentClassList = $target.parentNode.classList;
            parentClassList.toggle('opened');
            parentClassList.toggle('closed');
        }

        // get md file
        if($target.classList.contains("nav-link")) {
            result = await processMD($target.dataset.src);
            scroll(0, 0);

            if(!result.success) {
                $titleWrapper.firstElementChild.innerText = `Error: ${$target.dataset.name}`;
                setKind("Error");
                resetMDInfo();
                $articleMD.innerHTML = result.error;

                const { currentLi } = $nav.dataset;
                if(currentLi) {
                    document.querySelector(`[data-name=${CSS.escape(currentLi)}]`).classList.remove("nav-selected");
                }
                $nav.dataset.currentLi = "";
                
                if($aside.lastElementChild.tagName === "UL") {
                    $aside.lastElementChild.remove();
                }

                return false;
            }

            // markdown
            setName();
            setTaskCheckbox();

            setKind($target.dataset.kind);
            setNavWithMD($nav, $target);
            setAsideIndex($aside);
        }
    });

    // SCROLL 넣자!!
    // http code embed하자!

    // 왜 안돼ㅐㅐㅐㅐ
    // window.addEventListener('load', async () => {
        result = await processMD("README.md");
    
        if(!result.success) {
            $titleWrapper.firstElementChild.innerText = 'Error: Currently Not Available!';
            setKind("Error");
            resetMDInfo();
            $articleMD.innerHTML = result.error;
            return;
        }
    
        // markdown
        setName();
        setTaskCheckbox();
    
        setAsideIndex($aside);
    // });

    // console.error(new HTTPError(404));
})();

/**************
 * COMPONENTS *
 **************/
/** Create ul component for nav */
function createNavList(list, dir="/pages") {
    const ul = document.createElement("ul");

    list.forEach((el) => {
        const li = document.createElement("li");

        if(el.children.length === 0) {
            li.classList.add("nav-link");
            li.dataset.kind = el.kind;
            li.dataset.name = el.name;
            li.dataset.src = `${dir}/${el.name}`;
            li.innerText = el.text;
        }
        else {
            const p = document.createElement("p");
            li.classList.add("opened");
            p.classList.add("trigger-open");
            p.innerText = el.text;
            li.append(p);
            li.append(createNavList(el.children, `${dir}/${el.name}`));
        }

        ul.append(li);
    });

    return ul;
}

/** Create ul component for index */
function createIndexList(elements) {
    const ul = document.createElement("ul");

    for(let el of elements) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const img = document.createElement("img");
        const span = document.createElement("span");

        a.href = `#${el.id}`;
        img.src = "/components/svgs/index-style.svg";
        img.alt = "Index Style";
        span.innerText = el.innerText;

        a.append(img);
        a.append(span);
        li.append(a);
        ul.append(li);
    }

    return ul;
}

/*************
 * FUNCTIONS *
 *************/
/** Fetch markdown file */
async function fetchMD(dir) {
    const res = await fetch(dir);
    const { statusCode } = res;
    switch(Math.floor(statusCode / 100)) {
        case 4:
            throw new Error(`Client Error: ${statusCode}`);
        case 5:
            throw new Error(`Internal Server Error: ${statusCode}`);
        default:
            break;
    }

    return await res.text();
}

/** Initialize markdownit */
function initMarkdownit() {
    const mdi = new markdownit({
        html: true,
        breaks: true,
        langPrefix: "lang-",
        linkify: true,
        highlight: (str, lang) => {
            if(lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch(__) {
                }
            }
            return '';
        }
    });

    // text
    const renderTextDefault = mdi.renderer.rules.text || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    mdi.renderer.rules.text = function(tokens, idx, options, env, self) {
        const token = tokens[idx];

        if(idx === 0) {
            const prefix = token.content.slice(0, 3);
            if(prefix === "[x]") {
                return `<input type="checkbox" class="task-list-item-checkbox" disabled checked>${token.content.slice(3)}`;
            }
            else if(prefix === "[ ]") {
                return `<input type="checkbox" class="task-list-item-checkbox" disabled>${token.content.slice(3)}`;
            }
        }

        return renderTextDefault(tokens, idx, options, env, self);
    };

    // list item open
    const renderListItemOpenDefault = mdi.renderer.rules.list_item_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    mdi.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
        const token = tokens[idx];

        if(token.level > 1) {
            if(token.level < 5) {
                return `<li class="list-second">`;
            }
            else {
                return `<li class="list-third">`;
            }
        }

        return renderListItemOpenDefault(tokens, idx, options, env, self);
    };

    return mdi;
}

/** Process markdown file */
async function processMD(dir) {
    const md = await fetchMD(dir);
    const mdi = initMarkdownit();

    // render
    const rendered = mdi.render(md);
    document.getElementById("article-md").innerHTML = rendered;

    // article info
    const regmd = [...md].filter((char) => char.charCodeAt(0) !== 13).join('');
    const lines = regmd.match(/\n/g) || [];
    const emptyLines = regmd.match(/\n\n/g) || [];

    document.getElementById("lines").innerText = lines.length + 1;
    document.getElementById("sloc").innerText = (lines.length + 1) - emptyLines.length;

    let bytes;
    let unit = "Bytes";

    if(window.TextEncoder) {
        bytes = (new window.TextEncoder().encode(regmd)).length;
    }
    else {
        bytes = (new TextEncoderPolyfill().encode(regmd)).length;
    }

    if(bytes >= 1000) {
        if(bytes < 1000000) {
            bytes /= 1000;
            unit = "kB";
        }
        else if(bytes < 1000000000) {
            bytes = Math.floor(bytes/1000) / 1000;
            unit = "MB";
        }
    }

    document.getElementById("bytes").innerText = bytes;
    document.getElementById("unit").innerText = unit;

    return { success: true };
    // .catch((err) => {
    //     console.error(err);
    //     return { success: false, error: err }
    // });
}

/** Set name to h2 tags */
function setName() {
    const h2s = document.getElementById("article-md").getElementsByTagName("h2");
    for(let i = 0, len = h2s.length; i < len; i++) {
        const h2 = h2s[i];
        h2.id = `head${i + 1}`;
    }
}

/** Set task list item's checkbox */
function setTaskCheckbox() {
    for(let checkBox of document.getElementsByClassName("task-list-item-checkbox")) {
        let parent = checkBox.parentElement;
        while(!(parent.tagName === "LI" || parent.id === "article-md")) {
            parent = parent.parentElement;
        }

        if(parent.id === "article-md") {
            continue;
        }
        
        const ul = parent.parentElement;

        parent.classList.add("task-list-item");
        if(!ul.classList.contains("contains-task-list") && ul.tagName === "UL") {
            ul.classList.add("contains-task-list");
        }
    };
}

/** Set the kind of document */
function setKind(kind) {
    const kindElementsArray = [...document.getElementsByClassName("kind")];
    document.getElementById("kind-active").removeAttribute("id");
    kindElementsArray.filter((el) => el.innerText === kind)[0].id = "kind-active";
}

/** Reset markdown info to default */
function resetMDInfo() {
    document.getElementById("lines").innerText = '-';
    document.getElementById("sloc").innerText = '-';
    document.getElementById("bytes").innerText = 0;
    document.getElementById("unit").innerText = 'Bytes';
}

/** Set nav with markdown file */
function setNavWithMD(nav, target) {
    if(nav.dataset.currentLi) {
        document.querySelector(`[data-name=${CSS.escape(nav.dataset.currentLi)}]`).classList.remove("nav-selected");
    }

    document.getElementById("title-wrapper").firstElementChild.innerText = target.innerText;
    nav.dataset.currentLi = target.dataset.name;
    document.querySelector(`[data-name=${CSS.escape(nav.dataset.currentLi)}]`).classList.add("nav-selected");
}

function setAsideIndex($aside) {
    const heads = document.getElementById("article-md").getElementsByTagName("h2");
    if(heads.length === 0) return;

    if($aside.lastElementChild.tagName === "UL") {
        $aside.lastElementChild.remove();
    }
    $aside.append(createIndexList(heads));
}

/********
 * test *
 ********/
{
}