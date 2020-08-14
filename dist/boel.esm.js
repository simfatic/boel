/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t=function(){return(t=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var s in e=arguments[n])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t}).apply(this,arguments)};function e(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var r=Array(t),s=0;for(e=0;e<n;e++)for(var i=arguments[e],a=0,o=i.length;a<o;a++,s++)r[s]=i[a];return r}var n="INUMBER",r="IVAR",s="IEXPR";function i(t,e){this.type=t,this.value=null!=e?e:0}function a(t){return new i("IOP1",t)}function o(t){return new i("IOP2",t)}function u(t){return new i("IOP3",t)}function h(t,e,i){var a,o,u,f,d,v,y=[];if(l(t))return c(t,i);for(var g=t.length,x=0;x<g;x++){var E=t[x],m=E.type;if(m===n||"IVARNAME"===m)y.push(E.value);else if("IOP2"===m)o=y.pop(),a=y.pop(),"and"===E.value?y.push(!!a&&!!h(o,e,i)):"or"===E.value?y.push(!!a||!!h(o,e,i)):"="===E.value?(f=e.binaryOps[E.value],y.push(f(a,h(o,e,i),i))):(f=e.binaryOps[E.value],y.push(f(c(a,i),c(o,i))));else if("IOP3"===m)u=y.pop(),o=y.pop(),a=y.pop(),"?"===E.value?y.push(h(a?o:u,e,i)):(f=e.ternaryOps[E.value],y.push(f(c(a,i),c(o,i),c(u,i))));else if(m===r)if(E.value in e.functions)y.push(e.functions[E.value]);else if(E.value in e.unaryOps&&e.parser.isOperatorEnabled(E.value))y.push(e.unaryOps[E.value]);else{var F=i[E.value];if(void 0===F)throw new Error("undefined variable: "+E.value);y.push(F)}else if("IOP1"===m)a=y.pop(),f=e.unaryOps[E.value],y.push(f(c(a,i)));else if("IFUNCALL"===m){for(v=E.value,d=[];v-- >0;)d.unshift(c(y.pop(),i));if(!(f=y.pop()).apply||!f.call)throw new Error(f+" is not a function");y.push(f.apply(void 0,d))}else if("IFUNDEF"===m)y.push(function(){for(var t=y.pop(),n=[],r=E.value;r-- >0;)n.unshift(y.pop());var s=y.pop(),a=function(){for(var r=Object.assign({},i),s=0,a=n.length;s<a;s++)r[n[s]]=arguments[s];return h(t,e,r)};return Object.defineProperty(a,"name",{value:s,writable:!1}),i[s]=a,a}());else if(m===s)y.push(p(E,e));else if("IEXPREVAL"===m)y.push(E);else if("IMEMBER"===m)a=y.pop(),y.push(a[E.value]);else if("IENDSTATEMENT"===m)y.pop();else{if("IARRAY"!==m)throw new Error("invalid Expression");for(v=E.value,d=[];v-- >0;)d.unshift(y.pop());y.push(d)}}if(y.length>1)throw new Error("invalid Expression (parity)");return 0===y[0]?0:c(y[0],i)}function p(t,e,n){return l(t)?t:{type:"IEXPREVAL",value:function(n){return h(t.value,e,n)}}}function l(t){return t&&"IEXPREVAL"===t.type}function c(t,e){return l(t)?t.value(e):t}function f(t,e){for(var i,a,o,u,h,p,l=[],c=0;c<t.length;c++){var v=t[c],y=v.type;if(y===n)"number"==typeof v.value&&v.value<0?l.push("("+v.value+")"):Array.isArray(v.value)?l.push("["+v.value.map(d).join(", ")+"]"):l.push(d(v.value));else if("IOP2"===y)a=l.pop(),i=l.pop(),u=v.value,e?"^"===u?l.push("Math.pow("+i+", "+a+")"):"and"===u?l.push("(!!"+i+" && !!"+a+")"):"or"===u?l.push("(!!"+i+" || !!"+a+")"):"||"===u?l.push("(function(a,b){ return Array.isArray(a) && Array.isArray(b) ? a.concat(b) : String(a) + String(b); }(("+i+"),("+a+")))"):"=="===u?l.push("("+i+" === "+a+")"):"!="===u?l.push("("+i+" !== "+a+")"):"["===u?l.push(i+"[("+a+") | 0]"):l.push("("+i+" "+u+" "+a+")"):"["===u?l.push(i+"["+a+"]"):l.push("("+i+" "+u+" "+a+")");else if("IOP3"===y){if(o=l.pop(),a=l.pop(),i=l.pop(),"?"!==(u=v.value))throw new Error("invalid Expression");l.push("("+i+" ? "+a+" : "+o+")")}else if(y===r||"IVARNAME"===y)l.push(v.value);else if("IOP1"===y)i=l.pop(),"-"===(u=v.value)||"+"===u?l.push("("+u+i+")"):e?"not"===u?l.push("(!"+i+")"):"!"===u?l.push("fac("+i+")"):l.push(u+"("+i+")"):"!"===u?l.push("("+i+"!)"):l.push("("+u+" "+i+")");else if("IFUNCALL"===y){for(p=v.value,h=[];p-- >0;)h.unshift(l.pop());u=l.pop(),l.push(u+"("+h.join(", ")+")")}else if("IFUNDEF"===y){for(a=l.pop(),p=v.value,h=[];p-- >0;)h.unshift(l.pop());i=l.pop(),e?l.push("("+i+" = function("+h.join(", ")+") { return "+a+" })"):l.push("("+i+"("+h.join(", ")+") = "+a+")")}else if("IMEMBER"===y)i=l.pop(),l.push(i+"."+v.value);else if("IARRAY"===y){for(p=v.value,h=[];p-- >0;)h.unshift(l.pop());l.push("["+h.join(", ")+"]")}else if(y===s)l.push("("+f(v.value,e)+")");else if("IENDSTATEMENT"!==y)throw new Error("invalid Expression")}return l.length>1&&(l=e?[l.join(",")]:[l.join(";")]),String(l[0])}function d(t){return"string"==typeof t?JSON.stringify(t).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029"):t}function v(t,e){for(var n=0;n<t.length;n++)if(t[n]===e)return!0;return!1}function y(t,e,n){for(var i=!!(n=n||{}).withMembers,a=null,o=0;o<t.length;o++){var u=t[o];u.type===r||"IVARNAME"===u.type?i||v(e,u.value)?null!==a?(v(e,a)||e.push(a),a=u.value):a=u.value:e.push(u.value):"IMEMBER"===u.type&&i&&null!==a?a+="."+u.value:u.type===s?y(u.value,e,n):null!==a&&(v(e,a)||e.push(a),a=null)}null===a||v(e,a)||e.push(a)}function g(t,e){this.tokens=t,this.parser=e,this.unaryOps=e.unaryOps,this.binaryOps=e.binaryOps,this.ternaryOps=e.ternaryOps,this.functions=e.functions}i.prototype.toString=function(){switch(this.type){case n:case"IOP1":case"IOP2":case"IOP3":case r:case"IVARNAME":case"IENDSTATEMENT":return this.value;case"IFUNCALL":return"CALL "+this.value;case"IFUNDEF":return"DEF "+this.value;case"IARRAY":return"ARRAY "+this.value;case"IMEMBER":return"."+this.value;default:return"Invalid Instruction"}},g.prototype.simplify=function(t){return t=t||{},new g(function t(e,a,o,u,h){for(var p,l,c,f,d=[],v=[],y=0;y<e.length;y++){var g=e[y],x=g.type;if(x===n||"IVARNAME"===x)Array.isArray(g.value)?d.push.apply(d,t(g.value.map((function(t){return new i(n,t)})).concat(new i("IARRAY",g.value.length)),a,o,u,h)):d.push(g);else if(x===r&&h.hasOwnProperty(g.value))g=new i(n,h[g.value]),d.push(g);else if("IOP2"===x&&d.length>1)l=d.pop(),p=d.pop(),f=o[g.value],g=new i(n,f(p.value,l.value)),d.push(g);else if("IOP3"===x&&d.length>2)c=d.pop(),l=d.pop(),p=d.pop(),"?"===g.value?d.push(p.value?l.value:c.value):(f=u[g.value],g=new i(n,f(p.value,l.value,c.value)),d.push(g));else if("IOP1"===x&&d.length>0)p=d.pop(),f=a[g.value],g=new i(n,f(p.value)),d.push(g);else if(x===s){for(;d.length>0;)v.push(d.shift());v.push(new i(s,t(g.value,a,o,u,h)))}else if("IMEMBER"===x&&d.length>0)p=d.pop(),d.push(new i(n,p.value[g.value]));else{for(;d.length>0;)v.push(d.shift());v.push(g)}}for(;d.length>0;)v.push(d.shift());return v}(this.tokens,this.unaryOps,this.binaryOps,this.ternaryOps,t),this.parser)},g.prototype.substitute=function(t,e){return e instanceof g||(e=this.parser.parse(String(e))),new g(function t(e,n,h){for(var p=[],l=0;l<e.length;l++){var c=e[l],f=c.type;if(f===r&&c.value===n)for(var d=0;d<h.tokens.length;d++){var v,y=h.tokens[d];v="IOP1"===y.type?a(y.value):"IOP2"===y.type?o(y.value):"IOP3"===y.type?u(y.value):new i(y.type,y.value),p.push(v)}else f===s?p.push(new i(s,t(c.value,n,h))):p.push(c)}return p}(this.tokens,t,e),this.parser)},g.prototype.evaluate=function(t){return t=t||{},h(this.tokens,this,t)},g.prototype.toString=function(){return f(this.tokens,!1)},g.prototype.symbols=function(t){t=t||{};var e=[];return y(this.tokens,e,t),e},g.prototype.variables=function(t){t=t||{};var e=[];y(this.tokens,e,t);var n=this.functions;return e.filter((function(t){return!(t in n)}))},g.prototype.toJSFunction=function(t,e){var n=this,r=new Function(t,"with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return "+f(this.simplify(e).tokens,!0)+"; }");return function(){return r.apply(n,arguments)}};var x="TOP",E="TPAREN";function m(t,e,n){this.type=t,this.value=e,this.index=n}function F(t,e){this.pos=0,this.current=null,this.unaryOps=t.unaryOps,this.binaryOps=t.binaryOps,this.ternaryOps=t.ternaryOps,this.consts=t.consts,this.expression=e,this.savedPosition=0,this.savedCurrent=null,this.options=t.options,this.parser=t}m.prototype.toString=function(){return this.type+": "+this.value},F.prototype.newToken=function(t,e,n){return new m(t,e,null!=n?n:this.pos)},F.prototype.save=function(){this.savedPosition=this.pos,this.savedCurrent=this.current},F.prototype.restore=function(){this.pos=this.savedPosition,this.current=this.savedCurrent},F.prototype.next=function(){return this.pos>=this.expression.length?this.newToken("TEOF","EOF"):this.isWhitespace()||this.isComment()?this.next():this.isRadixInteger()||this.isNumber()||this.isOperator()||this.isString()||this.isParen()||this.isBracket()||this.isComma()||this.isSemicolon()||this.isNamedOp()||this.isConst()||this.isName()?this.current:void this.parseError('Unknown character "'+this.expression.charAt(this.pos)+'"')},F.prototype.isString=function(){var t=!1,e=this.pos,n=this.expression.charAt(e);if("'"===n||'"'===n)for(var r=this.expression.indexOf(n,e+1);r>=0&&this.pos<this.expression.length;){if(this.pos=r+1,"\\"!==this.expression.charAt(r-1)){var s=this.expression.substring(e+1,r);this.current=this.newToken("TSTRING",this.unescape(s),e),t=!0;break}r=this.expression.indexOf(n,r+1)}return t},F.prototype.isParen=function(){var t=this.expression.charAt(this.pos);return("("===t||")"===t)&&(this.current=this.newToken(E,t),this.pos++,!0)},F.prototype.isBracket=function(){var t=this.expression.charAt(this.pos);return!("["!==t&&"]"!==t||!this.isOperatorEnabled("["))&&(this.current=this.newToken("TBRACKET",t),this.pos++,!0)},F.prototype.isComma=function(){return","===this.expression.charAt(this.pos)&&(this.current=this.newToken("TCOMMA",","),this.pos++,!0)},F.prototype.isSemicolon=function(){return";"===this.expression.charAt(this.pos)&&(this.current=this.newToken("TSEMICOLON",";"),this.pos++,!0)},F.prototype.isConst=function(){for(var t=this.pos,e=t;e<this.expression.length;e++){var n=this.expression.charAt(e);if(n.toUpperCase()===n.toLowerCase()&&(e===this.pos||"_"!==n&&"."!==n&&(n<"0"||n>"9")))break}if(e>t){var r=this.expression.substring(t,e);if(r in this.consts)return this.current=this.newToken("TNUMBER",this.consts[r]),this.pos+=r.length,!0}return!1},F.prototype.isNamedOp=function(){for(var t=this.pos,e=t;e<this.expression.length;e++){var n=this.expression.charAt(e);if(n.toUpperCase()===n.toLowerCase()&&(e===this.pos||"_"!==n&&(n<"0"||n>"9")))break}if(e>t){var r=this.expression.substring(t,e);if(this.isOperatorEnabled(r)&&(r in this.binaryOps||r in this.unaryOps||r in this.ternaryOps))return this.current=this.newToken(x,r),this.pos+=r.length,!0}return!1},F.prototype.isName=function(){for(var t=this.pos,e=t,n=!1;e<this.expression.length;e++){var r=this.expression.charAt(e);if(r.toUpperCase()===r.toLowerCase()){if(e===this.pos&&("$"===r||"_"===r)){"_"===r&&(n=!0);continue}if(e===this.pos||!n||"_"!==r&&(r<"0"||r>"9"))break}else n=!0}if(n){var s=this.expression.substring(t,e);return this.current=this.newToken("TNAME",s),this.pos+=s.length,!0}return!1},F.prototype.isWhitespace=function(){for(var t=!1,e=this.expression.charAt(this.pos);!(" "!==e&&"\t"!==e&&"\n"!==e&&"\r"!==e||(t=!0,this.pos++,this.pos>=this.expression.length));)e=this.expression.charAt(this.pos);return t};var w=/^[0-9a-f]{4}$/i;function T(t,e,n){this.parser=t,this.tokens=e,this.current=null,this.nextToken=null,this.next(),this.savedCurrent=null,this.savedNextToken=null,this.allowMemberAccess=!1!==n.allowMemberAccess}F.prototype.unescape=function(t){var e=t.indexOf("\\");if(e<0)return t;for(var n=t.substring(0,e);e>=0;){var r=t.charAt(++e);switch(r){case"'":n+="'";break;case'"':n+='"';break;case"\\":n+="\\";break;case"/":n+="/";break;case"b":n+="\b";break;case"f":n+="\f";break;case"n":n+="\n";break;case"r":n+="\r";break;case"t":n+="\t";break;case"u":var s=t.substring(e+1,e+5);w.test(s)||this.parseError("Illegal escape sequence: \\u"+s),n+=String.fromCharCode(parseInt(s,16)),e+=4;break;default:throw this.parseError('Illegal escape sequence: "\\'+r+'"')}++e;var i=t.indexOf("\\",e);n+=t.substring(e,i<0?t.length:i),e=i}return n},F.prototype.isComment=function(){return"/"===this.expression.charAt(this.pos)&&"*"===this.expression.charAt(this.pos+1)&&(this.pos=this.expression.indexOf("*/",this.pos)+2,1===this.pos&&(this.pos=this.expression.length),!0)},F.prototype.isRadixInteger=function(){var t,e,n=this.pos;if(n>=this.expression.length-2||"0"!==this.expression.charAt(n))return!1;if(++n,"x"===this.expression.charAt(n))t=16,e=/^[0-9a-f]$/i,++n;else{if("b"!==this.expression.charAt(n))return!1;t=2,e=/^[01]$/i,++n}for(var r=!1,s=n;n<this.expression.length;){var i=this.expression.charAt(n);if(!e.test(i))break;n++,r=!0}return r&&(this.current=this.newToken("TNUMBER",parseInt(this.expression.substring(s,n),t)),this.pos=n),r},F.prototype.isNumber=function(){for(var t,e=!1,n=this.pos,r=n,s=n,i=!1,a=!1;n<this.expression.length&&((t=this.expression.charAt(n))>="0"&&t<="9"||!i&&"."===t);)"."===t?i=!0:a=!0,n++,e=a;if(e&&(s=n),"e"===t||"E"===t){n++;for(var o=!0,u=!1;n<this.expression.length;){if(t=this.expression.charAt(n),!o||"+"!==t&&"-"!==t){if(!(t>="0"&&t<="9"))break;u=!0,o=!1}else o=!1;n++}u||(n=s)}return e?(this.current=this.newToken("TNUMBER",parseFloat(this.expression.substring(r,n))),this.pos=n):this.pos=s,e},F.prototype.isOperator=function(){var t=this.pos,e=this.expression.charAt(this.pos);if("+"===e||"-"===e||"*"===e||"/"===e||"%"===e||"^"===e||"?"===e||":"===e||"."===e)this.current=this.newToken(x,e);else if("∙"===e||"•"===e)this.current=this.newToken(x,"*");else if(">"===e)"="===this.expression.charAt(this.pos+1)?(this.current=this.newToken(x,">="),this.pos++):this.current=this.newToken(x,">");else if("<"===e)"="===this.expression.charAt(this.pos+1)?(this.current=this.newToken(x,"<="),this.pos++):this.current=this.newToken(x,"<");else if("|"===e){if("|"!==this.expression.charAt(this.pos+1))return!1;this.current=this.newToken(x,"||"),this.pos++}else if("="===e)"="===this.expression.charAt(this.pos+1)?(this.current=this.newToken(x,"=="),this.pos++):this.current=this.newToken(x,e);else{if("!"!==e)return!1;"="===this.expression.charAt(this.pos+1)?(this.current=this.newToken(x,"!="),this.pos++):this.current=this.newToken(x,e)}return this.pos++,!!this.isOperatorEnabled(this.current.value)||(this.pos=t,!1)},F.prototype.isOperatorEnabled=function(t){return this.parser.isOperatorEnabled(t)},F.prototype.getCoordinates=function(){var t,e=0,n=-1;do{e++,t=this.pos-n,n=this.expression.indexOf("\n",n+1)}while(n>=0&&n<this.pos);return{line:e,column:t}},F.prototype.parseError=function(t){var e=this.getCoordinates();throw new Error("parse error ["+e.line+":"+e.column+"]: "+t)},T.prototype.next=function(){return this.current=this.nextToken,this.nextToken=this.tokens.next()},T.prototype.tokenMatches=function(t,e){return void 0===e||(Array.isArray(e)?v(e,t.value):"function"==typeof e?e(t):t.value===e)},T.prototype.save=function(){this.savedCurrent=this.current,this.savedNextToken=this.nextToken,this.tokens.save()},T.prototype.restore=function(){this.tokens.restore(),this.current=this.savedCurrent,this.nextToken=this.savedNextToken},T.prototype.accept=function(t,e){return!(this.nextToken.type!==t||!this.tokenMatches(this.nextToken,e))&&(this.next(),!0)},T.prototype.expect=function(t,e){if(!this.accept(t,e)){var n=this.tokens.getCoordinates();throw new Error("parse error ["+n.line+":"+n.column+"]: Expected "+(e||t))}},T.prototype.parseAtom=function(t){var e=this.tokens.unaryOps;if(this.accept("TNAME")||this.accept(x,(function(t){return t.value in e})))t.push(new i(r,this.current.value));else if(this.accept("TNUMBER"))t.push(new i(n,this.current.value));else if(this.accept("TSTRING"))t.push(new i(n,this.current.value));else if(this.accept(E,"("))this.parseExpression(t),this.expect(E,")");else{if(!this.accept("TBRACKET","["))throw new Error("unexpected "+this.nextToken);if(this.accept("TBRACKET","]"))t.push(new i("IARRAY",0));else{var s=this.parseArrayList(t);t.push(new i("IARRAY",s))}}},T.prototype.parseExpression=function(t){var e=[];this.parseUntilEndStatement(t,e)||(this.parseVariableAssignmentExpression(e),this.parseUntilEndStatement(t,e)||this.pushExpression(t,e))},T.prototype.pushExpression=function(t,e){for(var n=0,r=e.length;n<r;n++)t.push(e[n])},T.prototype.parseUntilEndStatement=function(t,e){return!!this.accept("TSEMICOLON")&&(!this.nextToken||"TEOF"===this.nextToken.type||this.nextToken.type===E&&")"===this.nextToken.value||e.push(new i("IENDSTATEMENT")),"TEOF"!==this.nextToken.type&&this.parseExpression(e),t.push(new i(s,e)),!0)},T.prototype.parseArrayList=function(t){for(var e=0;!this.accept("TBRACKET","]");)for(this.parseExpression(t),++e;this.accept("TCOMMA");)this.parseExpression(t),++e;return e},T.prototype.parseVariableAssignmentExpression=function(t){for(this.parseConditionalExpression(t);this.accept(x,"=");){var e=t.pop(),n=[],a=t.length-1;if("IFUNCALL"!==e.type){if(e.type!==r&&"IMEMBER"!==e.type)throw new Error("expected variable for assignment");this.parseVariableAssignmentExpression(n),t.push(new i("IVARNAME",e.value)),t.push(new i(s,n)),t.push(o("="))}else{if(!this.tokens.isOperatorEnabled("()="))throw new Error("function definition is not permitted");for(var u=0,h=e.value+1;u<h;u++){var p=a-u;t[p].type===r&&(t[p]=new i("IVARNAME",t[p].value))}this.parseVariableAssignmentExpression(n),t.push(new i(s,n)),t.push(new i("IFUNDEF",e.value))}}},T.prototype.parseConditionalExpression=function(t){for(this.parseOrExpression(t);this.accept(x,"?");){var e=[],n=[];this.parseConditionalExpression(e),this.expect(x,":"),this.parseConditionalExpression(n),t.push(new i(s,e)),t.push(new i(s,n)),t.push(u("?"))}},T.prototype.parseOrExpression=function(t){for(this.parseAndExpression(t);this.accept(x,"or");){var e=[];this.parseAndExpression(e),t.push(new i(s,e)),t.push(o("or"))}},T.prototype.parseAndExpression=function(t){for(this.parseComparison(t);this.accept(x,"and");){var e=[];this.parseComparison(e),t.push(new i(s,e)),t.push(o("and"))}};var A=["==","!=","<","<=",">=",">","in"];T.prototype.parseComparison=function(t){for(this.parseAddSub(t);this.accept(x,A);){var e=this.current;this.parseAddSub(t),t.push(o(e.value))}};var M=["+","-","||"];T.prototype.parseAddSub=function(t){for(this.parseTerm(t);this.accept(x,M);){var e=this.current;this.parseTerm(t),t.push(o(e.value))}};var O=["*","/","%"];function b(t,e){return Number(t)+Number(e)}function k(t,e){return t-e}function _(t,e){return t*e}function I(t,e){return t/e}function C(t,e){return t%e}function N(t,e){return Array.isArray(t)&&Array.isArray(e)?t.concat(e):""+t+e}function R(t,e){return t===e}function V(t,e){return t!==e}function S(t,e){return t>e}function q(t,e){return t<e}function L(t,e){return t>=e}function D(t,e){return t<=e}function P(t,e){return Boolean(t&&e)}function $(t,e){return Boolean(t||e)}function B(t,e){return v(e,t)}function U(t){return(Math.exp(t)-Math.exp(-t))/2}function j(t){return(Math.exp(t)+Math.exp(-t))/2}function z(t){return t===1/0?1:t===-1/0?-1:(Math.exp(t)-Math.exp(-t))/(Math.exp(t)+Math.exp(-t))}function G(t){return t===-1/0?t:Math.log(t+Math.sqrt(t*t+1))}function Y(t){return Math.log(t+Math.sqrt(t*t-1))}function K(t){return Math.log((1+t)/(1-t))/2}function X(t){return Math.log(t)*Math.LOG10E}function Z(t){return-t}function W(t){return!t}function J(t){return t<0?Math.ceil(t):Math.floor(t)}function H(t){return Math.random()*(t||1)}function Q(t){return et(t+1)}T.prototype.parseTerm=function(t){for(this.parseFactor(t);this.accept(x,O);){var e=this.current;this.parseFactor(t),t.push(o(e.value))}},T.prototype.parseFactor=function(t){var e=this.tokens.unaryOps;if(this.save(),this.accept(x,(function(t){return t.value in e}))){if("-"!==this.current.value&&"+"!==this.current.value){if(this.nextToken.type===E&&"("===this.nextToken.value)return this.restore(),void this.parseExponential(t);if("TSEMICOLON"===this.nextToken.type||"TCOMMA"===this.nextToken.type||"TEOF"===this.nextToken.type||this.nextToken.type===E&&")"===this.nextToken.value)return this.restore(),void this.parseAtom(t)}var n=this.current;this.parseFactor(t),t.push(a(n.value))}else this.parseExponential(t)},T.prototype.parseExponential=function(t){for(this.parsePostfixExpression(t);this.accept(x,"^");)this.parseFactor(t),t.push(o("^"))},T.prototype.parsePostfixExpression=function(t){for(this.parseFunctionCall(t);this.accept(x,"!");)t.push(a("!"))},T.prototype.parseFunctionCall=function(t){var e=this.tokens.unaryOps;if(this.accept(x,(function(t){return t.value in e}))){var n=this.current;this.parseAtom(t),t.push(a(n.value))}else for(this.parseMemberExpression(t);this.accept(E,"(");)if(this.accept(E,")"))t.push(new i("IFUNCALL",0));else{var r=this.parseArgumentList(t);t.push(new i("IFUNCALL",r))}},T.prototype.parseArgumentList=function(t){for(var e=0;!this.accept(E,")");)for(this.parseExpression(t),++e;this.accept("TCOMMA");)this.parseExpression(t),++e;return e},T.prototype.parseMemberExpression=function(t){for(this.parseAtom(t);this.accept(x,".")||this.accept("TBRACKET","[");){var e=this.current;if("."===e.value){if(!this.allowMemberAccess)throw new Error('unexpected ".", member access is not permitted');this.expect("TNAME"),t.push(new i("IMEMBER",this.current.value))}else{if("["!==e.value)throw new Error("unexpected symbol: "+e.value);if(!this.tokens.isOperatorEnabled("["))throw new Error('unexpected "[]", arrays are disabled');this.parseExpression(t),this.expect("TBRACKET","]"),t.push(o("["))}}};var tt=[.9999999999999971,57.15623566586292,-59.59796035547549,14.136097974741746,-.4919138160976202,3399464998481189e-20,4652362892704858e-20,-9837447530487956e-20,.0001580887032249125,-.00021026444172410488,.00021743961811521265,-.0001643181065367639,8441822398385275e-20,-26190838401581408e-21,36899182659531625e-22];function et(t){var e,n;if(function(t){return isFinite(t)&&t===Math.round(t)}(t)){if(t<=0)return isFinite(t)?1/0:NaN;if(t>171)return 1/0;for(var r=t-2,s=t-1;r>1;)s*=r,r--;return 0===s&&(s=1),s}if(t<.5)return Math.PI/(Math.sin(Math.PI*t)*et(1-t));if(t>=171.35)return 1/0;if(t>85){var i=t*t,a=i*t,o=a*t,u=o*t;return Math.sqrt(2*Math.PI/t)*Math.pow(t/Math.E,t)*(1+1/(12*t)+1/(288*i)-139/(51840*a)-571/(2488320*o)+163879/(209018880*u)+5246819/(75246796800*u*t))}--t,n=tt[0];for(var h=1;h<tt.length;++h)n+=tt[h]/(t+h);return e=t+4.7421875+.5,Math.sqrt(2*Math.PI)*Math.pow(e,t+.5)*Math.exp(-e)*n}function nt(t){return Array.isArray(t)?t.length:String(t).length}function rt(){for(var t=0,e=0,n=0;n<arguments.length;n++){var r,s=Math.abs(arguments[n]);e<s?(t=t*(r=e/s)*r+1,e=s):t+=s>0?(r=s/e)*r:s}return e===1/0?1/0:e*Math.sqrt(t)}function st(t,e,n){return t?e:n}function it(t,e){return void 0===e||0==+e?Math.round(t):(t=+t,e=-+e,isNaN(t)||"number"!=typeof e||e%1!=0?NaN:(t=t.toString().split("e"),+((t=(t=Math.round(+(t[0]+"e"+(t[1]?+t[1]-e:-e)))).toString().split("e"))[0]+"e"+(t[1]?+t[1]+e:e))))}function at(t,e,n){return n&&(n[t]=e),e}function ot(t,e){return t[0|e]}function ut(t){return 1===arguments.length&&Array.isArray(t)?Math.max.apply(Math,t):Math.max.apply(Math,arguments)}function ht(t){return 1===arguments.length&&Array.isArray(t)?Math.min.apply(Math,t):Math.min.apply(Math,arguments)}function pt(t,e){if("function"!=typeof t)throw new Error("First argument to map is not a function");if(!Array.isArray(e))throw new Error("Second argument to map is not an array");return e.map((function(e,n){return t(e,n)}))}function lt(t,e,n){if("function"!=typeof t)throw new Error("First argument to fold is not a function");if(!Array.isArray(n))throw new Error("Second argument to fold is not an array");return n.reduce((function(e,n,r){return t(e,n,r)}),e)}function ct(t,e){if("function"!=typeof t)throw new Error("First argument to filter is not a function");if(!Array.isArray(e))throw new Error("Second argument to filter is not an array");return e.filter((function(e,n){return t(e,n)}))}function ft(t,e){if(!Array.isArray(e)&&"string"!=typeof e)throw new Error("Second argument to indexOf is not a string or array");return e.indexOf(t)}function dt(t,e){if(!Array.isArray(e))throw new Error("Second argument to join is not an array");return e.join(t)}function vt(t){return(t>0)-(t<0)||+t}function yt(t){return t<0?-Math.pow(-t,1/3):Math.pow(t,1/3)}function gt(t){return Math.exp(t)-1}function xt(t){return Math.log(1+t)}function Et(t){return Math.log(t)/Math.LN2}function mt(t){this.options=t||{},this.unaryOps={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh||U,cosh:Math.cosh||j,tanh:Math.tanh||z,asinh:Math.asinh||G,acosh:Math.acosh||Y,atanh:Math.atanh||K,sqrt:Math.sqrt,cbrt:Math.cbrt||yt,log:Math.log,log2:Math.log2||Et,ln:Math.log,lg:Math.log10||X,log10:Math.log10||X,expm1:Math.expm1||gt,log1p:Math.log1p||xt,abs:Math.abs,ceil:Math.ceil,floor:Math.floor,round:Math.round,trunc:Math.trunc||J,"-":Z,"+":Number,exp:Math.exp,not:W,length:nt,"!":Q,sign:Math.sign||vt},this.binaryOps={"+":b,"-":k,"*":_,"/":I,"%":C,"^":Math.pow,"||":N,"==":R,"!=":V,">":S,"<":q,">=":L,"<=":D,and:P,or:$,in:B,"=":at,"[":ot},this.ternaryOps={"?":st},this.functions={random:H,fac:Q,min:ht,max:ut,hypot:Math.hypot||rt,pyt:Math.hypot||rt,pow:Math.pow,atan2:Math.atan2,if:st,gamma:et,roundTo:it,map:pt,fold:lt,filter:ct,indexOf:ft,join:dt},this.consts={E:Math.E,PI:Math.PI,true:!0,false:!1}}mt.prototype.parse=function(t){var e=[],n=new T(this,new F(this,t),{allowMemberAccess:this.options.allowMemberAccess});return n.parseExpression(e),n.expect("TEOF","EOF"),new g(e,this)},mt.prototype.evaluate=function(t,e){return this.parse(t).evaluate(e)};var Ft=new mt;mt.parse=function(t){return Ft.parse(t)},mt.evaluate=function(t,e){return Ft.parse(t).evaluate(e)};var wt={"+":"add","-":"subtract","*":"multiply","/":"divide","%":"remainder","^":"power","!":"factorial","<":"comparison",">":"comparison","<=":"comparison",">=":"comparison","==":"comparison","!=":"comparison","||":"concatenate",and:"logical",or:"logical",not:"logical","?":"conditional",":":"conditional","=":"assignment","[":"array","()=":"fndef"};function Tt(t){return t.name?t.name:t.constructor.name}mt.prototype.isOperatorEnabled=function(t){var e=function(t){return wt.hasOwnProperty(t)?wt[t]:t}(t),n=this.options.operators||{};return!(e in n)||!!n[e]};var At,Mt=function(){function t(t){this.message="",this.condition_expr=null,this.validator=t}return Object.defineProperty(t.prototype,"condition",{set:function(t){if(t){var e=new mt;this.condition_expr=e.parse(t)}else this.condition_expr=null},enumerable:!1,configurable:!0}),t}(),Ot=function(){function t(t,e){this.fields=t,this.validator_info=e,this.validations=[]}return t.prototype.addValidation=function(t){this.validations.push(new Mt(t))},t.prototype.addMessage=function(t){this.validations.length>0&&(this.validations[this.validations.length-1].message=t)},t.prototype.addCondition=function(t){this.validations.length>0&&(this.validations[this.validations.length-1].condition=t)},t.prototype.validate=function(t){for(var e={},n=0,r=this.validations;n<r.length;n++){var s=r[n];if(null!==s.condition_expr)if(!s.condition_expr.evaluate(t))continue;for(var i=0,a=this.fields;i<a.length;i++){var o=a[i];s.validator.validate(o,t)||e[o]||(e[o]={validation:Tt(s.validator),message:this.getMessage(s,o,t)})}}return e},t.prototype.getMessage=function(t,n,r){var s="";s=t.message?t.message:this.validator_info.getMessageTemplate(t.validator);var i=e(["field"],Object.keys(t.validator)),a=e([n],Object.values(t.validator));return(new(Function.bind.apply(Function,e([void 0],i,["return `"+s+"`;"])))).apply(void 0,a)},t.prototype.hasValidations=function(){return this.validations.length>0},t}(),bt=function(){function t(t){this.field_v=t}return t.prototype.addValidation=function(t){this.field_v.addValidation(t)},t.prototype.validate=function(t){return this.field_v.validate(t)},t.prototype.message=function(t){return this.field_v.addMessage(t),this},t.prototype.onlyWhen=function(t){return this.field_v.addCondition(t),this},t}(),kt=function(){function t(){this.message="${field} is required"}return t.prototype.validate=function(t,e){if(e[t]){if(String(e[t]).length>0)return!0}else if(0===e[t]||!1===e[t])return!0;return!1},t}(),_t=function(){function t(t){this.max_length=t,this.message="${field} exceeded max length ${max_length}"}return t.prototype.validate=function(t,e){return void 0===e[t]||!(String(e[t]).length>this.max_length)},t}(),It=function(){function t(t){this.min_length=t,this.message="${field} input length should be at least ${min_length}"}return t.prototype.validate=function(t,e){return void 0===e[t]||!(String(e[t]).length<this.min_length)},t}(),Ct={"<":{name:"LessThan",message:"${field} should be less than ${test_value}",fn:function(t,e){return t<e}},"<=":{name:"LessThanOrEqualTo",message:"${field} should be less than or equal to ${test_value}",fn:function(t,e){return t<=e}},">":{name:"GreaterThan",message:"${field} should be greater than ${test_value}",fn:function(t,e){return t>e}},">=":{name:"GreaterThanOrEqualTo",message:"${field} should be greater than or equal to ${test_value}",fn:function(t,e){return t>=e}},"=":{name:"EqualTo",message:"${field} should be equal to ${test_value}",fn:function(t,e){return t===e}},"!=":{name:"NotEqualTo",message:"${field} should not be equal to ${test_value}",fn:function(t,e){return t!==e}}};!function(t){t[t.Value=0]="Value",t[t.Field=1]="Field"}(At||(At={}));var Nt=function(){function t(t,e){if(this.comparison=t,this.options=e,this.message="",this.test_value=0,this.test_against=At.Value,this.name="",!Object.keys(Ct).includes(t))throw Error("unsupported comparison operator "+t);if(this.name=Ct[t].name,this.message=Ct[t].message,void 0!==e.test_value)this.test_against=At.Value,this.test_value=e.test_value;else{if(void 0===e.test_field)throw Error("Provide one of test_value or test_field in the options");this.test_against=At.Field,this.test_value=e.test_field}}return t.prototype.validate=function(t,e){var n=this.getOtherValue(e);return"="==this.comparison||"!="==this.comparison?this.doEqualTest(e[t],n):this.doComparison(Number(e[t]),Number(n))},t.prototype.getOtherValue=function(t){if(this.test_against==At.Field){if(void 0===this.options.test_field)throw Error("The test_field is not provided");return t[this.options.test_field]}if(void 0===this.options.test_value)throw Error("The test_value is not provided");return this.options.test_value},t.prototype.doComparison=function(t,e){return Ct[this.comparison].fn(t,e)},t.prototype.doEqualTest=function(t,e){return Ct[this.comparison].fn(t,e)},t}();var Rt=function(){function e(){this.validator_makers={},this.all_validators={}}return e.prototype.addValidator=function(t,e){if("string"==typeof t)this.validator_makers[t]=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return this.addValidation(e.apply(void 0,t)),this};else for(var n=0,r=t;n<r.length;n++){var s=r[n];this.addValidator(s,e)}return this},e.prototype.updateMessages=function(t){for(var e in t)this.all_validators[e]?this.all_validators[e].message=t[e]:this.all_validators[e]={message:t[e]}},e.prototype.field=function(t){var e=new bt(new Ot([t],this));return Object.assign(e,this.validator_makers),e},e.prototype.fields=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=new bt(new Ot(t,this));return Object.assign(n,this.validator_makers),n},e.prototype.validate=function(t,e){return this.validateByRules(t,e)},e.prototype.validateByRules=function(e,n){for(var r={},s=0,i=e;s<i.length;s++){var a=i[s].validate(n);r=t(t({},r),a)}return{has_errors:Object.keys(r).length>0,error_map:r}},e.prototype.validateFields=function(t,e){var n=function(t,e){for(var n=[],r=0,s=t;r<s.length;r++){for(var i=s[r],a=new Ot([i.name],e),o=0,u=i.validations;o<u.length;o++){var h=u[o],p=null;switch(h._vtype){case"Required":p=new kt;break;case"MaxLength":p=new _t(+h.size);break;case"MinLength":p=new It(+h.size);break;case"LessThan":p=new Nt("<",{test_value:+h.num});break;case"GreaterThan":p=new Nt(">",{test_value:+h.num})}p&&(a.addValidation(p),h.message&&a.addMessage(h.message),h.condition&&a.addCondition(h.condition))}a.hasValidations()&&n.push(a)}return n}(t,this);return n.length<=0?{has_errors:!1}:this.validateByRules(n,e)},e.prototype.getMessageTemplate=function(t){var e="Error! ",n=Tt(t);return this.all_validators[n]&&this.all_validators[n].message?e=this.all_validators[n].message:t.message&&(e=t.message),e},e}(),Vt=function(){function t(t){void 0===t&&(t=!0),this.allow_space=t,this.message="${field} can contain only English alphabetic characters"}return t.prototype.validate=function(t,e){var n=/^[A-Za-z]+$/i;return this.allow_space&&(n=/^[A-Za-z\s]+$/i),n.test(String(e[t]))},t}(),St=function(){function t(t){void 0===t&&(t=!0),this.allow_space=t,this.message="${field} can contain only alpha-numeric characters"}return t.prototype.validate=function(t,e){var n=/^[A-Za-z0-9]+$/i;return this.allow_space&&(n=/^[A-Za-z0-9\s]+$/i),n.test(String(e[t]))},t}(),qt=function(){function t(){this.message="Please provide a valid email address"}return t.prototype.validate=function(t,e){return/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(String(e[t]))},t}(),Lt=function(){function t(t){this.max_count=t,this.message="${field} selections exceeds max limit ${max_count}"}return t.prototype.validate=function(t,e){return void 0===e[t]||!(e[t].length>this.max_count)},t}(),Dt=function(){function t(t){this.min_count=t,this.message="For ${field}, select at least ${min_count} options"}return t.prototype.validate=function(t,e){return void 0===e[t]||!(e[t].length<this.min_count)},t}(),Pt=function(){function t(){this.message="${field} should be selected"}return t.prototype.validate=function(t,e){return!!e[t]},t}(),$t=function(){function t(t){this.extensions_str=t,this.message="Valid file extensions are: ${extensions_str}",this.valid_extensions=[],this.valid_extensions=this.extensions_str.split(",").map((function(t){return t.trim()}))}return t.prototype.validate=function(t,e){if(e[t]){var n=e[t].split(".").pop();if(!this.valid_extensions.includes(n))return!1}return!0},t}();function Bt(){return(t=new Rt).addValidator(["isRequired","areRequired","required"],(function(){return new kt})).addValidator(["maxLength","checkMaxLength"],(function(t){return new _t(t)})).addValidator(["minLength","checkMinLength"],(function(t){return new It(t)})).addValidator(["isAlphabetic","areAlphabetic"],(function(t){return void 0===t&&(t=!0),new Vt(t)})).addValidator(["isAlphaNumeric","areAlphaNumeric"],(function(t){return void 0===t&&(t=!0),new St(t)})).addValidator(["isEmail","areEmails"],(function(){return new qt})).addValidator(["lessThan","isLessThan","areLessThan"],(function(t){return new Nt("<",{test_value:t})})).addValidator(["lessThanOrEqualTo","isLessThanOrEqualTo","areLessThanOrEqualTo"],(function(t){return new Nt("<=",{test_value:t})})).addValidator(["greaterThan","isGreaterThan","areGreaterThan"],(function(t){return new Nt(">",{test_value:t})})).addValidator(["greaterThanOrEqualTo","isGreaterThanOrEqualTo","areGreaterThanOrEqualTo"],(function(t){return new Nt(">=",{test_value:t})})).addValidator(["equalsTo","isEqualTo","areEqualTo"],(function(t){return new Nt("=",{test_value:t})})).addValidator(["notEqualTo","isNotEqualTo","areNotEqualTo"],(function(t){return new Nt("!=",{test_value:t})})).addValidator(["lessThanField","isLessThanField","areLessThanField"],(function(t){return new Nt("<",{test_field:t})})).addValidator(["lessThanOrEqualToField","isLessThanOrEqualToField","areLessThanOrEqualToField"],(function(t){return new Nt("<=",{test_field:t})})).addValidator(["greaterThanField","isGreaterThanField","areGreaterThanField"],(function(t){return new Nt(">",{test_field:t})})).addValidator(["greaterThanOrEqualToField","isGreaterThanOrEqualToField","areGreaterThanOrEqualToField"],(function(t){return new Nt(">=",{test_field:t})})).addValidator(["equalsToField","isEqualToField","areEqualToField"],(function(t){return new Nt("=",{test_field:t})})).addValidator(["notEqualsToField","isNotEqualToField","areNotEqualToField"],(function(t){return new Nt("!=",{test_field:t})})).addValidator(["maxSelections","hasMaxSelections"],(function(t){return new Lt(t)})).addValidator(["minSelections","hasMinSelections"],(function(t){return new Dt(t)})).addValidator(["shouldBeSelected","isSelected","selected"],(function(){return new Pt})).addValidator(["hasExtension","hasFileExtension"],(function(t){return new $t(t)})),t;var t}export{Bt as makeBoel};
