-- loja.sql: o banco da loja, do zero, com dados de teste.
-- Cuidado: as três primeiras linhas APAGAM as tabelas. Faça a cópia de segurança antes!

DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS clientes;

-- as mesmas tabelas do banco.php (aula 12)
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL
);

CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    preco REAL NOT NULL CHECK (preco >= 0)
);

CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data TEXT NOT NULL DEFAULT (date('now')),
    FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    FOREIGN KEY (produto_id) REFERENCES produtos (id)
);

-- dados de teste (pessoas fictícias)
INSERT INTO clientes (nome, email, telefone) VALUES
    ('Ana Souza', 'ana@email.com', '61995993513'),
    ('Bruno Lima', 'bruno@email.com', '6133334444'),
    ('Carla Mendes', 'carla@email.com', '61988887777'),
    ('Diego Souza', 'diego@email.com', '61977776666'),
    ('Elisa Rocha', 'elisa@email.com', '61966665555'),
    ('Cliente de Teste', 'teste@loja.com', '61999990000');

INSERT INTO produtos (nome, preco) VALUES
    ('Caneca de cerâmica', 35.90),
    ('Vaso de macramê', 59.00),
    ('Chaveiro de crochê', 12.50),
    ('Quadro de sucata', 120.00),
    ('Luminária de garrafa', 89.90),
    ('Porta-copos de cortiça', 18.00);

-- datas no formato do banco: ano-mês-dia
INSERT INTO pedidos (cliente_id, produto_id, quantidade, data) VALUES
    (1, 1, 2, '2026-09-12'),
    (2, 3, 4, '2026-09-20'),
    (3, 4, 1, '2026-09-28'),
    (1, 2, 1, '2026-10-03'),
    (4, 5, 1, '2026-10-05'),
    (2, 1, 1, '2026-10-07'),
    (5, 6, 3, '2026-10-10'),
    (1, 3, 2, '2026-10-12'),
    (3, 2, 1, '2026-10-15'),
    (4, 1, 2, '2026-10-18');
