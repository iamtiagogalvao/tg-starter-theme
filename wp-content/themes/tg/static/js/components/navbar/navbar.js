jQuery(document).ready(a=>{const t=a("#site-navigation"),s=a(".theme-burger-wrapper"),e=a(".site-header"),o=a(document.body);s.click(()=>{"false"===t.attr("data-visible")?(o.toggleClass("scroll-blocked"),t.attr("data-visible","true"),s.toggleClass("close"),e.addClass("menu-open")):(o.toggleClass("scroll-blocked"),t.attr("data-visible","false"),s.toggleClass("close"),e.removeClass("menu-open"))});let l=a(window).height(),i=0;a(window).on("scroll",function(){var t,s=a(window).scrollTop();100<s?(e.addClass("fixed"),s>i?e.css("opacity",1):(t=Math.max(0,1-(s-100)/l),e.css("opacity",t))):e.removeClass("fixed").css("opacity",1),i=s}),e.css("transition","opacity 350ms ease-in-out"),a("body").hasClass("logged-in")&&(a("html").attr("style","margin: 0 !important"),a(window).width()<782?a("body").attr("style","margin-top: 32px !important"):a("body").attr("style","margin-top: 46px !important"))});