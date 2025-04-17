document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("login").addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const requestBody = Object.fromEntries(formData);

        postData(`${API_URL}/users/login`, requestBody, 'Login realizado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Login bem sucedido! Usuário logado: ", response);
                document.cookie = `user=${JSON.stringify(response)}; path=/;`;
                window.location.href = './operator-panel.html';
            } else showToast(response.error, "danger");
        });
    });
});