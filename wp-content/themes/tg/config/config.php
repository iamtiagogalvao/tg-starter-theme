<?php

class TG
{

    /** Add timber support. */
    public function __construct()
    {
        //### STYLES ######################################################
        require_once(get_template_directory() . "/config/styles.php"); //##
        //#################################################################

        //### SCRIPTS #####################################################
        require_once(get_template_directory() . "/config/scripts.php"); //#
        //#################################################################

        //### HELPERS #####################################################
        require_once(get_template_directory() . "/config/helpers.php"); //#
        //#################################################################

        add_action('after_setup_theme', array($this, 'theme_supports'));
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
    }

    /** Register Custom Post Types. */
    public function register_post_types()
    {
        require_once("custom-post-types.php");
    }
    /** Register Custom Taxonomies. */
    public function register_taxonomies()
    {
        require_once("custom-taxonomies.php");
    }

    public function theme_supports()
    {
        require_once("theme-support.php");
    }


    /**
     * Outputs an HTML img tag with the specified image source, CSS classes, and HTML attributes.
     *
     * @param string $name The name of the image file to use as the source attribute.
     * @param array $classes An array of CSS classes to apply to the img tag (optional).
     * @param array $attributes An array of HTML attributes to apply to the img tag (optional).
     * 
     * @return void This function does not return a value; it simply outputs HTML to the page.
     */
    public static function img($name, $classes = array(), $attributes = array())
    {
        $template_dir = get_template_directory_uri() . "/static/img/";
        $class_string = "";
        $attribute_string = "";

        if (sizeof($classes) > 0) :
            foreach ($classes as $class) :
                $class_string .= $class;
            endforeach;
        endif;

        if (sizeof($attributes) > 0) : foreach ($attributes as $attribute) :
                $attribute_string .= $attribute;
            endforeach;
        endif;

        echo sprintf('<img src="%s" %s %s/>', $template_dir . $name, 'class="' . $class_string . '"', $attribute_string);
    }

    public static function svg($svg)
    {
        $template_dir = get_template_directory_uri() . "/static/img/";


        $svg_file = file_get_contents($template_dir . $svg);

        $find_string = '<svg';
        $position = strpos($svg_file, $find_string);

        $svg_code = substr($svg_file, $position);

        echo $svg_code;
    }

    /**
     * Includes a template part file from a specific folder in the theme directory.
     *
     * @param string $slug The slug name for the generic template.
     */
    public static function load_component($slug)
    {

        $templates = array();

        // Add the custom folder path to the file path.
        $templates[] = sprintf('%s/components/%s/%s.php', get_template_directory(), $slug, $slug);

        // Allow 3rd party plugins or themes to override the templates with their own.
        $templates = apply_filters('load', $templates, $slug);

        // Get the template file and include it.
        foreach ($templates as $template) {
            if (file_exists($template)) {
                include $template;

                // Load the JavaScript file if it exists
                $js_file = sprintf('%s/components/%s/%s.js', get_template_directory(), $slug, $slug);
                $js_file_to_enqueue = sprintf('%s/static/js/components/%s/%s.js', get_template_directory(), $slug, $slug);
                if (file_exists($js_file)) {
                    wp_enqueue_script($slug."-min-component", $js_file_to_enqueue, array('jquery'), _S_VERSION, true);
                }
                return;
            }
        }
    }
}
