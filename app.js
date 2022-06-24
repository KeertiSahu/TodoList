//jshint esversion:6

const express =  require("express");
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const { redirect } = require("express/lib/response");
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();

// let items = ["Buy Foods", "Study" , "Drink Water"] ;
// let workItems = [];

app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Keerti:Keerti%4017@clustertodolist.vli7b.mongodb.net/todolistDB" , {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item" , itemsSchema );

const item1 = new Item ({
    name: "Welcome to todolist! "
});
const item2 = new Item ({
    name: "Hit the + button to add a new item. "
});
const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});

const defaultitems = [ item1 , item2 , item3 ] ;

const listSchema = new mongoose.Schema({
    name: String , 
    items : [itemsSchema]
});
const List = mongoose.model("List" , listSchema); 

app.get("/" , function(req,res){

    Item.find({} , function (err , foundItems) {

        if (foundItems.length ===0 ) {
            Item.insertMany( defaultitems , function (err) {
                   if(err){
                       console.log(err);
                   }else{
                       console.log("Successfully added to the databse.");
                   }
               });
               res.redirect("/");
       }else{
        res.render("list", {listTitle: "Today" , newlistItems: foundItems });
       }

    });
    
}); 


app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName) ;

    List.findOne({name: customListName } , function (err , foundList ) {
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items : defaultitems
                });
                list.save();
                res.redirect("/" + customListName);
            }else{
                //show an existing list

                res.render("list" , {listTitle: (foundList.name) , newlistItems: foundList.items })

            }
        }
    });

    // res.render("list",{listTitle: "Work List" , newlistItems: workItems});
});

app.post("/", function(req,res){

    let itemName = req.body.newitem;
    let listName = req.body.list;

    const item = new Item({
        name : itemName
    });

    if(listName === "Today" ){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName} , function(err , foundList){
           if(err){
            console.log(err);
           }else{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
           }
        });
    }
});

app.post("/delete" , function (req,res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId , function(err){
            if (err) {
                console.log(err);
            }else{
                console.log("Succesfully deleted the item.");
                res.redirect("/");
            }
        });
    }else {
        List.findOneAndUpdate({name: listName} , {$pull: {items: {_id: checkedItemId}}} , function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }

});



// app.post("/work" , function(req,res){
//     let item = req.body.newitem;
//     workItems.push(item);
//     res.redirect("/work");
// });

app.get("/about", function(req, res){
    res.render("about");
  });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
  

app.listen(port, function(){
    console.log ("Server started on port successfully!");
});