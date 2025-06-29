class MyCustomElement extends HTMLElement {
  static observedAttributes = ["color", "size"];
  _shadow = null;
  _editor = null;
  _leaveRange = null;
  constructor() {
    // 必须首先调用 super 方法
    super();

    this._shadow = this.attachShadow({ mode: "open" });
    this.render();
    this.addEvent();
  }
  render() {
    const template = `
    <div><button id="imageButton">图片</button><button id="boldButton">加粗</button><button id="italicButton">斜体</button></div>
    <div id="editorContainer" style="width: 100%;height: 300px;overflow: auto;" contenteditable="true">

    <p class="item"></p>
    </div>
    `;

    this._shadow.innerHTML = template;

    this._editor = this._shadow.getElementById("editorContainer");
    this._imageButton = this._shadow.getElementById("imageButton");
    this._boldButton = this._shadow.getElementById("boldButton");
    this._italicButton = this._shadow.getElementById("italicButton");
    this._selection = this._shadow.getSelection();
    console.log(this._editor, "打印");
    const doc = document.createElement("div");
    // doc.addEventListener
  }
  addEvent() {
    this._imageButton.addEventListener("click", () => {
      console.log(this._selection, "我点击了老弟");
      this.insertImage();
    });
    this._boldButton.addEventListener("click", () => {
      this.insertBold();
    });
    this._italicButton.addEventListener("click", () => {
      this.insertItalic();
    });
    this._editor.addEventListener("beforeinput", (e) => {
      console.log(e, "输入内容");
      // e.preventDefault();

      // 检查并清理零宽空格占位符
      // const firstP = this._editor.querySelector('p')
      // if (firstP && firstP.textContent === '\u200B') {
      //   // 如果p标签只包含零宽空格，清空内容
      //   firstP.innerHTML = ''
      // }
    });
    this._editor.addEventListener("input", (e) => {
      console.log(e, "输入内容");
      // e.preventDefault();

      // 检查并清理零宽空格占位符
      const firstP = this._editor.querySelector("p");
      const selection = this._shadow.getSelection();
      if (firstP && firstP.textContent === `\u200B${e.data}`) {
        // 如果p标签只包含零宽空格，清空内容
        firstP.innerHTML = e.data;
        const selection = this._shadow.getSelection();
        const range = selection.getRangeAt(0);
        const cloneRange = range.cloneRange();
        cloneRange.setStart(selection.baseNode, 1);
        cloneRange.setEnd(selection.baseNode, 1);
        selection.removeAllRanges();
        selection.addRange(cloneRange);
      }
      console.log(selection, "selectionselectionselectionselection");
    });
    this._editor.addEventListener("focus", () => {
      // console.log('聚焦了')
      // 聚焦之后，如果数据为空，直接创建一个p标签，并且把光标聚焦在p标签上
      // this.rangeEvent()
      // 聚焦后子标签为零是直接添加

      const pDom = document.createElement("p");
      // pDom.appendChild
      // console.log(, '这标签的数量')
      if (this._editor.children.length === 0) {
        this._editor.appendChild(pDom);
      }
      // this._editor.children.length
      console.dir(this._editor, "这是编辑器嘛");
      this.initRangeEvent(pDom);
    });
    this._editor.addEventListener("blur", () => {
      console.log(this._selection, "我离开了");
      // this._selection
    });
  }
  insertItalic() {
    const range = this._selection.getRangeAt(0);
    const cloneRange = range.cloneRange();
    const content = this._selection.toString();
    console.log("斜体插入的内容", content);
    // const template = `<div style="font-weight: 800;">${content}</div>`;
    this._selection.deleteFromDocument();
    const dom = document.createElement("span");
    dom.style.fontStyle = "italic";
    dom.innerHTML = content;
    // dom.innerHTML = template;
    range.insertNode(dom);
  }
  initRangeEvent(dom) {
    const selection = this._shadow.getSelection();

    // 获取编辑器中的第一个p标签
    const firstP = this._editor.querySelector("p");
    // firstP.innerHTML = ' '
    if (firstP) {
      // 如果p标签为空，添加零宽空格作为占位符
      if (!firstP.textContent.trim()) {
        firstP.innerHTML = "\u200B"; // 零宽空格，不可见但能让光标显示
      }

      // 创建新的范围
      const range = document.createRange();

      // 设置范围的起始位置为第一个p标签的开始位置
      range.setStart(firstP, 0);
      range.setEnd(firstP, 0);

      // 清除当前选择并设置新的选择
      selection.removeAllRanges();
      selection.addRange(range);

      // 让编辑器获得焦点
      this._editor.focus();
      console.log(selection, "firstPfirstPfirstPfirstP111111111111111111");
    }
    console.log(selection, "firstPfirstPfirstPfirstP");
  }
  insertBold() {
    const range = this._selection.getRangeAt(0);
    const cloneRange = range.cloneRange();
    const content = this._selection.toString();
    console.log("加粗插入的内容", content);
    // const template = `<div style="font-weight: 800;">${content}</div>`;
    this._selection.deleteFromDocument();
    const dom = document.createElement("span");
    dom.style.fontWeight = 800;
    dom.innerHTML = content;
    // dom.innerHTML = template;
    range.insertNode(dom);
  }
  insertImage() {
    const imageDom = document.createElement("img");
    imageDom.setAttribute(
      "src",
      "https://qpic.y.qq.com/music_cover/MHkTmaUZD8gX6xa8vmQ2d6ibYpj6TyibQHySl8CzWrhTPvoWfnxNUicKQ/300?n=1"
    );
    const newRange = document.createRange();
    newRange.setStart(this._selection.baseNode, this._selection.baseOffset);
    newRange.setStart(this._selection.focusNode, this._selection.focusOffset);
    this._selection.removeAllRanges();
    this._selection.addRange(newRange);
    newRange.insertNode(imageDom);
  }

  connectedCallback() {
    console.log("自定义元素添加至页面。");
  }

  disconnectedCallback() {
    console.log("自定义元素从页面中移除。");
  }

  adoptedCallback() {
    console.log("自定义元素移动至新页面。");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`属性 ${name} 已变更。`);
  }
}

customElements.define("my-custom-element", MyCustomElement);
