// Conteúdo do curso: módulos, lições e questões.
// kind 'mc'   -> múltipla escolha  { prompt, options[], answer(index), explain }
// kind 'fill' -> preencher lacuna  { prompt, answers[](aceitas), explain }

export const MODULES = [
  {
    id: 'm1',
    icon: "⌘",
    title: "Primeiros passos",
    description: "O que é back-end, a sintaxe do PHP e o servidor embutido.",
    lessons: [
      {
        id: 'm1-l1',
        title: "O que é back-end (e onde o PHP entra)",
        blocks: [
          { type: 'text', html: "<p>Quando você abre um site, o seu navegador faz um <strong>pedido</strong> (a requisição) para um computador lá longe, o <strong>servidor</strong>. O servidor monta a resposta e devolve uma página. Tudo o que roda no seu navegador é o <em>front-end</em> (HTML, CSS e JavaScript). Tudo o que roda no servidor, antes da página sair de lá, é o <strong>back-end</strong>. É aqui que o PHP mora.</p>" },
          { type: 'text', html: "<p>O PHP serve para montar a página <strong>na hora do pedido</strong>: mostrar o nome de quem entrou, buscar produtos no banco de dados, conferir uma senha. O navegador nunca vê o código PHP, só o HTML que ele produziu.</p>" },
          { type: 'code', code: `<?php
// o servidor monta a página na hora: cada visita pode ser diferente
$hora = (int) date('H');
if ($hora < 12) {
    $saudacao = 'Bom dia';
} else {
    $saudacao = 'Boa noite';
}
echo "<h1>$saudacao, filhote!</h1>";
echo '<p>Esta página foi montada às ' . date('H:i') . '.</p>';` },
          { type: 'text', html: "<p>Abra essa página às 9h e às 20h: o arquivo é o mesmo, mas o HTML que chega ao navegador muda. Clique com o botão direito em <em>Exibir código-fonte</em> e procure o PHP: ele não está lá. Só sobrou o resultado.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Onde o código PHP é executado?", options: ["No navegador do aluno", "No servidor, antes de a página ser enviada", "No banco de dados", "No editor de código"], answer: 1, explain: "O PHP roda no servidor. O navegador recebe só o HTML que ele produziu." } },
          { type: 'question', q: { kind: 'mc', prompt: "O que o navegador recebe de uma página PHP?", options: ["O código PHP completo", "Só o HTML gerado pelo PHP", "Um arquivo .exe", "Nada, o PHP abre sozinho"], answer: 1, explain: "O código fica no servidor; o navegador recebe o resultado em HTML." } },
        ],
      },
      {
        id: 'm1-l2',
        title: 'Sintaxe básica e comentários',
        blocks: [
          { type: 'text', html: '<p>PHP (<em>PHP: Hypertext Preprocessor</em>) é uma linguagem de script executada no <strong>servidor</strong>: o código roda antes da página chegar ao navegador, que recebe apenas o HTML resultante. Arquivos PHP geralmente usam a extensão <code class="inline">.php</code> e podem misturar HTML com blocos de código.</p>' },
          { type: 'text', html: '<p>O código PHP fica delimitado pelas tags <code class="inline">&lt;?php</code> e <code class="inline">?&gt;</code>. Tudo que estiver fora dessas tags é tratado como HTML puro e enviado direto ao navegador. Cada instrução (comando) termina com ponto e vírgula <code class="inline">;</code> — esquecer o <code class="inline">;</code> é um dos erros mais comuns de quem está começando.</p>' },
          { type: 'code', code: `<?php
    // Isso é um comentário de uma linha
    # Este também é um comentário válido (menos comum)
    /* Comentários
       de múltiplas linhas
       são úteis para explicações maiores */

    echo "Olá, mundo!";
?>` },
          { type: 'text', html: '<p>Para exibir conteúdo na tela usamos <code class="inline">echo</code> (o mais comum, aceita várias expressões separadas por vírgula) ou <code class="inline">print</code> (aceita apenas uma expressão e retorna sempre <code class="inline">1</code>). Existe ainda a forma curta <code class="inline">&lt;?= $variavel ?&gt;</code>, equivalente a <code class="inline">&lt;?php echo $variavel; ?&gt;</code>, muito usada ao misturar PHP com HTML em templates.</p>' },
          { type: 'code', code: `<!-- Misturando HTML com PHP: comum em páginas dinâmicas -->
<!DOCTYPE html>
<html>
<body>
    <h1><?= "Bem-vindo(a) ao curso!" ?></h1>
    <?php
        echo "<p>Hoje é um ótimo dia para aprender PHP.</p>";
    ?>
</body>
</html>` },
          { type: 'text', html: '<p>Boas práticas de estilo: indente o código de forma consistente, use nomes descritivos e prefira <code class="inline">&lt;?php ?&gt;</code> completo em vez da tag curta <code class="inline">&lt;? ?&gt;</code> (que pode vir desabilitada em alguns servidores).</p>' },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual símbolo abre um bloco de código PHP?', options: ['<?php', '<script php>', '<%php%>', '#php'], answer: 0, explain: 'Todo bloco de código PHP começa com a tag <?php e, opcionalmente, termina com ?>.' } },
          { type: 'question', q: { kind: 'fill', prompt: 'Complete o comando para exibir um texto: ____ "Bem-vindo!";', answers: ['echo', 'print'], explain: 'Tanto echo quanto print exibem conteúdo na tela.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'O que acontece se você esquecer o ";" ao final de uma instrução?', options: ['Nada, é opcional', 'Erro de sintaxe (parse error)', 'PHP adiciona automaticamente', 'A página fica mais rápida'], answer: 1, explain: 'O ponto e vírgula é obrigatório para separar instruções; sem ele o PHP gera um erro de sintaxe.' } },
        ],
      },
      {
        id: 'm1-l3',
        title: "Rodando PHP no seu computador",
        blocks: [
          { type: 'text', html: "<p>O PHP tem um servidor embutido, feito para desenvolver. Você não precisa ligar o Apache nem instalar nada a mais: abra o terminal na pasta do projeto e digite o comando abaixo. Depois, abra o endereço no navegador.</p>" },
          { type: 'code', code: `# na pasta do projeto
php -S localhost:8000

# no laboratório, o PHP que vem com o XAMPP também serve:
C:\\xampp\\php\\php.exe -S localhost:8000

# depois, no navegador:
# http://localhost:8000/index.php` },
          { type: 'text', html: "<p>O terminal fica \"preso\" enquanto o servidor está ligado: é normal. Para desligar, aperte <code class=\"inline\">Ctrl + C</code>. Se preferir o jeito antigo, também dá para colocar a pasta dentro de <code class=\"inline\">C:\\xampp\\htdocs</code> e ligar o Apache no painel do XAMPP.</p>" },
          { type: 'text', html: "<p>Deu erro? Leia a mensagem até o fim: ela diz o arquivo e a linha. <code class=\"inline\">Parse error: syntax error ... on line 7</code> quase sempre é um <code class=\"inline\">;</code> ou uma chave <code class=\"inline\">}</code> esquecida na linha 7 ou logo antes dela.</p>" },
          { type: 'question', q: { kind: 'fill', prompt: "Complete o comando que liga o servidor embutido do PHP na porta 8000: php __ localhost:8000", answers: ["-S", "-s"], explain: "php -S localhost:8000 liga o servidor embutido." } },
          { type: 'question', q: { kind: 'mc', prompt: "A mensagem \"Parse error ... on line 7\" indica:", options: ["Que o computador está sem internet", "Um erro de sintaxe na linha 7 (ou logo antes dela)", "Que o banco de dados caiu", "Que o navegador é antigo"], answer: 1, explain: "Parse error é erro de escrita do código. A linha indicada é o melhor lugar para começar a procurar." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Onde o código PHP é executado?", options: ["No navegador", "No servidor", "No banco de dados", "No HTML"], answer: 1, explain: "O PHP roda no servidor e entrega HTML ao navegador." },
      { kind: 'mc', prompt: 'Qual tag fecha um bloco de código PHP?', options: ['?>', '</php>', '%>', '--%>'], answer: 0, explain: 'O bloco PHP é fechado com ?>.' },
      { kind: 'fill', prompt: "Qual comando, digitado no terminal, liga o servidor embutido do PHP? (só a opção, ex.: -X)", answers: ["-S", "php -S", "php -S localhost:8000"], explain: "php -S localhost:8000." },
      { kind: 'mc', prompt: "Para desligar o servidor embutido no terminal, você aperta:", options: ["Ctrl + C", "Ctrl + Z", "Esc", "F5"], answer: 0, explain: "Ctrl + C interrompe o servidor." },
    ],
  },
  {
    id: 'm2',
    icon: "◇",
    title: "Dados: tipos, variáveis e operadores",
    description: "Tipos de dados, variáveis, constantes, expressões e operadores.",
    lessons: [
      {
        id: 'm2-l1',
        title: 'Tipos de dados',
        blocks: [
          { type: 'text', html: '<p>PHP possui <strong>tipagem dinâmica</strong>: você não declara o tipo da variável, ele é definido automaticamente pelo valor atribuído (e pode mudar ao longo da execução). Os tipos escalares principais são:</p><ul><li><code class="inline">string</code> — texto, entre aspas simples <code class="inline">\'...\'</code> ou duplas <code class="inline">"..."</code> (duplas permitem interpolação de variáveis);</li><li><code class="inline">int</code> — números inteiros, positivos ou negativos;</li><li><code class="inline">float</code> (ou <code class="inline">double</code>) — números com casas decimais;</li><li><code class="inline">bool</code> — apenas <code class="inline">true</code> ou <code class="inline">false</code>;</li><li><code class="inline">array</code> — coleções de valores (indexadas ou associativas);</li><li><code class="inline">null</code> — ausência de valor.</li></ul>' },
          { type: 'code', code: `<?php
    var_dump("Senac");   // string(5) "Senac"
    var_dump(2026);      // int(2026)
    var_dump(3.14);      // float(3.14)
    var_dump(true);      // bool(true)
    var_dump(null);      // NULL
    var_dump([1, 2, 3]); // array(3) { ... }
?>` },
          { type: 'text', html: '<p>A função <code class="inline">gettype($valor)</code> retorna o tipo de uma variável como texto, e <code class="inline">var_dump()</code> mostra o tipo junto com o valor — ótimo para depuração. Já as funções <code class="inline">is_int()</code>, <code class="inline">is_string()</code>, <code class="inline">is_array()</code>, entre outras, testam se um valor é de determinado tipo e retornam <code class="inline">bool</code>.</p>' },
          { type: 'code', code: `<?php
    $preco = "9.90";       // string
    $precoNum = (float) $preco;  // conversão explícita (cast) para float

    var_dump($preco);      // string(4) "9.90"
    var_dump($precoNum);   // float(9.9)

    echo "9" + 1;          // 10  -> PHP converte "9" para número automaticamente
?>` },
          { type: 'text', html: '<p>Esse último exemplo mostra a <strong>conversão automática de tipos</strong> (type juggling): ao somar uma string numérica com um inteiro, o PHP converte a string para número antes de calcular. Já arrays podem ser <em>indexados</em> (<code class="inline">["a", "b", "c"]</code>, acessados por posição 0, 1, 2...) ou <em>associativos</em> (<code class="inline">["nome" => "Ana", "idade" => 20]</code>, acessados por chave).</p>' },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual é o tipo do valor 3.14 em PHP?', options: ['int', 'float', 'string', 'bool'], answer: 1, explain: 'Números com casas decimais são do tipo float (ou double).' } },
          { type: 'question', q: { kind: 'mc', prompt: 'O que var_dump(10 > 5) exibe?', options: ['int(1)', 'bool(true)', '"true"', 'bool(false)'], answer: 1, explain: 'Expressões de comparação sempre resultam em um valor booleano.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual função converte um valor para inteiro explicitamente?', options: ['(int) $valor', 'to_int($valor)', 'int($valor)', 'cast_int($valor)'], answer: 0, explain: 'O cast (int) na frente do valor converte para inteiro.' } },
        ],
      },
      {
        id: 'm2-l2',
        title: 'Variáveis',
        blocks: [
          { type: 'text', html: '<p>Variáveis em PHP sempre começam com <code class="inline">$</code>, são <strong>case-sensitive</strong> (<code class="inline">$nome</code> e <code class="inline">$Nome</code> são variáveis diferentes) e não precisam declarar tipo — basta atribuir um valor com <code class="inline">=</code>.</p>' },
          { type: 'code', code: `<?php
    $nome = "Ana";
    $idade = 20;

    echo "$nome tem $idade anos.";          // interpolação simples
    echo "{$nome} tem {$idade} anos.";      // interpolação com chaves (mais segura)
    echo $nome . " tem " . $idade . " anos."; // concatenação
?>` },
          { type: 'text', html: '<p>Nomes de variáveis devem começar com letra ou <code class="inline">_</code>, seguidos de letras, números ou <code class="inline">_</code> (nunca podem começar com número). Use nomes descritivos: <code class="inline">$idadeAluno</code> é muito melhor que <code class="inline">$x</code>.</p>' },
          { type: 'text', html: '<p>Para valores que não devem mudar durante a execução, use constantes: <code class="inline">define("PI", 3.14)</code> ou, na sintaxe moderna, <code class="inline">const PI = 3.14;</code>. Diferente de variáveis, constantes não usam <code class="inline">$</code> e não podem ser redefinidas.</p>' },
          { type: 'code', code: `<?php
    const MAX_TENTATIVAS = 3;
    define("NOME_CURSO", "Programação WEB II");

    echo MAX_TENTATIVAS;   // 3
    echo NOME_CURSO;       // Programação WEB II
?>` },
          { type: 'text', html: '<p>As funções <code class="inline">isset($var)</code> (verifica se a variável existe e não é null), <code class="inline">empty($var)</code> (verifica se está "vazia": "", 0, null, false...) e <code class="inline">unset($var)</code> (remove a variável) são muito usadas para validar dados, por exemplo vindos de formulários.</p>' },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual nome de variável é inválido em PHP?', options: ['$idade1', '$_total', '$1nome', '$Nome_Completo'], answer: 2, explain: 'Nomes de variáveis não podem começar com número.' } },
          { type: 'question', q: { kind: 'fill', prompt: 'Qual é a saída de: $a = "Ana"; echo "Oi, $a!";', answers: ['Oi, Ana!'], explain: 'A interpolação de variáveis dentro de aspas duplas substitui $a pelo seu valor.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'Como declaramos uma constante na sintaxe moderna do PHP?', options: ['$const NOME = valor;', 'const NOME = valor;', 'constant NOME = valor;', 'final NOME = valor;'], answer: 1, explain: 'A palavra-chave const declara uma constante, sem usar $.' } },
        ],
      },
      {
        id: 'm2-l3',
        title: 'Expressões e operadores',
        blocks: [
          { type: 'text', html: '<p>Operadores aritméticos: <code class="inline">+ - * / % **</code> (soma, subtração, multiplicação, divisão, resto e potência). Operadores de atribuição compostos combinam operação e atribuição: <code class="inline">+= -= *= /= .=</code>.</p>' },
          { type: 'code', code: `<?php
    $x = 10;
    $x += 5;   // equivale a $x = $x + 5;  -> 15
    $x -= 3;   // 12
    $x *= 2;   // 24
    echo $x;   // 24

    $y = 2;
    echo $y ** 3;  // 8 (2 elevado a 3)
    echo 10 % 3;   // 1 (resto da divisão)
?>` },
          { type: 'text', html: '<p>Operadores de comparação: <code class="inline">== != &lt; &gt; &lt;= &gt;=</code> e os operadores <strong>estritos</strong> <code class="inline">=== / !==</code>, que também comparam o <strong>tipo</strong> do valor, não só o conteúdo. Existe ainda o operador nave espacial <code class="inline">&lt;=&gt;</code>, que retorna -1, 0 ou 1.</p>' },
          { type: 'code', code: `<?php
    var_dump("5" == 5);   // true  (mesmo valor, tipos diferentes ignorados)
    var_dump("5" === 5);  // false (string vs int)
    var_dump(1 <=> 2);    // -1 (1 é menor que 2)
?>` },
          { type: 'text', html: '<p>Operadores lógicos: <code class="inline">&& (e)</code>, <code class="inline">|| (ou)</code>, <code class="inline">! (não)</code>. Concatenação de strings: <code class="inline">.</code>. O operador ternário <code class="inline">condição ? seVerdadeiro : seFalso</code> substitui um if/else simples, e o de coalescência nula <code class="inline">??</code> retorna o valor da esquerda se ele existir e não for null, senão retorna o da direita.</p>' },
          { type: 'code', code: `<?php
    $idade = 20;
    $status = ($idade >= 18) ? "maior de idade" : "menor de idade";
    echo $status;  // maior de idade

    $apelido = $_GET['apelido'] ?? "visitante"; // valor padrão seguro
    echo $apelido;
?>` },
          { type: 'text', html: '<p>Fique atento à <strong>precedência de operadores</strong>: multiplicação e divisão são calculadas antes de soma e subtração, e a concatenação <code class="inline">.</code> tem prioridade menor que os operadores aritméticos. Use parênteses <code class="inline">()</code> sempre que tiver dúvida, para deixar a ordem explícita.</p>' },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual expressão retorna true?', options: ['"5" === 5', '5 === 5', '5 === "5"', 'null === 0'], answer: 1, explain: '=== compara valor E tipo; 5 e 5 são ambos int.' } },
          { type: 'question', q: { kind: 'fill', prompt: 'Qual o resultado de: echo 10 % 3;', answers: ['1'], explain: 'O operador % retorna o resto da divisão: 10 dividido por 3 dá resto 1.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'O que faz o operador ??  em "$nome = $dado ?? \'sem nome\';"?', options: ['Soma dois valores', 'Retorna $dado se ele não for null, senão "sem nome"', 'Sempre retorna "sem nome"', 'Gera um erro'], answer: 1, explain: 'O operador de coalescência nula ?? retorna o primeiro valor não-null.' } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: 'Qual função exibe o tipo e o valor de uma variável?', options: ['gettype()', 'var_dump()', 'typeof()', 'print_type()'], answer: 1, explain: 'var_dump() mostra tipo e valor.' },
      { kind: 'mc', prompt: 'Variáveis em PHP são:', options: ['Case-sensitive', 'Case-insensitive', 'Sempre maiúsculas', 'Precisam de tipo declarado'], answer: 0, explain: '$nome e $Nome são variáveis diferentes.' },
      { kind: 'fill', prompt: 'Qual operador compara valor e tipo ao mesmo tempo (estrito)?', answers: ['===', 'operador ==='], explain: 'O operador === (idêntico) compara valor e tipo.' },
      { kind: 'mc', prompt: 'echo 2 + 3 . "x"; produz:', options: ['5x', '23x', 'Erro', '2 3 x'], answer: 0, explain: 'A soma 2+3 é calculada primeiro (5) e depois concatenada com "x".' },
      { kind: 'mc', prompt: 'Qual é o tipo retornado por uma expressão de comparação, como 5 > 2?', options: ['int', 'string', 'bool', 'float'], answer: 2, explain: 'Comparações sempre resultam em true ou false (bool).' },
      { kind: 'fill', prompt: 'Qual palavra-chave declara uma constante na sintaxe moderna do PHP (sem usar $)?', answers: ['const'], explain: 'const NOME = valor; declara uma constante.' },
    ],
  },
  {
    id: 'm3',
    icon: "◆",
    title: "Decisões e repetições",
    description: "Condicionais e laços de repetição.",
    lessons: [
      {
        id: 'm3-l1',
        title: 'Condicionais',
        blocks: [
          { type: 'text', html: '<p>Use <code class="inline">if</code>, <code class="inline">elseif</code> e <code class="inline">else</code> para tomar decisões com base em condições. Cada condição é avaliada como <code class="inline">bool</code>; valores como <code class="inline">0</code>, <code class="inline">""</code>, <code class="inline">"0"</code>, <code class="inline">null</code> e arrays vazios são considerados "falsos" (falsy).</p>' },
          { type: 'code', code: `<?php
    $nota = 6;

    if ($nota >= 7) {
        echo "Aprovado";
    } elseif ($nota >= 5) {
        echo "Recuperação";
    } else {
        echo "Reprovado";
    }
?>` },
          { type: 'question', q: { kind: 'mc', prompt: 'No código acima, qual é a saída quando $nota = 6?', options: ['Aprovado', 'Recuperação', 'Reprovado', 'Nenhuma saída'], answer: 1, explain: '6 não é >= 7, mas é >= 5, então cai no elseif.' } },
          { type: 'text', html: '<p>Você pode combinar múltiplas condições com operadores lógicos, e condições podem ser aninhadas (um <code class="inline">if</code> dentro de outro):</p>' },
          { type: 'code', code: `<?php
    $idade = 20;
    $temCarteira = true;

    if ($idade >= 18) {
        if ($temCarteira) {
            echo "Pode dirigir";
        } else {
            echo "Precisa tirar a carteira";
        }
    } else {
        echo "Ainda não pode dirigir";
    }
?>` },
          { type: 'text', html: '<p>Ao misturar PHP com HTML, existe uma <strong>sintaxe alternativa</strong> para condicionais, mais legível em templates: <code class="inline">if(...): ... elseif(...): ... else: ... endif;</code></p>' },
          { type: 'code', code: `<?php if ($nota >= 7): ?>
    <p>Aprovado</p>
<?php else: ?>
    <p>Reprovado</p>
<?php endif; ?>` },
          { type: 'text', html: '<p>Quando há muitos valores possíveis para uma mesma variável, o <code class="inline">switch</code> deixa o código mais organizado que vários <code class="inline">elseif</code>. Não esqueça do <code class="inline">break</code> em cada <code class="inline">case</code> — sem ele, a execução "cai" para o próximo caso (fall-through).</p>' },
          { type: 'code', code: `<?php
    $dia = 3;

    switch ($dia) {
        case 1:
            echo "Segunda";
            break;
        case 3:
            echo "Quarta";
            break;
        default:
            echo "Outro dia";
    }
?>` },
          { type: 'question', q: { kind: 'fill', prompt: 'No switch acima, o que é impresso?', answers: ['Quarta'], explain: '$dia vale 3, correspondendo ao case 3.' } },
          { type: 'text', html: '<p>A partir do PHP 8, existe também o <code class="inline">match</code>, uma alternativa mais moderna e segura ao <code class="inline">switch</code>: ele usa comparação estrita (<code class="inline">===</code>) e não precisa de <code class="inline">break</code>.</p>' },
          { type: 'code', code: `<?php
    $dia = 3;

    $nome = match ($dia) {
        1 => "Segunda",
        3 => "Quarta",
        default => "Outro dia",
    };

    echo $nome; // Quarta
?>` },
          { type: 'question', q: { kind: 'mc', prompt: 'O que acontece se um "case" do switch não tiver "break"?', options: ['Erro de sintaxe', 'A execução continua no próximo case (fall-through)', 'O switch para imediatamente', 'É ignorado'], answer: 1, explain: 'Sem break, o PHP continua executando os cases seguintes até encontrar um break ou o fim do switch.' } },
        ],
      },
      {
        id: 'm3-l2',
        title: 'Laços de repetição',
        blocks: [
          { type: 'text', html: '<p>O <code class="inline">for</code> repete um número conhecido de vezes (usa inicialização, condição e incremento); o <code class="inline">while</code> repete <strong>enquanto</strong> uma condição for verdadeira, testada antes de cada repetição; o <code class="inline">do-while</code> é parecido, mas testa a condição <strong>depois</strong>, garantindo ao menos uma execução.</p>' },
          { type: 'code', code: `<?php
    for ($i = 1; $i <= 3; $i++) {
        echo $i;
    }
    // Saída: 123
?>` },
          { type: 'code', code: `<?php
    $contador = 0;
    while ($contador < 3) {
        echo $contador;
        $contador++;
    }
    // Saída: 012
?>` },
          { type: 'code', code: `<?php
    $senha = "";
    do {
        $senha = "1234"; // simula uma leitura de entrada
        echo "Tentando validar senha...\\n";
    } while ($senha === "");
    // O bloco do executa ao menos uma vez, mesmo que a condição já comece falsa
?>` },
          { type: 'text', html: '<p>O <code class="inline">foreach</code> percorre arrays sem precisar controlar índice manualmente. Ele também pode capturar a chave junto com o valor, usando <code class="inline">as $chave => $valor</code>:</p>' },
          { type: 'code', code: `<?php
    $frutas = ["maçã", "banana", "uva"];
    foreach ($frutas as $fruta) {
        echo $fruta . " ";
    }
    // Saída: maçã banana uva

    $precos = ["maçã" => 3.5, "banana" => 2.0];
    foreach ($precos as $nome => $preco) {
        echo "$nome custa R$ $preco\\n";
    }
?>` },
          { type: 'text', html: '<p>É possível também aninhar laços (um dentro do outro), muito usado para percorrer tabelas ou matrizes:</p>' },
          { type: 'code', code: `<?php
    for ($linha = 1; $linha <= 2; $linha++) {
        for ($coluna = 1; $coluna <= 2; $coluna++) {
            echo "($linha,$coluna) ";
        }
    }
    // Saída: (1,1) (1,2) (2,1) (2,2)
?>` },
          { type: 'text', html: '<p><code class="inline">break</code> interrompe totalmente o laço mais próximo; <code class="inline">continue</code> pula o restante da iteração atual e vai para a próxima. Cuidado com <strong>laços infinitos</strong>: sempre garanta que a condição de parada será alcançada (por exemplo, incrementando a variável de controle).</p>' },
          { type: 'question', q: { kind: 'mc', prompt: 'Quantas vezes o laço "for ($i=0; $i<5; $i++)" executa?', options: ['4', '5', '6', 'Infinitas'], answer: 1, explain: 'i vai de 0 a 4, totalizando 5 repetições.' } },
          { type: 'question', q: { kind: 'fill', prompt: 'Qual comando interrompe totalmente um laço?', answers: ['break'], explain: 'break encerra o laço imediatamente.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'Qual a principal diferença entre while e do-while?', options: ['Não há diferença', 'do-while sempre executa ao menos uma vez', 'while é mais rápido', 'do-while não aceita condições'], answer: 1, explain: 'O do-while testa a condição após executar o bloco, garantindo ao menos uma execução.' } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: 'Qual estrutura é ideal para percorrer um array?', options: ['switch', 'foreach', 'if', 'const'], answer: 1, explain: 'foreach foi criado para percorrer arrays.' },
      { kind: 'mc', prompt: 'O que "continue" faz dentro de um laço?', options: ['Encerra o script', 'Pula para a próxima iteração', 'Reinicia o laço do zero', 'Encerra o laço'], answer: 1, explain: 'continue pula o restante do bloco atual e vai para a próxima repetição.' },
      { kind: 'fill', prompt: 'Complete: "____ ($i = 0; $i < 10; $i++) { ... }" — qual estrutura é essa?', answers: ['for'], explain: 'O for usa inicialização, condição e incremento.' },
      { kind: 'mc', prompt: 'Em um switch, o que acontece se nenhum case bater e não houver default?', options: ['Erro fatal', 'Nada é executado', 'Executa o primeiro case', 'Loop infinito'], answer: 1, explain: 'Sem default e sem match, o switch simplesmente não executa nada.' },
      { kind: 'mc', prompt: 'Qual laço garante ao menos uma execução, mesmo com condição falsa?', options: ['while', 'for', 'do-while', 'foreach'], answer: 2, explain: 'do-while testa a condição somente após executar o bloco uma vez.' },
      { kind: 'mc', prompt: 'Qual sintaxe permite capturar chave e valor ao percorrer um array associativo?', options: ['foreach ($arr as $v)', 'foreach ($arr as $k => $v)', 'for ($arr as $k, $v)', 'while ($arr as $k => $v)'], answer: 1, explain: 'foreach ($arr as $chave => $valor) captura ambos.' },
      { kind: 'mc', prompt: 'A partir do PHP 8, qual estrutura moderna substitui o switch com comparação estrita e sem "break"?', options: ['match', 'case', 'select', 'when'], answer: 0, explain: 'O match usa === e não precisa de break.' },
    ],
  },
  {
    id: 'm4',
    icon: "▲",
    title: "Funções",
    description: "Declaração, parâmetros, retorno e reaproveitamento de código.",
    lessons: [
      {
        id: 'm4-l1',
        title: 'Declarando e usando funções',
        blocks: [
          { type: 'text', html: '<p>Funções agrupam código reutilizável sob um nome. Declaramos com <code class="inline">function</code>, podemos receber parâmetros (com valores padrão opcionais) e devolver um resultado com <code class="inline">return</code>. Uma função só executa quando é <strong>chamada</strong> pelo nome, seguida de parênteses.</p>' },
          { type: 'code', code: `<?php
    function saudacao($nome = "visitante") {
        return "Olá, $nome!";
    }

    echo saudacao("Maria");  // Olá, Maria!
    echo saudacao();         // Olá, visitante!
?>` },
          { type: 'question', q: { kind: 'mc', prompt: 'O que "echo saudacao();" imprime, sem argumento?', options: ['Olá, !', 'Olá, visitante!', 'Erro', 'Olá, null!'], answer: 1, explain: 'O parâmetro $nome tem valor padrão "visitante".' } },
          { type: 'text', html: '<p>Desde o PHP 7, é possível indicar o <strong>tipo esperado</strong> dos parâmetros e do retorno (type hints), o que ajuda a evitar erros e deixa o código autoexplicativo:</p>' },
          { type: 'code', code: `<?php
    function somar(int $a, int $b): int {
        return $a + $b;
    }

    echo somar(4, 6); // 10
?>` },
          { type: 'text', html: '<p>Funções podem receber uma quantidade variável de argumentos usando <code class="inline">...$args</code> (variádicos), e podem receber parâmetros <strong>por referência</strong> com <code class="inline">&$var</code>, permitindo alterar o valor original fora da função:</p>' },
          { type: 'code', code: `<?php
    function somarTudo(...$numeros) {
        return array_sum($numeros);
    }
    echo somarTudo(1, 2, 3, 4); // 10

    function dobrar(&$numero) {
        $numero = $numero * 2;
    }
    $valor = 5;
    dobrar($valor);
    echo $valor; // 10 (foi alterado dentro da função)
?>` },
          { type: 'text', html: '<p>Também existem <strong>funções anônimas</strong> (closures) e a forma curta <em>arrow function</em> <code class="inline">fn</code>, úteis para passar pequenas lógicas como argumento (ex.: em <code class="inline">array_map</code>):</p>' },
          { type: 'code', code: `<?php
    $dobro = fn($n) => $n * 2;
    echo $dobro(5); // 10

    $numeros = [1, 2, 3];
    $dobrados = array_map(fn($n) => $n * 2, $numeros);
    print_r($dobrados); // [2, 4, 6]
?>` },
          { type: 'question', q: { kind: 'fill', prompt: 'Qual palavra-chave define uma função em PHP?', answers: ['function'], explain: 'Toda função começa com a palavra-chave function.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'Como indicamos que um parâmetro deve ser passado por referência?', options: ['*$var', '&$var', '#$var', '@$var'], answer: 1, explain: 'O símbolo & antes do parâmetro faz a função alterar a variável original.' } },
        ],
      },
      {
        id: 'm4-l2',
        title: 'Escopo e reaproveitamento de código',
        blocks: [
          { type: 'text', html: '<p>Variáveis criadas dentro de uma função têm <strong>escopo local</strong>: elas não existem fora da função, e variáveis externas não são visíveis automaticamente dentro dela — isso evita que uma parte do código interfira acidentalmente em outra.</p>' },
          { type: 'code', code: `<?php
    function soma($a, $b) {
        $resultado = $a + $b;
        return $resultado;
    }

    $total = soma(4, 6);
    echo $total;  // 10
    // echo $resultado; // Erro: $resultado não existe fora da função
?>` },
          { type: 'text', html: '<p>Se realmente precisar acessar uma variável global dentro de uma função, use a palavra-chave <code class="inline">global</code> — mas use com moderação, pois dificulta entender de onde vêm os valores:</p>' },
          { type: 'code', code: `<?php
    $contadorGlobal = 0;

    function incrementar() {
        global $contadorGlobal;
        $contadorGlobal++;
    }

    incrementar();
    incrementar();
    echo $contadorGlobal; // 2
?>` },
          { type: 'text', html: '<p>Uma variável declarada como <code class="inline">static</code> dentro de uma função <strong>mantém seu valor</strong> entre chamadas diferentes, ao contrário das variáveis locais comuns que são recriadas a cada chamada:</p>' },
          { type: 'code', code: `<?php
    function contarChamadas() {
        static $vezes = 0;
        $vezes++;
        echo "Chamada número $vezes\\n";
    }

    contarChamadas(); // Chamada número 1
    contarChamadas(); // Chamada número 2
?>` },
          { type: 'text', html: '<p>Dividir um programa em funções — e até em vários arquivos, usando <code class="inline">require</code>/<code class="inline">include</code> (ou as versões <code class="inline">require_once</code>/<code class="inline">include_once</code>, que evitam importar o mesmo arquivo duas vezes) — facilita testes, leitura e reaproveitamento. Essa é a ideia central da <strong>modularização</strong>: cada função resolve uma pequena parte do problema, e o programa principal apenas combina essas partes.</p>' },
          { type: 'code', code: `<?php
    // arquivo: funcoes.php
    function calcularMedia($notas) {
        return array_sum($notas) / count($notas);
    }
?>

<?php
    // arquivo: index.php
    require_once "funcoes.php";

    $notas = [7, 8, 9];
    echo calcularMedia($notas); // 8
?>` },
          { type: 'question', q: { kind: 'mc', prompt: 'Por que usar funções ao invés de repetir código?', options: ['Deixa o código mais lento', 'Facilita reuso e manutenção', 'É obrigatório em PHP', 'Não faz diferença'], answer: 1, explain: 'Funções evitam repetição e tornam o código mais organizado e fácil de manter.' } },
          { type: 'question', q: { kind: 'fill', prompt: 'Qual comando "importa" o código de outro arquivo PHP?', answers: ['require', 'include', 'require_once', 'include_once'], explain: 'require e include (e suas variações _once) incluem código de outros arquivos.' } },
          { type: 'question', q: { kind: 'mc', prompt: 'O que uma variável "static" dentro de uma função faz?', options: ['É apagada a cada chamada', 'Mantém seu valor entre chamadas diferentes', 'Vira uma constante', 'Só funciona fora de funções'], answer: 1, explain: 'Variáveis static preservam seu valor de uma chamada para a próxima.' } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: 'O que uma função retorna se não houver "return"?', options: ['0', 'false', 'null', 'Erro de sintaxe'], answer: 2, explain: 'Sem return explícito, a função retorna null.' },
      { kind: 'mc', prompt: 'Parâmetros com valor padrão são úteis para:', options: ['Obrigar o uso de todos os argumentos', 'Permitir chamar a função sem passar aquele argumento', 'Impedir o uso da função', 'Nada, é só estilo'], answer: 1, explain: 'Valores padrão tornam o argumento opcional.' },
      { kind: 'fill', prompt: 'Como se chama o conjunto de variáveis visíveis somente dentro da função?', answers: ['escopo local', 'escopo', 'local'], explain: 'É o escopo local da função.' },
      { kind: 'mc', prompt: 'Qual das opções melhor descreve "modularização"?', options: ['Escrever tudo em um único bloco', 'Separar o programa em partes reutilizáveis (como funções)', 'Usar apenas variáveis globais', 'Evitar comentários'], answer: 1, explain: 'Modularizar é dividir em partes menores e reutilizáveis.' },
      { kind: 'mc', prompt: 'function dobro($n) { return $n * 2; } — echo dobro(5); imprime:', options: ['5', '10', '52', 'Erro'], answer: 1, explain: '5 * 2 = 10.' },
      { kind: 'mc', prompt: 'Qual palavra-chave permite acessar uma variável global dentro de uma função?', options: ['global', 'static', 'public', 'extern'], answer: 0, explain: 'global $var traz a variável do escopo global para dentro da função.' },
      { kind: 'mc', prompt: 'Qual sintaxe representa uma arrow function (função anônima curta)?', options: ['fn($n) => $n * 2', 'function($n) -> $n * 2', 'arrow($n) => $n * 2', 'lambda($n): $n * 2'], answer: 0, explain: 'fn($param) => expressão é a sintaxe de arrow function do PHP.' },
    ],
  },
  {
    id: 'm5',
    icon: "✉",
    title: "Formulários",
    description: "Do HTML ao PHP: $_POST, validação e segurança.",
    lessons: [
      {
        id: 'm5-l1',
        title: "Do formulário ao PHP",
        blocks: [
          { type: 'text', html: "<p>O formulário é a porta de entrada do sistema. Para os dados chegarem ao PHP, duas coisas no HTML são obrigatórias: o <code class=\"inline\">method</code> do <code class=\"inline\">&lt;form&gt;</code> e o <code class=\"inline\">name</code> de cada campo. É pelo <code class=\"inline\">name</code> que o PHP encontra o valor; o <code class=\"inline\">id</code> é do <code class=\"inline\">&lt;label&gt;</code> e do CSS.</p>" },
          { type: 'code', code: `<form method="post">
  <label for="nome">Nome</label>
  <input id="nome" name="nome">

  <label for="email">E-mail</label>
  <input id="email" name="email" type="email">

  <button type="submit">Cadastrar</button>
</form>` },
          { type: 'text', html: "<p>Com <code class=\"inline\">method=\"post\"</code>, os dados vão no corpo do pedido e chegam em <code class=\"inline\">$_POST</code>. Com <code class=\"inline\">method=\"get\"</code>, eles aparecem no endereço (<code class=\"inline\">?nome=Ana</code>) e chegam em <code class=\"inline\">$_GET</code>: bom para buscas, péssimo para senhas.</p>" },
          { type: 'code', code: `<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ?? '' evita erro se o campo não vier
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    echo "Recebi: $nome ($email)";
}` },
          { type: 'text', html: "<p>O <code class=\"inline\">REQUEST_METHOD</code> confere se o formulário foi mesmo enviado: na primeira visita, a página só mostra o formulário. O <code class=\"inline\">trim()</code> tira os espaços do começo e do fim. Tudo o que chega do formulário é texto, até os números.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Um campo sem o atributo name...", options: ["Chega ao PHP com o valor do id", "Não chega ao PHP", "Chega vazio, mas existe", "Gera um erro na tela"], answer: 1, explain: "Sem name, o navegador não envia o campo. Ele simplesmente some." } },
          { type: 'question', q: { kind: 'fill', prompt: "Com method=\"post\", os dados chegam na variável ____ (escreva com o cifrão)", answers: ["$_POST", "$_post"], explain: "Os dados de um formulário com method=\"post\" chegam em $_POST." } },
          { type: 'question', q: { kind: 'mc', prompt: "Para uma tela de busca, que pode ser salva nos favoritos com o termo pesquisado, o melhor método é:", options: ["post", "get", "put", "tanto faz"], answer: 1, explain: "Com get, o termo fica no endereço e a busca pode ser compartilhada." } },
        ],
      },
      {
        id: 'm5-l2',
        title: "Validar antes de usar",
        blocks: [
          { type: 'text', html: "<p>Dado de usuário é suspeito até prova em contrário: espaço em branco, nome de uma letra, e-mail sem arroba. Antes de gravar, confira. Uma função que devolve a <strong>lista de erros</strong> deixa o resto do código simples: lista vazia quer dizer que está tudo certo.</p>" },
          { type: 'code', code: `<?php
function validarCliente(string $nome, string $email): array
{
    $erros = [];
    if (strlen($nome) < 3) {
        $erros[] = 'O nome precisa de pelo menos 3 letras.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erros[] = 'Digite um e-mail válido.';
    }
    return $erros;
}

$erros = validarCliente('Al', 'semarroba');
// $erros tem as duas mensagens` },
          { type: 'text', html: "<p>O <code class=\"inline\">filter_var()</code> já conhece o formato de e-mail, URL e número: não precisa inventar a regra. E a validação do HTML (<code class=\"inline\">required</code>, <code class=\"inline\">type=\"email\"</code>) ajuda o usuário, mas não protege nada: qualquer um consegue enviar um pedido sem passar pelo formulário. A conferência de verdade é a do PHP.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Qual função confere se um texto tem o formato de e-mail?", options: ["is_email()", "filter_var($email, FILTER_VALIDATE_EMAIL)", "check_mail()", "strlen($email)"], answer: 1, explain: "filter_var com FILTER_VALIDATE_EMAIL valida o formato." } },
          { type: 'question', q: { kind: 'mc', prompt: "Se o formulário tem required no HTML, preciso validar no PHP?", options: ["Não, o HTML já garante", "Sim: o HTML ajuda o usuário, mas o pedido pode chegar sem passar pelo formulário", "Só se for senha", "Só no MySQL"], answer: 1, explain: "A validação no servidor é a que vale." } },
        ],
      },
      {
        id: 'm5-l3',
        title: "Mostrar o erro e manter o que foi digitado",
        blocks: [
          { type: 'text', html: "<p>Quando der erro, a página volta com o aviso e com os campos preenchidos. Ninguém merece digitar tudo de novo. Para isso, o <code class=\"inline\">value</code> de cada campo recebe o que veio do <code class=\"inline\">$_POST</code>.</p>" },
          { type: 'code', code: `<?php foreach ($erros as $erro): ?>
  <p class="erro"><?= htmlspecialchars($erro) ?></p>
<?php endforeach; ?>

<input id="nome" name="nome"
       value="<?= htmlspecialchars($nome) ?>">` },
          { type: 'text', html: "<p>O <code class=\"inline\">htmlspecialchars()</code> é o cinto de segurança: ele mostra o texto como texto. Sem ele, quem digitar <code class=\"inline\">&lt;script&gt;</code> no nome muda a sua página. Esse ataque se chama <strong>XSS</strong>. Regra de bolso: mostrou na tela algo que veio do usuário? Passe pelo <code class=\"inline\">htmlspecialchars()</code>.</p>" },
          { type: 'code', code: `<?php
echo htmlspecialchars('<script>alert("oi")</script>');
// &lt;script&gt;alert(&quot;oi&quot;)&lt;/script&gt;` },
          { type: 'question', q: { kind: 'fill', prompt: "Qual função transforma < e > em texto seguro antes de mostrar na página?", answers: ["htmlspecialchars", "htmlspecialchars()"], explain: "htmlspecialchars() evita que o texto vire código na página." } },
          { type: 'question', q: { kind: 'mc', prompt: "O ataque em que alguém injeta script pelo formulário para rodar na página de outras pessoas se chama:", options: ["SQL injection", "XSS", "DDoS", "Phishing"], answer: 1, explain: "XSS (cross-site scripting)." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Qual atributo do campo define o nome com que o valor chega ao PHP?", options: ["id", "name", "class", "for"], answer: 1, explain: "O PHP lê pelo name." },
      { kind: 'mc', prompt: "Os dados de method=\"get\" aparecem:", options: ["No corpo do pedido", "No endereço da página", "No banco de dados", "No cookie"], answer: 1, explain: "Com get, os dados vão no endereço." },
      { kind: 'fill', prompt: "Qual função tira os espaços do começo e do fim de um texto?", answers: ["trim", "trim()"], explain: "trim() limpa as pontas." },
      { kind: 'mc', prompt: "Para conferir se o formulário foi enviado, testamos:", options: ["$_SERVER['REQUEST_METHOD'] === 'POST'", "isset($_GET['form'])", "empty($_POST) === false sempre", "nada, o PHP sabe sozinho"], answer: 0, explain: "REQUEST_METHOD diz como a página foi pedida." },
      { kind: 'mc', prompt: "htmlspecialchars() protege contra:", options: ["SQL injection", "XSS", "Senhas fracas", "Arquivos grandes"], answer: 1, explain: "Ele impede que texto do usuário vire HTML ou script." },
      { kind: 'mc', prompt: "Uma função de validação que devolve um array vazio significa:", options: ["Que deu erro", "Que os dados passaram em todas as regras", "Que o formulário não foi enviado", "Que o banco está vazio"], answer: 1, explain: "Sem erros na lista, os dados estão bons." },
    ],
  },
  {
    id: 'm6',
    icon: "▦",
    title: "Banco de dados com SQLite",
    description: "Tabelas, PDO e SQL na prática: criar, inserir e consultar.",
    lessons: [
      {
        id: 'm6-l1',
        title: "Por que um banco de dados?",
        blocks: [
          { type: 'text', html: "<p>Variável vive só enquanto a página está sendo montada. Recarregou, sumiu. Para o sistema lembrar do cliente amanhã, os dados precisam de um lugar que não esquece: o <strong>banco de dados</strong>.</p>" },
          { type: 'text', html: "<p>Um banco guarda <strong>tabelas</strong>. Pense numa planilha com regras: cada <strong>coluna</strong> é um campo (nome, e-mail, cidade) e cada <strong>linha</strong> é um registro (um cliente). A coluna <code class=\"inline\">id</code> numera as linhas sozinha, e a regra <code class=\"inline\">UNIQUE</code> impede dois clientes com o mesmo e-mail.</p>" },
          { type: 'text', html: "<p>Nesta disciplina usamos o <strong>SQLite</strong>: o banco inteiro é um arquivo (<code class=\"inline\">loja.sqlite</code>) e já vem com o PHP, sem servidor para ligar. A linguagem para conversar com ele é o <strong>SQL</strong>, a mesma do MySQL e de quase todos os bancos do mercado.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Numa tabela de clientes, cada linha representa:", options: ["Um campo, como o e-mail", "Um cliente", "Uma tabela inteira", "Um comando SQL"], answer: 1, explain: "Linha é registro: um cliente. Coluna é campo." } },
          { type: 'question', q: { kind: 'mc', prompt: "Por que o cadastro \"esquece\" o cliente sem banco de dados?", options: ["Porque o PHP é lento", "Porque variáveis só existem enquanto a página está sendo montada", "Porque o navegador apaga", "Porque falta CSS"], answer: 1, explain: "Sem gravar em algum lugar, os dados somem ao fim do pedido." } },
        ],
      },
      {
        id: 'm6-l2',
        title: "Conectar com PDO e criar a tabela",
        blocks: [
          { type: 'text', html: "<p>O <strong>PDO</strong> é o jeito do PHP conversar com bancos de dados. A conexão é um objeto: com ele você executa comandos SQL. O modo de erro com exceções faz o PHP avisar na hora quando um comando dá errado.</p>" },
          { type: 'code', code: `<?php
// abre (ou cria) o arquivo do banco
$pdo = new PDO('sqlite:' . __DIR__ . '/loja.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec('CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    cidade TEXT
)');

// no MySQL do XAMPP, só a conexão muda:
// new PDO('mysql:host=localhost;dbname=loja;charset=utf8mb4', 'root', '');` },
          { type: 'text', html: "<p>Guarde esse código num arquivo <code class=\"inline\">banco.php</code> e chame com <code class=\"inline\">require 'banco.php';</code> nas outras páginas. O <code class=\"inline\">IF NOT EXISTS</code> deixa rodar quantas vezes quiser: a tabela só é criada na primeira. E coloque o <code class=\"inline\">loja.sqlite</code> no <code class=\"inline\">.gitignore</code>: dado de cliente não vai para o GitHub.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "No SQLite, o banco de dados é:", options: ["Um servidor que precisa ser ligado", "Um arquivo", "Uma planilha do Excel", "Uma pasta do XAMPP"], answer: 1, explain: "O SQLite guarda tudo num arquivo só." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual regra da coluna impede dois clientes com o mesmo e-mail?", answers: ["UNIQUE", "unique"], explain: "UNIQUE não deixa repetir o valor." } },
          { type: 'question', q: { kind: 'mc', prompt: "Para trocar o SQLite pelo MySQL, o que muda no código com PDO?", options: ["Tudo", "Basicamente a linha de conexão", "Os comandos echo", "Nada, é impossível"], answer: 1, explain: "Com PDO, o resto do código fica quase igual." } },
        ],
      },
      {
        id: 'm6-l3',
        title: "SQL na prática: inserir e consultar",
        blocks: [
          { type: 'text', html: "<p>Para gravar, use <code class=\"inline\">prepare()</code> com marcadores (<code class=\"inline\">:nome</code>, <code class=\"inline\">:email</code>) e <code class=\"inline\">execute()</code> com os valores. Assim o banco nunca confunde o que o usuário digitou com um comando.</p>" },
          { type: 'code', code: `<?php
$sql = 'INSERT INTO clientes (nome, email, cidade)
        VALUES (:nome, :email, :cidade)';
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':nome' => 'Ana Souza',
    ':email' => 'ana@exemplo.com',
    ':cidade' => 'Brasília',
]);
echo 'Cliente número ' . $pdo->lastInsertId();` },
          { type: 'text', html: "<p><strong>Nunca</strong> cole <code class=\"inline\">$_POST</code> direto dentro do SQL. Se alguém digitar um pedaço de comando no formulário, ele roda no seu banco. Esse ataque é o <strong>SQL injection</strong>, e os marcadores do <code class=\"inline\">prepare()</code> fecham essa porta.</p>" },
          { type: 'text', html: "<p>Para consultar, o <code class=\"inline\">SELECT</code> escolhe as colunas, o <code class=\"inline\">WHERE</code> filtra as linhas e o <code class=\"inline\">ORDER BY</code> ordena. O <code class=\"inline\">fetchAll()</code> devolve um array, que você percorre com <code class=\"inline\">foreach</code>.</p>" },
          { type: 'code', code: `<?php
$sql = 'SELECT nome, email FROM clientes
        WHERE cidade = :cidade
        ORDER BY nome';
$stmt = $pdo->prepare($sql);
$stmt->execute([':cidade' => 'Brasília']);

foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $cliente) {
    echo htmlspecialchars($cliente['nome']) . '<br>';
}

// quantos clientes há na tabela?
echo $pdo->query('SELECT COUNT(*) FROM clientes')->fetchColumn();` },
          { type: 'question', q: { kind: 'mc', prompt: "Qual comando SQL grava uma linha nova na tabela?", options: ["SELECT", "INSERT", "UPDATE", "CREATE"], answer: 1, explain: "INSERT INTO ... VALUES (...) grava um registro." } },
          { type: 'question', q: { kind: 'mc', prompt: "Por que usar prepare() com marcadores em vez de colar a variável no SQL?", options: ["Fica mais bonito", "Evita SQL injection", "É obrigatório no SQLite", "Deixa o banco maior"], answer: 1, explain: "Os marcadores separam os dados do comando." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual parte do SELECT filtra as linhas? (uma palavra)", answers: ["WHERE", "where"], explain: "WHERE escolhe quais linhas entram no resultado." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Coluna e linha, numa tabela, são:", options: ["Registro e campo", "Campo e registro", "Banco e tabela", "Comando e resposta"], answer: 1, explain: "Coluna é campo; linha é registro." },
      { kind: 'mc', prompt: "O que faz CREATE TABLE IF NOT EXISTS?", options: ["Apaga a tabela", "Cria a tabela só se ela ainda não existir", "Mostra as tabelas", "Cria um banco novo sempre"], answer: 1, explain: "Pode rodar várias vezes sem erro." },
      { kind: 'mc', prompt: "SELECT nome FROM clientes ORDER BY nome devolve:", options: ["Os nomes em ordem alfabética", "Só o primeiro nome", "Os nomes do mais novo para o mais antigo", "Um erro"], answer: 0, explain: "ORDER BY nome ordena de A a Z." },
      { kind: 'fill', prompt: "Qual método do PDO prepara um comando com marcadores, antes do execute()?", answers: ["prepare", "prepare()"], explain: "prepare() monta o comando seguro." },
      { kind: 'mc', prompt: "O ataque em que o usuário injeta comandos pelo formulário para rodar no banco se chama:", options: ["XSS", "SQL injection", "Phishing", "Spam"], answer: 1, explain: "SQL injection, evitado com prepare() e marcadores." },
      { kind: 'mc', prompt: "Onde o arquivo loja.sqlite deve ficar fora do GitHub?", options: ["Em lugar nenhum, ele deve ir", "No .gitignore", "No README", "No index.php"], answer: 1, explain: "Dados de clientes não vão para o repositório." },
    ],
  },
  {
    id: 'm7',
    icon: "✎",
    title: "CRUD completo",
    description: "Listar, alterar e excluir: o cadastro inteiro, do C ao D.",
    lessons: [
      {
        id: 'm7-l1',
        title: "Listar com ações",
        blocks: [
          { type: 'text', html: "<p><strong>CRUD</strong> é o apelido das quatro operações de quase todo sistema: <em>Create</em> (cadastrar), <em>Read</em> (listar e consultar), <em>Update</em> (alterar) e <em>Delete</em> (excluir). O cadastro já sabe as duas primeiras. Agora a lista ganha um link de ação em cada linha, levando o <code class=\"inline\">id</code> do cliente no endereço.</p>" },
          { type: 'code', code: `<?php foreach ($clientes as $cliente): ?>
  <tr>
    <td><?= htmlspecialchars($cliente['nome']) ?></td>
    <td><?= htmlspecialchars($cliente['email']) ?></td>
    <td><a href="editar.php?id=<?= $cliente['id'] ?>">Editar</a></td>
  </tr>
<?php endforeach; ?>` },
          { type: 'text', html: "<p>Na página <code class=\"inline\">editar.php</code>, o <code class=\"inline\">id</code> chega em <code class=\"inline\">$_GET</code>, como texto. O <code class=\"inline\">(int)</code> transforma em número e descarta o resto: <code class=\"inline\">(int) '7; DROP TABLE'</code> vira <code class=\"inline\">7</code>. Depois, busque o cliente e trate o caso de ele não existir.</p>" },
          { type: 'code', code: `<?php
require_once __DIR__ . '/banco.php';

$id = (int) ($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM clientes WHERE id = :id');
$stmt->execute([':id' => $id]);
$cliente = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$cliente) {
    http_response_code(404);
    exit('Cliente não encontrado.');
}` },
          { type: 'question', q: { kind: 'mc', prompt: "No CRUD, a letra U corresponde a:", options: ["Usar", "Update (alterar)", "Upload", "Unir tabelas"], answer: 1, explain: "Create, Read, Update, Delete." } },
          { type: 'question', q: { kind: 'mc', prompt: "O que (int) faz com o texto \"12abc\"?", options: ["Dá erro", "Vira 12", "Vira 0", "Continua \"12abc\""], answer: 1, explain: "O cast para int pega o número do começo e descarta o resto." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual método do PDO devolve uma única linha do resultado?", answers: ["fetch", "fetch()"], explain: "fetch() devolve uma linha; fetchAll() devolve todas." } },
        ],
      },
      {
        id: 'm7-l2',
        title: "Alterar com UPDATE",
        blocks: [
          { type: 'text', html: "<p>A tela de edição é o formulário de cadastro com os campos já preenchidos com os dados do banco. Ao enviar, o <code class=\"inline\">UPDATE</code> troca os valores <strong>daquela</strong> linha, que é escolhida pelo <code class=\"inline\">WHERE id = :id</code>.</p>" },
          { type: 'code', code: `<?php
$sql = 'UPDATE clientes
        SET nome = :nome, email = :email, cidade = :cidade
        WHERE id = :id';
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':nome' => $nome,
    ':email' => $email,
    ':cidade' => $cidade,
    ':id' => $id,
]);
echo $stmt->rowCount() . ' cliente alterado.';` },
          { type: 'text', html: "<p><strong>Cuidado com o UPDATE sem WHERE:</strong> ele altera todas as linhas da tabela. É o famoso \"mudei o nome de todo mundo para Ana\". Antes de rodar, leia o comando em voz alta: \"altere... onde o id for...\". O <code class=\"inline\">rowCount()</code> conta quantas linhas foram alteradas.</p>" },
          { type: 'code', code: `<input id="nome" name="nome"
       value="<?= htmlspecialchars($cliente['nome']) ?>">
<input type="hidden" name="id" value="<?= $cliente['id'] ?>">` },
          { type: 'question', q: { kind: 'mc', prompt: "O que acontece com UPDATE clientes SET cidade = 'Gama' sem WHERE?", options: ["Nada", "Todos os clientes passam a ser do Gama", "Só o primeiro cliente muda", "O banco recusa"], answer: 1, explain: "Sem WHERE, o UPDATE vale para todas as linhas." } },
          { type: 'question', q: { kind: 'mc', prompt: "Para o formulário de edição já vir preenchido, usamos:", options: ["O atributo placeholder", "O value de cada campo com os dados do banco", "Um novo INSERT", "O $_SESSION"], answer: 1, explain: "O value recebe o valor atual, passado pelo htmlspecialchars." } },
        ],
      },
      {
        id: 'm7-l3',
        title: "Excluir com DELETE (e com cuidado)",
        blocks: [
          { type: 'text', html: "<p>Excluir não se faz com um link simples: links podem ser abertos sem querer, até por robôs de busca. Use um pequeno formulário com <code class=\"inline\">method=\"post\"</code> e uma pergunta de confirmação. No PHP, o <code class=\"inline\">DELETE</code> leva o mesmo cuidado do <code class=\"inline\">UPDATE</code>: sempre com <code class=\"inline\">WHERE</code>.</p>" },
          { type: 'code', code: `<form method="post" action="excluir.php">
  <input type="hidden" name="id" value="<?= $cliente['id'] ?>">
  <button type="submit">Excluir <?= htmlspecialchars($cliente['nome']) ?></button>
</form>` },
          { type: 'code', code: `<?php
require_once __DIR__ . '/banco.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int) ($_POST['id'] ?? 0);
    $stmt = $pdo->prepare('DELETE FROM clientes WHERE id = :id');
    $stmt->execute([':id' => $id]);
}

// volta para a lista: um F5 não repete a exclusão
header('Location: index.php');
exit;` },
          { type: 'text', html: "<p>Esse \"faz e redireciona\" tem nome: <strong>Post/Redirect/Get</strong>. Depois de qualquer gravação, mande o navegador para outra página com <code class=\"inline\">header('Location: ...')</code> e <code class=\"inline\">exit</code>. Assim o F5 não envia o formulário de novo.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Por que excluir com um formulário POST, e não com um link?", options: ["Porque é mais bonito", "Porque um link pode ser aberto sem querer, até por robôs", "Porque o DELETE só funciona com POST", "Tanto faz"], answer: 1, explain: "Ações que mudam dados devem usar POST." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual função do PHP manda o navegador para outra página? (header com qual cabeçalho? escreva só a palavra)", answers: ["Location", "location"], explain: "header('Location: index.php') redireciona." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Qual comando SQL altera um registro?", options: ["INSERT", "UPDATE", "ALTER", "CHANGE"], answer: 1, explain: "UPDATE ... SET ... WHERE." },
      { kind: 'mc', prompt: "Qual comando SQL apaga um registro?", options: ["DROP", "REMOVE", "DELETE", "ERASE"], answer: 2, explain: "DELETE FROM ... WHERE. (DROP apaga a tabela inteira!)" },
      { kind: 'mc', prompt: "O que o rowCount() informa depois de um UPDATE?", options: ["Quantas colunas a tabela tem", "Quantas linhas foram alteradas", "O id do cliente", "O tempo da consulta"], answer: 1, explain: "rowCount() conta as linhas afetadas." },
      { kind: 'fill', prompt: "Como se chama o padrão de redirecionar depois de gravar, para o F5 não repetir a ação? (Post/Redirect/___)", answers: ["Get", "get"], explain: "Post/Redirect/Get." },
      { kind: 'mc', prompt: "editar.php?id=5: em que variável o 5 chega?", options: ["$_POST['id']", "$_GET['id']", "$_SESSION['id']", "$id automaticamente"], answer: 1, explain: "Dados do endereço chegam em $_GET." },
    ],
  },
  {
    id: 'm8',
    icon: "⧉",
    title: "Includes e organização",
    description: "include, require e um projeto dividido em arquivos com uma tarefa cada.",
    lessons: [
      {
        id: 'm8-l1',
        title: "include e require",
        blocks: [
          { type: 'text', html: "<p>Copiar a conexão com o banco e o cabeçalho em cada página é pedir para esquecer uma delas na próxima mudança. Com <code class=\"inline\">require</code>, o PHP \"cola\" outro arquivo naquele ponto. Mudou o cabeçalho? Muda em um lugar só.</p>" },
          { type: 'text', html: "<p><code class=\"inline\">include</code> e <code class=\"inline\">require</code> fazem a mesma coisa, mas reagem diferente quando o arquivo não existe: o <code class=\"inline\">include</code> só avisa e segue; o <code class=\"inline\">require</code> para tudo. Para a conexão com o banco, use <code class=\"inline\">require_once</code>: ele para se faltar e não carrega duas vezes. O <code class=\"inline\">__DIR__</code> é a pasta do arquivo atual e evita caminho quebrado.</p>" },
          { type: 'code', code: `<?php
// index.php
require_once __DIR__ . '/banco.php';
$titulo = 'Clientes';
require __DIR__ . '/parciais/cabecalho.php';
?>
<h1>Clientes</h1>
<?php require __DIR__ . '/parciais/rodape.php'; ?>` },
          { type: 'code', code: `<!-- parciais/cabecalho.php -->
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title><?= htmlspecialchars($titulo ?? 'Loja') ?></title>
</head>
<body>
  <nav><a href="index.php">Clientes</a> · <a href="novo.php">Novo</a></nav>` },
          { type: 'text', html: "<p>Repare no <code class=\"inline\">$titulo</code>: a página define a variável antes do <code class=\"inline\">require</code>, e o cabeçalho usa. O arquivo incluído enxerga as variáveis de quem incluiu.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Se o arquivo não existir, qual dos dois para a página com erro fatal?", options: ["include", "require", "os dois só avisam", "nenhum"], answer: 1, explain: "require para tudo; include só avisa." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual constante mágica guarda a pasta do arquivo atual? (com os sublinhados)", answers: ["__DIR__"], explain: "__DIR__ evita caminhos quebrados." } },
        ],
      },
      {
        id: 'm8-l2',
        title: "Uma pasta organizada",
        blocks: [
          { type: 'text', html: "<p>Regra de bolso: <strong>cada arquivo com uma tarefa</strong>. Quem conecta, conecta. Quem valida, valida. As páginas só juntam as peças. Um projeto pequeno pode ficar assim:</p>" },
          { type: 'code', code: `loja/
├── banco.php           # conexão PDO e criação das tabelas
├── funcoes.php         # validarCliente() e outras funções
├── parciais/
│   ├── cabecalho.php
│   └── rodape.php
├── index.php           # lista os clientes
├── novo.php            # cadastra
├── editar.php          # altera
├── excluir.php         # exclui
├── .gitignore          # loja.sqlite fica de fora
└── loja.sqlite         # o banco (criado sozinho)` },
          { type: 'text', html: "<p>Os nomes contam a história: qualquer colega abre a pasta e sabe onde mexer. E o dia em que o cadastro virar MySQL, você muda um arquivo só, o <code class=\"inline\">banco.php</code>.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Onde deve ficar a conexão com o banco?", options: ["Copiada em cada página", "Num arquivo próprio, incluído com require_once", "No cabeçalho HTML", "No .gitignore"], answer: 1, explain: "Um arquivo só: muda em um lugar." } },
          { type: 'question', q: { kind: 'mc', prompt: "O que vai no .gitignore deste projeto?", options: ["index.php", "loja.sqlite", "banco.php", "parciais/"], answer: 1, explain: "O arquivo do banco, com dados de clientes, fica fora do GitHub." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Para incluir a conexão com o banco, o mais seguro é:", options: ["include", "require_once", "echo", "import"], answer: 1, explain: "Para se faltar e não carrega duas vezes." },
      { kind: 'mc', prompt: "Uma variável definida antes do require pode ser usada no arquivo incluído?", options: ["Não", "Sim", "Só se for global", "Só se for constante"], answer: 1, explain: "O arquivo incluído enxerga o escopo de quem incluiu." },
      { kind: 'mc', prompt: "Qual a vantagem de ter cabeçalho e rodapé em arquivos separados?", options: ["O site fica mais rápido", "Mudou em um lugar, muda em todas as páginas", "O PHP exige", "Nenhuma"], answer: 1, explain: "Manutenção em um lugar só." },
      { kind: 'fill', prompt: "Complete: require_once __DIR__ . '/____.php'; para incluir a conexão chamada banco", answers: ["banco"], explain: "require_once __DIR__ . '/banco.php';" },
    ],
  },
  {
    id: 'm9',
    icon: "◎",
    title: "Classes e objetos",
    description: "A classe como molde: atributos, construtor, métodos e uma classe que fala com o banco.",
    lessons: [
      {
        id: 'm9-l1',
        title: "Do array ao objeto",
        blocks: [
          { type: 'text', html: "<p>Até aqui, um cliente era um array: <code class=\"inline\">$cliente['nome']</code>. Funciona, mas nada impede alguém de escrever <code class=\"inline\">$cliente['nmoe']</code> e só descobrir o erro depois. Uma <strong>classe</strong> é o molde do cliente: diz quais dados ele tem (atributos) e o que ele sabe fazer (métodos). Cada cliente criado com <code class=\"inline\">new</code> é um <strong>objeto</strong>.</p>" },
          { type: 'code', code: `<?php
class Cliente
{
    public function __construct(
        public string $nome,
        public string $email,
        public string $cidade = ''
    ) {
    }

    public function apresentar(): string
    {
        return "{$this->nome} ({$this->email})";
    }
}

$ana = new Cliente('Ana Souza', 'ana@exemplo.com', 'Brasília');
echo $ana->apresentar();   // Ana Souza (ana@exemplo.com)
echo $ana->cidade;         // Brasília` },
          { type: 'text', html: "<p>O <code class=\"inline\">__construct</code> roda na hora do <code class=\"inline\">new</code> e, com <code class=\"inline\">public</code> na frente dos parâmetros, já cria os atributos. Dentro da classe, <code class=\"inline\">$this</code> é \"este objeto\". Fora dela, a seta <code class=\"inline\">-></code> acessa atributos e métodos.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Qual palavra cria um objeto a partir de uma classe?", options: ["class", "new", "create", "this"], answer: 1, explain: "$ana = new Cliente(...);" } },
          { type: 'question', q: { kind: 'fill', prompt: "Dentro de um método, qual variável representa o próprio objeto?", answers: ["$this", "this"], explain: "$this é \"este objeto\"." } },
          { type: 'question', q: { kind: 'mc', prompt: "Na classe Cliente, apresentar() é:", options: ["Um atributo", "Um método", "Um construtor", "Uma tabela"], answer: 1, explain: "Método é uma função que pertence à classe." } },
        ],
      },
      {
        id: 'm9-l2',
        title: "Uma classe que conversa com o banco",
        blocks: [
          { type: 'text', html: "<p>O SQL do cliente estava espalhado pelas páginas. Juntando tudo numa classe, as páginas só pedem: \"salve este cliente\", \"me dê a lista\". Esse tipo de classe costuma se chamar <strong>repositório</strong>.</p>" },
          { type: 'code', code: `<?php
require_once __DIR__ . '/Cliente.php';

class ClienteRepositorio
{
    public function __construct(private PDO $pdo)
    {
    }

    public function salvar(Cliente $cliente): int
    {
        $sql = 'INSERT INTO clientes (nome, email, cidade)
                VALUES (:nome, :email, :cidade)';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $cliente->nome,
            ':email' => $cliente->email,
            ':cidade' => $cliente->cidade,
        ]);
        return (int) $this->pdo->lastInsertId();
    }

    public function listar(): array
    {
        $sql = 'SELECT nome, email, cidade FROM clientes ORDER BY nome';
        $clientes = [];
        foreach ($this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC) as $linha) {
            $clientes[] = new Cliente($linha['nome'], $linha['email'], $linha['cidade'] ?? '');
        }
        return $clientes;
    }
}` },
          { type: 'code', code: `<?php
// numa página qualquer
$repo = new ClienteRepositorio($pdo);
$repo->salvar(new Cliente('Davi Rocha', 'davi@exemplo.com'));

foreach ($repo->listar() as $cliente) {
    echo htmlspecialchars($cliente->apresentar()) . '<br>';
}` },
          { type: 'text', html: "<p>O <code class=\"inline\">private</code> esconde a conexão: só a própria classe usa o <code class=\"inline\">$this->pdo</code>. E os tipos (<code class=\"inline\">Cliente $cliente</code>, <code class=\"inline\">: int</code>) fazem o PHP reclamar na hora se alguém passar a coisa errada.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "O que o private na frente de $pdo garante?", options: ["Que a senha do banco fica criptografada", "Que só a própria classe acessa $this->pdo", "Que o objeto não pode ser criado", "Nada"], answer: 1, explain: "private: visível só dentro da classe." } },
          { type: 'question', q: { kind: 'mc', prompt: "Qual a vantagem de um repositório?", options: ["O SQL fica num lugar só e as páginas ficam simples", "O banco fica mais rápido", "Não precisa mais de PDO", "Dispensa o htmlspecialchars"], answer: 0, explain: "As páginas pedem; o repositório sabe o SQL." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "Classe e objeto são, respectivamente:", options: ["Objeto e molde", "Molde e coisa criada a partir do molde", "Tabela e linha do banco", "Função e variável"], answer: 1, explain: "A classe é o molde; o objeto, o que sai dele." },
      { kind: 'mc', prompt: "Qual método roda automaticamente quando fazemos new?", options: ["__start", "__construct", "init", "main"], answer: 1, explain: "__construct é o construtor." },
      { kind: 'fill', prompt: "Qual símbolo acessa um método do objeto: $ana__apresentar() (dois caracteres)", answers: ["->"], explain: "$ana->apresentar()." },
      { kind: 'mc', prompt: "public, private: o que eles definem?", options: ["O tipo do dado", "Quem pode acessar o atributo ou método", "A velocidade", "O banco usado"], answer: 1, explain: "Visibilidade." },
      { kind: 'mc', prompt: "Num ClienteRepositorio, o SQL dos clientes fica:", options: ["Espalhado pelas páginas", "Dentro da classe", "No HTML", "No .gitignore"], answer: 1, explain: "Centralizado na classe." },
    ],
  },
  {
    id: 'm10',
    icon: "⚿",
    title: "Login e sessão",
    description: "Senha protegida com password_hash e a sessão que lembra quem entrou.",
    lessons: [
      {
        id: 'm10-l1',
        title: "Senha não se guarda: se embaralha",
        blocks: [
          { type: 'text', html: "<p>Senha nunca vai para o banco do jeito que foi digitada. Se o banco vazar, ninguém deve conseguir ler as senhas. O PHP faz isso com uma função: <code class=\"inline\">password_hash()</code> transforma a senha num código que não dá para desfazer. Para conferir no login, <code class=\"inline\">password_verify()</code> compara a senha digitada com esse código.</p>" },
          { type: 'code', code: `<?php
// no cadastro do usuário
$hash = password_hash($_POST['senha'], PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO usuarios (email, senha_hash) VALUES (:email, :hash)');
$stmt->execute([':email' => $email, ':hash' => $hash]);

// $hash parece com: $2y$12$Qk... (60 caracteres, diferente a cada vez)` },
          { type: 'code', code: `<?php
// no login
$stmt = $pdo->prepare('SELECT id, senha_hash FROM usuarios WHERE email = :email');
$stmt->execute([':email' => $email]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if ($usuario && password_verify($senha, $usuario['senha_hash'])) {
    // senha certa
} else {
    $erro = 'E-mail ou senha incorretos.';
}` },
          { type: 'text', html: "<p>Repare na mensagem de erro: ela não diz se foi o e-mail ou a senha que errou. Isso não dá pista para quem está tentando adivinhar.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Como a senha deve ser guardada no banco?", options: ["Como foi digitada", "Com password_hash()", "Em maiúsculas", "Num cookie"], answer: 1, explain: "password_hash() gera um código que não dá para desfazer." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual função confere a senha digitada contra o hash guardado?", answers: ["password_verify", "password_verify()"], explain: "password_verify($senha, $hash)." } },
          { type: 'question', q: { kind: 'mc', prompt: "Por que a mensagem diz \"E-mail ou senha incorretos\" sem dizer qual?", options: ["Por preguiça", "Para não dar pista a quem tenta adivinhar", "Porque o PHP não sabe", "Por causa do SQLite"], answer: 1, explain: "Mensagem genérica protege as contas." } },
        ],
      },
      {
        id: 'm10-l2',
        title: "Sessão: lembrar quem entrou",
        blocks: [
          { type: 'text', html: "<p>Cada página PHP começa do zero: ela não lembra que você acabou de fazer login. A <strong>sessão</strong> resolve isso. O <code class=\"inline\">session_start()</code>, sempre no topo, abre uma \"gaveta\" só daquele visitante, a <code class=\"inline\">$_SESSION</code>, que dura enquanto ele navega.</p>" },
          { type: 'code', code: `<?php
// login.php, depois do password_verify dar certo
session_start();
session_regenerate_id(true);   // troca o crachá da sessão
$_SESSION['usuario_id'] = $usuario['id'];
header('Location: painel.php');
exit;` },
          { type: 'code', code: `<?php
// painel.php: só entra quem fez login
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: login.php');
    exit;
}` },
          { type: 'code', code: `<?php
// sair.php
session_start();
$_SESSION = [];
session_destroy();
header('Location: login.php');
exit;` },
          { type: 'text', html: "<p>O <code class=\"inline\">session_regenerate_id(true)</code> troca o identificador da sessão na hora do login: se alguém tinha pegado o antigo, ele deixa de valer. E coloque a verificação do painel num arquivo, como <code class=\"inline\">protegido.php</code>, incluído com <code class=\"inline\">require_once</code> em toda página restrita.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Onde o session_start() deve ficar?", options: ["No fim da página", "No topo, antes de qualquer HTML", "Só no login", "No banco"], answer: 1, explain: "A sessão precisa começar antes de qualquer saída." } },
          { type: 'question', q: { kind: 'fill', prompt: "Em qual variável superglobal guardamos o id de quem fez login?", answers: ["$_SESSION", "$_session"], explain: "$_SESSION['usuario_id']." } },
          { type: 'question', q: { kind: 'mc', prompt: "Uma página restrita sem $_SESSION['usuario_id'] deve:", options: ["Mostrar tudo mesmo assim", "Redirecionar para o login", "Apagar o banco", "Criar um usuário"], answer: 1, explain: "Sem login, volta para a porta." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "password_hash(\"123\") executado duas vezes gera:", options: ["O mesmo código", "Códigos diferentes, e os dois são aceitos pelo password_verify", "Erro", "\"123\" de novo"], answer: 1, explain: "O hash tem um sal aleatório; cada vez sai diferente." },
      { kind: 'mc', prompt: "Para sair do sistema, usamos:", options: ["session_start()", "session_destroy()", "password_hash()", "header()"], answer: 1, explain: "session_destroy() encerra a sessão." },
      { kind: 'fill', prompt: "Qual função troca o identificador da sessão na hora do login? session_______(true)", answers: ["regenerate_id", "session_regenerate_id", "_regenerate_id"], explain: "session_regenerate_id(true)." },
      { kind: 'mc', prompt: "Guardar a senha \"como foi digitada\" é problema porque:", options: ["Ocupa espaço", "Se o banco vazar, todo mundo lê as senhas", "O PHP não aceita", "Não é problema"], answer: 1, explain: "Por isso usamos hash." },
      { kind: 'mc', prompt: "As páginas restritas checam o login:", options: ["Só na primeira página", "Em todas, de preferência com um arquivo incluído", "Só no logout", "No CSS"], answer: 1, explain: "Toda página restrita confere a sessão." },
    ],
  },
  {
    id: 'm11',
    icon: "▤",
    title: "Relatórios, gráficos e Web Services",
    description: "Contar e agrupar com SQL, desenhar um gráfico e conversar com APIs.",
    lessons: [
      {
        id: 'm11-l1',
        title: "Relatórios com SQL",
        blocks: [
          { type: 'text', html: "<p>Relatório é pergunta feita ao banco: quantos clientes por cidade? Qual o total vendido no mês? As <strong>funções de agregação</strong> respondem: <code class=\"inline\">COUNT</code> conta, <code class=\"inline\">SUM</code> soma, <code class=\"inline\">AVG</code> tira a média. O <code class=\"inline\">GROUP BY</code> separa a conta por grupo.</p>" },
          { type: 'code', code: `<?php
$sql = 'SELECT cidade, COUNT(*) AS total
        FROM clientes
        GROUP BY cidade
        ORDER BY total DESC';
$linhas = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

foreach ($linhas as $linha) {
    echo htmlspecialchars($linha['cidade']) . ': ' . $linha['total'] . '<br>';
}
// Brasília: 12
// Taguatinga: 7 ...` },
          { type: 'text', html: "<p>O <code class=\"inline\">AS total</code> dá um apelido para a coluna calculada, e é por ele que o PHP lê o resultado. Relatório bom cabe numa tabela HTML simples: ninguém precisa de 30 colunas.</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Qual função conta as linhas de cada grupo?", options: ["SUM", "COUNT", "AVG", "MAX"], answer: 1, explain: "COUNT(*) conta." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual cláusula separa a contagem por cidade? (duas palavras)", answers: ["GROUP BY", "group by"], explain: "GROUP BY cidade." } },
        ],
      },
      {
        id: 'm11-l2',
        title: "Um gráfico sem biblioteca",
        blocks: [
          { type: 'text', html: "<p>Antes de instalar uma biblioteca de gráficos, um truque: barras são retângulos, e a largura pode ser a porcentagem. O PHP calcula, o CSS desenha. É matemática virando imagem.</p>" },
          { type: 'code', code: `<?php
$maior = max(array_column($linhas, 'total'));

foreach ($linhas as $linha):
    $largura = round($linha['total'] / $maior * 100); ?>
  <div class="barra-grafico">
    <span><?= htmlspecialchars($linha['cidade']) ?></span>
    <div style="width: <?= $largura ?>%"><?= $linha['total'] ?></div>
  </div>
<?php endforeach; ?>` },
          { type: 'code', code: `.barra-grafico div {
  background: #39ff8a;
  color: #060810;
  padding: 4px 8px;
  margin: 4px 0 12px;
}` },
          { type: 'text', html: "<p>A barra maior fica com 100% e as outras ficam proporcionais a ela. Quando o projeto pedir algo mais elaborado, bibliotecas como o Chart.js recebem os mesmos dados em JSON (próxima lição).</p>" },
          { type: 'question', q: { kind: 'mc', prompt: "Se a maior cidade tem 20 clientes e outra tem 5, a barra da segunda terá:", options: ["5%", "25%", "50%", "20%"], answer: 1, explain: "5 / 20 × 100 = 25%." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual função do PHP devolve o maior valor de um array?", answers: ["max", "max()"], explain: "max() pega o maior." } },
        ],
      },
      {
        id: 'm11-l3',
        title: "Consumindo uma API (e criando a sua)",
        blocks: [
          { type: 'text', html: "<p><strong>Web Service</strong> (ou API) é um site feito para programas, não para pessoas: ele responde dados, geralmente em <strong>JSON</strong>. O ViaCEP, por exemplo, devolve o endereço de um CEP. O PHP busca com <code class=\"inline\">file_get_contents()</code> e transforma o JSON em array com <code class=\"inline\">json_decode(..., true)</code>.</p>" },
          { type: 'code', code: `<?php
$cep = '01001000';
$resposta = @file_get_contents("https://viacep.com.br/ws/$cep/json/");

if ($resposta === false) {
    echo 'Não consegui falar com o ViaCEP.';
} else {
    $endereco = json_decode($resposta, true);
    echo $endereco['logradouro'] . ' - ' . $endereco['localidade'] . '/' . $endereco['uf'];
    // Praça da Sé - São Paulo/SP
}` },
          { type: 'text', html: "<p>Sempre trate o caso de a API não responder: internet cai, serviço sai do ar. E o caminho inverso também vale: o seu sistema pode ser uma API. Basta responder JSON em vez de HTML.</p>" },
          { type: 'code', code: `<?php
// api-clientes.php: a sua própria API
require_once __DIR__ . '/banco.php';
header('Content-Type: application/json; charset=utf-8');

$clientes = $pdo->query('SELECT nome, cidade FROM clientes ORDER BY nome')
                ->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
// [{"nome":"Ana Souza","cidade":"Brasília"}, ...]` },
          { type: 'question', q: { kind: 'mc', prompt: "Em que formato as APIs costumam responder?", options: ["HTML", "JSON", "PDF", "PNG"], answer: 1, explain: "JSON é o formato mais comum." } },
          { type: 'question', q: { kind: 'fill', prompt: "Qual função transforma um texto JSON em array do PHP?", answers: ["json_decode", "json_decode()"], explain: "json_decode($texto, true)." } },
          { type: 'question', q: { kind: 'mc', prompt: "Por que testar se file_get_contents() devolveu false?", options: ["Porque a API pode não responder", "Porque o PHP exige", "Para deixar mais rápido", "Não precisa"], answer: 0, explain: "Serviço fora do ar não pode quebrar a sua página." } },
        ],
      },
    ],
    quiz: [
      { kind: 'mc', prompt: "SELECT cidade, COUNT(*) FROM clientes GROUP BY cidade devolve:", options: ["Uma linha por cliente", "Uma linha por cidade, com a contagem", "Só o total geral", "Um erro"], answer: 1, explain: "GROUP BY agrupa por cidade." },
      { kind: 'mc', prompt: "Para dar um nome à coluna calculada, usamos:", options: ["AS", "NAME", "LABEL", "ALIAS ="], answer: 0, explain: "COUNT(*) AS total." },
      { kind: 'fill', prompt: "Qual função transforma um array do PHP em texto JSON?", answers: ["json_encode", "json_encode()"], explain: "json_encode($dados)." },
      { kind: 'mc', prompt: "Para a sua página responder como API, qual cabeçalho enviar?", options: ["Content-Type: application/json", "Location: api.php", "Content-Type: text/html", "Nenhum"], answer: 0, explain: "Assim quem chama sabe que vem JSON." },
      { kind: 'mc', prompt: "O ViaCEP é exemplo de:", options: ["Banco de dados local", "Web Service (API) pública", "Biblioteca de gráficos", "Framework PHP"], answer: 1, explain: "Um serviço que responde dados em JSON." },
    ],
  },
];


export function getModule(moduleId) {
  return MODULES.find(m => m.id === moduleId);
}

export function getLesson(moduleId, lessonId) {
  const mod = getModule(moduleId);
  return mod?.lessons.find(l => l.id === lessonId);
}

export function allLessonIds(mod) {
  return mod.lessons.map(l => l.id);
}

export function totalLessonCount() {
  return MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
}
