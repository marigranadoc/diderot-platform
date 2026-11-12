import {readFileSync,writeFileSync} from 'node:fs';
// Keep the raw report separately before calling this evidence-only utility.
for(const path of process.argv.slice(2)){
 const source=readFileSync(path,'utf8'),start=source.indexOf('{');
 const report=JSON.parse(source.slice(start));
 if(!report.config||!report.stats||!Array.isArray(report.suites))throw Error(`Not a completed Playwright report: ${path}`);
 const cases=[];
 function visit(suite){
  for(const spec of suite.specs??[])for(const test of spec.tests??[])cases.push({file:spec.file,line:spec.line,title:spec.title,project:test.projectName,status:test.status,expected_status:test.expectedStatus,results:(test.results??[]).map(result=>({status:result.status,duration_ms:result.duration,retry:result.retry,errors:(result.errors??[]).map(error=>(error.message??error.value??'Unknown error').replace(/\u001b\[[0-9;]*m/g,''))}))});
  for(const child of suite.suites??[])visit(child);
 }
 report.suites.forEach(visit);
 const output={format:'diderot-playwright-evidence-v1',source:'Completed Playwright JSON report; raw original retained in local work/raw-campaign-reports.',projects:report.config.projects.map(project=>({name:project.name,viewport:project.use?.viewport})),summary:report.stats,runner_errors:(report.errors??[]).map(error=>error.message??error.value),cases};
 writeFileSync(path,JSON.stringify(output,null,2)+'\n');
 console.log(JSON.stringify({file:path,...output.summary}));
}
