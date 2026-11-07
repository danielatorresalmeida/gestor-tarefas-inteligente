# Gestor de Tarefas Inteligente

## Aplicação

O projeto está disponível em:
https://danielatorresalmeida.github.io/gestor-tarefas-inteligente/


Projeto desenvolvido durante as aulas de **Programação Web**, no âmbito da formação Software Developer do CESAE Digital, para colocar em prática os conhecimentos adquiridos em JavaScript.

A aplicação permite organizar tarefas, acompanhar o seu estado e definir datas limite. Foi desenvolvida com HTML, CSS e JavaScript.

## Funcionalidades

- Login e logout simulados.
- Adicionar, editar, concluir, reabrir e eliminar tarefas.
- Verificação de tarefas com nomes repetidos.
- Registo automático da data de criação.
- Definição opcional de uma data limite.
- Avisos para tarefas sem prazo ou com prazo ultrapassado.
- Mensagens de confirmação e erro.
- Contagem de tarefas totais, ativas e concluídas.
- Filtros para consultar as tarefas por estado.
- Armazenamento das tarefas no navegador.
- Alternância entre tema claro e escuro.
- Apresentação da data e hora atuais.
- Consulta da temperatura e das condições meteorológicas em Lisboa.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- localStorage e sessionStorage
- API Open-Meteo

## Como utilizar

Para executar o projeto localmente, basta abrir o ficheiro `index.html` num navegador.

Ao entrar na aplicação, é pedido um nome de utilizador. Depois, é possível adicionar tarefas, definir datas limite e acompanhar as tarefas concluídas ou ainda por realizar.

As tarefas ficam guardadas no navegador, mesmo depois de atualizar ou fechar a página.

O login é simulado e não utiliza uma base de dados nem autenticação real.

## Melhorias futuras

Numa próxima versão, gostaria de acrescentar algumas funcionalidades que permitam acompanhar as tarefas com maior detalhe:

- **Descrição das tarefas:** permitir acrescentar informações sobre o trabalho a realizar.
- **Objetivos individuais:** dividir cada tarefa em vários objetivos, que possam ser assinalados à medida que são concluídos.
- **Conclusão automática:** considerar uma tarefa concluída quando todos os seus objetivos estiverem terminados.
- **Controlo de prazos:** identificar tarefas em atraso e distinguir as que foram concluídas dentro ou fora do prazo.
- **Histórico de alterações:** registar as mudanças de data limite, incluindo a data anterior, a nova data e o motivo da alteração.
- **Gestão por utilizador:** associar as tarefas aos respetivos criadores e permitir que cada um faça alterações às suas tarefas.
- **Suporte a vários idiomas:** permitir alternar entre português e inglês, incluindo os textos da interface, mensagens de feedback e informações apresentadas.


Estas melhorias permitiriam desenvolver a aplicação de forma gradual, mantendo como base as funcionalidades já implementadas.

## API utilizada

A informação meteorológica é obtida através da [Open-Meteo](https://open-meteo.com/).
