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


let roadmap = `
graph LR
    loading(Loading milestones ... please wait);
`

let state = {roadmap}

let App = {
    view: (vnode) => {
        return m('div', [
            m('.roadmap', m(Mermaid, {mermaid: state.roadmap}))
        ])
    }
}

/** github code */
function github() {

    const user = 'wires';
    // Generate token here: https://github.com/settings/tokens
    // const token = 'ed0ad757434229cee217ff19d9a8913e737474e6';
    const endpoint = 'https://api.github.com';
    // const creds = `${user}:${token}`;
    // const auth = btoa(creds);

    const options = {
        mode: 'cors',
        headers: {
            // 'Authorization': 'Basic ' + auth,
        }
    }

    const api = (resource) => fetch(`${endpoint}${resource}`, options)
        .then(
        response => response.json(),
        err => console.error('Error fetching', err)
        )
        .then(
        json => { console.log('JSON', json); return json },
        err => console.error('Error parsing', err)
        );

    // Get milestones requests from this repo
    return api('/repos/wires/roadmap-viewer/milestones')
}

const dependsRegexp = /# depends on (.+)/g


function startApp(elementId) {
    m.mount(document.getElementById('main'), App)
    github().then(milestones => {
        console.log(milestones.map(m => m.title));
        let ms = milestones.map(m => {
            let x = m.title.split(" - ")
            let node = `\tclick n${x[0]} "${m.url}" "go"; 
\tn${x[0]}(${x[0]}: ${x[1]});`
        // })
        // let deps = milestones.map(m => {
            let dependencies = m.description.match(dependsRegexp)
            if (dependencies) {
                let deps = dependencies.map(d => {
                    return d.split("# depends on ")[1]
                });
                let z = deps.map(k => `n${x[0]} --> n${k};`);
                return node + "\n\t" + z.join("\n\t");
            } else {
                return node;
            }
        })
        state.roadmap = 'graph LR\n' + (ms.join("\n"))
        console.log(state.roadmap)
        m.redraw();
    })
}

/*
closed_at: null
closed_issues: 0
created_at: "2018-12-17T13:03:05Z"
creator: {login: "wires", id: 315734, node_id: "MDQ6VXNlcjMxNTczNA==", avatar_url: "https://avatars3.githubusercontent.com/u/315734?v=4", gravatar_id: "", …}
description: "second milestone"
due_on: null
html_url: "https://github.com/wires/roadmap-viewer/milestone/2"
id: 3906499
labels_url: "https://api.github.com/repos/wires/roadmap-viewer/milestones/2/labels"
node_id: "MDk6TWlsZXN0b25lMzkwNjQ5OQ=="
number: 2
open_issues: 0
state: "open"
title: "Milestone 2"
updated_at: "2018-12-17T13:03:05Z"
url: "https://api.github.com/repos/wires/roadmap-viewer/milestones/2"
*/