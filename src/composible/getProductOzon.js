import axios from "axios";

export async function getProductOzon({ apiToken, clientId, items }) {
  // const loadingFeedbacks = message.loading('Загрузка продуктов у компании', 0);
  let nameArray = [];
  const skuArray = items.map(item => item.comment.sku.toString());

  function getNumber(value) {
    const result = value.match(/\d+/);
    return result ? Number(result[0]) : null;
  }

  try {
    const response = await axios.post(
      "https://api-seller.ozon.ru/v4/product/info/attributes",
      {
        filter: {
          product_id: [],
          offer_id: [],
          sku: skuArray,
          visibility: "ALL"
        },
        limit: 500,
        sort_dir: "ASC"
      },
      {
        headers: {
          'Client-Id': clientId,
          'Api-Key': apiToken,
        }
      }
    );

    if (response.data.result.length > 0) {
      nameArray = response.data.result.map(item => ({
        productName: item.name,
        sku: getNumber(item.barcode),
        offer_id: item.offer_id,
      }));
    }

    // Процесс обновления productName в массиве feedbacks
    items.forEach(item => {
      const product = nameArray.find(p => p.sku === item.comment.sku);
      if (product) {
        item.productName = product.productName;
        item.comment.sku = product.offer_id;
      }
    });

    return items;
  } catch (error) {
    console.error("getProductOzon", error);
    return [];
  }
}
