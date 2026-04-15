jQuery(document).ready(function($){
    // document start
    
     // Navbar
     $( "<span class='clickD'></span>" ).insertAfter(".navbar-nav li.menu-item-has-children > a");
     $('.navbar-nav li .clickD').click(function(e) {
         e.preventDefault();
         var $this = $(this);
         if ($this.next().hasClass('show'))
            {
                $this.next().removeClass('show');
                $this.removeClass('toggled');
            } 
            else 
            {
                $this.parent().parent().find('.sub-menu').removeClass('show');
                $this.parent().parent().find('.toggled').removeClass('toggled');
                $this.next().toggleClass('show');
                $this.toggleClass('toggled');
            }
     });
    
     $(window).on('resize', function(){
         if ($(this).width() < 1025) {
             $('html').click(function(){
                 $('.navbar-nav li .clickD').removeClass('toggled');
                 $('.toggled').removeClass('toggled');
                 $('.sub-menu').removeClass('show');
             });
             $(document).click(function(){
                 $('.navbar-nav li .clickD').removeClass('toggled');
                 $('.toggled').removeClass('toggled');
                 $('.sub-menu').removeClass('show');
             });
             $('.navbar-nav').click(function(e){
                e.stopPropagation();
             });
         }
     });
     // Navbar end
    
    
     
    /* ===== For menu animation === */
    $(".navbar-toggler").click(function(){
        $(".navbar-toggler").toggleClass("open");
        $(".navbar-toggler .stick").toggleClass("open");
        $('body,html' ).toggleClass("open-nav");
    });
    let headrHeight = $('.main-head').outerHeight();
    setInterval(() => {
        headrHeight = $('.main-head').outerHeight();
    }, 100);
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        let target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html, body').animate({ scrollTop: target.offset().top - (headrHeight / 3) }, 500);
        }
    });
    // Navbar end
    const headerHeightStatic = $('.main-head').outerHeight();
    // Sticky Nav
    $(window).scroll(function() {     
        var scroll = $(window).scrollTop();     
        if (scroll > 0) { 
            $(".main-head").addClass("fixed");
            $("body").css("padding-top", headerHeightStatic + "px"); 
        } 
        else {
            $(".main-head").removeClass("fixed"); 
            $("body").css("padding-top", "0");
        };
    });
    if(document.querySelector('footer')){
        function adjustFooter() {
            const footer = document.querySelector('footer');
            const content = document.querySelector('body');
            const totalContentHeight = content.offsetHeight;
            const viewportHeight = window.innerHeight;
            if (totalContentHeight < viewportHeight) {
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
                footer.style.left = '0';
            } else {
                footer.style.position = 'static';
            }
        };
        adjustFooter();
        window.addEventListener('load', adjustFooter);
        window.addEventListener('resize', adjustFooter);
    };
    $('.award-img-item').each(function() {
        const $original = $(this);
        for (let i = 0; i < 5; i++) {
          const $clone = $original.clone();
          $clone.insertAfter($original.next().next().next().next());
        }
    });
    if($('.sign-content-slider').length){
        $('.sign-content-slider').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: false,
            pauseOnFocus: true,
            pauseOnDotsHover: true,
            arrows: false,
            cssEase: 'linear',
            adaptiveHeight: true
        });
    };
    if($(".input-grp #txtDateRange,.input-grp input.date").length){
        $(function() {
            $( ".input-grp input.date" ).datepicker({
                dateFormat: "dd-mm-yy",
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
            
            });
        });
        (function($) {
            function compareDates(startDate, endDate, format) {
              var temp, dateStart, dateEnd;
              try {
                dateStart = $.datepicker.parseDate(format, startDate);
                dateEnd = $.datepicker.parseDate(format, endDate);
                if (dateEnd < dateStart) {
                  temp = startDate;
                  startDate = endDate;
                  endDate = temp;
                }
              } catch (ex) {}
              return { start: startDate, end: endDate };
            }
          
            $.fn.dateRangePicker = function (options) {
              options = $.extend({
                "changeMonth": false,
                "changeYear": false,
                "numberOfMonths": 2,
                "rangeSeparator": " - ",
                      "useHiddenAltFields": false
              }, options || {});
          
                  var myDateRangeTarget = $(this);
              var onSelect = options.onSelect || $.noop;
              var onClose = options.onClose || $.noop;
              var beforeShow = options.beforeShow || $.noop;
              var beforeShowDay = options.beforeShowDay;
              var lastDateRange;
          
              function storePreviousDateRange(dateText, dateFormat) {
                var start, end;
                dateText = dateText.split(options.rangeSeparator);
                if (dateText.length > 0) {
                  start = $.datepicker.parseDate(dateFormat, dateText[0]);
                  if (dateText.length > 1) {
                    end = $.datepicker.parseDate(dateFormat, dateText[1]);
                  }
                  lastDateRange = {start: start, end: end};
                } else {
                  lastDateRange = null;
                }
              }
                  
              options.beforeShow = function(input, inst) {
                var dateFormat = myDateRangeTarget.datepicker("option", "dateFormat");
                storePreviousDateRange($(input).val(), dateFormat);
                beforeShow.apply(myDateRangeTarget, arguments);
              };
                  
              options.beforeShowDay = function(date) {
                var out = [true, ""], extraOut;
                if (lastDateRange && lastDateRange.start <= date) {
                  if (lastDateRange.end && date <= lastDateRange.end) {
                    out[1] = "ui-datepicker-range";
                  }
                }
          
                if (beforeShowDay) {
                  extraOut = beforeShowDay.apply(myDateRangeTarget, arguments);
                  out[0] = out[0] && extraOut[0];
                  out[1] = out[1] + " " + extraOut[1];
                  out[2] = extraOut[2];
                }
                return out;
              };
          
              options.onSelect = function(dateText, inst) {
                var textStart;
                if (!inst.rangeStart) {
                  inst.inline = true;
                  inst.rangeStart = dateText;
                } else {
                  inst.inline = false;
                  textStart = inst.rangeStart;
                  if (textStart !== dateText) {
                    var dateFormat = myDateRangeTarget.datepicker("option", "dateFormat");
                    var dateRange = compareDates(textStart, dateText, dateFormat);
                    myDateRangeTarget.val(dateRange.start + options.rangeSeparator + dateRange.end);
                    inst.rangeStart = null;
                              if (options.useHiddenAltFields){
                                  var myToField = myDateRangeTarget.attr("data-to-field");
                                  var myFromField = myDateRangeTarget.attr("data-from-field");
                                  $("#"+myFromField).val(dateRange.start);
                                  $("#"+myToField).val(dateRange.end);
                              }
                  }
                }
                onSelect.apply(myDateRangeTarget, arguments);
              };
          
              options.onClose = function(dateText, inst) {
                inst.rangeStart = null;
                inst.inline = false;
                onClose.apply(myDateRangeTarget, arguments);
              };
          
              return this.each(function() {
                if (myDateRangeTarget.is("input")) {
                  myDateRangeTarget.datepicker(options);
                }
                      myDateRangeTarget.wrap("<div class=\"dateRangeWrapper\"></div>");
              });
            };
          }(jQuery));
          
              $("#txtDateRange").dateRangePicker({
                  showOn: "focus",
                  rangeSeparator: " to ",
                  dateFormat: "yy-mm-dd",
                  useHiddenAltFields: true,
                  constrainInput: true
              });
    };
    const popups = document.querySelectorAll("[data-popup]");
    $('body,html').removeClass("over-hide");
    popups.forEach(pop => {
        let popContent = "";
        let dataAttr = pop.getAttribute('data-popup');
        if(!dataAttr || dataAttr.trim() === "") {
            popContent = pop.innerHTML.trim().toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, "-").replace(/^-|-$/g, "");
        }else{
            popContent = pop.getAttribute('data-popup');
        }
        pop.setAttribute('data-popup', '.' + popContent);
        $(pop).click(function () {
            const targetSelector = $(this).data('popup');
            $(".popup-wrp").removeClass("active");
            $(this).addClass("active");
            if (targetSelector) {
            $(targetSelector).addClass("active");
            $('body,html').addClass("over-hide");
            } else {
            $('body,html').removeClass("over-hide");
            }
        });
    });
    $(".popup-wrp").find(".pop-overlay, .close-btn").click(function() {
        $(".popup-wrp").removeClass("active");
        $('body,html').removeClass("over-hide");
    });
    const otpInputs = document.querySelectorAll('.otp-container input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            };
        });
        input.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            };
        });
    });
    function getOTP() {
        return Array.from(otpInputs).map(input => input.value).join('');
    };
    getOTP();
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    function validatePasswords() {
        const pwd = passwordInput.value;
        const confirmPwd = confirmPasswordInput.value;
        if (!pwd && !confirmPwd) {
            toggleButtons.forEach(btn => {
                btn.querySelector("img").src = './images/eye-open.png';
            });
        } else if (pwd === confirmPwd) {
            toggleButtons.forEach(btn => {
                btn.querySelector("img").src = './images/check-green.png';
            });
        } else {
            toggleButtons.forEach(btn => {
                btn.querySelector("img").src = './images/cross-red.png';
            });
        }
    };
    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', validatePasswords);
        confirmPasswordInput.addEventListener('input', validatePasswords);
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.querySelector("img").src = 'https://cdn-icons-png.flaticon.com/512/9726/9726390.png';
            } else {
                input.type = 'password';
                this.querySelector("img").src = './images/eye-open.png';
            }
            validatePasswords();
            });
        });
    };

    $('.popup-wrp').removeClass("active");
    $('.forgot-password form').on('submit', function(e) {
        e.preventDefault();
        $('.forgot-password').removeClass("active");
        $('.validate-otp').addClass("active");
    });
    $('.validate-otp form').on('submit', function(e) {
        e.preventDefault();
        $('.validate-otp').removeClass("active");
        $('.reset-pass').addClass("active");
    });
    $('.reset-pass form').on('submit', function(e) {
        e.preventDefault();
        if (passwordInput.value !== confirmPasswordInput.value) {
            // alert("Passwords do not match!");
            return;
        }
        alert("Your Password Has Been Changed!");
        $('.forgot-password form, .validate-otp form, .reset-pass form').each(function() {
            this.reset();
        });
        $('.reset-pass').removeClass("active");
        $("body,html").removeClass("over-hide")
    });
    $(".hide").hide();
    $(".viewuploaded,.get-ledger button").click(function(){
        $(".show").hide();
        $(".hide").show();
    });
    $(".back-btn").click(function(){
        $(".hide").hide();
        $(".show").show();
    });
    $(".search-ledger-head input").click(function(){
        $(".search-ledger-body").slideToggle();
    });
    $(".search-ledger-body").hide();
    document.querySelectorAll('.client-list li').forEach(function(item) {
        item.addEventListener('click', function() {
          document.querySelector('#search-client').value = this.textContent;
          document.querySelector('.client-name').innerHTML = this.textContent;
          $(".search-ledger-body").slideUp();
        });
    });
    $(".sidebar-toggler").on("click",function(){
        $(".dsbrd-sidebar-wrp,.dashboard-body-wrp,.ds-panel-header").toggleClass("active");
    });
});