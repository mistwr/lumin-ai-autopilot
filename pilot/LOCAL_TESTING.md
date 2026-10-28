# Teste local — LUMIN Autopilot
Este piloto é offline e usa apenas dados fictícios.

## Requisitos
Node.js 20+ e navegador moderno.

## Testes
Na raiz do repositório:
```sh
node --test pilot/engine.test.mjs pilot/dashboard.test.mjs
node pilot/run.mjs
```

## Dashboard
Na raiz do repositório:
```sh
python3 -m http.server 8765 --directory pilot
```
Abrir http://localhost:8765/dashboard.html no mesmo computador.

Não abrir o HTML por file://: os imports ES Modules requerem servidor HTTP local. Não publicar o servidor na internet.

## Limites
- Sem autenticação; só dados fictícios.
- Os dados de demonstração são gerados localmente no browser.
- A seleção de empresa não constitui isolamento de segurança para clientes reais.
- Não há chamadas, SMS, email, acesso ao SD Dialer ou faturação.
- Não integrar produção sem revisão de autorização, consentimento, RLS, logs e testes de segurança.
