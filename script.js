
const app = document.getElementById("app");

let tela = "landing";
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let tema = "Política";
let perguntaAtual = "";
let resultadoAtual = null;
let mensagens = [];
let perguntas = JSON.parse(localStorage.getItem("perguntas")) || [];
let salvas = JSON.parse(localStorage.getItem("salvas")) || [];
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let abaHistorico = "perguntas";

let config = {
    tema: "Política",
    assunto: "Geral",
    quantidade: 5,
    dificuldade: "Fácil"
};

let questoes = [];
let indice = 0;
let selecionada = -1;
let acertos = 0;
let revisao = [];
let inicioQuiz = 0;
let ultimoQuiz = null;

const bancoQuestoes = [
    {
        tema: "Política",
        pergunta: "Qual é a função dos três poderes no Brasil?",
        alternativas: [
            "Dividir e equilibrar as funções do Estado",
            "Escolher uma única religião oficial",
            "Substituir as eleições",
            "Eliminar todas as leis"
        ],
        correta: 0,
        explicacao: "O Executivo administra, o Legislativo cria leis e fiscaliza, e o Judiciário interpreta as leis e julga conflitos."
    },
    {
        tema: "Política",
        pergunta: "O que caracteriza uma democracia?",
        alternativas: [
            "Participação política e direitos garantidos",
            "Poder concentrado sem eleições",
            "Proibição de opiniões diferentes",
            "Ausência de leis"
        ],
        correta: 0,
        explicacao: "A democracia envolve participação popular, eleições, direitos fundamentais e respeito às instituições."
    },
    {
        tema: "Política",
        pergunta: "Qual é o papel do Poder Legislativo?",
        alternativas: [
            "Criar leis e fiscalizar o Executivo",
            "Executar todas as decisões judiciais",
            "Comandar sozinho todos os órgãos públicos",
            "Substituir a Constituição"
        ],
        correta: 0,
        explicacao: "O Legislativo debate e aprova leis e fiscaliza ações do Executivo, respeitando a Constituição."
    },
    {
        tema: "Política",
        pergunta: "O que é cidadania?",
        alternativas: [
            "Exercício de direitos e deveres na sociedade",
            "Participar apenas de eleições presidenciais",
            "Ter obrigatoriamente um cargo público",
            "Concordar com todas as decisões do governo"
        ],
        correta: 0,
        explicacao: "Cidadania envolve direitos, responsabilidades e participação na sociedade."
    },
    {
        tema: "Política",
        pergunta: "Para que serve uma Constituição?",
        alternativas: [
            "Estabelecer regras fundamentais do Estado e direitos",
            "Substituir todas as eleições",
            "Definir uma opinião única para a população",
            "Organizar somente eventos culturais"
        ],
        correta: 0,
        explicacao: "A Constituição organiza o Estado e estabelece direitos e deveres fundamentais."
    },
    {
        tema: "Religião",
        pergunta: "O que significa pluralidade religiosa?",
        alternativas: [
            "Existência de diferentes crenças e tradições",
            "Obrigação de seguir uma única religião",
            "Proibição de práticas religiosas",
            "Ausência de tradições culturais"
        ],
        correta: 0,
        explicacao: "Pluralidade religiosa reconhece a existência de diferentes crenças e tradições na sociedade."
    },
    {
        tema: "Religião",
        pergunta: "O que é liberdade religiosa?",
        alternativas: [
            "Direito de ter, mudar ou não ter religião",
            "Obrigação de participar de cultos",
            "Permissão para discriminar outras crenças",
            "Obrigação de seguir uma tradição"
        ],
        correta: 0,
        explicacao: "A liberdade religiosa protege o direito de seguir uma crença, mudar de religião ou não ter religião."
    },
    {
        tema: "Religião",
        pergunta: "O que são textos sagrados?",
        alternativas: [
            "Textos importantes para uma tradição religiosa",
            "Leis iguais para todos os países",
            "Textos sem importância cultural",
            "Textos sempre interpretados da mesma forma"
        ],
        correta: 0,
        explicacao: "Textos sagrados têm importância espiritual para determinadas comunidades, e suas interpretações podem variar."
    },
    {
        tema: "Religião",
        pergunta: "Por que estudar religiões de forma imparcial?",
        alternativas: [
            "Para compreender tradições com respeito",
            "Para provar que todas são idênticas",
            "Para obrigar todos a seguir uma crença",
            "Para eliminar diferenças culturais"
        ],
        correta: 0,
        explicacao: "O estudo imparcial busca compreender crenças e práticas sem favorecer ou atacar uma religião."
    },
    {
        tema: "Religião",
        pergunta: "O que é diálogo inter-religioso?",
        alternativas: [
            "Conversa respeitosa entre diferentes religiões",
            "Debate para proibir outras crenças",
            "Obrigação de concordar em tudo",
            "Proibição de diferenças religiosas"
        ],
        correta: 0,
        explicacao: "O diálogo inter-religioso busca compreensão e convivência respeitosa entre diferentes tradições."
    }
];

function salvarDados() {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("perguntas", JSON.stringify(perguntas));
    localStorage.setItem("salvas", JSON.stringify(salvas));
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
}

function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function logo() {
    return `
        <div class="brand" onclick="ir('dashboard')">
            <span class="star">★</span>
            Entenda.AI
        </div>
    `;
}

function cabecalho(landing = false) {
    return `
        <header class="topbar">
            ${logo()}
            <div class="top-actions">
                ${landing
                    ? `<button class="linkbtn" onclick="ir('login')">Entrar</button>`
                    : `<button class="pill" onclick="ir('salvos')">♧ Salvos (${salvas.length})</button>`
                }
            </div>
        </header>
    `;
}

function navegacao() {
    const itens = [
        ["dashboard", "⌂", "Início"],
        ["configQuiz", "⊙", "Quiz"],
        ["historico", "◷", "Histórico"],
        ["perfil", "♙", "Perfil"]
    ];

    return `
        <nav class="bottomnav">
            ${itens.map(item => `
                <button class="navitem ${tela === item[0] ? "active" : ""}"
                    onclick="ir('${item[0]}')">
                    <span>${item[1]}</span>
                    <span>${item[2]}</span>
                </button>
            `).join("")}
        </nav>
    `;
}

function layout(conteudo, menu = true) {
    return `
        ${cabecalho()}
        <main class="main">${conteudo}</main>
        ${menu ? navegacao() : ""}
    `;
}

function ir(novaTela) {
    tela = novaTela;
    renderizar();
    window.scrollTo(0, 0);
}

function landing() {
    return `
        <div class="landing">
            ${cabecalho(true)}
            <section class="hero">
                <div>
                    <div class="eyebrow">
                        ● &nbsp; Conhecimento claro, responsável e imparcial
                    </div>

                    <h1>
                        Temas complexos,<br>
                        <span class="gradient">explicados de verdade.</span>
                    </h1>

                    <p>
                        Aprenda sobre política e religião com explicações
                        simples, diferentes perspectivas e fontes confiáveis.
                    </p>

                    <div class="actions">
                        <button class="primary" onclick="ir('cadastro')">
                            Começar gratuitamente →
                        </button>
                        <button class="secondary" onclick="ir('login')">
                            Já tenho conta
                        </button>
                    </div>

                    <div class="checks">
                        <span>🟢 Respostas imparciais</span>
                        <span>🟢 Fontes para aprofundar</span>
                        <span>🟢 Quiz interativo</span>
                    </div>
                </div>

                <div class="mock">
                    <div class="mockhead">
                        <span class="star">★</span>
                        <div>
                            <b>Entenda.AI</b>
                            <small>Pronto para explicar</small>
                        </div>
                        <span class="tag">Política</span>
                    </div>

                    <div class="bubble userbubble">
                        Por que existem três poderes no Brasil?
                    </div>

                    <div class="bubble answerbubble">
                        A divisão entre Executivo, Legislativo e Judiciário
                        ajuda a evitar a concentração de poder.
                        <hr>
                        📖 Explicação com contexto e fontes
                    </div>

                    <div class="mockstats">
                        <div>✦<br><b>Simples</b><br>Linguagem</div>
                        <div>✧<br><b>Plural</b><br>Perspectivas</div>
                        <div>✓<br><b>Confiável</b><br>Conteúdo</div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function cadastro() {
    return `
        ${cabecalho()}
        <main class="main">
            <div class="formbox">
                <h2>Crie sua conta</h2>
                <p class="muted">Comece a explorar política e religião.</p>

                <form onsubmit="cadastrar(event)">
                    <label class="formfield">Nome completo</label>
                    <input class="field" id="nome" required
                        placeholder="Como podemos te chamar?">

                    <label class="formfield">E-mail</label>
                    <input class="field" id="email" type="email" required
                        placeholder="seu@email.com">

                    <label class="formfield">Senha</label>
                    <input class="field" id="senha" type="password"
                        minlength="4" required placeholder="Crie uma senha">

                    <label class="formfield">Confirme sua senha</label>
                    <input class="field" id="confirmarSenha" type="password"
                        minlength="4" required placeholder="Digite novamente">

                    <button class="primary full">Criar conta</button>
                </form>

                <p class="muted">
                    Já tem conta?
                    <button class="textlink" onclick="ir('login')">Entrar</button>
                </p>
            </div>
        </main>
    `;
}

function login() {
    return `
        ${cabecalho()}
        <main class="main">
            <div class="formbox">
                <h2>Que bom ter você de volta!</h2>
                <p class="muted">Entre para continuar aprendendo.</p>

                <form onsubmit="entrar(event)">
                    <label class="formfield">E-mail</label>
                    <input class="field" id="email" type="email" required
                        placeholder="seu@email.com">

                    <label class="formfield">Senha</label>
                    <input class="field" id="senha" type="password" required
                        placeholder="Sua senha">

                    <button class="primary full">Entrar</button>
                </form>

                <p class="muted">
                    Ainda não tem conta?
                    <button class="textlink" onclick="ir('cadastro')">
                        Cadastre-se
                    </button>
                </p>

                <p class="muted small">
                    Protótipo demonstrativo: os dados ficam neste navegador.
                </p>
            </div>
        </main>
    `;
}

function dashboard() {
    const nome = usuario?.nome?.split(" ")[0] || "Estudante";

    return layout(`
        <p class="greeting">Olá, ${escapar(nome)} 👋</p>
        <h1 class="page-title">O que você quer entender hoje?</h1>

        <form class="searchrow" onsubmit="perguntarBusca(event)">
            <input class="field" id="busca"
                placeholder="Digite sua pergunta..." required>
            <button class="primary">Perguntar</button>
        </form>

        <button class="card quiz-banner" onclick="ir('configQuiz')">
            <div>
                <span class="small">NOVIDADE</span>
                <h3>Quiz Interativo</h3>
                <p>Teste seus conhecimentos sobre política e religião</p>
            </div>
            <span style="font-size:38px">🎯</span>
        </button>

        <div class="grid2">
            <button class="card theme-politica" onclick="escolherTema('Política')">
                <span class="emoji">🏛️</span>
                <h3>Política</h3>
                <p>Conceitos, eleições e instituições</p>
            </button>

            <button class="card theme-religiao" onclick="escolherTema('Religião')">
                <span class="emoji">✨</span>
                <h3>Religião</h3>
                <p>Tradições e perspectivas religiosas</p>
            </button>

            <button class="card theme-historico" onclick="ir('historico')">
                <span class="emoji">📋</span>
                <h3>Histórico</h3>
                <p>Suas perguntas anteriores</p>
            </button>

            <button class="card theme-about" onclick="ir('sobre')">
                <span class="emoji">💡</span>
                <h3>Como funciona?</h3>
                <p>Saiba mais sobre o Entenda.AI</p>
            </button>
        </div>
    `);
}

function escolherTema(novoTema) {
    tema = novoTema;
    mensagens = [];
    ir("chat");
}

function temas() {
    return layout(`
        <h1 class="page-title">Escolha um tema</h1>
        <p class="muted">Selecione uma área para começar.</p>

        <div class="grid2">
            <button class="card theme-politica" onclick="escolherTema('Política')">
                <span class="emoji">🏛️</span>
                <h3>Política</h3>
                <p>Democracia, eleições, governo e direitos</p>
            </button>

            <button class="card theme-religiao" onclick="escolherTema('Religião')">
                <span class="emoji">✨</span>
                <h3>Religião</h3>
                <p>Crenças, tradições e diversidade religiosa</p>
            </button>

            <button class="card" onclick="escolherTema('Pergunta Geral')">
                <span class="emoji">💬</span>
                <h3>Pergunta Geral</h3>
                <p>Explore assuntos relacionados</p>
            </button>
        </div>
    `);
}

function perguntarBusca(evento) {
    evento.preventDefault();
    const campo = document.getElementById("busca");
    const texto = campo.value.trim();

    if (texto) {
        tema = "Pergunta Geral";
        mensagens = [];
        ir("chat");
        enviarPergunta(texto);
    }
}

function chat() {
    return layout(`
        <p class="greeting">${escapar(tema)}</p>
        <h1 class="page-title">Vamos entender juntos.</h1>

        <div class="chatbox">
            <div class="chathead">
                <span class="star">★</span>
                <div>
                    <b>Entenda.AI</b>
                    <div class="small muted">Explicações educativas e imparciais</div>
                </div>
                <span class="tag">${escapar(tema)}</span>
            </div>

            <div class="chatmessages" id="mensagens">
                ${mensagens.length
                    ? mensagens.map(m => `
                        <div class="message ${m.tipo}">
                            ${escapar(m.texto)}
                        </div>
                    `).join("")
                    : `<div class="message ai">
                        Olá! Faça sua pergunta sobre ${escapar(tema)}.
                        Vou apresentar uma explicação educativa.
                    </div>`
                }
            </div>

            <form class="chatinput" onsubmit="enviarDoCampo(event)">
                <input class="field" id="campoPergunta"
                    placeholder="Digite sua pergunta..." required>
                <button class="primary">Enviar ➤</button>
            </form>
        </div>

        <div class="section">
            <button class="secondary" onclick="ir('temas')">
                ← Trocar tema
            </button>
        </div>
    `);
}

function enviarDoCampo(evento) {
    evento.preventDefault();
    const campo = document.getElementById("campoPergunta");
    const texto = campo.value.trim();

    if (texto) {
        enviarPergunta(texto);
    }
}

function gerarResposta(texto) {
    const q = texto.toLowerCase();

    if (q.includes("três poderes") || q.includes("tres poderes")) {
        return "No Brasil, o Estado é organizado em três poderes. O Executivo administra e coloca políticas públicas em prática; o Legislativo cria leis e fiscaliza; e o Judiciário interpreta as leis e resolve conflitos. Essa divisão procura evitar a concentração de poder. Cada poder possui limites previstos na Constituição.";
    }

    if (q.includes("democracia")) {
        return "Democracia é uma forma de organização política em que a população participa das decisões, diretamente ou por representantes. Ela envolve eleições, direitos fundamentais, liberdade de expressão e instituições que respeitam as leis. Existem diferentes modelos democráticos, e sua aplicação varia entre países e períodos históricos.";
    }

    if (q.includes("religião") || q.includes("religiao") ||
        q.includes("liberdade religiosa")) {
        return "Religião envolve crenças, práticas e comunidades que buscam responder a questões espirituais, éticas ou sobre o sentido da vida. Existem muitas tradições, com histórias e interpretações diferentes. Uma explicação imparcial descreve essas perspectivas sem afirmar que uma crença é superior às outras. No Brasil, a liberdade religiosa também protege o direito de não seguir uma religião.";
    }

    return `Para compreender "${texto}", é importante analisar o conceito, seu contexto histórico e as diferentes interpretações existentes. Em política e religião, as respostas podem variar conforme a época, a sociedade e a perspectiva analisada. Uma boa análise compara fontes confiáveis e distingue fatos de opiniões.

Esta é uma resposta demonstrativa do protótipo. O site ainda não está conectado a uma inteligência artificial real.`;
}

function enviarPergunta(texto) {
    perguntaAtual = texto;

    mensagens.push({
        tipo: "user",
        texto: texto
    });

    mensagens.push({
        tipo: "ai",
        texto: "Pensando na sua pergunta..."
    });

    renderizar();

    setTimeout(() => {
        const resposta = gerarResposta(texto);

        mensagens[mensagens.length - 1].texto = resposta;

        resultadoAtual = {
            pergunta: texto,
            resposta: resposta,
            tema: tema,
            data: new Date().toLocaleDateString("pt-BR")
        };

        perguntas.unshift(resultadoAtual);
        perguntas = perguntas.slice(0, 100);
        salvarDados();

        renderizar();
    }, 500);
}

function resultado() {
    if (!resultadoAtual && perguntas.length) {
        resultadoAtual = perguntas[0];
    }

    if (!resultadoAtual) {
        return layout(`
            <h1 class="page-title">Resultado detalhado</h1>
            <p class="muted">Faça uma pergunta para ver a resposta aqui.</p>
            <button class="primary" onclick="ir('temas')">Fazer pergunta</button>
        `);
    }

    return layout(`
        <p class="greeting">
            ${escapar(resultadoAtual.tema)} · ${escapar(resultadoAtual.data)}
        </p>

        <h1 class="page-title">${escapar(resultadoAtual.pergunta)}</h1>

        <div class="resultblock">
            <h3>💡 Explicação simples</h3>
            <p>${escapar(resultadoAtual.resposta)}</p>
        </div>

        <div class="resultblock">
            <h3>📚 Explicação detalhada</h3>
            <p>${escapar(resultadoAtual.resposta)}</p>
            <p class="muted small">
                Consulte fontes especializadas para aprofundar o assunto.
            </p>
        </div>

        <div class="resultblock">
            <h3>🔎 Termos importantes</h3>
            <p><b>Contexto:</b> circunstâncias históricas e sociais.</p>
            <p><b>Perspectiva:</b> ponto de vista utilizado na análise.</p>
            <p><b>Fonte:</b> material que permite verificar informações.</p>
        </div>

        <div class="actions">
            <button class="primary" onclick="salvarResposta()">☆ Salvar resposta</button>
            <button class="secondary" onclick="ir('fontes')">Ver fontes</button>
            <button class="secondary" onclick="ir('chat')">Nova pergunta</button>
        </div>
    `);
}

function fontes() {
    return layout(`
        <h1 class="page-title">Fontes e referências</h1>

        <p class="muted">
            Consulte materiais confiáveis para aprofundar seus estudos.
        </p>

        <div class="source">
            <b>Legislação e documentos oficiais</b>
            <p class="muted">Constituição Federal e legislação brasileira.</p>
            <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
               target="_blank" rel="noopener">
                Constituição Federal — Planalto ↗
            </a>
        </div>

        <div class="source">
            <b>Instituições públicas</b>
            <p class="muted">Informações e publicações do governo brasileiro.</p>
            <a href="https://www.gov.br/" target="_blank" rel="noopener">
                Portal Gov.br ↗
            </a>
        </div>

        <div class="source">
            <b>Pesquisa e educação</b>
            <p class="muted">Artigos e publicações acadêmicas.</p>
            <a href="https://www.scielo.br/" target="_blank" rel="noopener">
                SciELO Brasil ↗
            </a>
        </div>

        <div class="source">
            <b>Estudo das religiões</b>
            <p class="muted">
                Consulte livros acadêmicos e materiais das próprias tradições,
                observando autoria e contexto.
            </p>
        </div>

        <p class="muted small">
            Estes são exemplos de fontes para consulta, não uma lista de
            referências automaticamente utilizadas nas respostas.
        </p>
    `);
}

function historico() {
    const lista = abaHistorico === "perguntas" ? perguntas : quizzes;

    return layout(`
        <h1 class="page-title">Histórico</h1>

        <div class="chips">
            <button class="chip ${abaHistorico === "perguntas" ? "active" : ""}"
                onclick="abaHistorico='perguntas';ir('historico')">
                Perguntas
            </button>

            <button class="chip ${abaHistorico === "quizzes" ? "active" : ""}"
                onclick="abaHistorico='quizzes';ir('historico')">
                Quizzes
            </button>
        </div>

        ${lista.length
            ? lista.map((item, i) => abaHistorico === "perguntas"
                ? `
                    <div class="listitem">
                        <div>
                            <b>${escapar(item.pergunta)}</b>
                            <p class="muted small">
                                ${escapar(item.tema)} · ${escapar(item.data)}
                            </p>
                        </div>
                        <button class="secondary" onclick="abrirPergunta(${i})">
                            Abrir
                        </button>
                    </div>
                `
                : `
                    <div class="listitem">
                        <div>
                            <b>Quiz de ${escapar(item.tema)}</b>
                            <p class="muted small">
                                ${escapar(item.data)} · ${item.acertos}/${item.total} acertos
                            </p>
                        </div>
                        <button class="secondary" onclick="abrirRevisao(${i})">
                            Revisar
                        </button>
                    </div>
                `
            ).join("")
            : `
                <div class="resultblock">
                    <h3>Nada por aqui ainda</h3>
                    <p class="muted">
                        Seu histórico aparecerá aqui quando você fizer perguntas
                        ou concluir quizzes.
                    </p>
                </div>
            `
        }
    `);
}

function abrirPergunta(indicePergunta) {
    resultadoAtual = perguntas[indicePergunta];
    ir("resultado");
}

function salvos() {
    return layout(`
        <h1 class="page-title">Respostas salvas</h1>

        ${salvas.length
            ? salvas.map((item, i) => `
                <div class="listitem">
                    <div>
                        <b>${escapar(item.pergunta)}</b>
                        <p class="muted small">
                            ${escapar(item.tema)} · ${escapar(item.data)}
                        </p>
                    </div>

                    <div>
                        <button class="secondary" onclick="abrirSalva(${i})">
                            Abrir
                        </button>
                        <button class="textlink" onclick="removerSalva(${i})">
                            Remover
                        </button>
                    </div>
                </div>
            `).join("")
            : `
                <div class="resultblock">
                    <h3>Você ainda não salvou respostas</h3>
                    <p class="muted">
                        Salve uma explicação para consultar depois.
                    </p>
                </div>
            `
        }
    `);
}

function salvarResposta() {
    if (!resultadoAtual) return;

    const existe = salvas.some(item =>
        item.pergunta === resultadoAtual.pergunta &&
        item.data === resultadoAtual.data
    );

    if (!existe) {
        salvas.unshift(resultadoAtual);
        salvarDados();
    }

    renderizar();
}

function abrirSalva(i) {
    resultadoAtual = salvas[i];
    ir("resultado");
}

function removerSalva(i) {
    salvas.splice(i, 1);
    salvarDados();
    renderizar();
}

function perfil() {
    return layout(`
        <h1 class="page-title">Perfil</h1>

        <div class="resultblock">
            <div class="star">♙</div>
            <h2>${escapar(usuario?.nome || "Estudante")}</h2>
            <p class="muted">${escapar(usuario?.email || "")}</p>
        </div>

        <div class="grid3">
            <div class="stat">
                <strong>${perguntas.length}</strong>
                <span class="muted small">Perguntas</span>
            </div>

            <div class="stat">
                <strong>${salvas.length}</strong>
                <span class="muted small">Salvas</span>
            </div>

            <div class="stat">
                <strong>${quizzes.length}</strong>
                <span class="muted small">Quizzes</span>
            </div>
        </div>

        <div class="section">
            <button class="card" style="width:100%" onclick="ir('sobre')">
                💡 Sobre o projeto
                <p>Conheça a proposta do Entenda.AI.</p>
            </button>
        </div>

        <button class="secondary" onclick="sair()">Sair da conta</button>
    `);
}

function sobre() {
    return layout(`
        <h1 class="page-title">Sobre o Entenda.AI</h1>

        <div class="resultblock">
            <h3>Conhecimento claro, responsável e imparcial</h3>
            <p>
                O Entenda.AI é um projeto educacional criado para ajudar
                estudantes a compreender política e religião com explicações
                simples, organizadas e respeitosas.
            </p>
            <p>
                O objetivo não é defender partidos, candidatos, religiões ou
                ideologias. A proposta é apresentar contexto e diferentes
                perspectivas, incentivando a aprendizagem.
            </p>
        </div>

        <div class="grid2">
            <div class="card">
                <span class="emoji">⚖️</span>
                <h3>Imparcialidade</h3>
                <p>Separar informação, interpretação e opinião.</p>
            </div>

            <div class="card">
                <span class="emoji">📚</span>
                <h3>Aprendizagem</h3>
                <p>Conteúdo simples e incentivo à pesquisa.</p>
            </div>

            <div class="card">
                <span class="emoji">🌎</span>
                <h3>Respeito</h3>
                <p>Reconhecer a diversidade de crenças e ideias.</p>
            </div>

            <div class="card">
                <span class="emoji">🧠</span>
                <h3>Quiz interativo</h3>
                <p>Aprender e revisar conceitos de forma prática.</p>
            </div>
        </div>

        <p class="muted small">
            Protótipo desenvolvido com HTML, CSS e JavaScript.
            O projeto poderá receber uma API e banco de dados futuramente.
        </p>
    `);
}

function cadastrar(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmarSenha").value;

    if (senha !== confirmar) {
        alert("As senhas não são iguais.");
        return;
    }

    usuario = { nome, email, senha };
    salvarDados();
    ir("dashboard");
}

function entrar(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (usuario && usuario.email === email && usuario.senha === senha) {
        ir("dashboard");
    } else {
        alert("Conta não encontrada neste navegador. Faça o cadastro primeiro.");
    }
}

function sair() {
    usuario = null;
    localStorage.removeItem("usuario");
    ir("landing");
}

function configurarQuiz() {
    const assuntosPolitica = [
        "Geral", "Democracia", "Eleições",
        "Três poderes", "Direitos humanos", "Governo"
    ];

    const assuntosReligiao = [
        "Geral", "Cristianismo", "Islamismo",
        "Budismo", "Hinduísmo", "Diversidade religiosa"
    ];

    const assuntos = config.tema === "Política"
        ? assuntosPolitica
        : assuntosReligiao;

    return layout(`
        <h1 class="page-title">Configure seu quiz</h1>
        <p class="muted">Escolha como quer testar seus conhecimentos.</p>

        <div class="resultblock">
            <h3>1. Tema</h3>

            <div class="chips">
                <button class="chip ${config.tema === "Política" ? "active" : ""}"
                    onclick="mudarConfig('tema','Política')">
                    🏛️ Política
                </button>

                <button class="chip ${config.tema === "Religião" ? "active" : ""}"
                    onclick="mudarConfig('tema','Religião')">
                    ✨ Religião
                </button>
            </div>

            <h3>2. Assunto específico</h3>

            <div class="chips">
                ${assuntos.map(assunto => `
                    <button class="chip ${config.assunto === assunto ? "active" : ""}"
                        onclick="mudarConfig('assunto','${assunto}')">
                        ${assunto}
                    </button>
                `).join("")}
            </div>

            <h3>3. Número de questões</h3>

            <div class="optiongrid">
                ${[5, 10, 15].map(n => `
                    <button class="option ${config.quantidade === n ? "active" : ""}"
                        onclick="mudarConfig('quantidade',${n})">
                        ${n} questões
                    </button>
                `).join("")}
            </div>

            <h3>4. Dificuldade</h3>

            <div class="optiongrid">
                ${["Fácil", "Médio", "Difícil"].map(n => `
                    <button class="option ${config.dificuldade === n ? "active" : ""}"
                        onclick="mudarConfig('dificuldade','${n}')">
                        ${n}
                    </button>
                `).join("")}
            </div>

            <label class="formfield">
                <input type="checkbox" id="conteudoAtual">
                Incluir conteúdo atual (simulação)
            </label>

            <button class="primary full" onclick="iniciarQuiz()">
                Começar quiz →
            </button>
        </div>
    `);
}

function mudarConfig(chave, valor) {
    config[chave] = valor;
    renderizar();
}

function iniciarQuiz() {
    const disponiveis = bancoQuestoes.filter(q => q.tema === config.tema);

    questoes = [];

    for (let i = 0; i < config.quantidade; i++) {
        questoes.push({
            ...disponiveis[i % disponiveis.length]
        });
    }

    indice = 0;
    selecionada = -1;
    acertos = 0;
    revisao = [];
    inicioQuiz = Date.now();
    ultimoQuiz = null;

    ir("quiz");
}

function quiz() {
    const q = questoes[indice];

    return layout(`
        <p class="greeting">
            Quiz de ${escapar(config.tema)} · ${escapar(config.dificuldade)}
        </p>

        <h1 class="page-title">
            Questão ${indice + 1} de ${questoes.length}
        </h1>

        <div class="progress">
            <div class="progressbar"
                style="width:${indice / questoes.length * 100}%">
            </div>
        </div>

        <div class="resultblock">
            <h2>${escapar(q.pergunta)}</h2>

            ${q.alternativas.map((alternativa, i) => `
                <button class="answer-option ${selecionada === i ? "selected" : ""}"
                    onclick="selecionarAlternativa(${i})">
                    <b>${"ABCD"[i]}.</b>
                    ${escapar(alternativa)}
                </button>
            `).join("")}

            <button class="primary full" onclick="responderQuiz()"
                ${selecionada < 0 ? "disabled" : ""}>
                Responder
            </button>
        </div>
    `);
}

function selecionarAlternativa(i) {
    selecionada = i;
    renderizar();
}

function responderQuiz() {
    if (selecionada < 0) return;

    const q = questoes[indice];
    const acertou = selecionada === q.correta;

    if (acertou) acertos++;

    revisao.push({
        pergunta: q.pergunta,
        alternativas: q.alternativas,
        escolhida: selecionada,
        correta: q.correta,
        explicacao: q.explicacao,
        acertou
    });

    ir("feedback");
}

function feedback() {
    const r = revisao[revisao.length - 1];

    return layout(`
        <p class="greeting">
            Questão ${indice + 1} de ${questoes.length}
        </p>

        <h1 class="page-title">
            ${r.acertou ? "Resposta correta!" : "Vamos aprender com essa resposta"}
        </h1>

        <div class="resultblock">
            ${r.alternativas.map((a, i) => `
                <div class="answer-option
                    ${i === r.correta ? "correct" : ""}
                    ${i === r.escolhida && !r.acertou ? "wrong" : ""}">
                    ${"ABCD"[i]}. ${escapar(a)}
                    ${i === r.correta ? " ✓" : ""}
                </div>
            `).join("")}

            <h3 class="${r.acertou ? "good" : "danger"}">
                ${r.acertou ? "Muito bem!" : "A alternativa correta está destacada."}
            </h3>

            <p>${escapar(r.explicacao)}</p>

            <p class="muted small">
                Em temas complexos, diferentes perspectivas podem existir.
            </p>

            <button class="primary full" onclick="proximaQuestao()">
                ${indice === questoes.length - 1 ? "Ver resultado" : "Próxima questão →"}
            </button>
        </div>
    `);
}

function proximaQuestao() {
    indice++;
    selecionada = -1;

    if (indice >= questoes.length) {
        const tempo = Math.round((Date.now() - inicioQuiz) / 1000);

        ultimoQuiz = {
            tema: config.tema,
            acertos,
            total: questoes.length,
            porcentagem: Math.round(acertos / questoes.length * 100),
            data: new Date().toLocaleDateString("pt-BR"),
            tempo,
            revisao
        };

        quizzes.unshift(ultimoQuiz);
        quizzes = quizzes.slice(0, 50);
        salvarDados();
        ir("resultadoQuiz");
    } else {
        ir("quiz");
    }
}

function resultadoQuiz() {
    const r = ultimoQuiz || quizzes[0];

    if (!r) return layout("<h1>Nenhum resultado disponível.</h1>");

    return layout(`
        <h1 class="page-title">Resultado do quiz</h1>

        <div class="resultblock" style="text-align:center">
            <p class="muted">Quiz de ${escapar(r.tema)}</p>

            <div class="score-ring">${r.porcentagem}%</div>

            <h2>
                ${r.porcentagem >= 80
                    ? "Excelente trabalho!"
                    : r.porcentagem >= 50
                        ? "Bom progresso!"
                        : "Continue praticando!"
                }
            </h2>

            <p class="muted">
                Cada tentativa é uma oportunidade de aprender.
            </p>

            <div class="statrow">
                <div class="stat">
                    <strong>${r.acertos}</strong>
                    <span class="muted small">Acertos</span>
                </div>

                <div class="stat">
                    <strong>${r.total - r.acertos}</strong>
                    <span class="muted small">Erros</span>
                </div>

                <div class="stat">
                    <strong>${Math.floor(r.tempo / 60)}m ${r.tempo % 60}s</strong>
                    <span class="muted small">Tempo</span>
                </div>
            </div>

            <button class="primary full" onclick="ir('revisaoQuiz')">
                Revisar respostas
            </button>

            <button class="secondary full" onclick="ir('configQuiz')">
                Jogar novamente
            </button>
        </div>
    `);
}

function revisaoQuiz() {
    const r = ultimoQuiz || quizzes[0];

    if (!r) {
        return layout(`
            <h1 class="page-title">Revisão de respostas</h1>
            <p class="muted">Finalize um quiz para revisar suas respostas.</p>
        `);
    }

    return layout(`
        <h1 class="page-title">Revisão de respostas</h1>
        <p class="muted">${r.acertos}/${r.total} acertos · ${escapar(r.tema)}</p>

        ${r.revisao.map((q, i) => `
            <div class="resultblock">
                <h3>${i + 1}. ${escapar(q.pergunta)}</h3>

                ${q.alternativas.map((a, j) => `
                    <div class="answer-option
                        ${j === q.correta ? "correct" : ""}
                        ${j === q.escolhida && !q.acertou ? "wrong" : ""}">
                        ${"ABCD"[j]}. ${escapar(a)}
                        ${j === q.correta ? "✓" : ""}
                        ${j === q.escolhida ? "(sua resposta)" : ""}
                    </div>
                `).join("")}

                <p>${escapar(q.explicacao)}</p>
            </div>
        `).join("")}

        <button class="primary" onclick="ir('configQuiz')">
            Novo quiz
        </button>
    `);
}

function abrirRevisao(i) {
    ultimoQuiz = quizzes[i];
    ir("revisaoQuiz");
}

function renderizar() {
    const telas = {
        landing,
        cadastro,
        login,
        dashboard,
        temas,
        chat,
        resultado,
        fontes,
        historico,
        salvos,
        perfil,
        sobre,
        configQuiz: configurarQuiz,
        quiz,
        feedback,
        resultadoQuiz,
        revisaoQuiz
    };

    app.innerHTML = (telas[tela] || landing)();

    if (tela === "chat") {
        const caixa = document.getElementById("mensagens");

        if (caixa) {
            caixa.scrollTop = caixa.scrollHeight;
        }
    }
}

renderizar();
