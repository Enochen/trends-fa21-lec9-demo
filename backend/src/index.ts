import express from "express";
import cors from "cors";
import path from "path";
import { db, auth } from "./firebase-config";

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.use(express.json());

const port = process.env.PORT || 8080;

type Product = {
  price: string;
  stocked: boolean;
  name: string;
};

type ProductWithID = Product & {
  id: string;
};

const productsCollection = db.collection("products");

app.get("/getProducts", async (_, res) => {
  const products = await productsCollection.get();
  res.json(
    products.docs.map((doc): ProductWithID => {
      const product = doc.data() as Product;
      return { ...product, id: doc.id };
    })
  );
});

app.post("/createProduct", async (req, res) => {
  const idToken = req.headers.authorization || "";
  try {
    const user = await auth.verifyIdToken(idToken);
    if(user.email !== "yc728@cornell.edu") throw new Error();
    const newProduct = req.body as Product;
    const addedProduct = await productsCollection.add(newProduct);
    res.send(addedProduct.id);
  } catch (error) {
    res.send("auth error");
  }
});

app.post("/updatePrice", async (req, res) => {
  const { id, rating } = req.query;
  await productsCollection.doc(id as string).update({ rating });
  res.send("Product updated!");
});

app.delete("/deleteProduct", async (req, res) => {
  const { id } = req.query;
  await productsCollection.doc(id as string).delete();
  res.send("Product deleted!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
