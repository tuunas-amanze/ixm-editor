export default function json_downloader(data, title) {
    console.log('Download Data: ', data);

    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute('style', 'display: none;')
    a.download = title + '.json';
    a.href = url;

    document.body.appendChild(a);

    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
