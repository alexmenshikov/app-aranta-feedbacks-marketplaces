import axios from "axios";

export async function getFeedbacksOzon({ companyId, apiToken, clientId, companyName, marketplace, message }) {
  let dataList = [];
  const loadingFeedbacks = message.loading(`Загрузка отзывов у компании ${companyName}`, 0);

  try {
    const response = await axios.post(
      "https://api-seller.ozon.ru/v1/review/list",
      {
        last_id: "",
        limit: 100,
        sort_dir: "ASC",
        status: "UNPROCESSED"
      },
      {
        headers: {
          'Client-Id': clientId,
          'Api-Key': apiToken,
        }
      }
    );

    if (response.data.reviews.length > 0) {
      dataList = response.data.reviews
        .filter(feedback => feedback.order_status === "DELIVERED")
        .map(feedback => ({
        companyId: companyId,
        id: feedback.id,
        companyName: companyName,
        marketplace: marketplace,
        createdDate: feedback.published_at,
        userName: "",
        comment: {
          sku: feedback.sku,
          pros: "",
          cons: "",
          text: feedback.text,
        },
        productName: "",
        productValuation: feedback.rating,
        photoLinks: null,
        type: "feedback"
      }));
    }

    loadingFeedbacks();
    return dataList;
  } catch (error) {
    console.error("getFeedbacksOzon", error);
    loadingFeedbacks();
    return dataList;
  }
}
