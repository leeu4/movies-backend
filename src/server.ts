import { connectDB,prisma } from "./config/db";
import { Movie, User,Comment } from "@prisma/client";
import express, { Request, Response } from 'express';
import {v4} from 'uuid';

const port = 3000;
const app = express();
app.use(express.json());
app.post('/register',async(req:Request,res:Response)=>{
    const new_user = req.body as User;
    await prisma.user.create({
        data:new_user
    })
    res.json("User has been Created Successfully");
})
app.post('/login',async(req:Request,res:Response)=>{
    const {username,password} = req.body as User;
    const user = await prisma.user.findFirst({where:{username:username,password:password}});
    if(!user){
        return res.json("Incorrect username or password");
    }
    else{
        res.json(`welcome ${username}`);
    }
})
app.delete('/delete/:id',async(req:Request,res:Response)=>{
    const {id} = req.params;
    const user = await prisma.user.delete({where:{id:id}});
    return res.json(`User Deleted Successfully`);
})
app.put('/updateuser/:id',async(req:Request,res:Response)=>{
    const {id} = req.params;
    const new_user = req.body as User;
    const user = await prisma.user.update({
        where:{id:id},
        data:new_user
    });
    res.json(`User ${new_user.username} Updated successfully`);

})
app.get('/user/:id',async(req:Request,res:Response)=>{
    const {id} = req.params;
    const user_info = await prisma.user.findMany({where:{id:id},select:{comments:true,username:true}});
    return res.json(user_info);
})
app.post('/createmovie',async(req:Request,res:Response)=>{
    const new_movie = req.body as Movie;
    await prisma.movie.create({
        data:new_movie
    })
    res.json(`Movie:${new_movie.title} Created Successfully`);
});
app.get("/movie/:id",async(req:Request,res:Response)=>{
    const {id} = req.params;
    const movie_info = await prisma.movie.findMany({where:{id:id},select:{title:true,duration:true,rating:true,comments:true,}});
    return res.json(movie_info);
});
app.get("/movies",async(req:Request,res:Response)=>{
    const movies = await prisma.movie.findMany();
    return res.json(movies);
})
app.get("/moviecomments/:id",async(req:Request,res:Response)=>{
    const {id} = req.params;
    const movie_inf = await prisma.movie.findMany({
        where:{id:id},
        select:{title:true,id:false,rating:false,duration:true,comments:true},
    })
    return res.json(movie_inf)
})
app.get('/movierating/:rating',async(req:Request,res:Response)=>{
    const {rating}=req.params;
    const movies_rate = await prisma.movie.findMany({where:{rating:parseFloat(rating)}});
    return res.json(movies_rate);
})
app.post('/addcomment',async(req:Request,res:Response)=>{
    const newcomment = req.body as Comment;
    await prisma.comment.create({
        data:newcomment
    })
    return res.json("comment added successfully");
})
app.put("/updatecomment/:id",async (req:Request,res:Response)=>{
    const {id} = req.params;
    const new_comment = req.body as Comment
    const comment = await prisma.comment.update({
        where:{id:id},
        data:new_comment
    })
    return res.json("Comment updated successfully");
})
app.delete('/deletecomment/:id',async(req:Request,res:Response)=>{
    const {id} = req.params;
    const comment = await prisma.comment.delete({where:{id:id}});
    return res.json("comment deleted successfully")
})
connectDB()
app.listen(port,()=>{
    console.log("server is running");
})