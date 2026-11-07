import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const src=fs.readFileSync(new URL('./seo-quality-gate.mjs',import.meta.url),'utf8');
test('requires merged Hub PR',()=>assert.match(src,/pr\.merged_at/));
test('reads central review record from main',()=>assert.match(src,/quality-reviews/));
test('requires independently recorded PASS and release approval',()=>assert.match(src,/review\.verdict!=='PASS'/));
test('checks changed paths against Hub review',()=>assert.match(src,/affected\.some\(p=>!review\.changedPaths\.includes\(p\)\)/));
test('paginates changed files',()=>assert.match(src,/\+\+page/));
test('fails closed on remote authentication errors',()=>assert.match(src,/central review authentication failed/));

import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const recordPath='docs/seo/quality-reviews/approved.json';
const body='https://github.com/alanbishop75/find-my-ideal-hub/pull/99\nSEO Quality Gate record: '+recordPath;
const repo='alanbishop75/'+process.env.GITHUB_REPOSITORY?.split('/').at(-1);
function execute(scenario, prBody=body){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'seo-gate-mock-'));
 const mock=path.join(dir,'curl');
 const fixture=JSON.stringify(scenario);
 fs.writeFileSync(mock, '#!/usr/bin/env node\n'+
  'const u=process.argv.at(-1);const d=JSON.parse(process.env.MOCK_GH);\n'+
  'if(u.includes("/pulls/12/files"))console.log(JSON.stringify(d.files));\n'+
  'else if(u.includes("/pulls/99/files"))console.log(JSON.stringify(d.hubFiles));\n'+
  'else if(u.includes("/pulls/99/reviews"))console.log(JSON.stringify(d.reviews));\n'+
  'else if(u.includes("/pulls/99"))console.log(JSON.stringify(d.hubPr));\n'+
  'else if(u.includes("/contents/"))console.log(JSON.stringify({encoding:"base64",content:Buffer.from(JSON.stringify(d.review)).toString("base64")}));\n'+
  'else process.exit(1);\n',{mode:0o755});
 const out=spawnSync(process.execPath,[new URL('./seo-quality-gate.mjs',import.meta.url).pathname],{
  env:{...process.env,PATH:dir+':'+process.env.PATH,MOCK_GH:fixture,GH_REPO:'alanbishop75/test-site',PR_NUMBER:'12',PR_BODY:JSON.stringify(prBody),GH_TOKEN:'test'},
  encoding:'utf8'
 });
 fs.rmSync(dir,{recursive:true,force:true});return out;
}
const good={
 files:[{filename:'app/guide/page.tsx'}],
 hubPr:{merged_at:'2026-11-07T12:00:00Z',base:{ref:'main'},user:{login:'author'}},
 reviews:[{state:'APPROVED',user:{login:'independent-reviewer'}}],
 hubFiles:[{filename:recordPath}],
 review:{siteRepository:'alanbishop75/test-site',changedPaths:['app/guide/page.tsx'],verdict:'PASS',release:{approval:'APPROVED',approvalReference:'approval-123',ci:'PASS',preview:'PASS'}}
};
test('approved merged Hub review permits a matching SEO change',()=>{const x=execute(good);assert.equal(x.status,0,x.stderr);});
test('unapproved content is blocked',()=>assert.notEqual(execute({...good,review:{...good.review,verdict:'FAIL'}}).status,0));
test('unmerged Hub review is blocked',()=>assert.notEqual(execute({...good,hubPr:{...good.hubPr,merged_at:null}}).status,0));
test('forged PR-body PASS without Hub record is blocked',()=>assert.notEqual(execute(good,'SEO Quality Gate verdict: PASS').status,0));
test('review for different site is blocked',()=>assert.notEqual(execute({...good,review:{...good.review,siteRepository:'other/site'}}).status,0));
test('unreviewed additional file is blocked',()=>assert.notEqual(execute({...good,files:[...good.files,{filename:'lib/new-ranking.ts'}]}).status,0));
test('unrecognised page file is not bypassed',()=>assert.notEqual(execute({...good,files:[{filename:'new-pages/hidden-seo.md'}]}).status,0));
test('CI-only changes do not require a Hub record',()=>assert.equal(execute({...good,files:[{filename:'.github/workflows/ci.yml'}]},'').status,0));

test('self-approved Hub PR cannot authorize release',()=>assert.notEqual(execute({...good,reviews:[{state:'APPROVED',user:{login:'author'}}]}).status,0));
