<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import axios from "axios";
import {
  Button as AButton,
  Col as ACol,
  ConfigProvider as AConfigProvider,
  Form as AForm,
  FormItem as AFormItem,
  Textarea as ATextarea,
  Row as ARow,
  Select as ASelect,
  Table as ATable,
  Tag as ATag,
  Badge as ABadge,
  Image as AImage,
  Space as ASpace,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  message,
} from "ant-design-vue";
import ruRu from "ant-design-vue/es/locale/ru_RU";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";

dayjs.locale(ru);
dayjs.extend(utc);

const companyArray = [
  {
    id: 1,
    name: "ARANTA Decor (WB)",
    apiToken: "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwOTA0djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc0MzUzODUyMSwiaWQiOiIwMTkyNDcyNS1mMGUzLTc4MTEtYTJjZC1jOThiOWZlNDc0YjMiLCJpaWQiOjUzNzE1MjI2LCJvaWQiOjU3MDAwOCwicyI6MTI4LCJzaWQiOiI0ZTkzM2M1NC1kYzA2LTQzOWEtYTA2Ni1mNWRkZjFlMDdhNDUiLCJ0IjpmYWxzZSwidWlkIjo1MzcxNTIyNn0.dWCg4v_7MCRQGNMEXuKTM910gDu0ZuijqaGiHvGE4mQuJibGXX4S5qW5csKJQr3bKnZsqDN3N50x1VMLaFYzBw",
    telegramToken: "7954264530:AAFBQFwNmh8ZnL7CQXwZrjLJuBjlAkgdeKg",
    chatId: "514186798",
    prompt: "Мы компания ARANTA Decor, занимаемся продажей Сухоцветов (пампасной травы), как натуральных, стабилизированных, так и искусственных. Так же в нашем ассортименте есть ароматические саше и вазы для цветов и сухоцветов. Наши ароматические саше и искусственная пампасная трава изготовлены из премиальных материалов. Ты являешься менеджером, который отвечает на отзывы и вопросы покупателей от лица компании. Клиент должен чувствовать доброту и позитивные эмоции от ответов на их отзывы и вопросы. Ответ должен быть коротким, оригинальным, не формальным, с приятным послевкусием. Не используй в ответе разговорную речь, исключай тавтологию. Можно добавить приятных смайликов, что бы текст выглядел живее. В начале ответа должно быть приветствие, обращаемся с клиентом на «вы», но не часто. Не используем слова «привет», «шкаф». В конце ответа должны быть доброе пожелание клиенту и фраза от нашей команды. Также должен быть ненавязчивый призыв к покупке снова. Отзыв, который я пришлю, будет содержать имя покупателя, оценку от покупателя, комментарий, достоинства товара и недостатки. Не использовать в обращении к покупателю его фамилию. Если покупатель поставил 5 звезд и хорошо отозвался о товаре – нужно поблагодарить покупателя за высокую оценку. Если клиент просто поставил низкую оценку без дополнительной информации, нужно вежливо поинтересоваться, чем товар не оправдал ожиданий клиента. Если клиент получил негативный опыт при взаимодействии с нашим товаром, нужно обязательно выразить умеренное сочувствие. Не нужно просить прощения. Нужно предложить покупателю связаться с нами через личный кабинет, «Чат с продавцом». И заверить, что мы решим его вопрос и не оставим наедине с проблемой. Если клиент жалуется на недобросовестность продавца, нужно мягко объяснить, что у компании нет мотивации обманывать своих покупателей и нам важно, чтобы каждый покупатель оставался доволен. Мы тщательно, вручную собираем каждый букет, чтобы поддерживать высокий уровень качества. Высочайший приоритет компании – это удовольствие клиентов от приобретения наших сухоцветов. Если клиент жалуется на состояние упаковки, сломанные сухоцветы или сроки доставки, нужно объяснить, что транспортировкой и хранением товара занимается площадка маркетплейса и мы не можем повлиять на то, что происходит с товаром в пути. Если клиент жалуется на неполный набор или поврежденные сухоцветы, нужно так же уточнить, что товар мог быть возвратным и соответственно поврежден при первичном вскрытии. Мы рекомендуем проверять целостность желтой пломбы и в целом товар сразу в пункте выдачи. Если желтая пломба на упаковке вскрыта – мы не можем гарантировать целостность набора. И посоветовать связаться с нами для решения вопроса. Если клиент жалуется на осыпание, нужно пояснить, что наши сухоцветы имеют натуральное происхождение и небольшое осыпание – естественный процесс. При необходимости нужно объяснить, что осыпание минимизируется после распаковки, а легкая обработка букета лаком для волос закрепит результат. Сейчас я пришлю тебе отзыв от покупателя и тебе надо ответить.",
    promptQuestion: ""
  },
  {
    id: 2,
    name: "ARANTA Art Supplies (WB)",
    apiToken: "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMDAxdjEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc0NDQ3MjE0MiwiaWQiOiIwMTkyN2VjYi1kYWZiLTcxNDItOWJjZC03MDA0YmMzZTUxYzYiLCJpaWQiOjk2OTgyNDY4LCJvaWQiOjQwMTg1MzQsInMiOjEyOCwic2lkIjoiZGNlM2E3NDktZTRmZC00OTAwLWJiZjItYmMzNjI4M2Q5OTgwIiwidCI6ZmFsc2UsInVpZCI6OTY5ODI0Njh9.e5n8WrYSylkgacUML2a4E8RfHaK1QZQ5ijWg912ePuUjerovDIeZFhkotg5ZvOwqDixuPaxJr9_BM23AlXcqDg",
    telegramToken: "7954264530:AAFBQFwNmh8ZnL7CQXwZrjLJuBjlAkgdeKg",
    chatId: "514186798",
    prompt: "Мы компания ARANTA Art Supplies, занимаемся продажей художественных материалов. В нашем ассортименте есть профессиональные, акриловые маркеры. Набор маркеров из 20 цветов, включая золотой и серебряный металлик, подходит для рисования на любых поверхностях. Наши маркеры премиум качества, водостойкие и нетоксичные, безопасны для детей и взрослых. Клиент должен чувствовать доброту и позитивные эмоции от ответов на их отзывы и вопросы. Ответ должен быть коротким, оригинальным, с приятным послевкусием. Ответ должен демонстрировать нашу заинтересованность в художественном творчестве клиента. Не используй в ответе разговорную речь, исключай тавтологию. Можно добавить приятных смайликов, что бы текст выглядел живее. В начале ответа должно быть приветствие, обращаемся с клиентом на «вы», но не часто. Не используем слово «привет». В конце ответа должны быть доброе пожелание клиенту и фраза от нашей команды. Также должен быть ненавязчивый призыв к покупке снова. Отзыв, который я пришлю, будет содержать имя покупателя, оценку от покупателя, комментарий, достоинства товара и недостатки. Если покупатель поставил 5 звезд и хорошо отозвался о товаре – нужно поблагодарить покупателя за высокую оценку. Если клиент просто поставил низкую оценку без дополнительной информации, нужно вежливо поинтересоваться, чем товар не оправдал ожиданий клиента. Если клиент получил негативный опыт при взаимодействии с нашим товаром, нужно обязательно выразить умеренное сочувствие и попросить его связаться с нами через личный кабинет, «Чат с продавцом». И заверить, что мы решим его вопрос и не оставим наедине с проблемой.  Если клиент жалуется на состояние упаковки или сроки доставки, нужно посянить, что транспортировкой и хранением товара занимается площадка маркетплейса и мы не можем повлиять на то, что происходит с товаром в пути. И посоветовать связаться с нами для решения вопроса. Сейчас я пришлю тебе отзыв от покупателя и тебе надо ответить.",
    promptQuestion: ""
  },
  {
    id: 3,
    name: "Sunflowers (WB)",
    apiToken: "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQxMDAxdjEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc0NDQ3MjI4NiwiaWQiOiIwMTkyN2VjZS0xMDc4LTc5YWMtYWRhOS02OGEyY2E3ZTFhZDIiLCJpaWQiOjk2OTgyNDY4LCJvaWQiOjQwNzg0NjMsInMiOjEyOCwic2lkIjoiMGYzNjQ2MDMtYTgxYy00M2FkLTkyOWItMmFmMzE5YWFlNzNjIiwidCI6ZmFsc2UsInVpZCI6OTY5ODI0Njh9.zKFH5qObtzMhttQ6Ju0XBuBmLbrjofW7ilXR8dqskWSVyijpf6dOQ2qJxW9Umzw35rtPDAwrc-caUuHkGkeHKg",
    telegramToken: "7954264530:AAFBQFwNmh8ZnL7CQXwZrjLJuBjlAkgdeKg",
    chatId: "514186798",
    prompt: "Мы компания SunFlowers, занимаемся продажей Сухоцветов (пампасной травы), как натуральных и стабилизированных. Так же в нашем ассортименте представлены мини наборы из сухоцветов, для творчества и декора. Ты являешься менеджером, который отвечает на отзывы и вопросы покупателей. Ты являешься менеджером, который отвечает на отзывы и вопросы покупателей от лица компании. Клиент должен чувствовать доброту и позитивные эмоции от ответов на их отзывы и вопросы. Ответ должен быть коротким, оригинальным, не формальным, с приятным послевкусием. Не используй в ответе разговорную речь, исключай тавтологию. Можно добавить приятных смайликов, что бы текст выглядел живее. В начале ответа должно быть приветствие, обращаемся с клиентом на «вы», но не часто. Не используем слово «привет». В конце ответа должны быть доброе пожелание клиенту и фраза от нашей команды. Также должен быть ненавязчивый призыв к покупке снова. Отзыв, который я пришлю, будет содержать имя покупателя, оценку от покупателя, комментарий, достоинства товара и недостатки. Если покупатель поставил 5 звезд и хорошо отозвался о товаре – нужно поблагодарить покупателя за высокую оценку. Если клиент просто поставил низкую оценку без дополнительной информации, нужно вежливо поинтересоваться, чем товар не оправдал ожиданий клиента. Если клиент получил негативный опыт при взаимодействии с нашим товаром, нужно обязательно выразить умеренное сочувствие. Не нужно просить прощения. Нужно предложить покупателю связаться с нами через личный кабинет, «Чат с продавцом». И заверить, что мы решим его вопрос и не оставим наедине с проблемой. Если клиент жалуется на недобросовестность продавца, нужно мягко объяснить, что у компании нет мотивации обманывать своих покупателей и нам важно, чтобы каждый покупатель оставался доволен. Мы тщательно, вручную собираем каждый букет, чтобы поддерживать высокий уровень качества. Высочайший приоритет компании – это удовольствие клиентов от приобретения наших сухоцветов. Если клиент жалуется на состояние упаковки, сломанные сухоцветы или сроки доставки, нужно объяснить, что транспортировкой и хранением товара занимается площадка маркетплейса и мы не можем повлиять на то, что происходит с товаром в пути. И посоветовать связаться с нами для решения вопроса. Если клиент жалуется на осыпание, нужно пояснить, что наши сухоцветы имеют натуральное происхождение и небольшое осыпание – естественный процесс. При необходимости нужно объяснить, что осыпание минимизируется после распаковки, а легкая обработка букета лаком для волос закрепит результат. Сейчас я пришлю тебе отзыв от покупателя и тебе надо ответить.",
    promptQuestion: ""
  },
];

const telegramChatIds = [
  // {
  //   name: "Александр",
  //   id: 514186798,
  // },
  // {
  //   name: "Артём",
  //   id: 428444661,
  // }
];

const messagesUnansweredFeedback = ref([]);

let timerId = null;
const isRunning = ref(false);

const columns = ref([
  {
    title: 'Дата',
    dataIndex: 'createdDate',
    key: 'createdDate',
    width: '8%',
  },
  {
    title: 'Имя',
    dataIndex: 'userName',
    key: 'userName',
    width: '10%',
  },
  {
    title: 'Фотографии',
    dataIndex: 'photoLinks',
    key: 'photoLinks',
    width: '10%',
  },
  {
    title: 'Отзыв / Вопрос',
    dataIndex: 'comment',
    key: 'comment',
    width: '25%',
  },
  {
    title: 'Оценка',
    dataIndex: 'productValuation',
    key: 'productValuation',
    width: '10%'
  },
  {
    title: 'Ответ',
    dataIndex: 'answer',
    key: 'answer',
    width: '18%',
  },
  {
    title: 'Статус',
    key: 'status',
    dataIndex: 'status',
    width: '8%',
  },
  {
    title: 'Действие',
    key: 'makeAnswer',
    width: '6%',
  },
]);

const transformedCompanyOptions = computed(() => {
  return companyArray.map(company => ({
    label: company.name,
    value: JSON.stringify(company)
  }));
});

const loading = ref(false);

const companyOptions = ref([]);

const companySelected = ref(JSON.stringify(companyArray[0]));

watch(companySelected, (newValue, oldValue) => {
  localStorage.setItem("company_selected_feedbacks", JSON.stringify(newValue));

  if (newValue !== oldValue) {
    handleStop();

    initValues();
  }
});

companyOptions.value = transformedCompanyOptions.value;

const transformedCompanySelected = computed(() => JSON.parse(companySelected.value));

const feedbacksList = ref([]);
const questionsList = ref([]);
const feedbacksAndQuestions = ref([]);

const sortedFeedbacksAndQuestions = computed(() => {
  return [...feedbacksAndQuestions.value].sort((a, b) =>
    dayjs(a.createdDate) - dayjs(b.createdDate)
  );
});

const countUnansweredFeedbacks = computed(() => {
  let count = 0;

  sortedFeedbacksAndQuestions.value.forEach((item) => {
    if (item.type === "feedback" && !item.status) {
      count++;
    }
  });

  return count;
});

const countUnansweredQuestions = computed(() => {
  let count = 0;

  sortedFeedbacksAndQuestions.value.forEach((item) => {
    if (item.type === "question" && !item.status) {
      count++;
    }
  });

  return count;
});

const OPENAI_API_KEY = ref("");

watch(OPENAI_API_KEY, (newValue) => {
  localStorage.setItem(fieldCompanies("OPENAI_API_KEY"), newValue);
})

const prompt = ref("");
// const promptDateOfEditing = ref("");
const promptQuestion = ref("");
// const promptQuestionDateOfEditing = ref("");

function fieldCompanies(fieldName) {
  return `${transformedCompanySelected.value.name.replaceAll(" ", "")}_${fieldName}`
}

// let isInitialPrompt = true;
// let isInitialPromptQuestion = true;

watch(prompt, (newValue, oldValue) => {
  localStorage.setItem(fieldCompanies("prompt"), newValue);

  // if (isInitialPrompt) {
  //   isInitialPrompt = false;
  //   return;
  // }
  //
  // if (newValue.trim() !== oldValue.trim()) {
  //   promptDateOfEditing.value = dayjs.utc().local().format("DD.MM.YYYY HH:mm");
  //   localStorage.setItem(fieldCompanies("prompt_date_of_editing"), promptDateOfEditing.value);
  // }
});

watch(promptQuestion, (newValue, oldValue) => {
  localStorage.setItem(fieldCompanies("prompt_question"), newValue);

  // if (isInitialPromptQuestion) {
  //   isInitialPromptQuestion = false;
  //   return;
  // }
  //
  // if (newValue.trim() !== oldValue.trim()) {
  //   promptQuestionDateOfEditing.value = dayjs.utc().local().format("DD.MM.YYYY HH:mm");
  //   localStorage.setItem(fieldCompanies("prompt_question_date_of_editing"), promptQuestionDateOfEditing.value);
  // }
});

function initValues() {
  const getCompanySelected = localStorage.getItem("company_selected_feedbacks");
  companySelected.value = JSON.parse(getCompanySelected) || JSON.stringify(companyArray[0]);

  const getPrompt = localStorage.getItem(fieldCompanies("prompt"));
  prompt.value = getPrompt || transformedCompanySelected.value.prompt;

  const getPromptQuestion = localStorage.getItem(fieldCompanies("prompt_question"));
  promptQuestion.value = getPromptQuestion || transformedCompanySelected.value.promptQuestion;

  const getOPENAI_API_KEY = localStorage.getItem(fieldCompanies("OPENAI_API_KEY"));
  OPENAI_API_KEY.value = getOPENAI_API_KEY || "";

  // const getPromptDateOfEditing = localStorage.getItem(fieldCompanies("prompt_date_of_editing"));
  // promptDateOfEditing.value = getPromptDateOfEditing || "";
  //
  // const getPromptQuestionDateOfEditing = localStorage.getItem(fieldCompanies("prompt_question_date_of_editing"));
  // promptQuestionDateOfEditing.value = getPromptQuestionDateOfEditing || "";

  feedbacksAndQuestions.value = [];
  feedbacksList.value = [];
  questionsList.value = [];
}

onMounted(() => {
  initValues();
});

async function startGenerateAnwser(id) {
  const item = sortedFeedbacksAndQuestions.value.find((findItem) => findItem.id === id);

  item.answer = await generateAnwser({
    userName: item.userName,
    comment: item.comment,
    productName: item.productName,
    productValuation: item.productValuation,
    image: item.photoLinks ? true : false,
    type: item.type,
  });
}

async function generateAnwser(options) {
  const {userName, comment, productName, productValuation, image, type} = options;

  const client = axios.create({
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY.value}`,
    }
  });

  const text = type === "feedback"
    ? `Информация о его отзыве: ${userName && `Имя покупателя: ${userName}.`} ${productName && ` Купленный товар: ${productName}.`} ${productValuation && ` Оценка: ${productValuation}.`} ${comment.text && ` Отзыв: ${comment.text}.`} ${comment.pros && ` Достоинства товара по мнению покупателя: ${comment.pros}.`} ${comment.cons && ` Недостатки товара по мнению покупателя: ${comment.cons}.`} ${image ? ' А так же покупатель добавил фотографию(и) к отзыву.' : ''}`
    : `Вопрос от покупателя: ${comment.text} по товару ${productName}`;

  const params = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `${type === "feedback" ? prompt.value : promptQuestion.value} ${text}`,
      }
    ],
    max_tokens: 1000
  };

  message.loading('Генерация ответа');

  try {
    const response = await client.post("https://api.openai.com/v1/chat/completions", params);

    return response.data.choices[0].message.content; // Возвращаем ответ
  } catch (error) {
    console.error("Ошибка при запросе к OpenAI:", error);
    return "Не удалось получить ответ от OpenAI"; // Возвращаем сообщение об ошибке
  }
}

watch([feedbacksList, questionsList], ([newFeedbacks, newQuestions]) => {
  const updateData = ref([]);

  const processNewData = (newData, type) => {
    for (const newItem of newData) {
      const existingItem = feedbacksAndQuestions.value.find(item => item.id === newItem.id);

      if (existingItem) {
        updateData.value.push(existingItem);
      } else {
        updateData.value.push({
          ...newItem,
          type,
          status: false,
          answer: "Ответ еще не сгенерирован"
        });

        const message = type === 'feedback'
          ? `Новый отзыв от *${newItem.userName ? newItem.userName : 'Нет имени'}*`
          : 'Новый вопрос';

        const productValuation = type === "feedback"
          ? `Оценка *${getScoreWithSymbol(newItem.productValuation)}*\n`
          : '';

        sendMessageToAllUsers(
          `*${transformedCompanySelected.value.name}*\n` +
          `${message}\n` +
          `SKU *${newItem.comment.supplierArticle}*\n` +
          productValuation +
          `Дата *${dayjs(newItem.createdDate).format('DD.MM.YYYY HH:mm')}*`,
          newItem.id
        );
      }
    }
  };

  processNewData(newFeedbacks, 'feedback');
  processNewData(newQuestions, 'question');

  feedbacksAndQuestions.value = updateData.value;
});

// watch(feedbacksList, async (newData) => {
//   const updateData = ref([]);
//
//   for (const newItem of newData) {
//     const existingItem = feedbacksAndQuestions.value.find(item => item.id === newItem.id);
//
//     if (existingItem) {
//       updateData.value.push(existingItem);
//     } else {
//       updateData.value.push({
//         ...newItem,
//         status: false,
//         answer: "Ответ еще не сгенерирован"
//       });
//
//       sendMessageToAllUsers(
//         `*${transformedCompanySelected.value.name}*\n` +
//         `Новый отзыв от *${newItem.userName ? newItem.userName : 'Нет имени'}*\n` +
//         `SKU *${newItem.comment.supplierArticle}*\n` +
//         `Оценка *${getScoreWithSymbol(newItem.productValuation)}*\n` +
//         `Дата *${newItem.createdDate}*`,
//         newItem.id
//       );
//     }
//   }
//
//   console.log("Отзыв: ", feedbacksAndQuestions.value);
//   feedbacksAndQuestions.value = updateData.value;
// });
//
// watch(questionsList, async (newData) => {
//   const updateData = ref([]);
//
//   for (const newItem of newData) {
//     const existingItem = feedbacksAndQuestions.value.find(item => item.id === newItem.id);
//
//     if (existingItem) {
//       updateData.value.push(existingItem);
//     } else {
//       updateData.value.push({
//         ...newItem,
//         status: false,
//         answer: "Ответ еще не сгенерирован"
//       });
//
//       sendMessageToAllUsers(
//         `*${transformedCompanySelected.value.name}*\n` +
//         `Новый вопрос\n` +
//         `SKU *${newItem.comment.supplierArticle}*\n` +
//         `Дата *${newItem.createdDate}*`,
//         newItem.id
//       );
//     }
//   }
//
//   console.log("Вопрос: ", feedbacksAndQuestions.value);
//   feedbacksAndQuestions.value = updateData.value;
// });

function getScoreWithSymbol(value) {
  if (value === 5) return `${value} 💚`;
  else if (value === 4) return `${value} 💛`;
  else return `${value} 💔`;
}

// Загрузка отзывов
function feedbacksGet() {
  loading.value = true;
  message.loading('Загрузка отзывов', 0.5);

  axios
    .get("https://feedbacks-api.wildberries.ru/api/v1/feedbacks", {
      params: {
        isAnswered: false,
        take: 5000,
        skip: 0,
        order: "dateAsc",
      },
      headers: {
        "Authorization": `${transformedCompanySelected.value.apiToken}`
      }
    })
    .then(response => {
      feedbacksList.value = response.data.data.feedbacks.map((feedback) => ({
        id: feedback.id,
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

      loading.value = false;
    })
    .catch(error => {
      console.log(error);
      message.error('Ошибка при загрузке отзывов!');
      loading.value = false;
    });
}

// Загрузка отзывов
function questionsGet() {
  loading.value = true;
  message.loading('Загрузка вопросов', 0.5);

  axios
    .get("https://feedbacks-api.wildberries.ru/api/v1/questions", {
      params: {
        isAnswered: false,
        take: 5000,
        skip: 0,
        order: "dateAsc",
      },
      headers: {
        "Authorization": `${transformedCompanySelected.value.apiToken}`
      }
    })
    .then(response => {
      questionsList.value = response.data.data.questions.map((question) => ({
        id: question.id,
        createdDate: question.createdDate,
        userName: "",
        comment: {
          supplierArticle: question.productDetails.supplierArticle,
          pros: "",
          cons: "",
          text: question.text,
        },
        productName: question.productDetails.productName,
        productValuation: null,
        photoLinks: null,
        type: "question"
      }));

      loading.value = false;
    })
    .catch(error => {
      console.log(error);
      message.error('Ошибка при загрузке вопросов!');
      loading.value = false;
    });
}

// Отправка ответа
function makeAnswer(id, type) {
  const item = sortedFeedbacksAndQuestions.value.find((findItem) => findItem.id === id);
  if (!item) return;

  const paths = {
    feedback: "https://feedbacks-api.wildberries.ru/api/v1/feedbacks/answer",
    question: "https://feedbacks-api.wildberries.ru/api/v1/questions",
  };

  const data = {
    feedback: {
      id: item.id,
      text: item.answer
    },
    question: {
      id: item.id,
      answer: {
        text: item.answer
      },
      state: "wbRu"
    },
  };

  const method = type === "feedback" ? "post" : "patch";
  const path = paths[type];
  const payload = data[type];

  resetTimer();

  axios[method](path, payload, {
    headers: {
      Authorization: transformedCompanySelected.value.apiToken
    }
  })
    .then(() => {
      item.status = true;
      message.success("Ответ успешно отправлен!");
    })
    .catch((error) => {
      console.error(error);
      message.error("Ошибка при отправке ответа!");
    });
}

function isValidArray(arr) {
  return arr !== null && Array.isArray(arr) && arr.length > 0;
}

const token = transformedCompanySelected.value.telegramToken;

// Функция для получения обновлений и вытаскивания chat_id пользователей
// async function getChatIds() {
//   try {
//     const response = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`);
//     const updates = response.data.result;
//
//     // Извлекаем уникальные chat_id
//     const chatIds = [...new Set(updates.map(update => update.message.chat.id))];
//
//     return chatIds;
//   } catch (error) {
//     console.error('Ошибка при получении обновлений:', error);
//   }
// }

// Функция для отправки сообщения всем пользователям
async function sendMessageToAllUsers(message, feedbackId) {
  if (telegramChatIds.length === 0) {
    console.log('Нет новых пользователей.');
    return;
  }

  for (const chatId of telegramChatIds) {
    try {
      const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId.id,
        text: message,
        parse_mode: 'Markdown'
      });

      messagesUnansweredFeedback.value.push({
        messageId: response.data.result.message_id,
        feedbackId: feedbackId,
        company: transformedCompanySelected.value.name
      });
    } catch (error) {
      console.error(`Ошибка при отправке сообщения пользователю с chat_id: ${chatId.id}`, error);
    }
  }
}

function getColorProductValuation(record) {
  if (record.productValuation === null) {
    return "default";
  } else if (record.productValuation === 5) {
    return "#87d068";
  } else if (record.productValuation === 4) {
    return "gold";
  } else if (record.productValuation <= 3) {
    return "red";
  }
}

// Храним информацию о текущей редактируемой строке
const editingRow = ref({id: null, answer: ''});

// Проверяем, редактируется ли строка
const isEditing = (id) => {
  return editingRow.value.id === id;
};

// Функция для редактирования
const edit = (record) => {
  // Инициализируем ответ текущим значением
  editingRow.value = {id: record.id, answer: record.answer || ''};
};

// Сохранение изменений
const save = (id) => {
  const index = sortedFeedbacksAndQuestions.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    sortedFeedbacksAndQuestions.value[index].answer = editingRow.value.answer;
  }
  editingRow.value = {id: null, answer: ''};
};

// Отмена редактирования
const cancelEdit = () => {
  editingRow.value = {id: null, answer: ''};
};

function handleStart() {
  isRunning.value = true;
  feedbacksGet();
  questionsGet();
  timerId = setInterval(() => {
    feedbacksGet();
    questionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

function handleStop() {
  isRunning.value = false;
  clearInterval(timerId); // Остановить таймер
}

function resetTimer() {
  clearInterval(timerId); // Останавливаем текущий таймер
  timerId = setInterval(() => {
    feedbacksGet();
    questionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

onUnmounted(() => {
  handleStop();
});
</script>

<template>
  <a-config-provider :locale="ruRu">
    <a-form ref="form" layout="vertical">
      <a-collapse collapsible="header">
        <a-collapse-panel header="Ключ для ChatGPT и prompt">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="OPENAI_API_KEY" name="OPENAI_API_KEY">
                <a-textarea
                  v-model:value="OPENAI_API_KEY"
                  auto-size
                  :disabled="isRunning"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="Prompt для отзыва" name="prompt">
                <a-textarea
                  v-model:value="prompt"
                  auto-size
                  :disabled="isRunning"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!--          <a-row v-if="promptDateOfEditing" :gutter="24" style="margin-top: -20px; margin-bottom: 24px;">-->
          <!--            <a-col :span="24">-->
          <!--              Дата изменения {{ promptDateOfEditing }}-->
          <!--            </a-col>-->
          <!--          </a-row>-->

          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="Prompt для вопроса" name="promptQuestion">
                <a-textarea
                  v-model:value="promptQuestion"
                  auto-size
                  :disabled="isRunning"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!--          <a-row v-if="promptQuestionDateOfEditing" :gutter="24" style="margin-top: -20px;">-->
          <!--            <a-col :span="24">-->
          <!--              Дата изменения {{ promptQuestionDateOfEditing }}-->
          <!--            </a-col>-->
          <!--          </a-row>-->
        </a-collapse-panel>
      </a-collapse>

      <a-row :gutter="24" style="display: flex; align-items: flex-end; margin-top: 10px;">
        <a-col :span="12">
          <a-form-item label="Компания" name="companySelected">
            <a-select
              v-model:value="companySelected"
              :options="companyOptions"
              placeholder="Выберите из списка"
              show-search
            />
          </a-form-item>
        </a-col>

        <a-col :span="3">
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :disabled="isRunning"
              @click="handleStart"
              block
            >
              Запустить
            </a-button>
          </a-form-item>
        </a-col>

        <a-col :span="3">
          <a-form-item>
            <a-button
              html-type="submit"
              :disabled="!isRunning"
              @click="handleStop"
              block
            >
              Остановить
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div style="display: flex; align-items: flex-end; margin-bottom: 10px;">
      <span style="margin-right: 5px;">Количество неотвеченных отзывов</span>
      <a-badge :count="countUnansweredFeedbacks" show-zero/>
      <span style="margin: 0 5px;">и вопросов</span>
      <a-badge :count="countUnansweredQuestions" show-zero/>
    </div>

    <a-table
      :columns="columns"
      :data-source="sortedFeedbacksAndQuestions"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'createdDate'">
          <span v-if="record.createdDate">
            {{ dayjs(record.createdDate).format('DD.MM.YYYY HH:mm') }}
          </span>
        </template>

        <template v-if="column.key === 'userName'">
          <span v-if="record.userName">
            {{ record.userName }}
          </span>
          <a-tag v-else color="default">
            Нет имени
          </a-tag>
        </template>

        <template v-if="column.key === 'photoLinks'">
          <div
            v-if="isValidArray(record.photoLinks)"
            v-for="image in record.photoLinks"
            class="image__list-item"
          >
            <a-image
              :height="140"
              :src="image.miniSize"
              :preview="false"
            />
          </div>

          <span v-else>
            <a-tag color="default">
             Отсутствуют
            </a-tag>
          </span>
        </template>

        <template v-if="column.key === 'productValuation'">
          <a-tag :color="getColorProductValuation(record)">
            <span v-if="record.productValuation === 5">
              Отлично ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 4">
              Хорошо ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 3">
              Удовлет. ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 2">
              Плохо ({{ record.productValuation }})
            </span>
            <span v-if="record.productValuation === 1">
              Ужасно ({{ record.productValuation }})
            </span>
            <span v-if="!record.productValuation">
              Отсутствует
            </span>
          </a-tag>
        </template>

        <template v-if="column.key === 'comment'">
          <div style="display: flex; flex-direction: column;">
            <p v-if="record.comment.supplierArticle">
              <b>SKU: </b> {{ record.comment.supplierArticle }}
            </p>
            <p v-if="record.comment.pros">
              <b>Достоинства: </b> {{ record.comment.pros }}
            </p>
            <p v-if="record.comment.cons">
              <b>Недостатки: </b> {{ record.comment.cons }}
            </p>
            <p v-if="record.comment.text" :class="{ 'question-text': record.type === 'question' }">
              <b v-if="record.type === 'question'">Вопрос: </b> {{ record.comment.text }}
            </p>
          </div>
        </template>

        <template v-if="column.key === 'answer'">
          <template v-if="isEditing(record.id)">
            <a-textarea
              v-model:value="editingRow.answer"
              auto-size
            />
            <a-space style="margin-top: 10px;">
              <a-button @click="save(record.id)" type="primary">
                Сохранить
              </a-button>
              <a-button @click="cancelEdit">
                Отмена
              </a-button>
            </a-space>
          </template>
          <template v-else>
            <span @click="edit(record)"> <!-- При клике переходим в режим редактирования -->
              {{ record.answer || 'Нет ответа' }}
            </span>
          </template>
        </template>

        <template v-if="column.key === 'status'">
          <a-tag
            :color="record.status ? 'green' : 'volcano'"
          >
            {{ record.status ? 'Ответили' : 'Не ответили' }}
          </a-tag>
        </template>

        <template v-if="column.key === 'makeAnswer'">
          <div style="display: flex; flex-direction: column">
            <a @click="startGenerateAnwser(record.id)" style="margin-bottom: 10px">Сгенерировать</a>

            <a @click="makeAnswer(record.id, record.type)">Ответить</a>
          </div>
        </template>
      </template>
    </a-table>
  </a-config-provider>
</template>

<style scoped>
.image__list-item {
  margin-bottom: 5px;
}

.image__list-item:last-child {
  margin-bottom: 0;
}

.question-text {
  color: #1677ff;
}
</style>
