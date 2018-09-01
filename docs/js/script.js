
/**
 * clipboard
 */
 /**
  * super global
  */
var editor_defualt_height = 400

$(document).ready(function () {
var pre = document.getElementsByTagName('pre')
for (var i = 0; i < pre.length; i++) {
    var isLanguage = pre[i].children[0].className.indexOf('language-');
    if ( isLanguage === 0 ) {
      var button = document.createElement('button');
          button.className = 'copy-button';
          button.textContent = 'Copy';
          pre[i].appendChild(button);
    }
}
// setting up target for copy
var copyCode = new ClipboardJS('.copy-button', {
    target: function(trigger) {
        return trigger.previousElementSibling;
    }
});

// success message
copyCode.on('success', function(event) {
    event.clearSelection();
    event.trigger.textContent = 'Copied';
    window.setTimeout(function() {
        event.trigger.textContent = 'Copy';
    }, 2000);
});
// error message
copyCode.on('error', function(event) {
    event.trigger.textContent = 'Press "Ctrl + C" to copy';
    window.setTimeout(function() {
        event.trigger.textContent = 'Copy';
    }, 2000);
});

})

/**
 * toggle toc
 */
$(function () {
  let toc_toggle_span = $("#toc_toggle_span")
  let toc_content = $('#toc_content')
  toc_toggle_span.on('click', function () {
    if (toc_content.hasClass('d-none')) {
      toc_content.removeClass('d-none')
      toc_toggle_span.text('[hide]')
    }else {
      toc_content.addClass('d-none')
      toc_toggle_span.text('[show]')
    }
  })
})

/**
 * highlightjs
 */
$(function () {
hljs.initHighlightingOnLoad();
})

/**
 * hide and show editor panel
 */

$(function () {

  let App = {
    init: function () {
      this.domCached()
      this.bindEvents()
    },
    domCached: function () {
      this.$close_footer_panel_button = $('#editor #close_footer_panel_button');
      this.$toggle_editor_button = $('#toggle_editor_button');
      this.$editor = $('#editor');
      this.$editor_inner = $('#editor_inner')
      this.$body = $('body')
      this.$open_editor_from_footer = $('#open_editor_from_footer')
    },
    openingEditor: function () {
      this.$editor.css({opacity: 1}) // since initially i kept opacity 0 rather than display block
      this.$editor.slideDown(150)
      this.$body.css('margin-bottom', editor_defualt_height);

    },
    closingEditor: function () {
      this.$editor.height(editor_defualt_height) // reset editor height to default height 300, before closing
      this.$editor.slideUp(150);
      this.$body.css('margin-bottom', 0)
    },
    toggleEditor: function () {
      console.log('editor', this.$editor)
      this.$editor.is(':hidden') ? this.openingEditor() : this.closingEditor();
    },
    bindEvents: function () {
      this.$toggle_editor_button.on('click', this.toggleEditor.bind(this))
      this.$close_footer_panel_button.on('click', this.closingEditor.bind(this))
      this.$open_editor_from_footer.on('click', this.openingEditor.bind(this))
    }
  }
  App.init();
})



// })

/**
 * resize editor panel
 * using jquery resizable plugin
 *  better than jquery ui.
 *  jquery ui not working comfortably with fixed content
 */

$(function () {
  let editor = $('#editor')
  let editor_inner = $('#editor_inner')
  let body = $('body')
  editor.resizable({
    direction: 'top',
    stop: function () {
      editor_inner.height(editor.innerHeight()) // reset editor height to default height 300, before closing
      body.css("margin-bottom", editor.outerHeight())
    }
  })
})



// CodeMirror modular coding
// localStorage.clear();
$(function() {
  var App = {
    initialOptionsWithoutValue: {
      lineNumbers: true,
      lineWrapping: false,
      tabSize: 2,
      keyMap: 'default',
      theme: "solarized",
      mode : "javascript",
    },
    initialCode: {
      value: `//start writing`,
    },
    initialFontOptions: {
      fontSize: `18px`,
      fontFamily: 'monaco'
    },
    options: {...this.initialCode, ...this.initialOptionsWithoutValue},
    fontOptions: this.initialFontOptions,
    fontStacks: {
      monaco: "Monaco, Menlo, 'fira code', monospace",
      menlo: "Menlo, Monaco, 'fira code', monospace",
      fira_code: "'fira Code', Monaco, Menlo, monospace",
      source_code_pro: "'Source Code Pro', Monaco, Menlo, 'fira code', monospace",
      ubuntu_mono: "'Ubuntu Mono', Monaco, Menlo, 'fira code', monospace",
    },
    setOrGetLocalStorage: function (key, initial_value) {
      let value = initial_value;
       if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(initial_value));
      } else {
        value = JSON.parse(localStorage.getItem(key));
      }
      return value;
    },
    initializeLocalStorage: function () {
      let optionsWithOutValue = this.setOrGetLocalStorage('optionsWithOutValue', this.initialOptionsWithoutValue)
      let code = this.setOrGetLocalStorage('code', this.initialCode)
      let fontOptions = this.setOrGetLocalStorage('fontOptions', this.initialFontOptions)
      this.options = Object.assign(optionsWithOutValue, code)
      this.fontOptions = fontOptions
    },
    updateLocalStorage: function (key, value) {
      // pure function
      localStorage.setItem(key, JSON.stringify(value))
    },
    codeMirrorBeforeSetUp: function () {
      CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword});
      }
      CodeMirror.Vim.map('jj', '<Esc>', 'insert');
    },
    codeMirrorAfterSetUp: function () {
      emmetCodeMirror(this.editor)
      this.$editor_panel.hide();
    },
    init: function () {
      this.initializeLocalStorage();
      this.domCached();
      this.codeMirrorBeforeSetUp();
      this.render();
      this.codeMirrorAfterSetUp();
      this.bindEvents();
      this.updateInitialDomSelection();
    },
    domCached: function () {
      // all variable written with underscore
      // all function camelCase
      this.mounting_div = document.getElementById('codemirror_editor')
      this.$theme = $("input[name='theme']");
      this.$mode = $("input[name='mode']");
      this.$vim = $("input[name='vim']");
      this.$line_wrapping = $("input[name='lineWrapping']");

      this.$open_codemirror_setting_button = $('#open_codemirror_setting_button')
      this.$close_codemirror_setting_button = $('#close_codemirror_setting_button')
      this.$codemirror_setting = $('.codemirror_setting')
      this.$font_family = $('#font_family');
      this.$font_size = $('#font_size');
      this.$codemirror_editor_mounting_div = $('#codemirror_editor')
      this.$tab_size = $('#tab_size')
      this.$editor_panel = $('#editor')
      let currentOptions = {
        options: this.options,
        fontOptions: this.fontOptions,
      }
      console.log('currentOptions', currentOptions)
    },
    render: function () {
      this.editor = CodeMirror(this.mounting_div, {
        value: this.options.value,
        lineNumbers: this.options.lineNumbers,
        theme: this.options.theme,
        mode : this.options.mode,
        lineWrapping: this.options.lineWrapping,
        tabSize: this.options.tabSize,
        keyMap: this.options.keyMap,

        profile: 'xhtml',
        matchBrackets: true,
        autoCloseBrackets: true,
        showCursorWhenSelecting: true,
        continueComments: "Enter",
        extraKeys: {
          "Ctrl-Q": "toggleComment",
          "Ctrl-Space": "autocomplete"
        },
      })
    },
    updateCodemirrorOption: function (key, value) {
      this.options[key] = value
      this.editor.setOption(key, value)

      let options = this.options;
      delete options.value
      this.updateLocalStorage('optionsWithOutValue', options)
    },
    changeRadioOption: function (key, e) {
      this.updateCodemirrorOption(key, e.target.value)
    },
    closeCodemirrorSetting: function () {
      this.$codemirror_setting.slideUp(100)
    },
    openCodemirrorSetting: function () {
      this.$codemirror_setting.slideDown(100)
    },
    updateInitialDomSelection: function () {
      $("input[name='theme'][value=" + this.options.theme + "]").attr('checked', 'checked')
      $("input[name='mode'][value=\"" + this.options.mode + "\"]").attr('checked', 'checked')
      this.options.keyMap == 'vim' ? this.$vim.attr('checked', true) : null
      this.options.lineWrapping  ? this.$line_wrapping.attr('checked', true) : null
      this.$font_size.val(this.fontOptions.fontSize)
      this.$font_family.val(this.fontOptions.fontFamily)
      this.$codemirror_editor_mounting_div.css({'font-size': this.fontOptions.fontSize , 'font-family': this.fontStacks[this.fontOptions.fontFamily]})
      this.$tab_size.val(this.options.tabSize)

      let currentOptions = {
        options: this.options,
        fontOptions: this.fontOptions,
      }

    },
    changeLineWrappingOption: function () {
      let value = false;
      if (this.$line_wrapping.is(':checked')) {
        value = true;
      }
      this.updateCodemirrorOption('lineWrapping', value);
    },
    changeKeyMapOption: function () {
      let value = 'default'
      if (this.$vim.is(':checked')) {
        value = 'vim'
      }
      this.updateCodemirrorOption('keyMap', value);
    },
    editorOnChange() {
      let value = this.editor.getValue();
      let code = {value: value}
      this.updateLocalStorage('code', code)
    },
    updateFontOptions: function (key, value) {
      this.fontOptions[key] = value;
      this.updateLocalStorage('fontOptions', this.fontOptions)
    },
    changeFontSize: function (e) {
      this.updateFontOptions('fontSize', e.target.value);
      this.$codemirror_editor_mounting_div.css('font-size', e.target.value);
    },
    changeFontFamily: function (e) {
      this.updateFontOptions('fontFamily', e.target.value)
      let ff = this.fontStacks[e.target.value];
      this.$codemirror_editor_mounting_div.css('font-family', ff);
    },
    changeTabSize: function (key, e) {
      let tabSize = parseInt(e.target.value);
      if (tabSize && tabSize > 1 && tabSize < 9) {
        this.updateCodemirrorOption(key, e.target.value)
      } else {
        console.log(e.target.value, ' is not valid ')
      }
    },
    bindEvents: function () {
      this.$theme.on('click', this.changeRadioOption.bind(this, 'theme'))
      this.$mode.on('click', this.changeRadioOption.bind(this, 'mode'))
      this.$vim.on('change', this.changeKeyMapOption.bind(this))
      this.$line_wrapping.on('change', this.changeLineWrappingOption.bind(this))
      this.$close_codemirror_setting_button.on('click', this.closeCodemirrorSetting.bind(this))
      this.$open_codemirror_setting_button.on('click', this.openCodemirrorSetting.bind(this))
      this.editor.on('change', this.editorOnChange.bind(this))
      this.$font_size.on('change', this.changeFontSize.bind(this))
      this.$font_family.on('change', this.changeFontFamily.bind(this))
      this.$tab_size.on('keyup', this.changeTabSize.bind(this, 'tabSize'))
    },
  }

  App.init()


})










