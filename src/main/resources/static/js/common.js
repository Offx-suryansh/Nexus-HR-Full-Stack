(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  window.$ = $; window.$$ = $$;
  window.formatMoney = value => new Intl.NumberFormat(APP_CONFIG.LOCALE,{style:"currency",currency:APP_CONFIG.CURRENCY,maximumFractionDigits:0}).format(Number(value)||0);
  window.escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  window.initials = name => String(name||"?").trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("");
  window.toast = (message, type="success") => {
    const host=$("#toastHost"); if(!host)return;
    const el=document.createElement("div");el.className=`toast ${type==="error"?"error":""}`;
    el.innerHTML=`<i data-lucide="${type==="error"?"alert-circle":"check-circle-2"}"></i><span>${escapeHTML(message)}</span>`;
    host.appendChild(el);if(window.lucide)lucide.createIcons();setTimeout(()=>el.remove(),3600);
  };
  window.setApiStatus = (online, detail="") => {
    ["statusDot","settingsStatusDot"].forEach(id=>{const el=$("#"+id);if(el)el.className=`status-dot ${online?"online":"offline"}`});
    ["apiStatus","settingsApiStatus"].forEach(id=>{const el=$("#"+id);if(el)el.textContent=online?"Backend connected":(detail||"Backend unavailable")});
  };
  window.loadWorkspace = async () => {
    const [employees, departments] = await Promise.all([API.getEmployees(), API.getDepartments()]);
    return { employees:Array.isArray(employees)?employees:[], departments:Array.isArray(departments)?departments:[] };
  };
  window.employeeDepartmentId = e => e?.department?.id ?? e?.departmentId ?? "";
  window.employeeDepartmentName = e => e?.department?.name ?? e?.departmentName ?? "Unassigned";
  window.bindCommon = () => {
    if(window.lucide)lucide.createIcons();
    $("#menuToggle")?.addEventListener("click",()=>$("#sidebar")?.classList.toggle("open"));
    $("#themeBtn")?.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="light"?"dark":"light";setTheme(next)});
    $("#refreshBtn")?.addEventListener("click",()=>{if(window.pageRefresh)window.pageRefresh();else location.reload()});
    $$("[data-close]").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.close)?.classList.remove("open")));
    $$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
    const refresh=Number(localStorage.getItem("nexusRefresh")||APP_CONFIG.AUTO_REFRESH_MS);
    if(refresh>0)window.autoRefreshTimer=setInterval(()=>{if(window.pageRefresh)window.pageRefresh()},refresh);
    checkConnection();
  };
  window.setTheme = theme => {document.documentElement.dataset.theme=theme;localStorage.setItem("nexusTheme",theme);const sel=$("#themeSelect");if(sel)sel.value=theme};
  async function checkConnection(){try{await API.check();setApiStatus(true)}catch(e){setApiStatus(false,"Backend unavailable");}}
  document.addEventListener("DOMContentLoaded",()=>{setTheme(localStorage.getItem("nexusTheme")||"dark");bindCommon()});
})();