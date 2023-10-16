const fileButton = document.getElementById('json-file');
const fileInput  = document.getElementById('file-input');
const fileError  = document.getElementById('input-error');
const contentBox = document.getElementById('content-box');

fileButton.addEventListener('click', () => {
    fileInput.click();
    fileError.innerHTML = "";
});

function getArchive() {

    let file = fileInput.files[0];

    if (!file) {
        fileError.innerHTML = "<p>Please select a file.</p>";
        return;
    }

    if (file.type === 'application/json') {

        fileButton.innerText = "Loading...";

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let json = JSON.parse(e.target.result);
                let jsonView = syntaxHighlight(json);

                contentBox.innerHTML = "<div class='tree-view'><header class='view-header'><button class='back-button' onclick='refresh()'><</button><p class='title'>" + file.name + "</p></header><section class='json-view'><pre>" + jsonView + "</pre></section></div>";

            } catch (error) {
                fileError.innerHTML = "<p>Invalid JSON file. Please load a valid JSON file.</p>";
                console.error(error);
            }
        };

        reader.readAsText(file);

    } else {
        fileError.innerHTML = "<p>Invalid file type. Please load a valid JSON file.</p>";
    }
}

function syntaxHighlight(json) {

    return JSON.stringify(json, null, 2)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|\{|\}|\[|\])/g, (match) => {
            
            var cls = 'json-number';
            
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            } else if (/\{|\[/.test(match)) {
                cls = 'json-brace';
            } else if (/\}|\]/.test(match)) {
                cls = 'json-bracket';
            }

            return '<span class="' + cls + '">' + match + '</span>';
        });
}

const refresh = () => window.location.reload(); 
