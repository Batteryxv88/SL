"use strict";(self.webpackChunkjob=self.webpackChunkjob||[]).push([[305],{305:(e,t,n)=>{n.r(t),n.d(t,{default:()=>b});var a=n(893),r=n(998);const s="ngemgJwv",i="EiLEGA0J",c="UdaXOiDK";var l=n(294),u=n(567),o=n(40),d=["A50U172200","A50U172300","A50U172100","A50U109900","A50U164901","A50UR70A12"],p=["A50UR70244","A3VX600","A3VX700","A3VX800","A3VX900"],m=["A5WH0Y0"],f=["A1DUR71C00","A50UR70K22","A50U500401","A1DU504203","A50U501201","A50UR70655","65AA26380","A50U505700","A50U531601","A50U520001","A50UR70B00","A50UR70G01","V218060086"],h=["A57V720211","A50U756300","A7X5720100","A7X5740100","A50U724102","A03U729500","26NA53712","A50U720501","A1UD723500","A03U809500","A50U733712","A50UR73322","A50UM31F00","A50UM31E00","A50UR70F00","A50UR70E22"],A=["A50UR70115"],v=["A7X5601600"],x=["A7X5895400"];const j=function(){var e=(0,r.v9)((function(e){return e.parts.partsArray})),t=(0,r.v9)((function(e){return e.replacedParts.usedPartsArray})),n=(0,r.I0)(),j=(0,l.useState)(""),N=j[0],U=j[1],g=(0,l.useState)(""),b=g[0],R=g[1],w=(0,l.useState)(0),y=w[0],D=w[1],L=(0,l.useState)(""),X=L[0],S=L[1],C=(0,l.useState)(""),k=C[0],q=C[1],E=(0,l.useState)(),P=(E[0],E[1]);return(0,l.useEffect)((function(){fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow").then((function(e){return e.json()})).then((function(e){return S(e.datetime)})).catch((function(e){console.log("Ошибка. Запрос не выполнен: ",e)}))}),[k,y]),(0,a.jsxs)("form",{className:"fKIr0Jlc",onSubmit:function(a){a.preventDefault();var r,s=e.filter((function(e){return e.part.partN===N})),i=s[0].part.quantity-y,c=s[0].part.partName,l=(r=N,d.includes(r)?"External section":p.includes(r)?"Developing section":m.includes(r)?"Photo conductor section":"A50UR70323"===r?"Charging section":f.includes(r)?"Intermediate transfer section":A.includes(r)?"Toner collection section":h.includes(r)?"Fusing section":v.includes(r)?"Paper feed section":x.includes(r)?"Paper exit section":"Unknown section"),j=b,g={partN:N,quantity:y,date:X,section:l,man:k,partName:c},w={id:s[0].id,part:{quantity:i}},L=function(e,t){var n=e.filter((function(e){return e.part.partN===t}));return 0===n.length?null:n.sort((function(e,t){return new Date(t.part.date).getTime()-new Date(e.part.date).getTime()}))[0].id}(t,N),S={id:L,part:{serviceLife:j}};n((0,u.R5)(S)),n((0,o.Fw)(w)),n((0,u.tv)(g)),U(""),R(""),D(0),P(""),q("")},children:[(0,a.jsxs)("div",{className:s,children:[(0,a.jsx)("label",{className:i,children:"Парт номер"}),(0,a.jsx)("input",{className:c,onChange:function(e){return U(e.target.value.trim())},value:N})]}),(0,a.jsxs)("div",{className:s,children:[(0,a.jsx)("label",{className:i,children:"Пройденный ресурс"}),(0,a.jsx)("input",{className:c,onChange:function(e){return R(e.target.value)},value:b})]}),(0,a.jsxs)("div",{className:s,children:[(0,a.jsx)("label",{className:i,children:"Кол-во"}),(0,a.jsx)("input",{className:"faL4Qb2K",type:"number",onChange:function(e){return D(e.target.value)},value:y})]}),(0,a.jsxs)("div",{className:s,children:[(0,a.jsx)("label",{className:i,children:"Ответственный"}),(0,a.jsxs)("select",{className:c,onChange:function(e){return q(e.target.value)},value:k,children:[(0,a.jsx)("option",{value:""}),(0,a.jsx)("option",{value:"Алексей",children:"Алексей"}),(0,a.jsx)("option",{value:"Максим",children:"Максим"}),(0,a.jsx)("option",{value:"Сергей",children:"Сергей"})]})]}),(0,a.jsx)("button",{className:"WeXgSD6h",type:"submit",children:"Добавить"})]})},N={calendar:"h_IMJcan",box:"tuzckoRo",number:"UnJOYpar",date:"oe5k0Zs2",res:"xfUZNwHH",qty:"NZZmIw_c"},U=function(e){var t=e.name,n=e.number,s=e.qty,i=e.date,c=e.man,l=e.life,u=new Date(i),o=u.toLocaleString("ru-RU",{month:"numeric"}),d=u.toLocaleString("ru-RU",{day:"2-digit"}),p=u.getFullYear(),m=function(e,t,n){var a,r;if(t.length<=0||!n)return 0;var s=t.filter((function(t){return t.part.partN===e}));return(null===(r=null===(a=s[0])||void 0===a?void 0:a.part)||void 0===r?void 0:r.partLife)?Math.round(100*n/s[0].part.partLife):0}(n,(0,r.v9)((function(e){return e.parts.partsArray})),l);return(0,a.jsxs)("div",{className:"dnQKLzz4",children:[(0,a.jsx)("p",{className:"b3vAdLgC",children:t}),(0,a.jsx)("p",{className:"Bzpv9aOB",children:n}),(0,a.jsx)("p",{className:"XpYXwLg2",children:c}),(0,a.jsx)("p",{className:"ToiLSZ1m",children:s}),(0,a.jsx)("p",{className:m<100?"uOQzHNM_":"ZdImkBs_",children:m+"%"}),(0,a.jsxs)("div",{className:"TidsvjQu",children:[(0,a.jsx)("p",{children:d+"."}),(0,a.jsx)("p",{children:o+"."}),(0,a.jsx)("p",{children:p})]})]})},g=function(){var e,t,n,s=(0,r.v9)((function(e){return e.replacedParts.usedPartsArray})),i=(0,r.v9)((function(e){return e.filteredParts.filter})),c=0===(n=(e=s,"All"===(t=i)?e:e.filter((function(e){return e.part.section===t})))).length?n:n.slice().sort((function(e,t){var n=new Date(e.part.date).getTime();return new Date(t.part.date).getTime()-n})),d=(0,r.I0)();return(0,l.useEffect)((function(){d((0,o.KW)()),d((0,u.BB)())}),[d]),(0,a.jsxs)("div",{className:N.calendar,children:[(0,a.jsxs)("div",{className:N.box,children:[(0,a.jsx)("p",{className:N.name,children:"Наименование"}),(0,a.jsx)("p",{className:N.number,children:"Парт номер"}),(0,a.jsx)("p",{className:N.man,children:"Ответственный"}),(0,a.jsx)("p",{className:N.qty,children:"Кол-во"}),(0,a.jsx)("p",{className:N.res,children:"Ресурс"}),(0,a.jsx)("p",{className:N.date,children:"Дата"})]}),c.map((function(e){return(0,a.jsx)(U,{name:e.part.partName,number:e.part.partN,qty:e.part.quantity,man:e.part.man,date:e.part.date,life:e.part.serviceLife},e.id)}))]})},b=function(){return(0,a.jsxs)("div",{children:[(0,a.jsx)(j,{}),(0,a.jsx)(g,{})]})}}}]);