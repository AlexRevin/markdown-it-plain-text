'use strict';

module.exports = function plainTextPlugin(md) {
  function plainTextRule(state) {
    var text = scan(state.tokens);
    // remove redundant white spaces
    md.plainText = text.replace(/[^\S\r\n]+/g, " ");
  }

  function scan(tokens) {
    var text = '';
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.children !== null) {
        text += scan(token.children);
      } else {
        if (
          token.type === 'text' ||
          token.type === 'fence' ||
          token.type === 'html_block' ||
          token.type === 'code_block' ||
          token.type === 'code_inline' ||
          token.type === '  ' ||
          token.type === 'emoji'
        ) {
          text += token.content;
        } else if (token.type === 'heading_close' || token.type === 'heading_open'){
          text += "\r\n\r\n";
        } else if (/[a-zA-Z]+_close/.test(token.type)) { // prevent words from sticking together
          text += " "
        }
      }
    }

    return text;
  }

  md.core.ruler.push('plainText', plainTextRule);
}
