const firebaseConfig = {
    apiKey: "AIzaSyAg-RWgF-TV3coO9K7CJuL7BSeZMDW07is",
    authDomain: "farmacia-simples-b7609.firebaseapp.com",
    projectId: "farmacia-simples-b7609",
    storageBucket: "farmacia-simples-b7609.appspot.com",
    messagingSenderId: "763735650123",
    appId: "1:763735650123:web:1a9fa17ea236458aa142ce",
    measurementId: "G-QZJSEJCV18"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Classe base Usuario
class Usuario {
    constructor(nome, cpf, email) {
        this.nome = nome;
        this.cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        this.email = email;
    }

    validarCPF() {
        if (this.cpf.length !== 11) {
            throw new Error('O CPF deve conter 11 dígitos.');
        }
    }
}

// Classe derivada Funcionario
class Funcionario extends Usuario {
    constructor(nome, cpf, email, cargo) {
        super(nome, cpf, email);
        this.cargo = cargo;
    }

    acessarSistemaInterno() {
        console.log(`${this.nome} acessou o sistema interno.`);
    }
}

// Classe derivada Cliente
class Cliente extends Usuario {
    constructor(nome, cpf, email, endereco) {
        super(nome, cpf, email);
        this.endereco = endereco;
    }

    realizarCompra() {
        console.log(`${this.nome} realizou uma compra.`);
    }
}

// Funções de autenticação e CRUD
document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('cpf').value;

    try {
        await auth.signInWithEmailAndPassword(email, senha);
        const user = auth.currentUser;

        // Verificar o tipo de usuário
        const snapshot = await database.ref(`usuarios/${user.uid}`).once('value');
        const userInfo = snapshot.val();

        if (userInfo.tipo === 'Funcionario') {
            window.location.href = 'form.html';
        } else {
            window.location.href = 'paginaCliente.html';
        }
    } catch (erro) {
        document.getElementById('feedback').textContent = `Erro: ${erro.message}`;
    }
});


document.getElementById('registerButton').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const email = document.getElementById('email').value;
    const senha = cpf; // CPF como senha
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    try {
        let usuario;
        if (tipo === 'Funcionario') {
            usuario = new Funcionario(nome, cpf, email, 'Cargo Exemplo');
        } else {
            usuario = new Cliente(nome, cpf, email, 'Endereço Exemplo');
        }

        usuario.validarCPF();
        validarEmail(email);

        const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
        await database.ref(`usuarios/${userCredential.user.uid}`).set({
            nome: usuario.nome,
            cpf: usuario.cpf,
            email: usuario.email,
            tipo: tipo
        });

        document.getElementById('feedback').textContent = 'Cadastro realizado com sucesso!';
    } catch (erro) {
        document.getElementById('feedback').textContent = `Erro: ${erro.message}`;
    }
});

// Funções de validação
function validarEmail(email) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!padraoEmail.test(email)) {
        throw new Error('O email deve ter um formato válido.');
    }
}
