
// Formatters
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});


const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
});


const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
});


async function updateDropdown() {
    return fetch('./gpu_list')
        .then(response => response.json())
        .then(data => {
            let options = data.map(d => {
                return `<option value="${d.model}">${d.model}</option>`
            });
            document.getElementById('model-select').innerHTML = options;
        });
}


async function updatePostsTable() {
    let selection = document.getElementById('model-select').value;
    let abbrev = selection.replace(/\s/g, '').toLowerCase();

    fetch('./gpu_posts?' + new URLSearchParams({model: abbrev}))
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById('gpu-posts-table-data');

            // First clear table rows
            while(table.rows.length > 0) {
                table.deleteRow(0);
            }

            // Add the data rows
            data.forEach(d => {
                let row = `<tr>
                        <td>${dateFormatter.format(d.postdate)}</td>
                        <td>${d.company}</div></td>
                        <td>${d.model}</td>
                        <td>${currencyFormatter.format(d.price)}</td>
                        <td>${percentFormatter.format(d.price_to_msrp)}</td>
                        <td><a href="${d.url}">Link</a></td>
                    </tr>`
                table.innerHTML += row
            });

            // Fill in the blank rows
            for (let i = 0; i < Math.max(5 - data.length, 0); i++) {
                let row = '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
                table.innerHTML += row;
            }
        });
}