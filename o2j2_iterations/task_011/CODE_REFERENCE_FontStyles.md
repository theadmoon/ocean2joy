# CODE REFERENCE: Font Styles (index.css)

**Источник**: `/app/frontend/src/index.css` (Прототип Ocean2Joy)

---

## ОПРЕДЕЛЕНИЕ ШРИФТА ДЛЯ BODY (Строки 5-18)

**Текущая проблема в O2J2**: В файле `frontend/src/index.css` ОТСУТСТВУЕТ определение `font-family` для `body`. Из-за этого браузер использует fallback-шрифт (обычно Times New Roman или serif), что делает текст **тоньше** и менее читаемым.

**Референсный код из прототипа**:

```css
body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family:
        source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}
```

**ВАЖНО**:
- System fonts (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) обеспечивают **более жирное** и читаемое начертание.
- `-webkit-font-smoothing: antialiased` делает шрифт **чётким** на Retina-дисплеях.
- `-moz-osx-font-smoothing: grayscale` улучшает рендеринг на macOS.

---

## ГДЕ ВСТАВИТЬ В O2J2

В файле `O2J2/frontend/src/index.css`, **ПОСЛЕ** строки 3 (`@tailwind utilities;`) и **ПЕРЕД** строкой 5 (`@layer base {`), вставить:

```css
body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family:
        source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}
```

**Результат**: Файл должен выглядеть так:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family:
        source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}

@layer base {
  :root {
    ...
```
