# Query optimization examples

I used products for these examples. Each query filters the products, sorts them, and returns one page. I added `id` or `_id` as a second sort field so products with the same price have a consistent order.

## PostgreSQL

This query returns up to 10 products within a price range. `$1` is the minimum price, `$2` is the maximum price, and `$3` is the offset. For example, pass `10` to skip the first 10 products.

```sql
SELECT id, name, category, price, quantity, created_at, updated_at
FROM products
WHERE price BETWEEN $1 AND $2
ORDER BY price ASC, id ASC
LIMIT 10
OFFSET $3;
```

An index on the price and id columns can help with this query:

```sql
CREATE INDEX products_price_id_idx
ON products (price ASC, id ASC);
```

I can use `EXPLAIN` to check whether PostgreSQL uses the index.

## MongoDB

This query returns up to five products in the `Electronics` category. `page` starts at 1.

```javascript
const page = 1;
const pageSize = 5;

db.products
  .find(
    { category: "Electronics" },
    {
      _id: 1,
      name: 1,
      category: 1,
      price: 1,
      quantity: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  )
  .sort({ price: -1, _id: 1 })
  .skip((page - 1) * pageSize)
  .limit(pageSize);
```

This sorts by price from high to low. `_id` gives products with the same price a consistent order. Add an index for the category and sort fields:

```javascript
db.products.createIndex({ category: 1, price: -1, _id: 1 });
```
