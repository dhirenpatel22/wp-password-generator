# Password Generator Tool

A WordPress plugin that adds a password and passphrase generator to any page with a shortcode. Everything is generated in the visitor's browser, so no password is sent to the server.

It runs the [password generator on dhirenpatel.me](https://www.dhirenpatel.me/tools/password-generator/).

## What it does

- Generates five passwords at a time, 8 to 30 characters, from uppercase, lowercase, numbers and symbols.
- Passphrase mode: six words from the EFF large wordlist (7,776 words, about 12.9 bits of entropy per word, so about 77 bits for six), with an optional number and symbol.
- Options to exclude look-alike characters (O/0, l/1), use letters only (Easy to Say) or lowercase only (Easy to Read).
- Shows a strength score and estimated crack time for the first result, using zxcvbn from WordPress's bundled `password-strength-meter` script.
- Copy buttons, inline field errors and a screen-reader status message.

## How the randomness works

Every character and word is picked with `window.crypto.getRandomValues()`. Rejection sampling keeps the choice uniform (no modulo bias). `Math.random()` is not used anywhere.

I wrote up why an earlier version was weak and how I fixed it: [Why my passphrase generator was weak](https://www.dhirenpatel.me/blog/weak-passphrase-generator-fix/).

## Install

1. Download this repository as a ZIP (Code → Download ZIP).
2. In WordPress, go to Plugins → Add New Plugin → Upload Plugin, choose the ZIP and activate it.
3. Add the shortcode to a page:

```
[password_generator]
```

The scripts and styles load only on pages that use the shortcode. The plugin uses jQuery and `password-strength-meter`, both bundled with WordPress.

## Files

| File | Purpose |
|---|---|
| `password-generator.php` | Plugin header, shortcode and form markup |
| `assets/js/password-generator.js` | Generator, validation and copy buttons |
| `assets/js/eff-wordlist.js` | EFF large wordlist |
| `assets/css/password-generator.css` | Form and results styles |

## Licence

The plugin is GPL-2.0-or-later. See [LICENSE](LICENSE).

The wordlist is the [EFF large wordlist](https://www.eff.org/dice) by the Electronic Frontier Foundation, used under [CC BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/).

## Author

[Dhiren Patel](https://www.dhirenpatel.me/), Principal Full-Stack Engineer.
