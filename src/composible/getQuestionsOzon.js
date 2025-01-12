import axios from "axios";

export async function getQuestionsOzon({ companyId, apiToken, clientId, companyName, marketplace, message }) {
  let dataList = [];
  const loadingQuestions = message.loading('Загрузка вопросов', 0);

  // console.log('ЗАГРУЗКА ПО УСЛОВИЮ OZON');

  try {
    const response = await axios.post(
      "https://api-seller.ozon.ru/v1/question/list",
      {
        filter: {
          status: "NEW"
        },
        last_id: ""
      },
      {
        headers: {
          'Client-Id': clientId,
          'Api-Key': apiToken,
        }
      }
    );

    if (response.data.questions.length > 0) {
      dataList = response.data.questions.map((questions) => ({
        companyId: companyId,
        id: questions.id,
        companyName: companyName,
        marketplace: marketplace,
        createdDate: questions.published_at,
        userName: questions.author_name,
        comment: {
          sku: questions.sku,
          pros: "",
          cons: "",
          text: questions.text,
        },
        productName: "",
        productValuation: null,
        photoLinks: null,
        type: "questions"
      }));
    }

    loadingQuestions();
    return dataList;
  } catch (error) {
    console.error("getQuestionsOzon", error);
    loadingQuestions();
    return dataList;
  }
}
