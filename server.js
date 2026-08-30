const express=require("express");
const path=require("path");
const fs=require("fs");
const crypto=require("crypto");
const app=express();
const PORT=process.env.PORT||3000;
const DATA_FILE=path.join(__dirname,"matches.json");
app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));
function readMatches(){try{if(!fs.existsSync(DATA_FILE))return [];return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));}catch(e){return [];}}
function writeMatches(data){fs.writeFileSync(DATA_FILE,JSON.stringify(data,null,2));}
app.get("/api/matches",(req,res)=>res.json(readMatches()));
app.get("/api/matches/:id",(req,res)=>{const m=readMatches().find(x=>x.id===req.params.id);if(!m)return res.status(404).json({error:"Match not found"});res.json(m);});
app.post("/api/matches",(req,res)=>{const a=readMatches();const m={...req.body,id:crypto.randomUUID(),createdAt:new Date().toISOString()};a.unshift(m);writeMatches(a);res.status(201).json(m);});
app.put("/api/matches/:id",(req,res)=>{const a=readMatches();const i=a.findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:"Match not found"});a[i]={...req.body,id:req.params.id,updatedAt:new Date().toISOString()};writeMatches(a);res.json(a[i]);});
app.delete("/api/matches/:id",(req,res)=>{const a=readMatches(),b=a.filter(x=>x.id!==req.params.id);if(b.length===a.length)return res.status(404).json({error:"Match not found"});writeMatches(b);res.json({success:true});});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log("CB25 running at http://localhost:"+PORT));