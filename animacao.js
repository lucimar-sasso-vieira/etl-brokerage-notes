const pagina = document.querySelector('.pagina');
const registrarlink = document.querySelector('.registrar-link');
const loginlink = document.querySelector('.login-link');

registrarlink.onclick = () => {
    pagina.classList.add('ativo');
};

loginlink.onclick = () => {
    pagina.classList.remove('ativo');
};

document.querySelector('.login form').onsubmit = async (e) => {
    e.preventDefault();
    const formulario = e.target;
    const formData = new FormData(formulario);
    const acao = await fetch('/login', {
        method: 'POST',
        body: formData
    });
    const retorno = await acao.json();
    const emailInput = formulario.querySelector('input[name="email"]');
    const passwordInput = formulario.querySelector('input[name="password"]');
    if (retorno.status === 'error') {
        emailInput.classList.remove('success');
        passwordInput.classList.remove('success');
        emailInput.classList.add('error');
        passwordInput.classList.add('error');
        showNotification(retorno.message, 'error');
    } else {
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        emailInput.classList.add('success');
        passwordInput.classList.add('success');
        showNotification('Login executado com Sucesso!', 'success');
        setTimeout(() => {
            window.location.href = '/user';
        }, 2000);
    }
};

document.querySelector('.registrar form').onsubmit = async (e) => {
    e.preventDefault();
    const formulario = e.target;
    const formData = new FormData(formulario);
    const acao = await fetch('/registrar', {
        method: 'POST',
        body: formData
    });
    const retorno = await acao.json();
    showNotification(retorno.message, retorno.status === 'success' ? 'success' : 'error');
    if (retorno.status === 'success') {
        formulario.reset();
        pagina.classList.remove('ativo');
    }
};

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

function verSenha(id, icon) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bx-hide');
        icon.classList.add('bx-show');
    } else {
        input.type = 'password';
        icon.classList.remove('bx-show');
        icon.classList.add('bx-hide');
    }
}