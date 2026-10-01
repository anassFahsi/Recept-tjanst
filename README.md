# Recept-tjänst

En medlemsbaserad recepttjänst där användare får tillgång till olika recept och funktioner beroende på medlemsnivå.

## Live

Frontend: https://recept-tjanst-frontend.vercel.app  
Backend: https://recept-tjanst-backend-oscwers-projects.vercel.app

## Funktioner

- Registrering och inloggning
- Medlemsnivåer: Basic, Premium och Premium Plus
- Uppgradering av medlemskap via demo-checkout
- Kvittohistorik på användarkontot
- Recept med nivåbaserad åtkomst
- Sparade recept / eget bibliotek
- Adminpanel för hantering av recept och ingredienser

## Teknisk stack

### Frontend

- React
- Vite
- TypeScript
- React Router
- Axios
- CSS
- Context API

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- pg (node-postgres)
- JWT
- bcrypt

### Databas

Projektet använder bland annat:

- users
- membership_levels
- recipes
- categories
- ingredients
- recipe_ingredients
- saved_recipes
- receipts

## Ansvar

**Anass**
- Receptdata och recept-CRUD
- Sparade recept
- Adminfunktionalitet

**Dante**
- Autentisering och användare
- ER-diagram
- Frontenddesign och styling

**Oscar**
- Projektledning
- Wireframes och user flow
- Medlemsnivåer
- Checkout / demo-betalning
- Kvitton och kontosida
- Deployment
