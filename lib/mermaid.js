// mermaid included in index.html

const Mermaid = {
    oncreate: (vnode) => {
        Mermaid.onupdate(vnode)
    },
    onbeforeupdate: (vnode, old) => {
        // only update if the mermaid code has changed
        return (old.attrs.mermaid != vnode.attrs.mermaid)
    },
    onupdate: (vnode) => {
        // remove mermaid property that signals layout is done
        // https://github.com/knsv/mermaid/issues/311
        const box = vnode.dom
        
        try {
            // this fails the first time, whatever, ignore
            box.removeAttribute('data-processed')

            // NOT needed, setting textContent does this
            // // remove SVG contents from the node
            // while (box.lastChild) {
            //     box.removeChild(box.lastChild);
            // }
        }
        catch (e) {}
        
        // stick mermaid source code into the node
        box.textContent = vnode.attrs.mermaid || "graph TB\n no"

        // run mermaid layout
        mermaid.init(undefined, vnode.dom);
    },
    view: (vnode) => {
        return m('pre')
    }
}

module.exports = Mermaid;