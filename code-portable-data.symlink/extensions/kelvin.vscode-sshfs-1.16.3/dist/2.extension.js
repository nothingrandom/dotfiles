exports.ids=[2],exports.modules={59:function(t,e,i){"use strict";i.r(e),i.d(e,"SSHFileSystem",function(){return h}),i.d(e,"EMPTY_FILE_SYSTEM",function(){return a});var n=i(11),r=i(0),s=i(1),o=function(t,e,i,n){return new(i||(i=Promise))(function(r,s){function o(t){try{a(n.next(t))}catch(t){s(t)}}function h(t){try{a(n.throw(t))}catch(t){s(t)}}function a(t){t.done?r(t.value):new i(function(e){e(t.value)}).then(o,h)}a((n=n.apply(t,e||[])).next())})};class h{constructor(t,e,i,n){this.authority=t,this.sftp=e,this.root=i,this.config=n,this.waitForContinue=!1,this.closed=!1,this.closing=!1,this.copy=void 0,this.onDidChangeFileEmitter=new r.EventEmitter,this.onDidChangeFile=this.onDidChangeFileEmitter.event,this.sftp.on("end",()=>this.closed=!0)}disconnect(){this.closing=!0,this.sftp.end()}relative(t){return t.startsWith("/")&&(t=t.substr(1)),n.posix.resolve(this.root,t)}continuePromise(t){return new Promise((e,i)=>{const n=()=>{if(this.waitForContinue=!1,this.closed)return i(new Error("Connection closed"));try{t((t,n)=>t?i(t):e(n))||(this.waitForContinue=!0)}catch(t){i(t)}};this.waitForContinue?this.sftp.once("continue",n):n()})}watch(t,e){return new r.Disposable(()=>{})}stat(t){return o(this,void 0,void 0,function*(){const e=yield this.continuePromise(e=>this.sftp.stat(this.relative(t.path),e)).catch(e=>{throw 2===e.code?r.FileSystemError.FileNotFound(t):e}),{mtime:i,size:n}=e;let s=r.FileType.Unknown;return e.isFile()&&(s|=r.FileType.File),e.isDirectory()&&(s|=r.FileType.Directory),e.isSymbolicLink()&&(s|=r.FileType.SymbolicLink),{type:s,mtime:i,size:n,ctime:0}})}readDirectory(t){return o(this,void 0,void 0,function*(){const e=yield this.continuePromise(e=>this.sftp.readdir(this.relative(t.path),e)).catch(e=>{throw 2===e?r.FileSystemError.FileNotFound(t):e});return Promise.all(e.map(e=>o(this,void 0,void 0,function*(){const i=t.with({path:`${t.path}${t.path.endsWith("/")?"":"/"}${e.filename}`}),n=40960==(61440&e.attrs.mode)?r.FileType.SymbolicLink:0;try{const t=(yield this.stat(i)).type;return[e.filename,t|n]}catch(t){return[e.filename,r.FileType.Unknown|n]}})))})}createDirectory(t){return this.continuePromise(e=>this.sftp.mkdir(this.relative(t.path),e))}readFile(t){return new Promise((e,i)=>{const n=this.sftp.createReadStream(this.relative(t.path),{autoClose:!0}),r=[];n.on("data",r.push.bind(r)),n.on("error",i),n.on("close",()=>{e(new Uint8Array(Buffer.concat(r)))})})}writeFile(t,e,i){return new Promise((i,n)=>o(this,void 0,void 0,function*(){let o;try{o=(yield this.continuePromise(e=>this.sftp.stat(this.relative(t.path),e))).mode}catch(e){"No such file"===e.message?o=this.config.newFileMode:(s.c(e),r.window.showWarningMessage(`Couldn't read the permissions for '${this.relative(t.path)}', permissions might be overwritten`))}o=o;const h=this.sftp.createWriteStream(this.relative(t.path),{mode:o,flags:"w"});h.on("error",n),h.end(e,i)}))}delete(t,e){return o(this,void 0,void 0,function*(){const i=yield this.stat(t);return i.type&(r.FileType.SymbolicLink|r.FileType.File)?this.continuePromise(e=>this.sftp.unlink(this.relative(t.path),e)):i.type&r.FileType.Directory&&e.recursive?this.continuePromise(e=>this.sftp.rmdir(this.relative(t.path),e)):this.continuePromise(e=>this.sftp.unlink(this.relative(t.path),e))})}rename(t,e,i){return this.continuePromise(i=>this.sftp.rename(this.relative(t.path),this.relative(e.path),i))}}const a={onDidChangeFile:(new r.EventEmitter).event,watch:(t,e)=>new r.Disposable(()=>{}),stat:t=>{if(console.warn("Checking",t.toString()),"/"===t.path||"\\"===t.path)return{type:r.FileType.Directory};throw r.FileSystemError.FileNotFound(t)},readDirectory:t=>[],createDirectory:t=>{},readFile:t=>new Uint8Array(0),writeFile:(t,e,i)=>{},delete:(t,e)=>{},rename:(t,e,i)=>{}}}};
//# sourceMappingURL=2.extension.js.map