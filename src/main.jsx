// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
// Importação do StrictMode do React, ferramenta que ajuda a identificar problemas potenciais no código durante o desenvolvimento
import { StrictMode } from 'react'

// Importação do método createRoot da biblioteca react-dom, responsável por renderizar a aplicação no navegador
import { createRoot } from 'react-dom/client'

// Importação do componente principal da aplicação (o App.jsx que comentamos anteriormente)
import App from './App.jsx'

// Criação da raiz do projeto, selecionando a div com o id 'root' lá do arquivo index.html, e renderizando o app nela
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
