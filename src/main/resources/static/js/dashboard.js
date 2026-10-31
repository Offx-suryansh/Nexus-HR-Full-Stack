(() => {
 let charts={};
 const palette=["#9275ff","#5d8cff","#42c99a","#f2a65a","#ed789c","#50c4d8","#b49aff","#9aa7bc"];
 function chartOptions(){return {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#171d2a",titleColor:"#fff",bodyColor:"#dbe2f3",padding:10,cornerRadius:8}},scales:{x:{ticks:{color:"#8e98ad",font:{size:10}},grid:{display:false}},y:{ticks:{color:"#8e98ad",font:{size:10}},grid:{color:"rgba(142,152,173,.12)"},beginAtZero:true}}}}
 function renderCharts(data){
  const groups=data.departments.map(d=>({name:d.name,count:data.employees.filter(e=>String(employeeDepartmentId(e))===String(d.id)).length,salary:data.employees.filter(e=>String(employeeDepartmentId(e))===String(d.id))}));
  const ctx=$("#departmentChart");if(ctx){if(charts.dept)charts.dept.destroy();charts.dept=new Chart(ctx,{type:"doughnut",data:{labels:groups.map(g=>g.name),datasets:[{data:groups.map(g=>g.count),backgroundColor:palette,borderColor:"#121621",borderWidth:4,hoverOffset:7}]},options:{responsive:true,maintainAspectRatio:false,cutout:"72%",plugins:{legend:{display:false}}}})}
  const total=data.employees.length;$("#chartTotal").textContent=total;$("#departmentLegend").innerHTML=groups.map((g,i)=>`<span class="legend-item"><i class="legend-dot" style="background:${palette[i%palette.length]}"></i>${escapeHTML(g.name)} <b>${g.count}</b></span>`).join("")||'<span class="muted">No department data</span>';
  const s=$("#salaryChart");
  if(s){
   if(charts.salary) charts.salary.destroy();
   charts.salary=new Chart(s,{
    type:"bar",
    data:{labels:groups.map(g=>g.name),datasets:[{
     label:"Average salary",
     data:groups.map(g=>g.salary.length?g.salary.reduce((a,e)=>a+Number(e.salary||0),0)/g.salary.length:0),
     backgroundColor:palette.map(c=>c+"cc"),borderRadius:6,maxBarThickness:34
    }]},
    options:{...chartOptions(),plugins:{...chartOptions().plugins,tooltip:{callbacks:{label:c=>formatMoney(c.raw)}}}}
   });
  }
 }
 async function refresh(){try{const data=await loadWorkspace();setApiStatus(true);const em=data.employees, salaries=em.map(e=>Number(e.salary)||0);$("#totalEmployees").textContent=em.length;$("#totalDepartments").textContent=data.departments.length;$("#avgSalary").textContent=formatMoney(salaries.length?salaries.reduce((a,b)=>a+b,0)/salaries.length:0);$("#maxSalary").textContent=formatMoney(Math.max(0,...salaries));$("#recentEmployees").innerHTML=em.slice().sort((a,b)=>Number(b.id)-Number(a.id)).slice(0,5).map(e=>`<tr><td><div class="employee-cell"><span class="mini-avatar">${escapeHTML(initials(e.name))}</span><span><b>${escapeHTML(e.name)}</b><small>${escapeHTML(e.email)}</small></span></div></td><td><span class="dept-tag">${escapeHTML(employeeDepartmentName(e))}</span></td><td class="salary-cell">${formatMoney(e.salary)}</td><td>#${escapeHTML(e.id)}</td></tr>`).join("")||'<tr><td colspan="4" class="empty-cell">No employees yet. Add your first employee to get started.</td></tr>';renderCharts(data);$("#lastUpdated").textContent="Last synced "+new Date().toLocaleTimeString();}catch(e){setApiStatus(false,"Backend unavailable");$("#recentEmployees").innerHTML='<tr><td colspan="4" class="empty-cell">Could not load data. Start the Spring Boot backend in IntelliJ and refresh.</td></tr>';toast(e.message,"error")}}
 window.pageRefresh=refresh;document.addEventListener("DOMContentLoaded",refresh);
})();