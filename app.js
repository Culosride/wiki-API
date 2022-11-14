import express from "express";
import mongoose from "mongoose";

// import and use the dirname() method from the path module.
// The dirname method takes a path as a parameter and returns the directory name of the path.
import path from "path";
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
    const articles = await Article.find()
    res.render("home", {articles: articles})
  })

  app.get("/new-article", async (req, res) => {
    res.render("newArticle")
  })

  app.post("/postArticle", async (req,res) => {
    const title = req.body.title
    const content = req.body.content
    const newArticle = new Article({
      title: title,
      content: content
    })

    await newArticle.save()
    res.redirect("/")
  })

}

app.listen(3000)
