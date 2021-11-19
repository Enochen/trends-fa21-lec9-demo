import "./ProductTable.css";
// import axios from "axios";

export type Product = {
  readonly price: string;
  readonly stocked: boolean;
  readonly name: string;
  readonly id: string;
};

type ProductRowProps = {
  product: Product;
};

// new code 3
const ProductRow = ({
  product: { name, stocked, price, id },
}: ProductRowProps) => {
  // DELETE request using fetch
  const deleteProduct = () => {
    fetch(`/deleteProduct?id=${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
  };

  // DELETE request using axios and async/await
  // const deleteProduct = async () => {
  //   await axios.delete('/deleteProduct?id=${id}');
  // }

  const nameStyle = stocked ? {} : { color: "red" };
  return (
    <tr>
      <td style={{ ...nameStyle }}>{name}</td>
      <td>{price}</td>
      <td>
        <button onClick={deleteProduct}>X</button>
      </td>
    </tr>
  );
};

type Props = {
  readonly products: Product[];
  readonly filterText: string;
  readonly inStockOnly: boolean;
};

const ProductTable = ({ products, filterText, inStockOnly }: Props) => {
  const filterNormalized = filterText.toLocaleUpperCase();
  const filteredProducts = products.filter(({ name, stocked }) => {
    return (
      name.toLocaleUpperCase().includes(filterNormalized) &&
      (stocked || !inStockOnly)
    );
  });

  return (
    <div className="listings">
      <h3>Listings</h3>
      {filteredProducts.length ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow product={product} key={product.id} />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Nothing found 😢</div>
      )}
    </div>
  );
};

export default ProductTable;
