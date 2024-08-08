import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAg-RWgF-TV3coO9K7CJuL7BSeZMDW07is",
    authDomain: "farmacia-simples-b7609.firebaseapp.com",
    projectId: "farmacia-simples-b7609",
    storageBucket: "farmacia-simples-b7609.appspot.com",
    messagingSenderId: "763735650123",
    appId: "1:763735650123:web:1a9fa17ea236458aa142ce",
    measurementId: "G-QZJSEJCV18"
  };

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para cadastrar um remédio
async function cadastrarRemedio() {
    const nome = document.getElementById('nome').value;
    const medida = document.getElementById('medida').value;
    const quantidade = document.getElementById('quantidade').value;

    if (nome && medida && quantidade) {
        try {
            const newRef = ref(db, 'remedios/' + Date.now()); // Usando timestamp como chave única
            await set(newRef, {
                nome,
                medida,
                quantidade
            });
            alert('Remédio cadastrado com sucesso!');
            limparFormulario();
            verRemedios();
        } catch (error) {
            console.error('Erro ao cadastrar remédio:', error);
            alert('Erro ao cadastrar remédio.');
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para ver os remédios
async function verRemedios() {
    const lista = document.getElementById('listaRemedios');
    lista.innerHTML = '';
    try {
        const snapshot = await get(ref(db, 'remedios'));
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const remedio = childSnapshot.val();
                const item = document.createElement('li');
                item.textContent = `Nome: ${remedio.nome}, Medida: ${remedio.medida}, Quantidade: ${remedio.quantidade}`;
                lista.appendChild(item);
            });
        } else {
            lista.innerHTML = '<li>Nenhum remédio cadastrado.</li>';
        }
    } catch (error) {
        console.error('Erro ao buscar remédios:', error);
        alert('Erro ao buscar remédios.');
    }
}

// Função para atualizar um remédio
async function atualizarRemedio() {
    const nome = prompt('Digite o nome do remédio que deseja atualizar:');
    try {
        const q = query(ref(db, 'remedios'), orderByChild('nome'), equalTo(nome));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const remd = snapshot.val();
            const key = Object.keys(remd)[0];
            const novaMedida = prompt('Digite a nova medida do remédio:', remd[key].medida);
            const novaQuantidade = prompt('Digite a nova quantidade na caixa:', remd[key].quantidade);

            if (novaMedida && novaQuantidade) {
                await update(ref(db, 'remedios/' + key), {
                    medida: novaMedida,
                    quantidade: novaQuantidade
                });
                alert('Remédio atualizado com sucesso!');
                verRemedios();
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        } else {
            alert('Remédio não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao atualizar remédio:', error);
        alert('Erro ao atualizar remédio.');
    }
}

// Função para deletar um remédio
async function deletarRemedio() {
    const nome = prompt('Digite o nome do remédio que deseja deletar:');
    try {
        const q = query(ref(db, 'remedios'), orderByChild('nome'), equalTo(nome));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const remd = snapshot.val();
            const key = Object.keys(remd)[0];
            await remove(ref(db, 'remedios/' + key));
            alert('Remédio deletado com sucesso!');
            verRemedios();
        } else {
            alert('Remédio não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao deletar remédio:', error);
        alert('Erro ao deletar remédio.');
    }
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('medida').value = '';
    document.getElementById('quantidade').value = '';
}

// Adicionar eventos aos botões
document.getElementById('btnCadastrar').addEventListener('click', cadastrarRemedio);
document.getElementById('btnVerRemedios').addEventListener('click', verRemedios);
document.getElementById('btnAtualizar').addEventListener('click', atualizarRemedio);
document.getElementById('btnDeletar').addEventListener('click', deletarRemedio);