"use strict";(self.webpackChunktemplate=self.webpackChunktemplate||[]).push([[312],{312:(t,e,s)=>{s.r(e),s.d(e,{default:()=>d});class d{constructor(t,e){this.board=t,this.todo=e,this.addTodoToDOM()}checkClicked(t){const e=t,s=t.parentElement.querySelector("button.description");"done"===this.todo.getStatus()?(s.dataset.status="pending",e.dataset.status="pending",this.todo.setStatus("pending")):(s.dataset.status="done",e.dataset.status="done",this.todo.setStatus("done"))}todoClicked(t){t.classList.add("clicked-todo"),s.e(345).then(s.bind(s,345)).then((e=>{new(0,e.default)(this.todo,t)}))}addTodoToDOM(){const t=document.createElement("div");t.className="todo",t.dataset.id=this.todo.getId();const e=document.createElement("button");e.className="status-checker",e.addEventListener("click",(t=>{this.checkClicked(t.target)})),e.dataset.status=this.todo.getStatus(),t.appendChild(e);const s=document.createElement("button");s.textContent=this.todo.getDescription(),s.className="description",s.dataset.selectedPriority=this.todo.getTitle(),s.dataset.status=this.todo.getStatus(),s.addEventListener("click",(t=>{this.todoClicked(t.target)})),t.appendChild(s);const d=this.board.children.length;t.style.animationDuration="".concat(10*d+500,"ms"),t.style.animationDelay="".concat(10*d,"ms"),this.board.appendChild(t),this.board.scrollTo(0,this.board.scrollHeight)}}}}]);
//# sourceMappingURL=312.266dba335c09115c7f89.js.map