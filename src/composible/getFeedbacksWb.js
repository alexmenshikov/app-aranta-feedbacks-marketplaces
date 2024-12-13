import axios from "axios";

export async function getFeedbacksWb({ apiToken, companyName, marketplace }) {
  let dataList = [];

  try {
    const response = await axios.get("https://feedbacks-api.wildberries.ru/api/v1/feedbacks", {
      params: {
        isAnswered: false,
        take: 5000,
        skip: 0,
        order: "dateAsc",
      },
      headers: {
        Authorization: apiToken
      }
    });

    if (response.data.data.feedbacks.length > 0) {
      dataList = response.data.data.feedbacks.map((feedback) => ({
        id: feedback.id,
        companyName: companyName,
        marketplace: marketplace,
        createdDate: feedback.createdDate,
        userName: feedback.userName,
        comment: {
          supplierArticle: feedback.productDetails.supplierArticle,
          pros: feedback.pros,
          cons: feedback.cons,
          text: feedback.text,
        },
        productName: feedback.productDetails.productName,
        productValuation: feedback.productValuation,
        photoLinks: feedback.photoLinks,
        type: "feedback"
      }));
    }

    console.log("dataList", dataList);
    return dataList;
  } catch (error) {
    console.error("getFeedbacksWb", error);
    return dataList;
  }
}
