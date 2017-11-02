
angular.module('directiveModule', [])
    /**
    * 菜单折叠
    */
    .directive('toggleMenu', function () {
        return {
            restrict: 'EA',
            link: function ($scope, element, attr, ngModel) {
                $('#sidebar .sub-menu > a').click(function () {
                    var last = $('.sub-menu.open', $('#sidebar'));
                    last.removeClass("open");
                    $('.arrow', last).removeClass("open");
                    $('.sub', last).slideUp(200);
                    var sub = $(this).next();
                    if (sub.is(":visible")) {
                        $('.arrow', $(this)).removeClass("open");
                        $(this).parent().removeClass("open");
                        sub.slideUp(200);
                    } else {
                        $('.arrow', $(this)).addClass("open");
                        $(this).parent().addClass("open");
                        sub.slideDown(200);
                    }
                });
                function responsiveView() {
                    var wSize = $(window).width();
                    if (wSize <= 768) {
                        $('#container').addClass('sidebar-close');
                        $('#sidebar > ul').hide();
                    }

                    if (wSize > 768) {
                        $('#container').removeClass('sidebar-close');
                        $('#sidebar > ul').show();
                    }
                }
                $(window).on('load', responsiveView);
                $(window).on('resize', responsiveView);

                $('.fa-navicon').click(function () {
                    if ($('#sidebar > ul').is(":visible") === true) {
                        $('#main-content').css({
                            'margin-left': '0px'
                        });
                        $('#sidebar').css({
                            'margin-left': '-180px'
                        });
                        $('#sidebar > ul').hide();
                        $("#container").addClass("sidebar-closed");
                    } else {
                        $('#main-content').css({
                            'margin-left': '180px'
                        });
                        $('#sidebar > ul').show();
                        $('#sidebar').css({
                            'margin-left': '0'
                        });
                        $("#container").removeClass("sidebar-closed");
                    }
                });
               
                function heightResize() {
                    var minHeight = $(window).height()-88;
                    $('.wrapper').css("min-height", minHeight+"px")
                }
                heightResize()
                $(window).resize(function () {
                   heightResize()
                });
            }
        }
    })