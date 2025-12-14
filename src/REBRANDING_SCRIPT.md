# Rebranding Script: Valor Vault → Valor Registry

## Files to Update

This document tracks the rebranding from "Valor Vault" to "Valor Registry" and domain update to "valorregistry.com"

### Completed:
- ✅ /components/Login.tsx
- ✅ /components/Register.tsx
- ✅ /components/LandingPage.tsx (email added)

### Pending Manual Updates:
The following files need "Valor Vault" replaced with "Valor Registry":

1. /components/Dashboard.tsx (3 instances)
2. /components/LandingPage.tsx (remaining instances)
3. /components/TermsOfService.tsx (11 instances)
4. /components/PrivacyPolicy.tsx (8 instances)
5. /supabase/functions/server/index.tsx (3 instances)
6. /supabase/functions/server/email.tsx (many instances)

## Replacement Pattern:
- Find: "Valor Vault"
- Replace: "Valor Registry"

- Find: "valorvault.com"
- Replace: "valorregistry.com"

- Find: "@valorvault.com"
- Replace: "@valorregistry.com"
