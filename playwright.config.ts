import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',timeout:60000,expect:{timeout:10000},fullyParallel:false,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:3101',launchOptions:{executablePath:process.env.DIDEROT_CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe'},trace:'retain-on-failure'},
 webServer:{command:'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101',url:'http://127.0.0.1:3101',reuseExistingServer:false,timeout:30000},
 projects:[{name:'computador',use:{viewport:{width:1440,height:1000}}},{name:'celular',use:{viewport:{width:390,height:844}}}],
});
