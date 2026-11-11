(function($) {
	'use strict';

	// EFF large wordlist (7,776 words, ~12.9 bits each), loaded by eff-wordlist.js.
	const words = window.pgtWords || [];

	// Uniform random integer in [0, max) from the browser's cryptographic generator (rejection sampling, no modulo bias).
	function randomInt(max) {
		const limit = Math.floor(0x100000000 / max) * max;
		const buf = new Uint32Array(1);
		do {
			window.crypto.getRandomValues(buf);
		} while (buf[0] >= limit);
		return buf[0] % max;
	}

	$(document).ready(function() {
		const $status = $('#pgt-status');

		// Shows an error tied to its field (by aria-describedby); clears it when msg is empty.
		function fieldError(id, $field, msg) {
			$('#' + id).text(msg).prop('hidden', !msg);
			if ($field) {
				$field.attr('aria-invalid', msg ? 'true' : null);
			}
		}

		$('#generate').click(function() {
			const $length = $('#length');
			const length = parseInt($length.val(), 10);
			const min = parseInt($length.attr('min'), 10);
			const max = parseInt($length.attr('max'), 10);
			const useUpper = $('#uppercase').is(':checked');
			const useLower = $('#lowercase').is(':checked');
			const useNumbers = $('#numbers').is(':checked');
			const useSymbols = $('#symbols').is(':checked');
			const passphraseMode = $('#passphrase').is(':checked');
			const excludeSimilar = $('#exclude-similar').is(':checked');
			const easySay = $('#easy-say').is(':checked');
			const easyRead = $('#easy-read').is(':checked');

			const charset = buildCharset(useUpper, useLower, useNumbers, useSymbols, excludeSimilar, easySay, easyRead);
			const anyType = useUpper || useLower || useNumbers || useSymbols;
			const lengthOk = passphraseMode || (length >= min && length <= max);
			const typesOk = passphraseMode || charset !== '';
			let typesMsg = '';
			if (!typesOk) {
				typesMsg = anyType ? 'Easy to Say uses letters only. Choose Uppercase or Lowercase Letters.' : 'Choose at least one character type.';
			}
			fieldError('length-error', $length, lengthOk ? '' : `Enter a length from ${min} to ${max}.`);
			fieldError('types-error', null, typesMsg);
			if (!lengthOk || !typesOk) {
				$('#results, #strength').empty();
				$status.text('');
				(lengthOk ? $('#uppercase') : $length).trigger('focus');
				return;
			}

			let passwords = [];
			for (let i = 0; i < 5; i++) {
				let password;
				if (passphraseMode) {
					password = generatePassphrase(6, useNumbers, useSymbols);
				} else {
					password = generatePassword(length, charset);
				}
				passwords.push(password);
			}

			const $list = $('<ul class="pgt-password-list"></ul>');
			passwords.forEach((pwd, i) => {
				$('<li class="pgt-password-item"></li>')
					.append($('<span class="pgt-password-text"></span>').text(pwd))
					.append($('<button type="button" class="pgt-copy-btn">Copy</button>').attr('aria-label', `Copy password ${i + 1}`).data('password', pwd))
					.appendTo($list);
			});
			$('#results').empty().append($list);

			$('.pgt-copy-btn').on('click', function() {
				const btn = $(this);
				navigator.clipboard.writeText(btn.data('password')).then(() => {
					const originalText = btn.text();
					btn.text('Copied!').addClass('pgt-copied');
					$status.text('Copied to clipboard.');
					setTimeout(() => {
						btn.text(originalText).removeClass('pgt-copied');
					}, 2000);
				}).catch(() => $status.text('Could not copy. Select the password and copy it.'));
			});

			if (passwords.length > 0 && typeof zxcvbn !== 'undefined') {
				const strength = zxcvbn(passwords[0]);
				$('#strength').text(`Strength: ${strength.score}/4 (Time to crack: ${strength.crack_times_display.offline_slow_hashing_1e4_per_second})`);
			} else {
				$('#strength').text('Strength: Unable to evaluate (zxcvbn library may be missing).');
			}
			$status.text(`${passwords.length} passwords generated. ${$('#strength').text()}`);
		});
	});

	// The characters a password can use, after the Easy to Say and Easy to Read filters.
	function buildCharset(upper, lower, numbers, symbols, exclude, easySay, easyRead) {
		let charset = '';
		if (lower) charset += 'abcdefghijkmnopqrstuvwxyz';
		if (upper) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
		if (numbers) charset += '23456789';
		if (symbols) charset += '!@#$%^&*()_+-=[]{}|;';

		if (!exclude) {
			if (lower) charset += 'l';
			if (upper) charset += 'OI';
			if (numbers) charset += '01';
		}

		if (easySay) charset = charset.replace(/[^a-zA-Z]/g, '');
		if (easyRead) charset = charset.toLowerCase();

		// Lowercasing can repeat letters (A and a, O and o); keep each character once so every one is equally likely.
		charset = Array.from(new Set(charset)).join('');

		return charset;
	}

	function generatePassword(length, charset) {
		if (!charset) return '';
		let password = '';
		for (let i = 0; i < length; i++) {
			password += charset[randomInt(charset.length)];
		}
		return password;
	}

	function generatePassphrase(wordCount, addNumbers, addSymbols) {
		if (words.length < 7776) return 'Error: word list not loaded';
		let passphrase = '';
		for (let i = 0; i < wordCount; i++) {
			passphrase += words[randomInt(words.length)] + ' ';
		}
		if (addNumbers) passphrase += randomInt(100);
		if (addSymbols) passphrase += '!@#$%^&*'[randomInt(8)];
		return passphrase.trim();
	}
})(jQuery);
