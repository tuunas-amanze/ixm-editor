import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import { ixm } from './global-variables.js';

import EditorJS from '@editorjs/editorjs';

import Paragraph from'@editorjs/paragraph';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import Delimiter from'@editorjs/delimiter';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

import ArkaTranslator from './arka-translator.js';

import random_text from './random-text.js'

// loads the Icon plugin
UIkit.use(Icons);

export default function editor_generator(element_id, initial_data) {
    if (!element_id) {
        return new Error('No args here!');
    }

    if (!initial_data) {
        return new Error('No args here!');
    }

    if (!window[ixm].editor_title) {
        window[ixm].editor_title = Date.now();
    }

    return new EditorJS({
        holder: element_id,
        autofocus: true,
        data: initial_data,
        tunes: ['arka'],
        tools: {
            arka: ArkaTranslator,
            header: Header,
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            quote: Quote,
            code: CodeTool,

            list: List,
            table: Table,

            delimiter: Delimiter,

            embed: Embed,
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        uploadByFile(file) {
                            return new Promise(resolve => {
                                let file_reader = new FileReader();
                                file_reader.addEventListener('load', e => {
                                    let data = {
                                        success: 1,
                                        file: {
                                            url: e.target.result
                                        }
                                    };
                                    resolve(data);
                                }, {once: true});
                                file_reader.readAsDataURL(file);
                            });
                        },
                        uploadByUrl(url) {
                            return fetch(url).then(response => {
                                return response.blob()
                            }).then(response => {
                                return new Promise(resolve => {
                                    let file_reader = new FileReader();
                                    file_reader.addEventListener('load', e => {
                                        let data = {
                                            success: 1,
                                            file: {
                                                url: e.target.result
                                            }
                                        };
                                        resolve(data);
                                    }, {once: true});
                                    file_reader.readAsDataURL(response);
                                });
                            });
                        }
                    }
                }
            }
        },
        onChange() {
            window[ixm].editor.save().then((output) => {
                window[ixm].database.editor_data
                .where("id")
                .equals(window[ixm].document_id)
                .toArray()
                .then((search) => {
                    console.log('search: ', search)
                    window[ixm].database.editor_data.update(window[ixm].document_id, {
                        title: window[ixm].editor_title,
                        data: output
                    });
                })
                window[ixm].database.editor_data.toArray().then((notes) => {
                    console.log('Indexdb: ', notes);
                });
            });
        },
        onReady() {
            window[ixm].database.personal_id.toArray().then((id) => {
                console.log('personal_id:', id);
                if (!window[ixm].document_id || window[ixm].document_id == "default") {
                    if (id.length) {
                        window[ixm].document_id = id[0].id + '-' + Date.now();
                        window[ixm].database.editor_data.add({
                            id: window[ixm].document_id,
                            title: window[ixm].editor_title,
                            data: {}
                        });
                        console.log('document_id: ', window[ixm].document_id);
                    } else {
                        //let default_id = random_text(10);
                        let default_id = random_text(10);
                        UIkit.modal.prompt('Personal ID:', default_id).then((your_id) => {
                            if (!your_id) {
                                throw new Error('No id detected.');
                            }
                            window[ixm].database.personal_id.add({
                                id: your_id
                            });
                            window[ixm].document_id = your_id + '-' + Date.now();
                            window[ixm].database.editor_data.add({
                                id: window[ixm].document_id,
                                title: window[ixm].editor_title,
                                data: {}
                            });
                            console.log('document_id: ', window[ixm].document_id);
                        }).catch((err) => {
                            console.log(err);
                            window[ixm].database.personal_id.add({
                                id: default_id
                            });
                            window[ixm].document_id = default_id + '-' + Date.now();
                            window[ixm].database.editor_data.add({
                                id: window[ixm].document_id,
                                title: window[ixm].editor_title,
                                data: {}
                            });
                            console.log('document_id: ', window[ixm].document_id);
                        });
                    }
                }
            });
        }
    });
}
