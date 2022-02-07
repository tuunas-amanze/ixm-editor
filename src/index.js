import '../node_modules/uikit/dist/css/uikit.min.css'
import './css/arka.css';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import { ixm } from './modules/global-variables.js';

import random_text from './modules/random-text.js';
import editor_generator from './modules/editor-generator.js';
import { start_spinner, stop_spinner } from './modules/toggle-spinner.js';
import json_downloader from './modules/json-downloader.js';
import update_file_list from './modules/update-file-list.js';

// loads the Icon plugin
UIkit.use(Icons);

window[ixm] = {
    document_id: "default",
};

window[ixm].document_id = "default";
window[ixm].editor_id = Date.now();

window[ixm].editor_title = 'New File';

window[ixm].database = new Dexie('IxmEditorDatabase');
window[ixm].database.version(1).stores({
    editor_data: "id, title, data",
    personal_id: "id"
});

window[ixm].editor_body = document.createElement('div');
window[ixm].editor_body.setAttribute('id', 'editor-' + window[ixm].editor_id);

window[ixm].editor_container = document.querySelector('#editor_container');
window[ixm].editor_container.appendChild(window[ixm].editor_body);

window[ixm].editor = editor_generator('editor-' + window[ixm].editor_id, {});

window[ixm].document_title = document.querySelector('#title');
window[ixm].document_title.value = window[ixm].editor_title;
window[ixm].document_title.addEventListener('input', e => {
    window[ixm].editor_title = e.target.value;
})

const create_button = document.querySelector('#create');
create_button.addEventListener('click', e => {
    e.preventDefault();
    window[ixm].database.personal_id.toArray().then((id) => {
        if (id.length) {
            window[ixm].database.editor_data.add({
                id: id[0].id + '-' + Date.now(),
                title: 'New File',
                data: {}
            });
        } else {
            throw new Error('"personal_id" is none.');
        }
    }).catch(error => {
        console.error(error);

        window[ixm].database.personal_id.add({
            id: random_text(10)
        });
        console.log('Create New "personal_id".');
    });
});

const open_button = document.querySelector('#open');
const file_list = document.querySelector('#open_file_list')
open_button.addEventListener('click', e => {
    e.preventDefault();

    import_button.textContent = 'Import';
    import_button.removeAttribute('uk-spinner');
    import_button.removeAttribute('disabled');

    update_file_list(file_list);
})

const dd_fmt_selector = document.querySelector('#download_format');
const download_2_button = document.querySelector('#download_2');

let downloader = async () => {
    const result = await window[ixm].editor.save();
    return result;
};
dd_fmt_selector.addEventListener('change', async (e) => {
    download_2_button.setAttribute('disabled', 'true');
    let result;
    if (e.target.value == 'json') {
        result = await window[ixm].editor.save();
    } else if (e.target.value == 'backup') {
        result = await window[ixm].database.editor_data.toArray();
    } else {
        console.log('Error: ', 'Invalid data format. (from "dd_fmt_selector")');
        result = {};
    }
    downloader = async () => { return result; };
    download_2_button.removeAttribute('disabled');
});

download_2_button.addEventListener('click', e => {
    e.preventDefault();
    downloader()
    .then(data => { json_downloader(data, window[ixm].editor_title); })
    .catch(error => {
        console.log('Saving failed: ', error);
    });
});

const import_button = document.querySelector('#import');
import_button.addEventListener('click', e => {
    e.preventDefault();

    start_spinner(import_button);

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'application/json');
    input.setAttribute('style', 'display: none;');

    let reader = new FileReader()

    input.addEventListener('change', e => {
        reader.readAsText(e.target.files[0]);
    });

    reader.addEventListener('load', e => {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
            window[ixm].database.editor_data.bulkPut(json).catch((error) => {
                console.log('failed: import backup');
            })
        } else if (json.time) {
            window[ixm].database.personal_id.toArray().then((id) => {
                let your_id = id[0].id;
                let date = Date.now();
                window[ixm].database.editor_data.add({
                    id: your_id + date,
                    title: 'import-' + date,
                    data: json
                });
            });
        }

        stop_spinner(import_button, 'Import');
    });

    document.body.appendChild(input);
    input.click();
})
