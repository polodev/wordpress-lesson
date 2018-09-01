import React, { Component } from 'react';
import { render } from 'react-dom';
import AceEditor from 'react-ace';
import 'brace/keybinding/vim'

const languages = [
  'javascript',
  'php',
  'jsx',
  'python',
  'markdown',
  'json',
  'html',
  'css',
]

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'solarized_light'
]

languages.forEach((lang) => {
  require(`brace/mode/${lang}`)
  require(`brace/snippets/${lang}`)
})

themes.forEach((theme) => {
  require(`brace/theme/${theme}`)
})
/*eslint-disable no-alert, no-console */
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

let defaultValue =
`function onLoad(editor) {
  console.log("start coding");
}`;

if (localStorage.getItem('code') === null) {
  localStorage.setItem('code', JSON.stringify(defaultValue));
} else {
  defaultValue = JSON.parse(localStorage.getItem('code'));
}

class MyAceEditor extends Component {
  onLoad() {
    console.log('i\'ve loaded');
  }
  onChange(newValue) {
    localStorage.setItem('code', JSON.stringify(newValue))
    this.setState({
      value: newValue
    })
  }

  onSelectionChange(newValue, event) {
  }

  onCursorChange(newValue, event) {
  }

  onValidate(annotations) {
  }

  setTheme(e) {
    this.setState({
      theme: e.target.value
    })
  }
  setMode(e) {
    this.setState({
      mode: e.target.value
    })
  }
  setBoolean(name, value) {
    this.setState({
      [name]: value
    })
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value,10)
    })
  }
  toggleShowSetting () {
    this.setState({showSetting: !this.state.showSetting})
  }
  setVimKeyboardHandler (value) {
    let keyboardHandler = value ? 'vim' : '';
    this.setState({keyboardHandler})
  }
  renderSetting() {
    return <div id='ace_editor_setting' className='ml-4'>
      <h2 className='text-center'>All settings </h2>
      <h4 className='text-center' >
        <span className='cp btn btn-danger' onClick={() => this.setState({showSetting: false})} >close Setting</span>
      </h4>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="mode">Mode</label>
            <select id='mode' className='form-control' name="mode" onChange={this.setMode} value={this.state.mode}>
              {languages.map((lang) => <option  key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select className='form-control' id='name' name="Theme" onChange={this.setTheme} value={this.state.theme}>
              {themes.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="font_size">font Size</label>
            <select id='font_size' className='form-control' name="Font Size" onChange={this.setFontSize} value={this.state.fontSize}>
              {[14,16,18,20,24,28,32,40].map((lang) => <option  key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-check pt-4">
            <input id='vim_key_bindings' className='form-check-input' type="checkbox" checked={this.state.keyboardHandler === 'vim'} onChange={(e) => this.setVimKeyboardHandler(e.target.checked)} />
            <label htmlFor="vim_key_bindings" className='form-check-label'>
              Enable Vim Keybinding
            </label>
          </div>
          <div className="form-check">
            <input id='enable_word_wrap' className='form-check-input' type="checkbox" checked={this.state.wrapEnabled} onChange={(e) => this.setBoolean('wrapEnabled', e.target.checked)} />
            <label htmlFor="enable_word_wrap" className='form-check-label'>
              Enable Word Wrap
            </label>
          </div>
          <div className="form-check">
            <input id='basic_auto_complete' className='form-check-input' type="checkbox" checked={this.state.enableBasicAutocompletion} onChange={(e) => this.setBoolean('enableBasicAutocompletion', e.target.checked)} />
            <label htmlFor="basic_auto_complete" className='form-check-label'>
              Enable Basic Autocomplete
            </label>
          </div>

          <div className="form-check">
            <input id='enable_live_auto_complete' className='form-check-input' type="checkbox" checked={this.state.enableLiveAutocompletion} onChange={(e) => this.setBoolean('enableLiveAutocompletion', e.target.checked)} />
            <label htmlFor="enable_live_auto_complete" className='form-check-label'>
              Enable Live Autocomplete
            </label>
          </div>

          <div className="form-check">
            <input id='show_gutter' className='form-check-input' type="checkbox" checked={this.state.showGutter} onChange={(e) => this.setBoolean('showGutter', e.target.checked)} />
            <label htmlFor="show_gutter" className='form-check-label'>
              Show Gutter
            </label>
          </div>
          <div className="form-check">
            <input id='show_print_margin' className='form-check-input' type="checkbox" checked={this.state.showPrintMargin} onChange={(e) => this.setBoolean('showPrintMargin', e.target.checked)} />
            <label htmlFor="show_print_margin" className='form-check-label' >
              Show Print Margin
            </label>
          </div>
          <div className="form-check">
            <input id='highlight_active_line' className='form-check-input' type="checkbox" checked={this.state.highlightActiveLine} onChange={(e) => this.setBoolean('highlightActiveLine', e.target.checked)} />
            <label htmlFor="highlight_active_line" className='form-check-label' >
              Highlight Active Line
            </label>
          </div>
          <div className="form-check">
            <input id='enable_snippets' className='form-check-input' type="checkbox" checked={this.state.enableSnippets} onChange={(e) => this.setBoolean('enableSnippets', e.target.checked)} />
            <label htmlFor="enable_snippets" className='form-check-label' >
              Enable Snippets
            </label>
          </div>
          <div className="form-check">
            <label htmlFor="show_line_numbers" className='form-check-label' >
            <input id='show_line_numbers' className='form-check-input' type="checkbox" checked={this.state.showLineNumbers} onChange={(e) => this.setBoolean('showLineNumbers', e.target.checked)} />
              Show Line Numbers
            </label>
          </div>
          {/* template

          <div className="form-check">
            <label htmlFor="hello" className='form-check-label' >
            </label>
            <input id='hello' className='form-check-input' type="checkbox" />
          </div>

          */}
        </div>
      </div>
      <div className='mt-2'>
          <p>
            <strong>Editor size </strong>
            <span onClick={() => this.changeHeight('decrease')} className='btn btn-info'> - </span>
            <span className="px-2 d-inline-block"> {this.state.editorHeight} </span>
            <span onClick={() => this.changeHeight('increase')} className='btn btn-info'> + </span>
        </p>
      </div>
      <div className="field">
        <p className="control">
          <label className="checkbox">
          </label>
        </p>
      </div>
    </div>
  }


  changeHeight (value) {
    let {editorHeight} = this.state
    if (value === 'increase' && editorHeight < 850 ) {
      editorHeight += 10
    } else if (value === 'decrease' && editorHeight > 200) {
      editorHeight -= 10;
    }
    this.setState({editorHeight})
  }

  constructor(props) {
    super(props);
    this.state = {
      value: defaultValue,
      theme: 'tomorrow',
      mode: 'javascript',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      fontSize: 16,
      showGutter: true,
      showPrintMargin: true,
      highlightActiveLine: true,
      enableSnippets: false,
      showLineNumbers: true,
      showSetting: false,
      keyboardHandler: 'vim',
      wrapEnabled: false,
      editorHeight: 400,
    };
    this.setTheme = this.setTheme.bind(this);
    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setFontSize = this.setFontSize.bind(this);
    this.setBoolean = this.setBoolean.bind(this);
    this.renderSetting = this.renderSetting.bind(this)
    this.renderEditor = this.renderEditor.bind(this)
    this.toggleShowSetting = this.toggleShowSetting.bind(this)
    this.setVimKeyboardHandler = this.setVimKeyboardHandler.bind(this)
    this.changeHeight = this.changeHeight.bind(this)

  }
  renderEditor () {
    return <div>
      <div>
        <AceEditor
          mode={this.state.mode}
          theme={this.state.theme}
          wrapEnabled={this.state.wrapEnabled}
          width= '95%'
          height= {`${this.state.editorHeight}px`}
          name="ace_editor"
          onLoad={this.onLoad}
          onChange={this.onChange}
          onSelectionChange={this.onSelectionChange}
          onCursorChange={this.onCursorChange}
          onValidate={this.onValidate}
          value={this.state.value}
          fontSize={this.state.fontSize}
          showPrintMargin={this.state.showPrintMargin}
          showGutter={this.state.showGutter}
          highlightActiveLine={this.state.highlightActiveLine}
          keyboardHandler={this.state.keyboardHandler}
          setOptions={{
            enableBasicAutocompletion: this.state.enableBasicAutocompletion,
            enableLiveAutocompletion: this.state.enableLiveAutocompletion,
            enableSnippets: this.state.enableSnippets,
            showLineNumbers: this.state.showLineNumbers,
            tabSize: 2,
          }}/>
      </div>
      <h2>Editor -
        <span
          className='cp d-inline-block text-secondary'
          onClick={() => this.setState({showSetting: !this.state.showSetting})}>
          {
            this.state.showSetting ? ' hide setting' : ' Show setting'
          }

        </span>
      </h2>

    </div>
  }

  render() {
    const {showSetting} = this.state
    const output =  showSetting ?
      <div className="d-md-flex editor_output">
          { this.renderEditor() }
          {this.renderSetting()}
      </div> :  this.renderEditor()

    return output;
  }
}


export default MyAceEditor;
