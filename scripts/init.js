/**************
 * COMPONENTS *
 **************/
/** Create ul component for nav */
const createNavList = (list, dir="/pages") => {
    const ul = document.createElement("ul");

    list.forEach((el) => {
        const li = document.createElement("li");

        if(el.children.length === 0) {
            li.classList.add("nav-link");
            li.dataset.kind = el.kind;
            li.dataset.name = el.name;
            li.dataset.src = `${dir}/${el.name}`;
            li.innerText = el.text;
        } else {
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
const createIndexList = (elements) => {
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
const fetchMD = async (dir) => {
    return fetch(dir)
        .then((res) => {
            const statusCode = res.status;

            switch(Math.floor(statusCode / 100)) {
                case 4:
                    throw new Error(`Client Error: ${statusCode}`);
                case 5:
                    throw new Error(`Internal Server Error: ${statusCode}`);
                default:
            }

            return res.text();
        })
        .then((md) => {
            const mdi = new markdownit({
                html: true,
                breaks: true,
                langPrefix: "lang-",
                linkify: true,
                highlight: (str, lang) => {
                    if(lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(lang, str).value;
                        } catch(__) {}
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
                    } else if(prefix === "[ ]") {
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
                    } else {
                        return `<li class="list-third">`;
                    }
                }

                return renderListItemOpenDefault(tokens, idx, options, env, self);
            };

            // render
            const rendered = mdi.render(md);
            document.getElementById("article-md").innerHTML = rendered;

            return [...md].filter((char) => char.charCodeAt(0) !== 13).join('');
        })
        .then((regmd) => {
            // article info
            const lines = regmd.match(/\n/g) || [];
            const emptyLines = regmd.match(/\n\n/g) || [];

            document.getElementById("lines").innerText = lines.length + 1;
            document.getElementById("sloc").innerText = (lines.length + 1) - emptyLines.length;

            let bytes;
            let unit = "Bytes";

            if(typeof TextEncoder === "undefined") {
                bytes = (new TextEncoderPolyfill().encode(regmd)).length;
            } else {
                bytes = (new TextEncoder().encode(regmd)).length;
            }

            if(bytes >= 1000) {
                if(bytes < 1000000) {
                    bytes /= 1000;
                    unit = "kB";
                } else if(bytes < 1000000000) {
                    bytes = Math.floor(bytes/1000) / 1000;
                    unit = "MB";
                }
            }

            document.getElementById("bytes").innerText = bytes;
            document.getElementById("unit").innerText = unit;

            return { success: true }
        })
        .catch((err) => {
            console.error(err);
            return { success: false, error: err }
        });
}

/** Set name to h2 tags */
const setName = () => {
    const h2s = document.getElementById("article-md").getElementsByTagName("h2");
    for(let i = 0, len = h2s.length; i < len; i++) {
        const h2 = h2s[i];
        h2.id = `head${i + 1}`;
    }
}

/** Set task list item's checkbox */
const setTaskCheckbox = () => {
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
const setKind = (kind) => {
    const kindElementsArray = [...document.getElementsByClassName("kind")];
    document.getElementById("kind-active").removeAttribute("id");
    kindElementsArray.filter((el) => el.innerText === kind)[0].id = "kind-active";
}

/** Reset markdown info to default */
const resetMDInfo = () => {
    document.getElementById("lines").innerText = '-';
    document.getElementById("sloc").innerText = '-';
    document.getElementById("bytes").innerText = 0;
    document.getElementById("unit").innerText = 'Bytes';
}

/** Set nav with markdown file */
const setNavWithMD = (nav, target) => {
    if(nav.dataset.currentLi) {
        document.querySelector(`[data-name=${CSS.escape(nav.dataset.currentLi)}]`).classList.remove("nav-selected");
    }

    document.getElementById("title-wrapper").firstElementChild.innerText = target.innerText;
    nav.dataset.currentLi = target.dataset.name;
    document.querySelector(`[data-name=${CSS.escape(nav.dataset.currentLi)}]`).classList.add("nav-selected");
}

const setAsideIndex = (aside) => {
    const heads = document.getElementById("article-md").getElementsByTagName("h2");
    if(heads.length === 0) return;

    if(aside.lastElementChild.tagName === "UL") {
        aside.lastElementChild.remove();
    }
    aside.append(createIndexList(heads));

    /**
     * li-top-offset: ul-margin + ul-padding + li-margin
     * li-top-margin: i * (li-height + li-margin)
     */
    const asideScroll = document.getElementById("aside-scroll-element");
    const ul = asideScroll.nextElementSibling;
    const li = ul.firstElementChild;

    // const asideScrollStyle = getComputedStyle(asideScroll) || asideScroll.currentStyle;
    const ulStyle = getComputedStyle(ul) || ul.currentStyle;
    const liStyle = getComputedStyle(li) || li.currentStyle;

    const liHeight = liStyle.height;

    ul.style.transform = `translate(0, -${liHeight})`;
    asideScroll.style.height = liHeight;
    asideScroll.style.transform = `translate(0, calc(${ulStyle.marginTop} + ${ulStyle.paddingTop} + ${liStyle.marginTop}))`;
}

/********
 * MAIN *
 ********/
fetch("/components/navlist.json", {
    Method: "GET",
    Accept: "application/json"
})
    .then(res => res.json())
    .then(jsonData => {
        document.getElementsByTagName("nav")[0].append(createNavList(jsonData.navList));
    });

document.addEventListener("click", (e) => {
    const target = e.target;
    const nav = document.getElementsByTagName("nav")[0];
    const aside = document.getElementsByTagName("aside")[0];
    
    if(target.classList.contains("trigger-open")) {
        const parentClassList = target.parentNode.classList;

        if(parentClassList.contains("opened")) {
            parentClassList.remove("opened");
            parentClassList.add("closed");
        } else if(parentClassList.contains("closed")) {
            parentClassList.remove("closed");
            parentClassList.add("opened");
        }

    } else if(target.classList.contains("nav-link")) {
        fetchMD(target.dataset.src)
            .then((result) => {
                scroll(0, 0);

                if(!result.success) {
                    document.getElementById("title-wrapper").firstElementChild.innerText = `Error: ${target.dataset.name}`;
                    setKind("Error");
                    resetMDInfo();
                    document.getElementById("article-md").innerHTML = result.error;

                    if(nav.dataset.currentLi) {
                        document.querySelector(`[data-name=${CSS.escape(nav.dataset.currentLi)}]`).classList.remove("nav-selected");
                    }
                    nav.dataset.currentLi = "";
                    
                    if(aside.lastElementChild.tagName === "UL") {
                        aside.lastElementChild.remove();
                    }
                    document.getElementById("aside-scroll-element").style.height = 0;

                    return { success: false, error: result.error }
                }

                // markdown
                setName();
                setTaskCheckbox();

                setKind(target.dataset.kind);
                setNavWithMD(nav, target);
                setAsideIndex(aside);

                return { success: true }
            });
    }
});

// SCROLL 넣자!!
// http code embed하자!

fetchMD("README.md")
    .then((result) => {
        if(!result.success) {
            document.getElementById("title-wrapper").firstElementChild.innerText = 'Error: Currently Not Available!';
            setKind("Error");
            resetMDInfo();
            document.getElementById("article-md").innerHTML = result.error;
            return { success: false, error: result.error };
        }

        // markdown
        setName();
        setTaskCheckbox();

        setAsideIndex(document.getElementsByTagName("aside")[0]);

        return { success: true }
    });

console.error(new HTTPError(404));

/********
 * test *
 ********/
{
}