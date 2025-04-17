document.addEventListener('DOMContentLoaded', function () {
    searchLogs("");

    document.body.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'search-log') {
            const searchParam = prepareQuery(event);
            console.log("Search param2: ", searchParam);

            searchLogs(searchParam);
        }
    });

    function prepareQuery(event) {
        const formData = new FormData(event.target);
        const searchParam = Object.fromEntries(formData);
        console.log("Search param1: ", searchParam);

        const queryParams = [];
        if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
        if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
        if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

        return queryParams.length ? '?' + queryParams.join('&') : '';
    }

    function searchLogs(searchParam) {
        getData(`${API_URL}/logs${searchParam}`, 'Busca realizada com sucesso!').then((response) => {
            if (!response.error) {
                console.log("Logs encontrados: ", response);
                if (response.length == 0) {
                    document.getElementById('logs-query-results').setAttribute('hidden', true);
                    showToast('Nenhum log encontrado', "warning");
                } else {
                    document.getElementById('logs-query-results').removeAttribute('hidden');
                    const logsTable = document.getElementById('logs-table-body');
                    logsTable.innerHTML = '';
                    response.forEach(log => {
                        const row = document.createElement('tr');
                        row.setAttribute('id', `log-tr-${log?.id}`);

                        const creationDate = new Date(log?.createdAt).toLocaleDateString('pt-BR');
                        const creationTime = new Date(log?.createdAt).toLocaleTimeString('pt-BR');
                        const entity = log?.entity.split(' ');

                        row.innerHTML = `
                            <td>O(a) usuário(a) <strong>${log?.author}</strong> <strong>${log?.action}</strong> ${entity?.[0]} <strong>${entity?.[1]}</strong> <strong>${log?.target}</strong>, às <strong>${creationTime}</strong> do dia <strong>${creationDate}</strong></td>
                        `;
                        logsTable.appendChild(row);
                    });
                }
            } else showToast(response.error, "danger");
        });
    }
});