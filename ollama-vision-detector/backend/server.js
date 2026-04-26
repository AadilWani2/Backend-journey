const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json({limit:'20mb'}));

app.post('/api/analyze', async(req,res)=>{
 try{
   const {image}=req.body;
   const base64=image.replace(/^data:image\/\w+;base64,/,'');
   const response=await fetch('http://localhost:11434/api/generate',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({
       model:'llava',
       prompt:'Identify the main object(s) in this image briefly and clearly.',
       images:[base64],
       stream:false
     })
   });
   const data=await response.json();
   res.json({result:data.response});
 }catch(e){
   console.log(e.message);
   res.status(500).json({error:'Backend failed. Is Ollama running with llava model installed?'});
 }
});

app.listen(5000,()=>console.log('Server running on 5000'));