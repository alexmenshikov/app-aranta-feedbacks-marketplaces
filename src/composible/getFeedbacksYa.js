import axios from "axios";

export async function getFeedbacksYa({ businessId, apiToken, companyName, marketplace, message }) {
  let dataList = [];
  const loadingFeedbacks = message.loading('Загрузка отзывов', 0);

  console.log('Отправка запроса', businessId);

  try {
    const response = await axios.get(`https://api.partner.market.yandex.ru/businesses/${businessId}/goods-feedback`, {
      params: {
        limit: 20
      },
      headers: {
        Authorization: `Api-Key ${apiToken}`
      }
    });

    console.log("response", response);
    // if (response.data.data.feedbacks.length > 0) {
    //   dataList = response.data.data.feedbacks.map((feedback) => ({
    //     companyId: companyId,
    //     id: feedback.id,
    //     companyName: companyName,
    //     marketplace: marketplace,
    //     createdDate: feedback.createdDate,
    //     userName: feedback.userName,
    //     comment: {
    //       supplierArticle: feedback.productDetails.supplierArticle,
    //       pros: feedback.pros,
    //       cons: feedback.cons,
    //       text: feedback.text,
    //     },
    //     productName: feedback.productDetails.productName,
    //     productValuation: feedback.productValuation,
    //     photoLinks: feedback.photoLinks,
    //     type: "feedback"
    //   }));
    // }

    loadingFeedbacks();
    return dataList;
  } catch (error) {
    console.error("getFeedbacksYa", error);
    loadingFeedbacks();
    return dataList;
  }
}
