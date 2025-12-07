const express=require("express");
const App=express();

App.listen(3000, ()=>{
    console.log("App is listening");
}
)

App.get("/", (req,res)=>{
    res.status(200).send("App is Working");
}
)

App.post("/",(req,res)=>{
    res.status(200).send("POST Method working good")
})
