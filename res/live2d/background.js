// 背景图样式基础样式
let backgroundCssNode;
function addBackgroundStyle(mainImgs, siderImgs) {
    if (backgroundCssNode)
        backgroundCssNode.remove();
    
    backgroundCssNode = document.createElement('style');

    const commonStyle = `
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.2;
    `;

    let styleContent = `
${addMainImagesCss(mainImgs, commonStyle)}
${addSidebarImagesCss(siderImgs, commonStyle)}
`;
    backgroundCssNode.appendChild(document.createTextNode(styleContent))
    document.head.appendChild(backgroundCssNode);
}

function addMainImagesCss(images, commonStyle, loop) {

    // ------ 在前景图时使用 ::after ------
    const frontContent = '::after'; // useFront ? '::after' : '::before';

    // ------ 组合样式 ------
    const imageStyleContent = images
        .map((img, index) => {
            // ------ nth-child ------
            // nth-child(1)
            let nthChildIndex = index + 1 + '';
            // nth-child(3n + 1)
            if (loop) {
                nthChildIndex = `${images.length}n + ${nthChildIndex}`;
            }

            return (
                // code editor
                `[id="workbench.parts.editor"] .split-view-view:nth-child(${nthChildIndex}) ` +
                `.editor-container .editor-instance>.monaco-editor ` +
                `.overflow-guard>.monaco-scrollable-element${frontContent}{background-image: url('${img}') !important;${commonStyle}}` +
                '\n' +
                // home screen
                `[id="workbench.parts.editor"] .split-view-view:nth-child(${nthChildIndex}) ` +
                `.empty::before { background-image: url('${img}') !important;${commonStyle} }`
            );
        })
        .join('\n');

    const content = `
${imageStyleContent}
[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}
`;

    return content;
}

const addSidebarImagesCss = function (images, commonStyle, loop) {
    const sidebarItems = [
        "workbench.view.explorer",
        "workbench.view.search",
        "workbench.view.scm",
        "workbench.view.debug",
        "workbench.view.extensions"
    ];

    // ------ 组合样式 ------
    const imageStyleContent = images
        .map((img, index) => {
            // ------ nth-child ------
            // nth-child(1)
            let nthChildIndex = index + 1 + '';
            // nth-child(3n + 1)
            if (loop) {
                nthChildIndex = `${images.length}n + ${nthChildIndex}`;
            }
            const Items = sidebarItems && sidebarItems.length ? sidebarItems : ['workbench.view.explorer'];
            // sidebar content css
            return (
                Items.map(
                    id =>
                        `[id="${id}"] .split-view-view:nth-child(${nthChildIndex}) ` +
                        `.pane-body .monaco-list>.monaco-scrollable-element::before{background-image: url('${img}') !important;${commonStyle}}`
                ).join('\n') + '\n'
            );
        })
        .join('\n');
    return imageStyleContent;
};

function getAsoulImgs(callback) {
    fetch('https://api.asoul.cloud:8000/getPic?page=4&tag_id=0&sort=1&part=0&rank=3&type=1', {
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "user-agent": "Mozilla/4.0 MDN Example",
            "content-type": "application/json"
        },
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // *client, no-referrer
    })
        .then(response => response.json()) // parses response to JSON
        .then(function (myJson) {

            if (Array.isArray(myJson) && myJson.length > 0) {
                const imgs = myJson.map(item => item.pic_url[0].img_src);
                console.log(imgs);
                callback && callback(imgs);
            }
        });
}

getAsoulImgs((imgs) => {
    addBackgroundStyle(imgs.slice(0,5),imgs.slice(5,10));
})