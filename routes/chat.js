const express = require("express");
const { reset } = require("nodemon");
const Contenedor = require("../src/daos/chat/ChatDaoFirebase");
const { normalize, schema, denormalize } = require("normalizr");

const app = express();
const { Router } = express;
const router = new Router();


let chat = new Contenedor;

//GET TODO EL CHAT
router.get("/", (req, res) => {
  async function getTodos(){
    try{
      let aux = await chat.getAll();
      console.log(aux);
      console.log('********************************************');
      const commentSchema = new schema.Entity('msg')
      const schemaAutor = new schema.Entity('author')
      const mySchema = new schema.Array({
        author: schemaAutor,
        comments: [ commentSchema ]
      })

      const normalizedChat = normalize(aux, mySchema)
      console.log(normalizedChat);
      console.log('********************************************');
      
      const denormalizeChat = denormalize(normalizedChat.result, mySchema, normalizedChat.entities)
      console.log(denormalizeChat);
      console.log('********************************************');
      
      res.send({normalizr: normalizedChat, original: aux});

    }
    catch(error){
      throw Error("Error en todos los chats")
    }  
  }    
  getTodos();

});

//POST CON CHAT
router.post("/", (req, res) => {

  async function saveChat(){
    try {          
      await chat.save(req.body)
      res.send('chat agregado');      
    } catch (error) {
      throw Error("Error en post Chat");
    }
  }
  saveChat();
});


//EXPORT MODULO ROUTER
module.exports = router;