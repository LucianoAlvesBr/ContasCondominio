# 💼 Controle de Despesas do Condomínio

Sistema moderno e responsivo para gerenciar despesas de condomínio, com interface intuitiva e design premium.

## 🚀 Tecnologias

- **Frontend**: React + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS com gradientes e glassmorphism
- **Icons**: Lucide React

## ✨ Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Adicionar, editar e excluir despesas
- ✅ Alternar status (Paga/Pendente)
- ✅ Filtros por mês/ano
- ✅ Design responsivo (mobile-friendly)
- ✅ Interface moderna com animações suaves

## 🛠️ Instalação Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie .env.example para .env e preencha com suas chaves do Supabase

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔐 Configuração

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script `db/database_schema.sql` no SQL Editor do Supabase
3. Copie suas credenciais para o arquivo `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 📱 Deploy

Veja o arquivo `deployment_guide.md` para instruções completas de deploy no Vercel.

## 📄 Licença

MIT
