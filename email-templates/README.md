# Email mallid Supabase jaoks

## Subject liinid (Email Subject)

| Mall | Subject |
|------|---------|
| Confirm signup | `Kinnita oma konto - elektriliikur.ee` |
| Reset Password | `Parooli lähtestamine - elektriliikur.ee` |
| Magic Link | `Sinu sisselogimise link - elektriliikur.ee` |
| Change Email | `Kinnita uus e-posti aadress - elektriliikur.ee` |

## Kuidas kasutada

1. Mine: https://supabase.com/dashboard/project/vcsjusvvbjdgvfkikefy/auth/templates
2. Vali mall vasakult (nt "Confirm signup")
3. Kleebi vastav HTML fail `Message body` väljale
4. Pane subject liin peale (vt tabel üleval)
5. Salvesta

## Failid

- `confirm-signup.html` → Confirm signup
- `reset-password.html` → Reset Password
- `magic-link.html` → Magic Link
- `change-email.html` → Change Email Address
