
// requring libraries 

const express = require('express')

const post = require('../models/post')


const mainRoutes = express.Router()  // created instance named mainRoutes



// creating routes 
// mainRoutes.get('/',(req,res)=>{
//    const text={
//     title:"main page",
//     content:'it is the page about the html and css and javascript'
//    }
//     res.render('index',{text})

// })


// inserting data into the data base using a separate function

// function insertdata()
// {
//     post.insertMany([{
//         title:'junais',
//         body:'how are you my dear'},
//         {
//             title:'junais',
//             body:'how are you my dear'},
//             {
//                 title:'junais',
//                 body:'how are you my dear'},
//                 {
//                     title:'junais',
//                     body:'how are you my dear'},
//                     {
//                         title:'junais',
//                         body:'how are you my dear'},
//                         {
//                             title:'junais',
//                             body:'how are you my dear'},
//                             {
//                                 title:'junais',
//                                 body:'how are you my dear'},
//                                 {
//                                     title:'junais',
//                                     body:'how are you my dear'},{
//                                         title:'junais',
//                                         body:'how are you my dear'},
//                                         {
//                                             title:'junais',
//                                             body:'how are you my dear'},
//                                             {
//                                                 title:'junais',
//                                                 body:'how are you my dear'},
//                                                 {
//                                                     title:'junais',
//                                                     body:'how are you my dear'}

//     ])  
// }
// insertdata()


// mainRoutes.get('/',async(req,res)=>{
//     const data={
//         title:"my blogs",
//         post:"how are you man "
//     }
//     try {
//         const data1 = await post.find()
//         res.render('index',{data,data1})
        
//     } catch (error) {
//         console.log(error)
        
//     }
// })


mainRoutes.get('/',async(req,res)=>{
   
    try {
        const text={
            title:"my blogs",
            post:"how are you man "
        }
        
        let perPage= 6;
        let page=req.query.page || 1;

        const data = await post.aggregate([{$sort: {createdAt:-1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();


        const count = await post.countDocuments();
        const nextPage =parseInt(page) +1;
        const hasNextPage = nextPage<= Math.ceil(count/perPage)
        
        



        
        res.render('index',{
            text,
            data,
            current:page,
            nextPage :hasNextPage ? nextPage :null
        })
        
    } catch (error) {
        console.log(error)
        
    }
})


// creating routes 
mainRoutes.get('/post/:id', async(req,res)=>{
    try {

        const text={
            title:"main page",
            content:'it is the page about the html and css and javascript'
           }
           let slug = req.params.id

           const data = await post.findById({_id :slug})
            res.render('post',{text,data})
        
    } catch (error) {
        console.log(error)
        
    }
   


})


mainRoutes.post ('/search',async(req,res)=>{
    try {

        const text= {
            title:'search',
            content:'it is the serach page'
        }

        let search = req.body.searchTerm
        // const searchNoSpecial = search.replace(/[^a-zA-Z0-9]/g,"")

        

        // console.log(search)
        const data= await post.find({
            $or:[
                {title:{$regex: new RegExp(search,'i')}},
                {body:{$regex: new RegExp(search,'i')}}
            ]
        })
        res.render('search',{data,text})
        
    } catch (error) {
        console.log(error)
        
    }
})




module.exports = mainRoutes;