<?php
/**
 * Plugin Name: Password Generator Tool
 * Plugin URI:  https://www.dhirenpatel.me/
 * Description: A secure, client-side password generator to boost website security features.
 * Version:     1.2
 * Author:      Dhiren Patel
 * Author URI:  https://www.dhirenpatel.me/
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: password-generator-tool
 *
 * @package Password_Generator_Tool
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Shortcode to display the password generator form.
 *
 * Enqueues required scripts and styles only when the shortcode is rendered.
 *
 * @since 1.0
 * @return string The HTML output for the form.
 */
function pgt_shortcode() {
	// Enqueue assets only when shortcode is rendered
	wp_enqueue_script( 'password-strength-meter' );
	wp_enqueue_script(
		'pgt-wordlist',
		plugins_url( '/assets/js/eff-wordlist.js', __FILE__ ),
		array(),
		'1.2',
		true
	);
	wp_enqueue_script(
		'pgt-script',
		plugins_url( '/assets/js/password-generator.js', __FILE__ ),
		array( 'jquery', 'password-strength-meter', 'pgt-wordlist' ),
		'1.2',
		true
	);
	wp_enqueue_style(
		'pgt-style',
		plugins_url( '/assets/css/password-generator.css', __FILE__ ),
		array(),
		'1.2'
	);

	ob_start();
	?>
	<div id="password-generator" class="pgt-container">
		<h2><?php esc_html_e( 'Secure Password Generator', 'password-generator-tool' ); ?></h2>
		<form id="pgt-form" class="pgt-form">
			<div class="pgt-section">
				<label for="length" class="pgt-label"><?php esc_html_e( 'Password Length:', 'password-generator-tool' ); ?></label>
				<input type="number" id="length" class="pgt-input" min="8" max="30" value="12" aria-describedby="length-desc length-error">
				<small id="length-desc"><?php esc_html_e( 'Recommended: 12-15 characters for strong security.', 'password-generator-tool' ); ?></small>
				<p id="length-error" class="pgt-error" hidden></p>
			</div>
			<div class="pgt-options-row">
				<fieldset class="pgt-section pgt-options" aria-describedby="types-error">
					<legend><?php esc_html_e( 'Character Types', 'password-generator-tool' ); ?></legend>
					<p id="types-error" class="pgt-error" hidden></p>
					<div class="pgt-checkbox-group">
						<label><input type="checkbox" id="uppercase" checked> <?php esc_html_e( 'Uppercase Letters', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="lowercase" checked> <?php esc_html_e( 'Lowercase Letters', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="numbers" checked> <?php esc_html_e( 'Numbers', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="symbols" checked> <?php esc_html_e( 'Symbols', 'password-generator-tool' ); ?></label>
					</div>
				</fieldset>
				<fieldset class="pgt-section pgt-options">
					<legend><?php esc_html_e( 'Advanced Options', 'password-generator-tool' ); ?></legend>
					<div class="pgt-checkbox-group">
						<label><input type="checkbox" id="passphrase"> <?php esc_html_e( 'Passphrase Mode (6 words)', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="exclude-similar"> <?php esc_html_e( 'Exclude Similar Characters (e.g., O/0, l/1)', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="easy-say"> <?php esc_html_e( 'Easy to Say', 'password-generator-tool' ); ?></label>
						<label><input type="checkbox" id="easy-read"> <?php esc_html_e( 'Easy to Read', 'password-generator-tool' ); ?></label>
					</div>
				</fieldset>
			</div>
			<button type="button" id="generate" class="pgt-button"><?php esc_html_e( 'Generate Passwords', 'password-generator-tool' ); ?></button>
		</form>
		<div id="results" class="pgt-results"></div>
		<div id="strength" class="pgt-strength"></div>
		<p id="pgt-status" class="pgt-visually-hidden" role="status"></p>
		<p class="pgt-note"><em><?php esc_html_e( 'Passwords are generated securely in your browser—no data is sent to the server.', 'password-generator-tool' ); ?></em></p>
		<?php if ( shortcode_exists( 'wpsr_share_icons' ) ) : ?>
		<div class="password-generator-share-icons">
			<h5>Found this useful? Share it with someone who needs it!</h5>
			<?php echo do_shortcode( '[wpsr_share_icons icons="whatsapp, sms, facebook, x, linkedin, shortlink"]' ); ?>
		</div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'password_generator', 'pgt_shortcode' );
