<?php
//****************************************
// 🆃🅶                                     
// Wᴏʀᴅᴘʀᴇss Sᴛᴀʀᴛᴇʀ Tʜᴇᴍᴇ                  
// @𝑣𝑒𝑟𝑠𝑖𝑜𝑛 1.0
//****************************************
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package tg
 */

get_header();
?>

<main id="primary" class="site-main">

	<div class="container-medium">
		<?php
		while (have_posts()) :
			the_post();

			get_template_part('templates/partials/content', get_post_type());

			the_post_navigation(
				array(
					'prev_text' => '<span class="nav-subtitle">' . esc_html__('Previous:', THEME_TEXT_DOMAIN) . '</span> <span class="nav-title">%title</span>',
					'next_text' => '<span class="nav-subtitle">' . esc_html__('Next:', THEME_TEXT_DOMAIN) . '</span> <span class="nav-title">%title</span>',
				)
			);

			// If comments are open or we have at least one comment, load up the comment template.
			if (comments_open() || get_comments_number()) :
				comments_template();
			endif;

		endwhile; // End of the loop.
		?>

	</div>

</main><!-- #main -->

<?php
get_sidebar();
get_footer();
