# Playwright MCP

Projekt automatyzacji testów end-to-end wykorzystujący Playwright z integracją Model Context Protocol (MCP).

## 📋 Spis treści

- [Opis projektu](#opis-projektu)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [Skrypty npm](#skrypty-npm)
- [Quality Assurance](#quality-assurance)
- [Git Hooks](#git-hooks)
- [Rozwój](#rozwój)

## 🎯 Opis projektu

Ten projekt zawiera automatyczne testy end-to-end napisane w TypeScript z wykorzystaniem frameworka Playwright. Projekt jest skonfigurowany z zaawansowanymi narzędziami do zapewnienia jakości kodu:

- **Playwright** - Framework do testów E2E
- **TypeScript** - Typowany JavaScript
- **ESLint** - Linter dla JavaScript/TypeScript
- **Prettier** - Formatter kodu
- **Husky** - Git hooks dla automatycznego sprawdzania kodu

## 🔧 Wymagania

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** - do zarządzania wersją

## 🚀 Instalacja

### 1. Klonowanie repozytorium

```bash
git clone <repository-url>
cd playwright-mcp
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Instalacja przeglądarek Playwright

```bash
npx playwright install
```

## 📁 Struktura projektu

```
playwright-mcp/
├── config/
│   └── urls.ts              # Konfiguracja URL-i
├── constants/
│   └── validation.ts        # Stałe walidacyjne
├── fixtures/
│   └── pages.ts            # Fixtures dla page objects
├── pages/
│   ├── base.page.ts        # Bazowa klasa page object
│   ├── login.page.ts       # Page object dla logowania
│   ├── register.page.ts    # Page object dla rejestracji
│   └── welcome.page.ts     # Page object dla strony powitalnej
├── tests/
│   └── auth.spec.ts        # Testy autoryzacji
├── utils/
│   ├── test-helpers.ts     # Pomocnicze funkcje
│   └── test-types.ts       # Typy TypeScript
├── .husky/
│   └── pre-commit          # Git pre-commit hook
├── eslint.config.js        # Konfiguracja ESLint
├── playwright.config.ts    # Konfiguracja Playwright
├── .prettierrc            # Konfiguracja Prettier
└── package.json           # Zależności i skrypty
```

## ⚙️ Konfiguracja

### Playwright Configuration

Projekt jest skonfigurowany do uruchamiania testów na:

- **Browser**: Chromium
- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720
- **Screenshots**: tylko przy błędach

### ESLint Configuration

- Sprawdzanie składni TypeScript
- Reguły dla projektów Playwright
- Automatyczne naprawianie prostych błędów

### Prettier Configuration

- Średniki: włączone
- Pojedyncze cudzysłowy
- Szerokość tabulacji: 2 spacje
- Maksymalna długość linii: 100 znaków

## 🏃‍♂️ Uruchomienie

### Uruchomienie testów

```bash
# Uruchomienie wszystkich testów
npm run test

# Uruchomienie testów w trybie UI
npx playwright test --ui

# Uruchomienie konkretnego testu
npx playwright test tests/auth.spec.ts

# Uruchomienie testów z raportem
npx playwright test --reporter=html
```

### Tryb deweloperski

```bash
# Sprawdzanie formatowania
npm run format:check

# Automatyczne formatowanie
npm run format

# Sprawdzanie ESLint
npm run lint

# Automatyczne naprawianie ESLint
npm run lint:fix
```

## 📜 Skrypty npm

| Skrypt                 | Opis                                   |
| ---------------------- | -------------------------------------- |
| `npm run test`         | Uruchamia wszystkie testy Playwright   |
| `npm run format`       | Formatuje kod za pomocą Prettier       |
| `npm run format:check` | Sprawdza formatowanie bez zmian        |
| `npm run lint`         | Sprawdza kod za pomocą ESLint          |
| `npm run lint:fix`     | Naprawia problemy ESLint automatycznie |

## 🔍 Quality Assurance

### Code Quality Tools

- **ESLint**: Statyczna analiza kodu JavaScript/TypeScript
- **Prettier**: Automatyczne formatowanie kodu
- **TypeScript**: Typowanie statyczne

### Lint-staged Configuration

Automatyczne sprawdzanie plików przed commitem:

```json
{
  "*.{ts,js}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## 🪝 Git Hooks

### Pre-commit Hook

Automatycznie uruchamiany przed każdym commitem:

1. **ESLint** - sprawdza i naprawia błędy w kodzie
2. **Prettier** - formatuje kod zgodnie z regułami
3. **Blokuje commit** jeśli znajdzie nienaprawialne błędy

### Konfiguracja Husky

```bash
# .husky/pre-commit
npx lint-staged
```

## 🛠 Rozwój

### Dodawanie nowych testów

1. Utwórz nowy plik w katalogu `tests/`
2. Zaimportuj potrzebne page objects z `fixtures/`
3. Napisz testy używając wzorca Page Object Model

### Dodawanie nowych page objects

1. Utwórz nowy plik w katalogu `pages/`
2. Rozszerz klasę `BasePage`
3. Dodaj selektory i metody specyficzne dla strony

### Best Practices

- Używaj wzorca **Page Object Model**
- Pisz **deskryptywne nazwy testów**
- Grupuj testy w **logiczne suite'y**
- Używaj **type-safe selektorów**
- Dodawaj **komentarze** do skomplikowanej logiki

### Przed commitem

Hook pre-commit automatycznie:

- ✅ Sprawdzi kod ESLintem
- ✅ Sformatuje kod Prettierem
- ✅ Zablokuje commit przy błędach

### Rozwiązywanie problemów

```bash
# Sprawdzenie wszystkich błędów
npm run lint

# Automatyczne naprawienie błędów
npm run lint:fix

# Formatowanie całego projektu
npm run format

# Sprawdzenie instalacji Playwright
npx playwright --version
```

## 📊 Raportowanie

Playwright generuje automatyczne raporty HTML dostępne po uruchomieniu testów z flagą `--reporter=html`.

## 🤝 Wkład w projekt

1. Fork repozytorium
2. Utwórz branch dla funkcjonalności (`git checkout -b feature/amazing-feature`)
3. Commit zmiany (`git commit -m 'Add amazing feature'`)
4. Push do brancha (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

---

**Autor**: Twoje Imię  
**Licencja**: ISC  
**Wersja**: 1.0.0
