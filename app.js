import express from "express";
import mongoose from "mongoose";

// import and use the dirname() method from the path module.
// The dirname method takes a path as a parameter and returns the directory name of the path.
import path from "path";
import { title } from "process";
// fileURLToPath method from the url module to get the filename.
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB')

  const articleSchema = new mongoose.Schema({
    title: String,
    content: String
  })

  const Article = mongoose.model("Article", articleSchema)

  app.get("/", async (req, res) => {
    res.redirect("/articles")
  })


  app.route("/articles")
  .get(async (req, res) => {
    const articles = await Article.find()
    res.send(articles)
  })

  .post(async (req,res) => {
    const title = req.body.title
      const content = req.body.content
      const newArticle = new Article({
        title: title,
        content: content
      })
      await newArticle.save()
      res.redirect("/articles")
    })

    .delete(async (req, res) => {
      await Article.deleteMany()
      res.redirect("/articles")
    });

  app.route("/articles/:id")

    .get(async (req, res) => {
        const id = req.params.id
        const article = await Article.find({_id: id})
        res.send(article)
      })

      .put(async (req, res) => {
        const {title, content} = req.body
        await Article.replaceOne(
          { _id: req.params.id },
          { title, content },
          )
        const article = await Article.findOne({ _id: req.params.id })
        res.send(article)
      })

      .patch(async (req, res) => {
        const {title, content} = req.body
        await Article.updateOne(
          { _id: req.params.id },
          { title, content },
          )
        const article = await Article.findOne({ _id: req.params.id })
        res.send(article)
      })

      .delete(async (req, res) => {
        const id = req.params.id
        await Article.findOneAndDelete({_id: id})
        res.redirect("/articles")
      })
  }

  app.listen(3000)
