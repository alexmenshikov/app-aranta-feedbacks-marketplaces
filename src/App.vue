<script setup>
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

import { useCompanyStore } from "./stores/companyStore.js";
import CompanySelector from "./components/CompanySelector.vue";
import CompanyPanel from "./components/CompanyPanel.vue";
import ProductValuation from "./components/ProductValuation.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getFeedbacksWb } from "./composible/getFeedbacksWb.js";
import { getQuestionsWb } from "./composible/getQuestionsWb.js";

import { getQuestionsOzon } from "./composible/getQuestionsOzon.js";
import { getFeedbacksOzon } from "./composible/getFeedbacksOzon.js";
import { getProductOzon } from "./composible/getProductOzon.js";
import { makeAnswerFeedbackOzon } from "./composible/makeAnswerFeedbackOzon.js";
import { makeAnswerQuestionOzon } from "./composible/makeAnswerQuestionOzon.js";

import { getFeedbacksYa } from "./composible/getFeedbacksYa.js";

const store = useCompanyStore();

let isInitialized = false;
let wasStarted = false;

const OPENAI_API_KEY = ref("");

watch(OPENAI_API_KEY, (newValue) => {
  localStorage.setItem("selectedOpenaiApiKey", newValue);
})

onMounted(() => {
  store.loadFromLocalStorage();

  feedbacksAndQuestions.value = [];
  feedbacksList.value = [];
  questionsList.value = [];

  const getOPENAI_API_KEY = localStorage.getItem("selectedOpenaiApiKey");
  OPENAI_API_KEY.value = getOPENAI_API_KEY || "";

  isInitialized = true;
});

const trackingCompanies = computed(() => store.trackingCompanies);

function handleStart() {
  // console.log("START");
  feedbacksQuestionsGet();

  timerId = setInterval(() => {
    feedbacksQuestionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

function handleStop() {
  // console.log("STOP");
  clearInterval(timerId); // Остановить таймер
}

function handleReset({ onlyTimer }) {
  // console.log("RESET");

  if (!onlyTimer) {
    feedbacksQuestionsGet();
  }

  clearInterval(timerId); // Останавливаем текущий таймер
  timerId = setInterval(() => {
    feedbacksQuestionsGet();
  }, 600000); // 600000 миллисекунд = 10 минут
}

onUnmounted(() => {
  handleStop();
});

watch(trackingCompanies, (newValue) => {
  if (!isInitialized) return;

  // Проверяем, был ли уже вызван handleStart
  if (newValue.length > 0 && !wasStarted) {
    handleStart();
    wasStarted = true; // Помечаем, что старт уже был
  } else if (newValue.length > 0 && wasStarted) {
    handleReset({
      onlyTimer: false,
    });
  } else {
    handleStop();
    feedbacksAndQuestions.value = [];
    wasStarted = false; // Сбрасываем флаг
  }
}, { flush: 'post', immediate: true });

let timerId = null;

const loading = ref(false);
const feedbacksList = ref([]);
const questionsList = ref([]);

const columns = ref([
  {
    title: 'Дата / компания',
    dataIndex: 'createdDate',
    key: 'createdDate',
    ellipsis: false,
    width: 157,
  },
  {
    title: 'Имя',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: false,
  },
  {
    title: 'Фотографии',
    dataIndex: 'photoLinks',
    key: 'photoLinks',
    ellipsis: false,
  },
  {
    title: 'Отзыв / Вопрос',
    dataIndex: 'comment',
    key: 'comment',
    width: 230,
    ellipsis: false,
  },
  {
    title: 'Оценка',
    dataIndex: 'productValuation',
    key: 'productValuation',
    width: 120,
    ellipsis: false,
  },
  {
    title: 'Ответ',
    dataIndex: 'answer',
    key: 'answer',
    width: 230,
    ellipsis: false,
  },
  {
    title: 'Статус',
    key: 'status',
    dataIndex: 'status',
    ellipsis: false,
  },
  {
    title: 'Действие',
    key: 'makeAnswer',
    ellipsis: false,
  },
]);

const feedbacksAndQuestions = ref([]);

const sortedFeedbacksAndQuestions = computed(() => {
  return [...feedbacksAndQuestions.value].sort((a, b) =>
    dayjs(a.createdDate) - dayjs(b.createdDate)
  );
});

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

        // const message = type === 'feedback'
        //   ? `Новый отзыв от *${newItem.userName ? newItem.userName : 'Нет имени'}*`
        //   : 'Новый вопрос';
        //
        // const productValuation = type === "feedback"
        //   ? `Оценка *${getScoreWithSymbol(newItem.productValuation)}*\n`
        //   : '';
        //
        // sendMessageToAllUsers(
        //   `*company*\n` +
        //   `${message}\n` +
        //   `SKU *${newItem.comment.supplierArticle}*\n` +
        //   productValuation +
        //   `Дата *${dayjs(newItem.createdDate).format('DD.MM.YYYY HH:mm')}*`,
        //   newItem.id
        // );
      }
    }
  };

  processNewData(newFeedbacks, 'feedback');
  processNewData(newQuestions, 'question');

  feedbacksAndQuestions.value = updateData.value;
});

// Загрузка отзывов и вопросов
async function feedbacksQuestionsGet() {
  loading.value = true;

  try {
    const allFeedbacks = [];
    const allQuestions = [];

    for (const company of store.trackingCompanies) {
      if (Object.keys(company.marketplaces).length > 0) {
        for (const marketplace of Object.keys(company.marketplaces)) {
          if (marketplace === 'wb') {
            const feedbacksWb = await getFeedbacksWb({
              companyId: company.id,
              apiToken: company.marketplaces[marketplace].apiToken,
              companyName: company.name,
              marketplace: marketplace,
              message: message,
            });
            allFeedbacks.push(...feedbacksWb);

            const questionsWb = await getQuestionsWb({
              companyId: company.id,
              apiToken: company.marketplaces[marketplace].apiToken,
              companyName: company.name,
              marketplace: marketplace,
              message: message,
            });
            allQuestions.push(...questionsWb);
          } else if (marketplace === 'ozon') {
            const feedbacksOzon = await getFeedbacksOzon({
              companyId: company.id,
              apiToken: company.marketplaces[marketplace].apiToken,
              clientId: company.marketplaces[marketplace].clientId,
              companyName: company.name,
              marketplace: marketplace,
              message: message,
            });

            const feedbacksOzonEnrichedProducts = await getProductOzon({
              apiToken: company.marketplaces[marketplace].apiToken,
              clientId: company.marketplaces[marketplace].clientId,
              items: feedbacksOzon,
              message: message,
            });

            allFeedbacks.push(...feedbacksOzonEnrichedProducts);

            const questionsOzon = await getQuestionsOzon({
              companyId: company.id,
              apiToken: company.marketplaces[marketplace].apiToken,
              clientId: company.marketplaces[marketplace].clientId,
              companyName: company.name,
              marketplace: marketplace,
              message: message,
            });

            const questionsOzonEnrichedProducts = await getProductOzon({
              apiToken: company.marketplaces[marketplace].apiToken,
              clientId: company.marketplaces[marketplace].clientId,
              items: questionsOzon,
              message: message,
            });

            allQuestions.push(...questionsOzonEnrichedProducts);
          } else if (marketplace === 'yandex') {
            const feedbacksYa = await getFeedbacksYa({
              businessId: company.marketplaces[marketplace].businessId,
              apiToken: company.marketplaces[marketplace].apiToken,
              message: message,
            })
            allFeedbacks.push(...feedbacksYa);
          }
        }
      }
    }

    feedbacksList.value = allFeedbacks;
    questionsList.value = allQuestions;

    loading.value = false;
  } catch (error) {

    loading.value = false;
  }
}

function isValidArray(arr) {
  return arr !== null && Array.isArray(arr) && arr.length > 0;
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

function convertNameMarketplace(value) {
  if (value === "wb") {
    return "Wilberries";
  } else if (value === "ozon") {
    return "Ozon";
  } else if (value === "yandex") {
    return "Яндекс";
  }
}

function getColorTagMarketplace(value) {
  if (value === "wb") {
    return "#bc3d96";
  } else if (value === "ozon") {
    return "#005bff";
  } else if (value === "yandex") {
    return "#fa3e2c";
  }
}

function getColorTagCompany(value) {
  if (value === "ARANTA Decor") {
    return "#17a365";
  } else if (value === "ARANTA Art Supplies") {
    return "#858fcf";
  } else if (value === "Sunflowers") {
    return "#97be0d";
  }
}

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

async function startGenerateAnwser(id) {
  const item = sortedFeedbacksAndQuestions.value.find((findItem) => findItem.id === id);

  const findCompany = store.companies.find(company => company.id === item.companyId);

  const prompts = {
    feedback: findCompany.marketplaces[item.marketplace].prompt,
    question: findCompany.marketplaces[item.marketplace].promptQuestion,
  }

  item.answer = await generateAnwser({
    userName: item.userName,
    comment: item.comment,
    productName: item.productName,
    productValuation: item.productValuation,
    image: item.photoLinks ? true : false,
    type: item.type,
    prompts: prompts,
  });
}

// генерация ответа на вопрос и отзыв
async function generateAnwser(options) {
  const { userName, comment, productName, productValuation, image, type, prompts } = options;

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
        content: `${prompts[type]} ${text}`
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

async function startMakeAnswer(id) {
  const item = sortedFeedbacksAndQuestions.value.find((findItem) => findItem.id === id);

  if (!item) return;

  const findCompany = store.companies.find(company => company.id === item.companyId);

  if (item.marketplace === "wb") {
    makeAnswerWb({
      apiToken: findCompany.marketplaces[item.marketplace].apiToken,
      item: item,
    });
  } else if (item.marketplace === "ozon") {
    if (item.type === "feedback") {
      makeAnswerFeedbackOzon({
        apiToken: findCompany.marketplaces[item.marketplace].apiToken,
        clientId: findCompany.marketplaces[item.marketplace].clientId,
        item: item,
        message: message
      });
    } else if (item.type === "question") {
      makeAnswerQuestionOzon({
        apiToken: findCompany.marketplaces[item.marketplace].apiToken,
        clientId: findCompany.marketplaces[item.marketplace].clientId,
        item: item,
        message: message
      });
    }
  } else if (item.marketplace === "yandex") {

  }
}
</script>

<template>
  <a-config-provider :locale="ruRu">
    <a-form layout="vertical">
      <company-selector />
      <company-panel
        :openApiKey="OPENAI_API_KEY"
        @edit-open-api-key="OPENAI_API_KEY = $event"
      />
    </a-form>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; margin-top: 20px;">
      <div style="display: flex; align-items: flex-end;">
        <span style="margin-right: 5px;">Количество неотвеченных отзывов</span>
        <a-badge :count="countUnansweredFeedbacks" show-zero/>
        <span style="margin: 0 5px;">и вопросов</span>
        <a-badge :count="countUnansweredQuestions" show-zero/>
      </div>
    </div>

    <a-table
      class="ant-table-striped"
      :columns="columns"
      :data-source="sortedFeedbacksAndQuestions"
      :loading="loading"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      row-key="id"
      bordered
      :scroll="{ x: 1259 }"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'createdDate'">
          <span v-if="record.createdDate" style="display: block; font-weight: bold;">
            {{ dayjs(record.createdDate).format('DD.MM.YYYY') }}
          </span>
          <span v-if="record.createdDate" style="display: block;">
            {{ dayjs(record.createdDate).format('HH:mm') }}
          </span>
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <a-tag :bordered="false" :color="getColorTagCompany(record.companyName)" style="margin: 5px 0;">{{ record.companyName }}</a-tag>
            <a-tag :bordered="false" :color="getColorTagMarketplace(record.marketplace)">{{ convertNameMarketplace(record.marketplace) }}</a-tag>
          </div>
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

        <product-valuation
          v-if="column.key === 'productValuation'"
          :valution="record.productValuation"
        />
<!--        <template v-if="column.key === 'productValuation'">-->
<!--          <a-tag :color="getColorProductValuation(record)">-->
<!--            <span v-if="record.productValuation === 5">-->
<!--              Отлично ({{ record.productValuation }})-->
<!--            </span>-->
<!--            <span v-if="record.productValuation === 4">-->
<!--              Хорошо ({{ record.productValuation }})-->
<!--            </span>-->
<!--            <span v-if="record.productValuation === 3">-->
<!--              Удовлет. ({{ record.productValuation }})-->
<!--            </span>-->
<!--            <span v-if="record.productValuation === 2">-->
<!--              Плохо ({{ record.productValuation }})-->
<!--            </span>-->
<!--            <span v-if="record.productValuation === 1">-->
<!--              Ужасно ({{ record.productValuation }})-->
<!--            </span>-->
<!--            <span v-if="!record.productValuation">-->
<!--              Отсутствует-->
<!--            </span>-->
<!--          </a-tag>-->
<!--        </template>-->

        <template v-if="column.key === 'comment'">
          <div style="display: flex; flex-direction: column;">
            <p v-if="record.comment.sku">
              <b>SKU: </b> {{ record.comment.sku }}
            </p>
            <p v-if="record.productName">
              <b>Продукт: </b> {{ record.productName }}
            </p>
            <p v-if="record.comment.pros">
              <b>Достоинства: </b> {{ record.comment.pros }}
            </p>
            <p v-if="record.comment.cons">
              <b>Недостатки: </b> {{ record.comment.cons }}
            </p>
            <p v-if="record.comment.text" :class="{ 'question-text': record.type === 'question' }">
              <b v-if="record.type === 'feedback'">Отзыв: </b>
              <b v-if="record.type === 'question'">Вопрос: </b>
              {{ record.comment.text }}
            </p>
          </div>
        </template>

        <template v-if="column.key === 'answer'">
          <template v-if="isEditing(record.id)">
            <a-textarea
              v-model:value="editingRow.answer"
              auto-size
            />
            <a-space style="display: flex; flex-wrap: wrap; margin-top: 10px;">
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

            <a @click="startMakeAnswer(record.id)">Ответить</a>
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

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ant-table {
  table-layout: fixed !important;
}

.ant-collapse {
  margin-bottom: 20px;
}

p {
  word-break: break-word;
}

.ant-collapse:last-child {
  margin-bottom: 0;
}

.ant-tag {
  margin-inline-end: 0px;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
