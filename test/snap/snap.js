'use strict';

const dict = {};

((run = true) => {
    if(!run) return;

    const $container = document.getElementById('container');

    for(let data of dcConsData) {
        const { name, keywords } = data;

        for(let keyword of keywords) {
            if(dict[keyword] === undefined) {
                dict[keyword] = [];
            }
            dict[keyword].push(name);
        }

        $container.appendChild(createEl(data));
    }
    console.log(dict);
})();

function createEl({ name, uri, keywords, tags }) {
    const $ret = document.createElement('div');
    const $inner = document.createElement('div');
    const $name = document.createElement('p');
    const $p1 = document.createElement('p');
    const $keywordList = document.createElement('ol');

    $ret.classList.add('con');
    $ret.style.backgroundImage = `url(${uri})`;
    $ret.id = keywords[0];

    $inner.classList.add('con-inner');

    $name.innerText = name;

    $p1.innerText = 'Keywords';
    for(let keyword of keywords) {
        const $keyword = document.createElement('li');
        $keyword.innerText = keyword;
        $keywordList.appendChild($keyword);
    }

    $inner.appendChild($name);
    $inner.appendChild($p1);
    $inner.appendChild($keywordList);
    $ret.appendChild($inner);

    return $ret
}