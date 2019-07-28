function htmlToStruct(elements) {
  const struct = [];
  Array.from(elements).forEach(element => {
    const item = {
      tagName: element.tagName.toLowerCase(),
      children: [],
      data: {}
    }

    if (element.children.length > 0) {
      item.children = htmlToStruct(element.children);
    } else if (element.textContent.trim().length > 0) {
      const regionName = element.textContent.trim().replace(/{{|}}/gm, '');
      item.children.push({
        tagName: 'render-region',
        children: [],
        data: {
          attrs: {},
          props: {
            regionName
          }
        }
      });
    }

    const attributes = Array.from(element.attributes);
    if (attributes.length > 0) {
      item.data.attrs = {};
      attributes.forEach((attr) => {
        item.data.attrs[attr.name] = attr.value;
      });
    }

    struct.push(item);
  });

  return struct;
}

function createEditor(id, mode) {
  const editor = ace.edit(id);
  editor.setTheme('ace/theme/monokai');
  editor.session.setMode(`ace/mode/${mode}`);

  return editor;
}

const editor = createEditor('editor', 'html');
const viewer = createEditor('viewer', 'json');
viewer.setReadOnly(true);

const editorDOM = document.getElementById('editorDOM');
document.getElementById('btn').addEventListener('click', (e) => {
  editorDOM.innerHTML = editor.getValue();
  viewer.setValue(JSON.stringify(htmlToStruct(editorDOM.children), null, 2));
});
