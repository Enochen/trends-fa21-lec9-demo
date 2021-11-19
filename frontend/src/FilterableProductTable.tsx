import "./FilterableProductTable.css";
// import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import ProductTable, { Product } from "./ProductTable";
import { getAuth } from "firebase/auth";

type SearchProps = {
  readonly filterText: string;
  readonly inStockOnly: boolean;
  readonly handleFilterTextChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly handleCheckBoxChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar = ({
  filterText,
  inStockOnly,
  handleFilterTextChange,
  handleCheckBoxChange,
}: SearchProps) => (
  <form>
    <h3>Search</h3>
    <input
      type="text"
      placeholder="search here"
      value={filterText}
      onChange={handleFilterTextChange}
    />
    <p>
      <input
        type="checkbox"
        checked={inStockOnly}
        onChange={handleCheckBoxChange}
      />
      Only show the products in stock
    </p>
  </form>
);

type NewProductProps = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const NewProduct = ({ products, setProducts }: NewProductProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stocked, setStocked] = useState(true);

  // POST request using fetch
  const createProduct = async () => {
    const newProduct = { name, price, stocked };
    if (!name || !price) {
      alert("Fields cannot be empty");
      return;
    }
    getAuth()
      .currentUser?.getIdToken()
      .then((idToken) =>
        fetch("/createProduct", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "authorization": idToken,
          },
          body: JSON.stringify(newProduct),
        })
      )
      .then((res) => res.text())
      .then((data) => {
        const newProductWithID = { ...newProduct, id: data };
        setProducts([...products, newProductWithID]);
      });
  };

  // POST request using axios and async/await
  // const createProduct = async () => {
  //   const newProduct = { price, stocked, name };
  //   const { data } = await axios.post<string>('/createProduct', newProduct);
  //   const newProductWithID = { ...newProduct, id: data };
  //   setProducts([...products, newProductWithID]);
  // }

  return (
    <div>
      <h3>Add New Product</h3>
      <input
        type="text"
        name="name"
        placeholder="name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        name="price"
        placeholder="price..."
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select
        name="stock"
        onChange={(e) => setStocked(e.target.selectedIndex === 0)}
      >
        <option value="true">in stock</option>
        <option value="false">out of stock</option>
      </select>
      <button onClick={createProduct}>add a product</button>
    </div>
  );
};

const FilterableProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // GET request using fetch
  useEffect(() => {
    fetch("/getProducts")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, [products]);

  // GET request using axios and async/await
  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get<Product[]>("/getProducts");
  //     setProducts(data);
  //   })();
  // }, [products]);

  const handleFilterTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInStockOnly(e.target.checked);
  };

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        handleFilterTextChange={handleFilterTextChange}
        handleCheckBoxChange={handleCheckBoxChange}
      />
      <hr />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
      <hr />
      <NewProduct products={products} setProducts={setProducts} />
    </div>
  );
};

export default FilterableProductTable;
