// Conteúdo do curso: módulos, lições e questões.
// kind 'mc'   -> múltipla escolha  { prompt, options[], answer(index), explain }
// kind 'fill' -> preencher lacuna  { prompt, answers[](aceitas), explain }

export const MODULES = [
  {
    id: 'm1',
    icon: '⌘',
    title: 'Introdução ao PHP',
    description: 'Sintaxe, tipos de dados, variáveis, expressões e operadores.',
    lessons: [
      {
        id: 'm1-l1',
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
        id: 'm1-l2',
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
        id: 'm1-l3',
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
        id: 'm1-l4',
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
      { kind: 'mc', prompt: 'Qual tag fecha um bloco de código PHP?', options: ['?>', '</php>', '%>', '--%>'], answer: 0, explain: 'O bloco PHP é fechado com ?>.' },
      { kind: 'mc', prompt: 'Qual função exibe o tipo e o valor de uma variável?', options: ['gettype()', 'var_dump()', 'typeof()', 'print_type()'], answer: 1, explain: 'var_dump() mostra tipo e valor.' },
      { kind: 'mc', prompt: 'Variáveis em PHP são:', options: ['Case-sensitive', 'Case-insensitive', 'Sempre maiúsculas', 'Precisam de tipo declarado'], answer: 0, explain: '$nome e $Nome são variáveis diferentes.' },
      { kind: 'fill', prompt: 'Qual operador compara valor e tipo ao mesmo tempo (estrito)?', answers: ['===', 'operador ==='], explain: 'O operador === (idêntico) compara valor e tipo.' },
      { kind: 'mc', prompt: 'echo 2 + 3 . "x"; produz:', options: ['5x', '23x', 'Erro', '2 3 x'], answer: 0, explain: 'A soma 2+3 é calculada primeiro (5) e depois concatenada com "x".' },
      { kind: 'mc', prompt: 'Qual é o tipo retornado por uma expressão de comparação, como 5 > 2?', options: ['int', 'string', 'bool', 'float'], answer: 2, explain: 'Comparações sempre resultam em true ou false (bool).' },
      { kind: 'fill', prompt: 'Qual palavra-chave declara uma constante na sintaxe moderna do PHP (sem usar $)?', answers: ['const'], explain: 'const NOME = valor; declara uma constante.' },
    ],
  },

  {
    id: 'm2',
    icon: '◆',
    title: 'Estruturas de Controle',
    description: 'Condicionais e laços de repetição.',
    lessons: [
      {
        id: 'm2-l1',
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
        id: 'm2-l2',
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
    id: 'm3',
    icon: '▲',
    title: 'Modularização: Funções',
    description: 'Declaração, parâmetros, retorno e reuso de código.',
    lessons: [
      {
        id: 'm3-l1',
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
        id: 'm3-l2',
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
