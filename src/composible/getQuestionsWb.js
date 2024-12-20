import axios from "axios";

export async function getQuestionsWb({ companyId, apiToken, companyName, marketplace, message }) {
  let dataList = [];
  const loadingQuestions = message.loading('Загрузка вопросов', 0);

  try {
    const response = await axios.get("https://feedbacks-api.wildberries.ru/api/v1/questions", {
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

    if (response.data.data.questions.length > 0) {
      dataList = response.data.data.questions.map((questions) => ({
        companyId: companyId,
        id: questions.id,
        companyName: companyName,
        marketplace: marketplace,
        createdDate: questions.createdDate,
        userName: "",
        comment: {
          supplierArticle: questions.productDetails.supplierArticle,
          pros: "",
          cons: "",
          text: questions.text,
        },
        productName: questions.productDetails.productName,
        productValuation: null,
        photoLinks: null,
        type: "questions"
      }));
    }

    loadingQuestions();
    return dataList;
  } catch (error) {
    console.error("getQuestionsWb", error);
    loadingQuestions();
    return dataList;
  }
}
