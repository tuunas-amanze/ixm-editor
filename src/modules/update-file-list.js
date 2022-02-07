import { ixm } from './global-variables.js';
import editor_generator from './editor-generator.js';

export default function update_file_list(parent_element) {
    while( parent_element.firstChild ) {
        parent_element.removeChild( parent_element.firstChild );
    }

    let button_body = document.createElement('a');
                button_body.classList.add("uk-icon-link");
                button_body.setAttribute('uk-icon', "icon: pencil; ratio: 1.25;");
                button_body.href = '#'

    window[ixm].database.editor_data.toArray().then((list) => {
        for (let data of list) {
            let raw = document.createElement('tr');
            let title = document.createElement('td');
            title.textContent = data.title;
            //let id = document.createElement('td');
            //id.textContent = data.id;
            let button_container = document.createElement('td');
            let button_body = document.createElement('a');
            button_body.classList.add("uk-icon-link");
            button_body.setAttribute('uk-icon', "icon: pencil; ratio: 1.25;");
            button_body.href = '#';
            let delete_button_container = document.createElement('td');
            let delete_button_body = document.createElement('a');
            delete_button_body.classList.add("uk-icon-link", "uk-text-danger");
            delete_button_body.setAttribute('uk-icon', "icon: trash; ratio: 1.25;");
            delete_button_body.href = '#';

            button_container.appendChild(button_body);
            if (data.id != window[ixm].document_id) {
                delete_button_container.appendChild(delete_button_body);
            }

            raw.appendChild(title);
            //raw.appendChild(id);
            raw.appendChild(button_container);
            raw.appendChild(delete_button_container);

            parent_element.appendChild(raw);

            button_body.addEventListener('click', e => {
                e.preventDefault();

                window[ixm].editor_id = Date.now();
                window[ixm].document_id = data.id;
                window[ixm].document_title.value = data.title;
                window[ixm].document_title.dispatchEvent(new Event('input'));

                window[ixm].editor_body.setAttribute('style', 'display: none;')

                window[ixm].editor_body = document.createElement('div');
                window[ixm].editor_body.setAttribute('id', 'editor-' + window[ixm].editor_id);

                window[ixm].editor_container.removeChild(editor_container.firstChild);
                window[ixm].editor_container.appendChild(window[ixm].editor_body);

                window[ixm].editor.destroy();
                window[ixm].editor = editor_generator('editor-' + window[ixm].editor_id, data.data);
            }, {once: true});

            if (data.id != window[ixm].document_id) {
                delete_button_body.addEventListener('click', e => {
                    e.preventDefault();

                    parent_element.removeChild(raw);

                    window[ixm].database.editor_data.delete(data.id);
                });
            }
        }
    });
}
