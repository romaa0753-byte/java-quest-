const stage = document.querySelector('#stage');
const questionCount = document.querySelector('#question-count');
const scoreLabel = document.querySelector('#score-label');
const progressFill = document.querySelector('#progress-fill');
const questionCategory = document.querySelector('#question-category');
const questionTitle = document.querySelector('#question-title');
const questionCode = document.querySelector('#question-code');
const roundLabel = document.querySelector('#round-label');
const answersContainer = document.querySelector('#answers');
const feedback = document.querySelector('#feedback');
const nextButton = document.querySelector('#next-button');
const questionView = document.querySelector('#question-view');
const result = document.querySelector('#result');
const resultScore = document.querySelector('#result-score');
const resultMessage = document.querySelector('#result-message');
const reviewList = document.querySelector('#review-list');
const restartButton = document.querySelector('#restart-button');
const timerLabel = document.querySelector('#timer-label');
const timeoutOverlay = document.querySelector('#timeout-overlay');

const questions = [
	{
		category: 'Fundamentos',
		text: 'Qual palavra-chave é usada para criar uma classe em Java?',
		options: ['function', 'class', 'define', 'new'],
		answer: 1,
		explanation: 'A palavra-chave class declara uma classe em Java.'
	},
	{
		category: 'Tipos',
		text: 'Qual destes tipos guarda um número inteiro?',
		options: ['String', 'boolean', 'int', 'double'],
		answer: 2,
		explanation: 'int representa números inteiros, como 7 ou -12.'
	},
	{
		category: 'Saída',
		text: 'Qual comando mostra texto no console?',
		options: ['System.out.println()', 'Console.write()', 'print.line()', 'echo()'],
		answer: 0,
		explanation: 'System.out.println() imprime o conteúdo e pula para a próxima linha.'
	},
	{
		category: 'Conceitos',
		text: 'Qual valor uma variável boolean pode armazenar?',
		options: ['Qualquer texto', 'true ou false', 'Apenas números', 'Uma lista de valores'],
		answer: 1,
		explanation: 'O tipo boolean só aceita true ou false.'
	},
	{
		category: 'Repetição',
		text: 'Qual estrutura repete um bloco enquanto uma condição for verdadeira?',
		options: ['if', 'class', 'while', 'import'],
		answer: 2,
		explanation: 'O laço while continua executando enquanto a condição for verdadeira.'
	},
	{
		category: 'Arrays',
		text: 'Qual é o índice do primeiro elemento de um array?',
		options: ['0', '1', '-1', 'Depende do tamanho'],
		answer: 0,
		explanation: 'Em Java, os índices de arrays começam em zero.'
	},
	{
		category: 'Métodos',
		text: 'Qual palavra indica que um método não retorna valor?',
		options: ['null', 'empty', 'static', 'void'],
		answer: 3,
		explanation: 'void indica que o método termina sem retornar um valor.'
	},
	{
		category: 'Objetos',
		text: 'Qual palavra-chave cria uma nova instância de uma classe?',
		options: ['this', 'new', 'make', 'instance'],
		answer: 1,
		explanation: 'A palavra-chave new cria um objeto a partir de uma classe.'
	},
	{
		category: 'POO • Encapsulamento',
		text: 'Sobre encapsulamento em Java, qual alternativa está correta?',
		options: [
			'Todos os atributos ficam acessíveis diretamente por qualquer classe.',
			'Esconder detalhes internos e controlar o acesso aos dados, geralmente com private.',
			'Criar herança entre classes.',
			'Impedir que uma classe tenha métodos públicos.',
			'Permitir que uma classe herde de várias classes ao mesmo tempo.'
		],
		answer: 1,
		explanation: 'Encapsulamento protege o estado interno e controla o acesso, por exemplo usando atributos private e métodos públicos.'
	},
	{
		category: 'POO • Polimorfismo',
		text: 'Qual conceito de POO é demonstrado principalmente pelo código?',
		code: 'class Animal {\n    void emitirSom() {\n        System.out.println("Som do animal");\n    }\n}\n\nclass Cachorro extends Animal {\n    @Override\n    void emitirSom() {\n        System.out.println("Au au");\n    }\n}',
		options: ['Encapsulamento', 'Abstração', 'Polimorfismo por sobrescrita de método', 'Sobrecarga de métodos', 'Composição'],
		answer: 2,
		explanation: 'Cachorro sobrescreve emitirSom() de Animal. Isso é polimorfismo por sobrescrita de método.'
	},
	{
		category: 'POO • Abstração',
		text: 'Qual é a principal diferença entre uma classe abstrata e uma interface em Java?',
		options: [
			'Uma classe abstrata não pode possuir métodos, enquanto uma interface pode.',
			'Uma interface pode ser instanciada diretamente, enquanto uma classe abstrata não pode.',
			'Uma classe abstrata pode possuir estado e métodos concretos, enquanto uma interface define principalmente um contrato.',
			'Uma classe pode herdar de várias classes abstratas ao mesmo tempo.',
			'Interfaces não podem ser implementadas por classes.'
		],
		answer: 2,
		explanation: 'Uma classe abstrata pode manter estado e implementar métodos; uma interface define um contrato que classes podem implementar.'
	}
];

const firstScreenQuestionCount = 8;
let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswers = [];
let timerInterval;
let timeoutReset;
let secondsRemaining = 10;

function startQuestionTimer() {
	clearInterval(timerInterval);
	secondsRemaining = 10;
	timerLabel.textContent = `TEMPO: ${secondsRemaining}s`;
	timerLabel.classList.remove('urgent');
	timerInterval = setInterval(() => {
		secondsRemaining--;
		timerLabel.textContent = `TEMPO: ${secondsRemaining}s`;
		if (secondsRemaining <= 3) timerLabel.classList.add('urgent');
		if (secondsRemaining === 0) handleTimeout();
	}, 1000);
}

function handleTimeout() {
	clearInterval(timerInterval);
	answered = true;
	timeoutOverlay.hidden = false;
	timeoutReset = setTimeout(() => {
		timeoutOverlay.hidden = true;
		startGame();
	}, 2500);
}

function renderQuestion() {
	const question = questions[currentQuestion];
	const isSecondScreen = currentQuestion >= firstScreenQuestionCount;
	const screenQuestionIndex = isSecondScreen ? currentQuestion - firstScreenQuestionCount : currentQuestion;
	const screenQuestionCount = isSecondScreen ? questions.length - firstScreenQuestionCount : firstScreenQuestionCount;
	answered = false;
	questionCount.textContent = `TELA ${isSecondScreen ? 2 : 1}/2 • PERGUNTA ${screenQuestionIndex + 1} DE ${screenQuestionCount}`;
	roundLabel.textContent = `Etapa ${isSecondScreen ? 2 : 1}/2`;
	scoreLabel.textContent = `PONTOS: ${score}`;
	progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
	questionCategory.textContent = question.category;
	questionTitle.textContent = question.text;
	questionCode.textContent = question.code || '';
	questionCode.hidden = !question.code;
	feedback.className = 'feedback';
	feedback.textContent = '';
	nextButton.classList.remove('visible');
	answersContainer.replaceChildren();

	question.options.forEach((option, index) => {
		const button = document.createElement('button');
		const key = document.createElement('span');
		const label = document.createElement('span');
		button.type = 'button';
		button.className = 'answer-button';
		key.className = 'answer-key';
		key.textContent = String.fromCharCode(65 + index);
		label.textContent = option;
		button.append(key, label);
		button.addEventListener('click', () => selectAnswer(index));
		answersContainer.append(button);
	});
	startQuestionTimer();
}

function selectAnswer(selectedIndex) {
	if (answered) return;
	answered = true;
	clearInterval(timerInterval);
	selectedAnswers[currentQuestion] = selectedIndex;
	const question = questions[currentQuestion];
	const answerButtons = answersContainer.querySelectorAll('.answer-button');
	answerButtons.forEach((button, index) => {
		button.disabled = true;
		if (index === question.answer) button.classList.add('correct');
	});

	if (selectedIndex === question.answer) {
		score++;
		feedback.classList.add('correct');
		feedback.innerHTML = `<strong>Acertou, miserável!</strong>${question.explanation}<img class="feedback-meme" src="ftof/transferir.jpeg" alt="Meme: acertou, miserável!">`;
	} else {
		answerButtons[selectedIndex].classList.add('incorrect');
		feedback.classList.add('wrong');
		feedback.innerHTML = `<strong>Errou!</strong>${question.explanation}<img class="feedback-meme" src="ftof/images.jpeg" alt="Meme: errou!">`;
	}
	scoreLabel.textContent = `PONTOS: ${score}`;
	nextButton.textContent = currentQuestion === questions.length - 1 ? 'Ver resultado →' : 'Próxima →';
	nextButton.classList.add('visible');
}

function addReviewItem(question, index) {
	const item = document.createElement('article');
	const heading = document.createElement('h3');
	const selected = selectedAnswers[index];
	const yourAnswer = document.createElement('p');
	const correctAnswer = document.createElement('p');
	const explanation = document.createElement('p');
	const wasCorrect = selected === question.answer;

	item.className = `review-item ${wasCorrect ? 'review-correct' : 'review-wrong'}`;
	heading.textContent = `${String(index + 1).padStart(2, '0')}. ${question.text}`;
	yourAnswer.className = 'review-answer';
	yourAnswer.textContent = `Sua resposta: ${String.fromCharCode(65 + selected)}. ${question.options[selected]}`;
	correctAnswer.className = 'review-answer';
	correctAnswer.textContent = `Resposta correta: ${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}`;
	explanation.className = 'review-explanation';
	explanation.textContent = `Explicação: ${question.explanation}`;
	item.append(heading, yourAnswer, correctAnswer, explanation);
	return item;
}

function showResult() {
	clearInterval(timerInterval);
	questionView.hidden = true;
	result.classList.add('visible');
	progressFill.style.width = '100%';
	questionCount.textContent = 'DESAFIO CONCLUÍDO';
	roundLabel.textContent = 'Resultado';
	resultScore.textContent = `${score}/${questions.length}`;
	resultMessage.textContent = score === questions.length
		? 'Perfeito! Você domina os fundamentos e conceitos de POO em Java.'
		: score >= Math.ceil(questions.length * 0.6)
			? 'Mandou bem! Continue praticando para dominar Java.'
			: 'Boa tentativa! Confira as explicações e jogue novamente para praticar.';
	reviewList.replaceChildren(...questions.map(addReviewItem));
}

function startGame() {
	clearTimeout(timeoutReset);
	timeoutOverlay.hidden = true;
	for (let index = questions.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[questions[index], questions[randomIndex]] = [questions[randomIndex], questions[index]];
	}
	currentQuestion = 0;
	score = 0;
	selectedAnswers = [];
	questionView.hidden = false;
	result.classList.remove('visible');
	stage.classList.add('playing');
	renderQuestion();
}

function advanceQuestion() {
	if (currentQuestion === questions.length - 1) {
		showResult();
		return;
	}
	currentQuestion++;
	renderQuestion();
}

restartButton.addEventListener('click', startGame);
nextButton.addEventListener('click', advanceQuestion);
startGame();
