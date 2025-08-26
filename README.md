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
- **Faker.js** - Biblioteka do generowania realistycznych danych testowych
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

### 4. Przygotowanie aplikacji testowej

Projekt wymaga aplikacji testowej GAD GUI API Demo. Upewnij się, że jest ona sklonowana w katalogu nadrzędnym:

```bash
cd ..
git clone https://github.com/jaktestowac/gad-gui-api-demo.git
cd gad-gui-api-demo
npm install
cd ../playwright-mcp
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

### Uruchomienie aplikacji testowej

Przed uruchomieniem testów należy uruchomić aplikację testową GAD GUI API Demo:

```bash
# Uruchomienie aplikacji (w osobnym terminalu)
npm run app:start

# Lub uruchomienie aplikacji w tle (Windows)
npm run app:start:background

# Zatrzymanie aplikacji (Windows)
npm run app:stop
```

### Uruchomienie testów

```bash
# Uruchomienie wszystkich testów (aplikacja musi być uruchomiona)
npm run test

# Uruchomienie testów w trybie UI
npm run test:ui

# Uruchomienie testów w trybie headed (widoczna przeglądarka)
npm run test:headed

# Uruchomienie testów w trybie debug
npm run test:debug

# Uruchomienie konkretnego testu
npx playwright test tests/auth.spec.ts

# Uruchomienie testów z raportem
npx playwright test --reporter=html
```

### Workflow dla developera

```bash
# Terminal 1: Uruchom aplikację
npm run app:start

# Terminal 2: Uruchom testy
npm run test:ui

# Lub szybkie uruchomienie (eksperymentalne)
npm run dev        # uruchom app + testy
npm run dev:ui     # uruchom app + testy UI
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

| Skrypt                         | Opis                                     |
| ------------------------------ | ---------------------------------------- |
| `npm run test`                 | Uruchamia wszystkie testy Playwright     |
| `npm run test:ui`              | Uruchamia testy w trybie UI              |
| `npm run test:headed`          | Uruchamia testy z widoczną przeglądarką  |
| `npm run test:debug`           | Uruchamia testy w trybie debug           |
| `npm run format`               | Formatuje kod za pomocą Prettier         |
| `npm run format:check`         | Sprawdza formatowanie bez zmian          |
| `npm run lint`                 | Sprawdza kod za pomocą ESLint            |
| `npm run lint:fix`             | Naprawia problemy ESLint automatycznie   |
| `npm run app:start`            | Uruchamia aplikację testową (foreground) |
| `npm run app:start:background` | Uruchamia aplikację testową (background) |
| `npm run app:stop`             | Zatrzymuje aplikację testową             |
| `npm run dev`                  | Uruchamia aplikację + testy              |
| `npm run dev:ui`               | Uruchamia aplikację + testy w trybie UI  |

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

### Git Conventions

**Zasada projektu:** Preferujemy proste, zwięzłe commit messages

```bash
# ✅ Preferowane
feat: add Faker.js for test data generation
fix: resolve login validation issue
test: add email format validation

# ❌ Unikaj
feat(test-data): implement comprehensive Faker.js library...
```

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
