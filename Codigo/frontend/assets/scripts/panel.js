// PEGAR TIPO DO USUÁRIO E NOME ATRAVÉS DE COOKIES
function getCookie(nomeCookie) {
    const name = nomeCookie + "=";
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica os cookies
    const cookieArray = decodedCookie.split(';'); // Divide todos os cookies em um array
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        // Remove espaços em branco iniciais
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1); 
        }
        // Se o cookie começar com o nome desejado, retorna o valor
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// PREENCHE NOME DO USUÁRIO LOGADO
function preencheNomeUsuario(nomeUsuario) {
    const userButton = document.querySelector('.btn-usuario');
    const nome = document.querySelector('#nome');

    if (nomeUsuario) {
        try {
            // Converte o valor do cookie para JSON
            const usuarioObj = JSON.parse(nomeUsuario);
            const userName = usuarioObj.name || "Usuário"; // Usa o nome ou "Usuário" como padrão

            userButton.textContent = userName;
            nome.textContent = userName;
        } catch (error) {
            console.error("Erro ao parsear o cookie:", error);
            userButton.textContent = "Usuário Logado";
            nome.textContent = "Usuário Logado";
        }
    } else {
        // Se o cookie não existir
        userButton.textContent = "Usuário Logado";
        nome.textContent = "Usuário Logado";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nomeUsuario = getCookie("user");
    preencheNomeUsuario(nomeUsuario);
});
