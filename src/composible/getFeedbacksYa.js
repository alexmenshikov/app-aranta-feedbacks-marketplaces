import axios from "axios";

export async function getFeedbacksYa({ businessId, apiToken, companyName, marketplace, message }) {
  let dataList = [];
  const loadingFeedbacks = message.loading('Загрузка отзывов', 0);

  console.log('Отправка запроса', businessId);

  try {
    // const response = await axios.get(`https://api.partner.market.yandex.ru/businesses/${businessId}/goods-feedback`, {
    //   params: {
    //     limit: 20
    //   },
    //   headers: {
    //     'Api-Key': 'ACMA:Bqk1qcBY7IBnmLQvQ8LrzWrJKx6Vz5VvVohLWxyZ:15be0b73'
    //   }
    // });

    // const response = await axios.post(
    //   `https://api.partner.market.yandex.ru/businesses/${businessId}/goods-feedback`,
    //   {
    //     params: {
    //       limit: 20
    //     },
    //   },
    //   {
    //     headers: {
    //       'Api-Key': apiToken,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );

    // const response = await axios.post(
    //   `https://api.partner.market.yandex.ru/businesses/${businessId}/goods-feedback`,
    //   {
    //     params: {
    //       limit: 20
    //     },
    //   },
    //   {
    //     headers: {
    //       'Api-Key': apiToken,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );

    const params = {
      limit: 20,
      page_token: null
    };

    const body = {
      dateTimeFrom: null,
      dateTimeTo: null,
      reactionStatus: "ALL",
      ratingValues: [0],
      modelIds: [0],
      paid: false
    };

    const response = await axios.post(
      `https://api.partner.market.yandex.ru/businesses/${businessId}/goods-feedback`,
      body, {
      params: params,
      headers: {
        'Api-Key': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
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
