<script setup>
import { useCompanyStore } from "../stores/companyStore.js";
import { computed } from "vue";
import {
  Col as ACol,
  FormItem as AFormItem,
  Textarea as ATextarea,
  Row as ARow,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
} from "ant-design-vue";

const props = defineProps({
  openApiKey: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(["editOpenApiKey"]);

const store = useCompanyStore();

const trackingCompanies = computed(() => store.trackingCompanies);

function convertNameMarketplace(key) {
  const options = {
    wb: "Wildberries",
    ozon: "Ozon",
    yandex: "Яндекс",
  };
  return options[key] || key;
}

function updatePrompt(companyId, marketplaceKey, type, value) {
  store.updatePrompt(companyId, marketplaceKey, type, value);
}
</script>

<!--@change="emit('openApiKey', $event.target.value)"-->
<template>
  <a-collapse collapsible="header">
    <a-collapse-panel header="Prompts и ключ gpt">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="OPENAI_API_KEY" name="OPENAI_API_KEY">
            <a-textarea
              :value="props.openApiKey"
              @change="emit('editOpenApiKey', $event.target.value)"
              auto-size
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-collapse class="bc" collapsible="header" v-for="company in trackingCompanies" :key="company.id">
        <a-collapse-panel :header="company.name" class="collapse__panel">
          <div v-for="(marketplace, key) in company.marketplaces" :key="key">
            <h3>{{ convertNameMarketplace(key) }}</h3>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item
                  :label="'Prompt для отзыва (' + convertNameMarketplace(key).toLowerCase() + ')'"
                  :name="'prompt-' + key"
                >
                  <a-textarea
                    v-model:value="marketplace.prompt"
                    auto-size
                    @change="updatePrompt({
                      companyId: company.id,
                      marketplaceKey: key,
                      promptType: 'prompt',
                      newValue: $event.target.value
                    })"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item
                  :label="'Prompt для вопроса (' + convertNameMarketplace(key).toLowerCase() + ')'"
                  :name="'promptQuestion-' + key">
                  <a-textarea
                    v-model:value="marketplace.promptQuestion"
                    auto-size
                    @change="updatePrompt({
                      companyId: company.id,
                      marketplaceKey: key,
                      promptType: 'promptQuestion',
                      newValue: $event.target.value
                    })"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
  </a-collapse>
</template>

<style scoped>
.ant-collapse {
  margin-bottom: 20px;
}

.ant-collapse:last-child {
  margin-bottom: 0;
}
</style>