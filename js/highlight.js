// Realce de sintaxe PHP simplificado (sem dependências externas).
const KEYWORDS = ['echo', 'print', 'if', 'else', 'elseif', 'endif', 'switch', 'case', 'default',
  'for', 'foreach', 'while', 'do', 'break', 'continue', 'function', 'return', 'as', 'true', 'false',
  'null', 'const', 'require', 'include', 'array', 'new', 'class', 'public', 'private', 'static'];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Tokenização em passada única: evita que uma regra (ex.: a palavra-chave "class")
// re-analise o HTML <span class="..."> já injetado por uma regra anterior.
const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*|#[^\\n]*)',                 // 1: comentário de linha
    '(\\/\\*[\\s\\S]*?\\*\\/)',                 // 2: comentário de bloco
    '("[^"]*"|\'[^\']*\')',                     // 3: string
    '(\\$[a-zA-Z_][a-zA-Z0-9_]*)',              // 4: variável
    '(\\b\\d+(?:\\.\\d+)?\\b)',                 // 5: número
    `(\\b(?:${KEYWORDS.join('|')})\\b)`,        // 6: palavra-chave
    '(\\b[a-zA-Z_][a-zA-Z0-9_]*\\b(?=\\s*\\())', // 7: chamada de função
  ].join('|'),
  'g'
);

export function highlightPhp(code) {
  const escaped = escapeHtml(code);
  return escaped.replace(TOKEN_RE, (match, comment, blockComment, str, variable, number, keyword) => {
    if (comment || blockComment) return `<span class="tok-com">${match}</span>`;
    if (str) return `<span class="tok-str">${match}</span>`;
    if (variable) return `<span class="tok-var">${match}</span>`;
    if (number) return `<span class="tok-num">${match}</span>`;
    if (keyword) return `<span class="tok-kw">${match}</span>`;
    return `<span class="tok-fn">${match}</span>`;
  });
}
