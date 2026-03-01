function salvarPerfil() {
    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const curso = document.getElementById("curso").value;
    const fotoInput = document.getElementById("foto");
    let perfil = { nome, turma, curso, foto: "" };

    if (fotoInput && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            perfil.foto = e.target.result;
            localStorage.setItem("perfilAluno", JSON.stringify(perfil));
            localStorage.setItem("fotoPerfil", e.target.result);
            alert("Perfil salvo com sucesso!");
            carregarPerfil();
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        localStorage.setItem("perfilAluno", JSON.stringify(perfil));
        alert("Perfil salvo com sucesso!");
        carregarPerfil();
    }
}

function carregarPerfil() {
    const dados = JSON.parse(localStorage.getItem("perfilAluno"));
    if (!dados) return;

    if (document.getElementById("nome")) document.getElementById("nome").value = dados.nome || "";
    if (document.getElementById("turma")) document.getElementById("turma").value = dados.turma || "";
    if (document.getElementById("curso")) document.getElementById("curso").value = dados.curso || "";
    if (dados.foto && document.getElementById("previewFoto")) document.getElementById("previewFoto").src = dados.foto;

    const fotoHeader = document.getElementById("fotoHeader");
    if (fotoHeader) fotoHeader.src = dados.foto || "images/user.png";
}

function removerFoto() {
    const preview = document.getElementById("previewFoto");
    const header = document.getElementById("fotoHeader");
    const fotoPadrao = "images/user.png";

    if (preview) preview.src = fotoPadrao;
    if (header) header.src = fotoPadrao;

    localStorage.removeItem("fotoPerfil");
    alert("Foto removida com sucesso!");
}

function login() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (usuario === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    const dadosLogin = { usuario, logado: true };
    localStorage.setItem("loginAluno", JSON.stringify(dadosLogin));
    window.location.href = "painel.html";
}

function sairConta() {
    localStorage.removeItem("loginAluno");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const paginaAtual = window.location.pathname;
    if (paginaAtual.includes("painel.html")) {
        const loginSalvo = localStorage.getItem("loginAluno");
        if (!loginSalvo) { window.location.href = "login.html"; return; }
        const login = JSON.parse(loginSalvo);
        if (!login.logado) { window.location.href = "login.html"; }
    }
});

const disciplinas = [
    "Artes 1","Biologia 1","Ciência, Tecnologia e Sociedade","Cidadania e Ética 1","Ferramentas de Escritório e de Acesso Remoto",
    "Filosofia 1","Física 1","Geografia 1","História 1","Informática e Redes de Computadores",
    "Língua Inglesa 1","Língua Portuguesa 1","Matemática 1","Programação 1","Projeto e Prática 1","Química 1",
    "Artes 2","Banco de Dados","Biologia 2","Desenvolvimento Web","Educação Física 2","Física 2","Geografia 2","História 2",
    "Inglês Instrumental","Língua Inglesa 2","Língua Portuguesa 2","Matemática 2","Programação 2","Projeto e Prática 2",
    "Projetos em Ciências da Natureza","Projetos Inovadores e Divulgação Científica","LABORATÓRIO POLITÉCNICO DE PESQUISA E EXTENSÃO","Química 2",
    "Segurança, Meio Ambiente e Saúde","Sociologia","Empreendedorismo, Inovação e Startups","Física 3","Geografia 3",
    "História 3","Língua Portuguesa 3","Matemática 3","Programação 3","Projeto e Prática 3","Projetos em Inclusão e Direitos Humanos",
    "Química 3","Relação Étnico e Direitos Humanos","Testes e Software"
];

function filtrarDisciplinas() {
    const input = document.getElementById("disciplina").value.toLowerCase();
    const datalist = document.getElementById("listaSugestoes");
    datalist.innerHTML = "";

    disciplinas
        .filter(d => d.toLowerCase().includes(input))
        .forEach(d => {
            const option = document.createElement("option");
            option.value = d;
            datalist.appendChild(option);
        });
}

let perguntas = JSON.parse(localStorage.getItem("perguntas")) || [];

function publicarPergunta() {
    const nome = document.getElementById('nome').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const disciplina = document.getElementById('disciplina').value.trim();
    const texto = document.getElementById('texto').value.trim();

    if (!nome || !titulo || !disciplina || !texto) {
        alert('Preencha todos os campos!');
        return;
    }

    const id = Date.now();
    const pergunta = { id, nome, titulo, disciplina, texto };
    perguntas.push(pergunta);

    localStorage.setItem("perguntas", JSON.stringify(perguntas)); // ✅ Salvar no localStorage

    atualizarMinhasPerguntas();
    document.getElementById('formPergunta').reset();
}

function atualizarMinhasPerguntas(filtro = '') {
    const container = document.getElementById('minhasPerguntas');
    if (!container) return;

    container.innerHTML = '';

    const perguntasFiltradas = perguntas.filter(p => filtro === '' || p.disciplina.toLowerCase() === filtro.toLowerCase());

    if (perguntasFiltradas.length === 0) {
        container.innerHTML = '<p>Nenhuma pergunta encontrada.</p>';
        return;
    }

    perguntasFiltradas.forEach(p => {
        const card = document.createElement('div');
        card.className = 'cardPergunta';
        card.innerHTML = `
            <h4>${p.titulo}</h4>
            <small>Disciplina: ${p.disciplina} | Autor: ${p.nome}</small>
            <p>${p.texto}</p>
            <div class="botoes-perfil">
                <button onclick="editarPergunta(${p.id})">Editar</button>
                <button onclick="removerPergunta(${p.id})" style="background:red;">Remover</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarMinhasPerguntas() {
    const filtro = document.getElementById('filtroDisciplina').value;
    atualizarMinhasPerguntas(filtro);
}

function editarPergunta(id) {
    const pergunta = perguntas.find(p => p.id === id);
    if (!pergunta) return;

    document.getElementById('nome').value = pergunta.nome;
    document.getElementById('titulo').value = pergunta.titulo;
    document.getElementById('disciplina').value = pergunta.disciplina;
    document.getElementById('texto').value = pergunta.texto;

    perguntas = perguntas.filter(p => p.id !== id);
    localStorage.setItem("perguntas", JSON.stringify(perguntas));
    atualizarMinhasPerguntas();
}

function removerPergunta(id) {
    if (!confirm('Deseja realmente remover esta pergunta?')) return;
    perguntas = perguntas.filter(p => p.id !== id);
    localStorage.setItem("perguntas", JSON.stringify(perguntas));
    atualizarMinhasPerguntas();
}

function preencherFiltroDisciplinas() {
    const select = document.getElementById("filtroDisciplina");
    if (!select) return;

    select.innerHTML = '<option value="">Todas</option>';
    disciplinas.forEach(d => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        select.appendChild(option);
    });
}

function mostrarPerguntasIndex() {
    const container = document.getElementById("Postagens");
    if (!container) return;

    const perguntasIndex = JSON.parse(localStorage.getItem("perguntas")) || [];

    if (perguntasIndex.length === 0) {
        container.innerHTML = "<p>Nenhuma pergunta publicada.</p>";
        return;
    }

    perguntasIndex.forEach(p => {
        const card = document.createElement("div");
        card.className = "cardPergunta";
        card.innerHTML = `
            <h4>${p.titulo}</h4>
            <small>Disciplina: ${p.disciplina} | Autor: ${p.nome}</small>
            <p>${p.texto}</p>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    carregarPerfil();
    preencherFiltroDisciplinas();
    atualizarMinhasPerguntas();
    mostrarPerguntasIndex();
});

document.addEventListener("DOMContentLoaded", function() {
    const loginSalvo = localStorage.getItem("loginAluno");
    const areaPergunta = document.getElementById("areaPergunta");

    if (!loginSalvo) {
        areaPergunta.innerHTML = `
            <p style="color:red; font-weight:bold;">
                Você precisa estar logado para publicar perguntas.
                <a href="login.html">Clique aqui para entrar</a>
            </p>
        `;
        return;
    }

    const login = JSON.parse(loginSalvo);

    if (!login.logado) {
        areaPergunta.innerHTML = `
            <p style="color:red; font-weight:bold;">
                Você precisa estar logado para publicar perguntas.
                <a href="login.html">Clique aqui para entrar</a>
            </p>
        `;
        return;
    }

    const nomeInput = document.getElementById("nome");
    if (nomeInput) {
        nomeInput.value = login.usuario || "";
    }
});

function adicionarConteudo() {
    const disciplina = document.getElementById("disciplinaConteudo").value;
    const tipo = document.getElementById("tipoConteudo").value;
    const titulo = document.getElementById("tituloConteudo").value;
    const descricao = document.getElementById("descricaoConteudo").value;

    if (!disciplina || !titulo || !descricao) {
        alert("Preencha todos os campos!");
        return;
    }

    let conteudos = JSON.parse(localStorage.getItem("conteudos")) || [];

    conteudos.push({
        id: Date.now(),
        disciplina,
        tipo,
        titulo,
        descricao,
        autor: "Aluno",
        dataHora: new Date().toLocaleString()
    });

    localStorage.setItem("conteudos", JSON.stringify(conteudos));

    alert("Conteúdo adicionado com sucesso!");

    // Limpar campos
    document.getElementById("disciplinaConteudo").value = "";
    document.getElementById("tipoConteudo").value = "resumo";
    document.getElementById("tituloConteudo").value = "";
    document.getElementById("descricaoConteudo").value = "";

    atualizarConteudosDisciplina();
}

function atualizarConteudosDisciplina() {
    const container = document.getElementById("conteudosDisciplina");
    container.innerHTML = '';

    let conteudos = JSON.parse(localStorage.getItem("conteudos")) || [];

    conteudos.forEach(c => {
        const card = document.createElement('div');
        card.className = 'cardPergunta';
        card.innerHTML = `
            <h4>${c.titulo} (${c.tipo})</h4>
            <small>Disciplina: ${c.disciplina} | Autor: ${c.autor} | ${c.dataHora}</small>
            <p>${c.descricao}</p>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", atualizarConteudosDisciplina);

function atualizarConteudosDisciplina() {
    const container = document.getElementById("conteudosDisciplina");
    container.innerHTML = '';

    let conteudos = JSON.parse(localStorage.getItem("conteudos")) || [];

    conteudos.forEach(c => {
        const card = document.createElement('div');
        card.className = 'cardPergunta';
        card.innerHTML = `
            <h4>${c.titulo} (${c.tipo})</h4>
            <small>Disciplina: ${c.disciplina} | Autor: ${c.autor} | ${c.dataHora}</small>
            <p>${c.descricao}</p>
            <div class="botoes-perfil">
                <button onclick="removerConteudoDisciplina(${c.id})" style="background:red;">🗑️ Remover</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function removerConteudoDisciplina(id) {
    if (!confirm("Deseja realmente remover este conteúdo?")) return;

    let conteudos = JSON.parse(localStorage.getItem("conteudos")) || [];
    conteudos = conteudos.filter(c => c.id !== id);
    localStorage.setItem("conteudos", JSON.stringify(conteudos));
    atualizarConteudosDisciplina();
}

