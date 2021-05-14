$(document).ready(function () {
    //Adds rotate function
    jQuery.fn.rotate = function (degrees) {
        $(this).css({ 'transform': 'rotate(' + degrees + 'deg)' });
        return $(this);
    };

    if (screen.width > 900) {
        //Add breadcrumb
        var breadcrumb = $("#breadcrumb");
        if (window.BreadCrumbItems !== "undefined" & breadcrumb.length) {
            var bcitems = [];
            for (var i = window.BreadCrumbItems.length - 1; i >= 0; i--) {
                var item = window.BreadCrumbItems[i];

                if (i == window.BreadCrumbItems.length - 1) {
                    bcitems.push({
                        type: "rootitem",
                        href: item.NavigateUrl,
                        text: item.Text,
                        showText: true,
                        icon: "home",
                        showIcon: true
                    })
                } else {
                    bcitems.push({
                        type: "item",
                        href: item.NavigateUrl,
                        text: item.Text,
                        showText: true
                    })
                }
            }

            breadcrumb.kendoBreadcrumb(
                {
                    navigational: true,
                    items: bcitems
                }
            );
        }
    }

    //Turn session menu into icons in the top (use the search in the top corner)
    if ($("#category_07405876-e8c2-4b24-a774-4ef57f596384_15").length && screen.width > 900) {
        sessionmenu = $(".logo-container > .search-container");
        sessionmenu.attr("id", "session-toolbar");
        sessionmenu.empty();

        primarycolor = $(".primary-color-sesion-toolbar").length > 0;

        toolbaritems = [{ template: `<a class="k-button${primarycolor?" k-primary":""}" id="toolbar-notifications" href="javascript:void(0)"><span class="k-icon k-i-notification"></span><span id="badge-notifications" style="display:none;">0</span></a>` }];

        //New format
        username = $("#category_07405876-e8c2-4b24-a774-4ef57f596384_15").text();

        subbuttons = [];
        if ($("#page_07405876-e8c2-4b24-a774-4ef57f596384_15").length) {
            subbuttons.push({ id: "toolbar-profile", text: $("#page_07405876-e8c2-4b24-a774-4ef57f596384_15").text(), icon: "user" });
        }

        if ($("#page_07405876-e8c2-4b24-a774-4ef57f596384_56").length) {
            subbuttons.push({ id: "toolbar-security", text: $("#page_07405876-e8c2-4b24-a774-4ef57f596384_56").text(), icon: "lock" });
        }

        subbuttons.push({ id: "toolbar-logout", text: $("#page_logout").text(), icon: "logout" });

        toolbaritems.push({
            id: "session-split",
            type: "splitButton",
            text: `<img class="supports-gravatar" id="toolbar-profile-image" src="https://www.gravatar.com/avatar/${window.GravatarHash}?s=28&d=mp" />&nbsp;&nbsp;${username}`,
            menuButtons: subbuttons
        })

        sessionmenu.kendoToolBar({
            resizable: false,
            items: toolbaritems
        });

        $("#session-split").click(function () {
            $("#session-split").next().click()
        });



        $('#badge-notifications').kendoBadge({
            color: 'info',
            shape: 'rounded'
        });

        sidebarcount = $("#UnreadMessageCount");
        if (sidebarcount.length == 0) {
            sidebarcount = $('<div id="UnreadMessageCount" style="display:none;"></div>');
            $('body').append(sidebarcount);
        }

        sidebarcount.bind('DOMSubtreeModified', function () {
            if ($(this).attr("unread")) {
                $("#badge-notifications").css("display", "flex");
                $("#badge-notifications").html($(this).attr("unread"));
                if ($(this).attr("unread") > 0) {
                    $("#badge-notifications").parent().addClass("has-notifications")
                } else {
                    $("#badge-notifications").parent().addClass("no-notifications")
                }
            }
        });

        $("#toolbar-logout").click(function () {
            document.getElementById('logoutForm').submit();
        })

        $("#toolbar-notifications").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_69").attr("href");
        })

        $("#toolbar-profile").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_15").attr("href");
        })

        $("#toolbar-security").click(function () {
            window.location.href = $("#page_07405876-e8c2-4b24-a774-4ef57f596384_56").attr("href");
        })

        sessionmenu.css("visibility", "visible");
    }

    //Turn service icons into drawer (skip in service home page and mobile)
    if ($("#serviceicons").length && (window.BreadCrumbItems[0].Id != "d3b2aa93-7e2b-4e0d-8080-67d14b2fa8a9_23" | $("#aspxcontent").length) && screen.width > 900) {
        sidebar = $("#serviceicons").parent();
        iconshead = $("#serviceicons");
        icons = $("#serviceicons > ul");
        iconlinks = icons.find(" li > a");
        legend = $("#serviceicons > legend");
        legendtext = legend.html();
        sidebarminwidth = sidebar.css("min-width");
        sidebar.css("min-width", "unset");
        sidebar.css("width", "59px");
        icons.css("width", "40px");
        icons.css("overflow", "hidden");
        legend.html("&nbsp;");
        legend.addClass("service-icons-collapsed");

        function addIconToolTips() {
            iconlinks.each(function (i, link) {
                l = $(link);
                l.kendoTooltip({
                    content: l.text(),
                    position: "right",
                    offset: 10,
                    callout: false
                });
            });
        }

        function removeIconToolTips() {
            iconlinks.each(function (i, link) {
                $(link).data("kendoTooltip").destroy();
            });
        }

        if (readCookie("_serviceIconsPinned")) {
            legend.addClass("service-icons-collapsed-pinned");
            addIconToolTips();
        }
        legend.click(function () {
            if (legend.hasClass("service-icons-collapsed")) {
                if (legend.hasClass("service-icons-collapsed-pinned")) {
                    legend.removeClass("service-icons-collapsed-pinned")
                    eraseCookie("_serviceIconsPinned");
                    removeIconToolTips();
                } else {
                    legend.addClass("service-icons-collapsed-pinned")
                    createCookie("_serviceIconsPinned", "1", 365);
                    addIconToolTips();
                }
            }
        });

        allowcollapse = false;
        allowexpand = false;
        expandhandle = null;
        collapsehandle = null;
        cleared_main_collapse = false;

        iconlinks.mouseenter(function () {
            allowexpand = true;
            if (sidebar.hasClass("drawer-expanded")) {
                allowcollapse = false;
                return;
            }

            if (mainsidebar_collapsehandle) { clearTimeout(mainsidebar_collapsehandle); mainsidebar_collapsehandle = 0; cleared_main_collapse = true; }

            if (legend.hasClass("service-icons-collapsed-pinned")) {
                return;
            }

            expandhandle = setTimeout(function () {
                if (!allowexpand | sidebar.hasClass("drawer-expanded")) {
                    return;
                }
                
                sidebar.addClass("drawer-expanded");
                allowcollapse = false;
                icons.css("overflow", "");
                icons.css("width", "");
                clone = sidebar.clone().css("width", "auto").appendTo(sidebar.parent());
                targetwidth = clone.width();
                clone.remove();
                sidebar.animate({ width: targetwidth }, 250);
                legend.html(legendtext);
                legend.removeClass("service-icons-collapsed")
                legend.removeClass("service-icons-collapsed-pinned")
            }, 100);
        });

        iconlinks.mousemove(function () {
            allowexpand = true;
            allowcollapse = false;
        });

        iconlinks.mouseout(function () {
            allowexpand = false;
            if (!sidebar.hasClass("drawer-expanded")) {
                return;
            }

            allowcollapse = true;

            if (expandhandle) { clearTimeout(expandhandle); expandhandle = 0; }
            if (collapsehandle) { clearTimeout(collapsehandle); collapsehandle = 0; }
            collapsehandle = setTimeout(function () {
                if (!allowcollapse | !sidebar.hasClass("drawer-expanded")) {
                    return;
                }
                sidebar.removeClass("drawer-expanded");
                allowcollapse = false;
                sidebar.css("min-width", "unset");
                icons.css("overflow", "hidden");
                sidebar.animate({ width: 59 }, 250);
                icons.animate({ width: 40 }, 250);
                legend.html("&nbsp;");
                legend.addClass("service-icons-collapsed")
                if (cleared_main_collapse) {
                    cleared_main_collapse = false;
                    mainsidebar_mouseout();
                }
            }, 500)
        });

        iconlinks.click(function () {
            if (expandhandle) { clearTimeout(expandhandle); expandhandle = 0; }
            allowexpand = false;
        });
    }

    //Hide secondary sidebar on pages that don't need it
    hassidebar = ["07405876-e8c2-4b24-a774-4ef57f596384_1", "07405876-e8c2-4b24-a774-4ef57f596384_3", "07405876-e8c2-4b24-a774-4ef57f596384_9", "07405876-e8c2-4b24-a774-4ef57f596384_5", "f43151f2-0303-4a88-96f3-1381b79700f8_1", "07405876-e8c2-4b24-a774-4ef57f596384_64", "07405876-e8c2-4b24-a774-4ef57f596384_15", "07405876-e8c2-4b24-a774-4ef57f596384_56", "07405876-e8c2-4b24-a774-4ef57f596384_40", "07405876-e8c2-4b24-a774-4ef57f596384_29", "07405876-e8c2-4b24-a774-4ef57f596384_27"];
    if ( screen.width > 900 && window.BreadCrumbItems && hassidebar.indexOf(window.BreadCrumbItems[0].Id) == -1 & $("#serviceicons").length == 0 & $("#pageicons").length==0) {
        $("#sidebar > fieldset > legend").html("&nbsp;");
        $("#sidebar > fieldset ul").css("visibility", "hidden");
        $("#sidebar > fieldset li").css("visibility", "hidden");
        $("#sidebar > fieldset legend:gt(0)").css("visibility", "hidden");
        $("#sidebar").css("width", "0");
        $("#sidebar").css("min-width", "unset");
    }

    function resizeBody() {
        let interval = setInterval(function () {
            bodyheight = $("body").css("min-height").replace("px", "");
            navheight = $(".nav-fostrap > ul").outerHeight(true)
            if (bodyheight == navheight) {
                clearInterval(interval);
            } else {
                $("body").css("min-height", $(".nav-fostrap > ul").outerHeight(true));
            }
        }, 20)
    }
    resizeBody();

    //disable default mouse hover on main menu
    $(".nav-fostrap > ul > li").addClass("nohover");

    //Handle menu clicks
    $(".nav-fostrap > ul > li").click(function (e) {
        $this = $(this);

        //Must have children
        if ($this.find("ul").children().length == 0) {
            return;
        }

        if (!$this.hasClass('manual-hover')) {
            $($this.children()[1]).slideDown(350);
            $this.addClass('manual-hover');
        } else {
            $($this.children()[1]).slideUp(350);
            $this.removeClass('manual-hover');
        }

        var state = [];
        $('.nav-fostrap .manual-hover').each(function () {
            state.push($(this).find(">a").attr("id"));
        });

        createCookie("_sideBarState", state, 365);
        resizeBody();
    })

    $(".nav-fostrap > ul > li > ul").click(function (e) {
        e.stopPropagation();
    });

    //Change main sidebar into drawer
    if (screen.width > 900) {
        sidebarsearch = $('.nav-fostrap .search-container');
        mainsidebar = $(".nav-fostrap");
        mainul = $("li > ul.dropdown");
        largelogo = $(".main-sidebar-collapsed #header > .logo-container > .logo");
        smalllogo = $("nav .fixed-top > .navbar-fostrap > img");
        mainsidebar_width = "263px";//mainsidebar.css("width");
        sidebar_marginleft = "263px";//$("#sidebar").css("margin-left");
        sidebarswitch_left = "238px"//sidebarswitch.css("left");

        mainsidebar_allowcollapse = false;
        mainsidebar_allowexpand = false;
        mainsidebar_expandhandle = null;
        mainsidebar_collapsehandle = null;

        mainsidebar_mouseenter = function () {
            if (!mainsidebar.hasClass("click-collapsed")) {
                return;
            }

            mainsidebar_allowexpand = true;
            if (mainsidebar.hasClass("drawer-expanded")) {
                mainsidebar_allowcollapse = false;
                return;
            }

            mainsidebar_expandhandle = setTimeout(function () {
                if (!mainsidebar_allowexpand | mainsidebar.hasClass("drawer-expanded")) {
                    return;
                }

                mainsidebar.addClass("drawer-expanded");
                expandMainSideBar();
            }, 500);
        }

        mainsidebar_mousemove = function () {
            mainsidebar_allowexpand = true;
            mainsidebar_allowcollapse = false;
        }

        mainsidebar_mouseout = function () {
            if (!mainsidebar.hasClass("click-collapsed")) {
                return;
            }

            mainsidebar_allowexpand = false;
            if (!mainsidebar.hasClass("drawer-expanded")) {
                return;
            }

            mainsidebar_allowcollapse = true;

            if (mainsidebar_expandhandle) { clearTimeout(mainsidebar_expandhandle); mainsidebar_expandhandle = 0; }
            if (mainsidebar_collapsehandle) { clearTimeout(mainsidebar_collapsehandle); mainsidebar_collapsehandle = 0; }
            mainsidebar_collapsehandle = setTimeout(function () {
                if (!mainsidebar_allowcollapse | !mainsidebar.hasClass("drawer-expanded")) {
                    return;
                }
                mainsidebar.removeClass("drawer-expanded");
                mainsidebar_allowcollapse = false;

                collapseMainSideBar();
            }, 500)
        }

        sidebarswitch = $('<div class="sidebar-switch">&#xe007;</div>')
        if (mainul.length) {
            $('body').append(sidebarswitch);
        }
        sidebarswitch.click(function () {
            if (mainsidebar.hasClass("drawer-expanded")) {
                mainsidebar.removeClass("drawer-expanded");
                mainsidebar.addClass("click-collapsed");
                collapseMainSideBar();
                createCookie("_sideBarCollapsed", 1, 365);
                addSideBarToolTips();
            } else {
                mainsidebar.addClass("drawer-expanded");
                mainsidebar.removeClass("click-collapsed");
                expandMainSideBar();
                eraseCookie("_sideBarCollapsed");
                removeSideBarToolTips();
            }
        });

        if (readCookie("_sideBarCollapsed") == 1) {
            mainsidebar.addClass("click-collapsed");
            collapseMainSideBar(true);
        } else {
            mainsidebar.addClass("drawer-expanded");
        }

        function addSideBarToolTips() {
            $(".nav-fostrap li a").each(function (i, link) {
                l = $(link);
                ismain = l.parent().parent().parent().prop("tagName") == "DIV";
                l.kendoTooltip({
                    content: l.text(),
                    position: "right",
                    offset: ismain?5:16,
                    callout: false
                });
            });
        }

        function removeSideBarToolTips() {
            $(".nav-fostrap li a").each(function (i, link) {
                $(link).data("kendoTooltip").destroy();
            });
        }

        if (mainsidebar.hasClass("click-collapsed")) {
            addSideBarToolTips();
        }

        //mainsidebar.find("ul:first").mouseenter(mainsidebar_mouseenter)
        //$(".nav-fostrap .search-container").mouseenter(mainsidebar_mouseenter)
        //mainsidebar.find("ul:first").mousemove(mainsidebar_mousemove);
        //$(".nav-fostrap .search-container").mousemove(mainsidebar_mousemove);
        //mainsidebar.find("ul:first").mouseout(mainsidebar_mouseout);
        //$(".nav-fostrap .search-container input").focus(mainsidebar_mousemove);
        //$(".nav-fostrap .search-container").mouseout(mainsidebar_mouseout);

        mainul.find("a").click(function () {
            if (mainsidebar_expandhandle) { clearTimeout(mainsidebar_expandhandle); mainsidebar_expandhandle = 0; }
            mainsidebar_allowexpand = false;
        });

        function expandMainSideBar() {
            smalllogo.hide();
            $(".nav-fostrap .search-container > span").css("width", "");
            $(".nav-fostrap li a > span").css("visibility", "");
            mainul.css("width", "");
            mainsidebar.animate({ width: mainsidebar_width }, {
                duration: 250,
                complete: () => {
                    mainsidebar.css("white-space", "");
                    mainsidebar.css("overflow", "");
                    $("HTML").removeClass("main-sidebar-collapsed");
                    largelogo.show();
                }
            });
            $("#sidebar").animate({ marginLeft: sidebar_marginleft }, { duration: 250 });
            breadcrumb.animate({ left: 268 }, { duration: 250 });
            sidebarswitch.animate({ left: sidebarswitch_left }, { duration: 250 });
            sidebarswitch.rotate(0);

        }

        function collapseMainSideBar(disableAnimation) {
            mainsidebar.css("white-space", "nowrap")
            mainsidebar.css("overflow", "hidden")
            if (disableAnimation) {
                mainsidebar.css("width", 102);
                $.each(mainul, function (i, ul) {
                    ul.style.setProperty('width', "80px", 'important');
                });
                setTimeout(function () { $(".nav-fostrap .search-container > span")[0].style.setProperty('width', "84px", 'important'); });
                $(".nav-fostrap li a > span").css("visibility", "hidden");
                $("#sidebar").css("margin-left", 100);
                sidebarswitch.css("left", 85);
                sidebarswitch.rotate(180);
            } else {
                largelogo.hide();
                mainsidebar.animate({ width: 102 }, {
                    duration: 250,
                    complete: () => {
                        $.each(mainul, function (i, ul) {
                            ul.style.setProperty('width', "80px", 'important');
                        });
                        $(".nav-fostrap .search-container > span")[0].style.setProperty('width', "84px", 'important');
                        $(".nav-fostrap li a > span").css("visibility", "hidden");
                        $("HTML").addClass("main-sidebar-collapsed");
                        smalllogo.show();
                    }
                });

                $("#sidebar").animate({ marginLeft: 100 }, { duration: 250 });
                breadcrumb.animate({ left: 107 }, { duration: 250 });
                sidebarswitch.animate({ left: 85 }, { duration: 250 });
                sidebarswitch.rotate(180);
            }
        }
    }
});